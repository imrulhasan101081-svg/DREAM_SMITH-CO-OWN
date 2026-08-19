import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  project_id: mongoose.Types.ObjectId;
  full_name: string;
  email: string;
  contact: string;
  address: string;
  nid_number: string;
  shares_requested: number;
  nominee_name: string;
  nominee_relation: string;
  nominee_contact: string;
  bank_details: string;
  status: "new" | "converted" | "rejected";
  // Document verification workflow
  verificationStatus:
    | "pending"
    | "under_review"
    | "approved"
    | "rejected"
    | "requires_revision";
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedByName?: string;
  verifiedAt?: Date;
  reviewedAt?: Date;
}

import { encrypt, decrypt } from "../encryption";

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    nid_number: { 
      type: String, 
      required: true,
      get: decrypt,
      set: encrypt
    },
    shares_requested: { type: Number, required: true, min: 1 },
    nominee_name: { type: String, required: true },
    nominee_relation: { type: String, required: true },
    nominee_contact: { type: String, required: true },
    bank_details: { 
      type: String, 
      required: true,
      get: decrypt,
      set: encrypt
    },
    status: {
      type: String,
      enum: ["new", "converted", "rejected"],
      default: "new",
    },
    verificationStatus: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "requires_revision",
      ],
      default: "pending",
    },
    verificationNotes: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    verifiedByName: { type: String },
    verifiedAt: { type: Date },
    reviewedAt: { type: Date },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
