import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAzoCaresEntry extends Document {
  amount: number;
  initiative: string;
  date: Date;
  project_id: mongoose.Types.ObjectId; // which project's profit funds this
  evidence: string[]; // Photo(s) / receipt URLs
}

const AzoCaresEntrySchema: Schema<IAzoCaresEntry> = new Schema(
  {
    amount: { type: Number, required: true },
    initiative: { type: String, required: true },
    date: { type: Date, required: true },
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    evidence: [{ type: String }],
  },
  { timestamps: true }
);

const AzoCaresEntry: Model<IAzoCaresEntry> =
  mongoose.models.AzoCaresEntry ||
  mongoose.model<IAzoCaresEntry>("AzoCaresEntry", AzoCaresEntrySchema);

export default AzoCaresEntry;
