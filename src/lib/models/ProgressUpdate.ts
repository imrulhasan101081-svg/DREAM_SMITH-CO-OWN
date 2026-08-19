import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProgressUpdate extends Document {
  project_id: mongoose.Types.ObjectId;
  phase:
    | "land_permits"
    | "foundation"
    | "structure"
    | "finishing"
    | "handover";
  date: Date;
  photos: string[];
  description: string;
  posted_by: string; // Staff identity
}

const ProgressUpdateSchema: Schema<IProgressUpdate> = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    phase: {
      type: String,
      enum: [
        "land_permits",
        "foundation",
        "structure",
        "finishing",
        "handover",
      ],
      required: true,
    },
    date: { type: Date, required: true },
    photos: [{ type: String }],
    description: { type: String, required: true },
    posted_by: { type: String, required: true },
  },
  { timestamps: true }
);

const ProgressUpdate: Model<IProgressUpdate> =
  mongoose.models.ProgressUpdate ||
  mongoose.model<IProgressUpdate>("ProgressUpdate", ProgressUpdateSchema);

export default ProgressUpdate;
