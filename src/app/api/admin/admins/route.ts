import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser, { REGULAR_ADMIN_DEFAULT_PERMISSIONS } from "@/lib/models/AdminUser";
import {
  requireSuperAdmin,
  logAction,
  rbacErrorResponse,
} from "@/lib/rbac";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/admin/admins — list all admins (Super Admin only)
export async function GET() {
  try {
    const admin = await requireSuperAdmin();
    await dbConnect();

    const admins = await AdminUser.find({ deletedAt: null })
      .select("-password_hash -googleId -inviteToken")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ admins });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// POST /api/admin/admins — create a Regular Admin (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperAdmin();
    await dbConnect();

    const body = await req.json();
    const { name, email, password, permissions } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check for existing admin with this email
    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An admin with this email already exists" },
        { status: 409 }
      );
    }

    // Cannot create a Super Admin via this route
    const password_hash = await bcrypt.hash(password, 12);

    const newAdmin = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      role: "REGULAR_ADMIN",
      permissions: permissions ?? REGULAR_ADMIN_DEFAULT_PERMISSIONS,
      isActive: true,
      password_hash,
      createdBy: admin.adminId,
    });

    await logAction({
      admin,
      action: "admin.create",
      resourceType: "AdminUser",
      resourceId: newAdmin._id.toString(),
      resourceLabel: name,
      description: `Created Regular Admin: ${name} (${email})`,
      req,
    });

    return NextResponse.json({
      success: true,
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions: newAdmin.permissions,
        isActive: newAdmin.isActive,
      },
    });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
