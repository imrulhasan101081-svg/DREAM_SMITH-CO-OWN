import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
  certificate_id: string; // e.g. DSCO-CERT-2026-0143
  holding_id: mongoose.Types.ObjectId;
  qr_verification_hash: string;
  issue_date: Date;
  superseded_by?: mongoose.Types.ObjectId; // points to the new Certificate if reissued
}

const CertificateSchema: Schema<ICertificate> = new Schema(
  {
    certificate_id: { type: String, required: true, unique: true },
    holding_id: {
      type: Schema.Types.ObjectId,
      ref: "Holding",
      required: true,
    },
    qr_verification_hash: { type: String, required: true, unique: true, index: true },
    issue_date: { type: Date, required: true },
    superseded_by: {
      type: Schema.Types.ObjectId,
      ref: "Certificate",
    },
  },
  { timestamps: true }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
