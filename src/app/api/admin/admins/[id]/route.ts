import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser";
import AuditLog from "@/lib/models/AuditLog";
import {
  requireSuperAdmin,
  logAction,
  rbacErrorResponse,
} from "@/lib/rbac";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/admin/admins/[id] — get single admin with activity (Super Admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin();
    await dbConnect();

    const admin = await AdminUser.findById(params.id)
      .select("-password_hash -googleId -inviteToken")
      .lean();

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Get recent audit activity for this admin
    const recentActivity = await AuditLog.find({ adminId: params.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ admin, recentActivity });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// PATCH /api/admin/admins/[id] — update admin info / deactivate / change permissions
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const superAdmin = await requireSuperAdmin();
    await dbConnect();

    const body = await req.json();
    const { name, permissions, isActive, newPassword } = body;

    const targetAdmin = await AdminUser.findById(params.id);
    if (!targetAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Cannot modify a Super Admin via this route
    if (targetAdmin.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Super Admin accounts cannot be modified via this endpoint" },
        { status: 403 }
      );
    }

    const oldValue: Record<string, unknown> = {
      name: targetAdmin.name,
      isActive: targetAdmin.isActive,
      permissions: targetAdmin.permissions,
    };

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (newPassword) {
      updateData.password_hash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await AdminUser.findByIdAndUpdate(
      params.id,
      updateData,
      { returnDocument: 'after' }
    ).select("-password_hash -googleId");

    await logAction({
      admin: superAdmin,
      action: isActive === false ? "admin.deactivate" : "admin.update",
      resourceType: "AdminUser",
      resourceId: params.id,
      resourceLabel: targetAdmin.name,
      oldValue,
      newValue: { name: updated?.name, isActive: updated?.isActive, permissions: updated?.permissions },
      description: isActive === false
        ? `Deactivated admin: ${targetAdmin.name}`
        : `Updated admin: ${targetAdmin.name}`,
      req,
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}

// DELETE /api/admin/admins/[id] — soft delete (Super Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const superAdmin = await requireSuperAdmin();
    await dbConnect();

    const targetAdmin = await AdminUser.findById(params.id);
    if (!targetAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Cannot delete a Super Admin
    if (targetAdmin.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Super Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    // Safety: ensure we're not deleting ourselves
    if (params.id === superAdmin.adminId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 403 }
      );
    }

    // Soft delete — data remains, audit trail preserved
    await AdminUser.findByIdAndUpdate(params.id, {
      deletedAt: new Date(),
      isActive: false,
    });

    await logAction({
      admin: superAdmin,
      action: "admin.delete",
      resourceType: "AdminUser",
      resourceId: params.id,
      resourceLabel: targetAdmin.name,
      description: `Soft-deleted admin: ${targetAdmin.name} (${targetAdmin.email})`,
      req,
    });

    return NextResponse.json({ success: true, message: "Admin deactivated and archived" });
  } catch (err) {
    return rbacErrorResponse(err);
  }
}
