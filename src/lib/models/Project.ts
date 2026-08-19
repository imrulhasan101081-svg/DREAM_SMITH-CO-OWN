import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug: string;
  location: string;
  address?: string;
  structure_details: string;
  description?: string;
  total_shares: number;
  shares_reserved: number;
  price_per_share: number;
  buyback_amount: number;
  term_months: number;
  construction_months: number;
  first_refusal_rate: number;
  status: "planning" | "under_construction" | "completed";
  media: string[]; // legacy — kept for compatibility

  // Extended fields
  isPublished: boolean;
  isFeatured: boolean;
  deletedAt?: Date;

  // Rich media
  coverImage?: string;
  gallery: string[];
  floorPlans: string[];
  brochureUrl?: string;
  videoUrls: string[];

  // Specs
  amenities: string[];
  facilities: string[];
  land_area?: string;
  total_units?: number;
  total_floors?: number;
  parking_info?: string;
  payment_info?: string;
  emi_info?: string;
  expected_completion_date?: Date;
  start_date?: Date;

  // Progress
  constructionProgress: number; // 0-100 overall
  progressBreakdown: {
    foundation: number;
    structural: number;
    interior: number;
    exterior: number;
    utility: number;
    handover: number;
  };

  // Visibility controls per field group
  visibility: {
    financials: "public" | "client" | "shareholder" | "admin" | "super_admin";
    documents: "public" | "client" | "shareholder" | "admin" | "super_admin";
    progress: "public" | "client" | "shareholder" | "admin" | "super_admin";
    contacts: "public" | "client" | "shareholder" | "admin" | "super_admin";
  };

  // Admin assignment
  assignedAdminId?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    address: { type: String },
    structure_details: { type: String, required: true },
    description: { type: String },
    total_shares: { type: Number, required: true },
    shares_reserved: { type: Number, default: 0 },
    price_per_share: { type: Number, required: true },
    buyback_amount: { type: Number, required: true },
    term_months: { type: Number, required: true },
    construction_months: { type: Number, required: true },
    first_refusal_rate: { type: Number, required: true },
    status: {
      type: String,
      enum: ["planning", "under_construction", "completed"],
      required: true,
      default: "planning",
    },
    media: [{ type: String }],

    // Extended
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // Media
    coverImage: { type: String },
    gallery: [{ type: String }],
    floorPlans: [{ type: String }],
    brochureUrl: { type: String },
    videoUrls: [{ type: String }],

    // Specs
    amenities: [{ type: String }],
    facilities: [{ type: String }],
    land_area: { type: String },
    total_units: { type: Number },
    total_floors: { type: Number },
    parking_info: { type: String },
    payment_info: { type: String },
    emi_info: { type: String },
    expected_completion_date: { type: Date },
    start_date: { type: Date },

    // Progress
    constructionProgress: { type: Number, default: 0, min: 0, max: 100 },
    progressBreakdown: {
      foundation: { type: Number, default: 0 },
      structural: { type: Number, default: 0 },
      interior: { type: Number, default: 0 },
      exterior: { type: Number, default: 0 },
      utility: { type: Number, default: 0 },
      handover: { type: Number, default: 0 },
    },

    // Visibility
    visibility: {
      financials: { type: String, enum: ["public", "client", "shareholder", "admin", "super_admin"], default: "public" },
      documents: { type: String, enum: ["public", "client", "shareholder", "admin", "super_admin"], default: "client" },
      progress: { type: String, enum: ["public", "client", "shareholder", "admin", "super_admin"], default: "public" },
      contacts: { type: String, enum: ["public", "client", "shareholder", "admin", "super_admin"], default: "client" },
    },

    assignedAdminId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

ProjectSchema.index({ isPublished: 1, deletedAt: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
