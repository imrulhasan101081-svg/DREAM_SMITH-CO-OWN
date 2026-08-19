import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHolding extends Document {
  investor_id: mongoose.Types.ObjectId;
  project_id: mongoose.Types.ObjectId;
  share_count: number;
  purchase_date: Date;
  maturity_date: Date;
  agreement_ref: string;
  cheque_ref: string; // encrypted, masked in API
  status: "active" | "matured" | "paid_out";
}

const HoldingSchema: Schema<IHolding> = new Schema(
  {
    investor_id: {
      type: Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    share_count: { type: Number, required: true },
    purchase_date: { type: Date, required: true },
    maturity_date: { type: Date, required: true },
    agreement_ref: { type: String, required: true },
    cheque_ref: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "matured", "paid_out"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

const Holding: Model<IHolding> =
  mongoose.models.Holding || mongoose.model<IHolding>("Holding", HoldingSchema);

export default Holding;
