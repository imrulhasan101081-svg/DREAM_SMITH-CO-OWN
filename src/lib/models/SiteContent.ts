import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteContent extends Document {
  section: string; // e.g. "hero", "about", "footer", "cares"
  key: string; // e.g. "headline", "subtitle", "phone"
  value: string; // stored as string (JSON for complex values)
  label: string; // human-readable label for admin CMS UI
  type: "text" | "textarea" | "url" | "email" | "phone" | "number" | "json";
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
}

const SiteContentSchema: Schema<ISiteContent> = new Schema(
  {
    section: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: String, required: true, default: "" },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "textarea", "url", "email", "phone", "number", "json"],
      default: "text",
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    updatedByName: { type: String },
  },
  { timestamps: true }
);

// Unique compound index: section + key
SiteContentSchema.index({ section: 1, key: 1 }, { unique: true });

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;
