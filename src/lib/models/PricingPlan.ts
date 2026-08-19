import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricingPlan extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  shares: number;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  badgeText?: string; // e.g. "Most Popular"
  deletedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const PricingPlanSchema: Schema<IPricingPlan> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    shares: { type: Number, default: 1, min: 1 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    badgeText: { type: String },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

PricingPlanSchema.index({ isActive: 1, order: 1 });

const PricingPlan: Model<IPricingPlan> =
  mongoose.models.PricingPlan ||
  mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);

export default PricingPlan;
