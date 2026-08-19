import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "new_application"
  | "document_submitted"
  | "document_approved"
  | "document_rejected"
  | "document_revision"
  | "kyc_verified"
  | "certificate_issued"
  | "project_progress"
  | "new_announcement"
  | "payment_update"
  | "system_alert"
  | "admin_created"
  | "admin_deactivated";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  recipientRole: "SUPER_ADMIN" | "REGULAR_ADMIN" | "INVESTOR" | "CLIENT" | "SHAREHOLDER";
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string; // deep link e.g. /admin/applications/[id]
  relatedId?: mongoose.Types.ObjectId; // the resource this is about
  relatedType?: string;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true, index: true },
    recipientRole: {
      type: String,
      enum: ["SUPER_ADMIN", "REGULAR_ADMIN", "INVESTOR", "CLIENT", "SHAREHOLDER"],
      required: true,
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    relatedId: { type: Schema.Types.ObjectId },
    relatedType: { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
