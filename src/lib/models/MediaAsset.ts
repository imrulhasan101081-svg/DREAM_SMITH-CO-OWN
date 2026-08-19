import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAsset extends Document {
  filename: string; // stored filename on CDN
  originalName: string; // original uploaded name
  mimeType: string;
  size: number; // in bytes
  url: string; // public CDN URL
  storageKey: string; // R2/S3 object key
  uploadedBy: mongoose.Types.ObjectId;
  uploadedByName?: string;
  associatedWith?: {
    type: "Project" | "Certificate" | "AzoCaresEntry" | "Investor" | "Site";
    id: mongoose.Types.ObjectId;
  };
  tags: string[];
  altText?: string;
  caption?: string;
  deletedAt?: Date;
}

const MediaAssetSchema: Schema<IMediaAsset> = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    storageKey: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    uploadedByName: { type: String },
    associatedWith: {
      type: {
        type: String,
        enum: ["Project", "Certificate", "AzoCaresEntry", "Investor", "Site"],
      },
      id: { type: Schema.Types.ObjectId },
    },
    tags: [{ type: String }],
    altText: { type: String },
    caption: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MediaAssetSchema.index({ "associatedWith.id": 1 });
MediaAssetSchema.index({ deletedAt: 1, createdAt: -1 });

const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);

export default MediaAsset;
