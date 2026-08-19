import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvestor extends Document {
  name: string;
  contact: string;
  email: string;
  address: string;
  nid_number: string; // encrypted string
  nid_hash: string; // deterministic hash of the plaintext NID, for dedup lookups
  nominee_name: string;
  nominee_relation: string;
  nominee_contact: string;
  kyc_status: "pending" | "verified";
  bank_details: string; // JSON string encrypted
  login_email?: string;
  password_hash?: string;
}

import { encrypt, decrypt } from "../encryption";

const InvestorSchema: Schema<IInvestor> = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    nid_number: {
      type: String,
      required: true,
      get: decrypt,
      set: encrypt
    },
    nid_hash: { type: String, index: true },
    nominee_name: { type: String, required: true },
    nominee_relation: { type: String, required: true },
    nominee_contact: { type: String, required: true },
    kyc_status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    bank_details: { 
      type: String, 
      required: true,
      get: decrypt,
      set: encrypt
    },
    login_email: { type: String, unique: true, sparse: true, lowercase: true },
    password_hash: { type: String },
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

const Investor: Model<IInvestor> =
  mongoose.models.Investor || mongoose.model<IInvestor>("Investor", InvestorSchema);

export default Investor;
