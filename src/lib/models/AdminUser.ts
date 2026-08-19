import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminRole = "SUPER_ADMIN" | "REGULAR_ADMIN";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[]; // e.g. ["project.create", "client.update"]
  isActive: boolean;
  googleId?: string; // for Google OAuth Super Admins
  password_hash?: string; // for Regular Admin credentials login
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdBy?: mongoose.Types.ObjectId; // which Super Admin created this
  deletedAt?: Date; // soft delete
  inviteToken?: string; // pending invitation
  inviteExpiry?: Date;
}

// All available permissions in the system
export const ALL_PERMISSIONS = [
  "project.create",
  "project.update",
  "project.delete",
  "project.publish",
  "project.progress.update",
  "project.media.upload",
  "project.media.delete",
  "client.create",
  "client.update",
  "client.document.review",
  "client.document.approve",
  "client.document.reject",
  "pricing.create",
  "pricing.update",
  "pricing.delete",
  "admin.create",
  "admin.update",
  "admin.deactivate",
  "admin.delete",
  "system.settings.update",
  "audit.view",
  "content.update",
  "media.upload",
  "media.delete",
  "certificate.issue",
  "certificate.reissue",
  "cares.create",
  "notification.send",
] as const;

// Regular admin default permissions (operational, no system-level access)
export const REGULAR_ADMIN_DEFAULT_PERMISSIONS: string[] = [
  "project.create",
  "project.update",
  "project.progress.update",
  "project.media.upload",
  "project.media.delete",
  "client.create",
  "client.update",
  "client.document.review",
  "client.document.approve",
  "client.document.reject",
  "media.upload",
  "certificate.issue",
  "cares.create",
];

const AdminUserSchema: Schema<IAdminUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "REGULAR_ADMIN"],
      required: true,
    },
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    googleId: { type: String, sparse: true },
    password_hash: { type: String },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    deletedAt: { type: Date, default: null },
    inviteToken: { type: String },
    inviteExpiry: { type: Date },
  },
  { timestamps: true }
);

// Index for fast email lookup
AdminUserSchema.index({ email: 1, isActive: 1 });

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
