import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  action: string; // e.g. "project.progress.update"
  resourceType: string; // e.g. "Project"
  resourceId?: mongoose.Types.ObjectId;
  resourceLabel?: string; // human-readable name e.g. "Dream Smith Chihno"
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  description?: string; // plain text summary
  ipAddress?: string;
  userAgent?: string;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    resourceType: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId },
    resourceLabel: { type: String },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    description: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
    // Never allow updates to audit logs — they are append-only
    versionKey: false,
  }
);

// Indexes for fast filtering in admin audit view
AuditLogSchema.index({ adminId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
