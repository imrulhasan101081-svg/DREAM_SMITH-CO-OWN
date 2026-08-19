/**
 * RBAC — Role-Based Access Control Engine
 * 
 * This file is the single source of truth for permission enforcement.
 * ALL sensitive API routes MUST call requirePermission() or requireSuperAdmin()
 * before executing any data mutation.
 * 
 * NEVER rely on frontend role checks alone.
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AdminUser, { IAdminUser } from "@/lib/models/AdminUser";
import AuditLog from "@/lib/models/AuditLog";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export class RBACError extends Error {
  constructor(
    public statusCode: 401 | 403,
    message: string
  ) {
    super(message);
    this.name = "RBACError";
  }
}

export type AdminSession = {
  adminId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "REGULAR_ADMIN";
  permissions: string[];
};

/**
 * Extracts and validates the admin session from the NextAuth JWT.
 * Returns the AdminSession or throws RBACError.
 */
export async function getAdminSession(): Promise<AdminSession> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new RBACError(401, "Not authenticated");
  }

  const role = (session.user as any).role;
  const adminId = (session.user as any).adminId;
  const permissions: string[] = (session.user as any).permissions ?? [];

  if (role !== "SUPER_ADMIN" && role !== "REGULAR_ADMIN") {
    throw new RBACError(403, "Insufficient role — admin access required");
  }

  // Verify the admin is still active in the database
  await dbConnect();
  const adminRecord = await AdminUser.findById(adminId).lean() as IAdminUser | null;

  if (!adminRecord || !adminRecord.isActive || adminRecord.deletedAt) {
    throw new RBACError(403, "Admin account is deactivated or does not exist");
  }

  return {
    adminId: adminRecord._id.toString(),
    name: adminRecord.name,
    email: adminRecord.email,
    role: adminRecord.role,
    permissions: adminRecord.role === "SUPER_ADMIN" ? ["*"] : (adminRecord.permissions ?? []),
  };
}

/**
 * Requires a specific permission.
 * SUPER_ADMIN always passes (they have "*").
 * REGULAR_ADMIN must have the specific permission in their array.
 */
export async function requirePermission(
  permission: string
): Promise<AdminSession> {
  const adminSession = await getAdminSession();

  if (
    adminSession.role !== "SUPER_ADMIN" &&
    !adminSession.permissions.includes(permission)
  ) {
    throw new RBACError(
      403,
      `Missing required permission: ${permission}`
    );
  }

  return adminSession;
}

/**
 * Requires Super Admin role specifically.
 * Use this for: admin management, audit logs, system settings.
 */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const adminSession = await getAdminSession();

  if (adminSession.role !== "SUPER_ADMIN") {
    throw new RBACError(
      403,
      "This action requires Super Admin privileges"
    );
  }

  return adminSession;
}

/**
 * Logs an admin action to the AuditLog collection.
 * Call this AFTER successful execution, not before.
 */
export async function logAction({
  admin,
  action,
  resourceType,
  resourceId,
  resourceLabel,
  oldValue,
  newValue,
  description,
  req,
}: {
  admin: AdminSession;
  action: string;
  resourceType: string;
  resourceId?: string | mongoose.Types.ObjectId;
  resourceLabel?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  description?: string;
  req?: NextRequest;
}) {
  try {
    await AuditLog.create({
      adminId: admin.adminId,
      adminName: admin.name,
      adminEmail: admin.email,
      adminRole: admin.role,
      action,
      resourceType,
      resourceId: resourceId ? new mongoose.Types.ObjectId(resourceId.toString()) : undefined,
      resourceLabel,
      oldValue,
      newValue,
      description,
      ipAddress: req?.headers.get("x-forwarded-for") ?? req?.headers.get("x-real-ip") ?? undefined,
      userAgent: req?.headers.get("user-agent") ?? undefined,
    });
  } catch (err) {
    // Audit log failures should NEVER block the main operation
    console.error("[AuditLog] Failed to write audit entry:", err);
  }
}

/**
 * Helper: wraps an API handler with RBAC and returns a clean JSON error on failure.
 * Usage: return withPermission("project.update", req, handler)
 */
export async function withPermission<T>(
  permission: string,
  req: NextRequest,
  handler: (admin: AdminSession) => Promise<T>
): Promise<T> {
  const admin = await requirePermission(permission);
  return handler(admin);
}

/**
 * Helper: convert RBACError to a standard API response.
 */
export function rbacErrorResponse(err: unknown): Response {
  if (err instanceof RBACError) {
    return Response.json(
      { error: err.message },
      { status: err.statusCode }
    );
  }
  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
