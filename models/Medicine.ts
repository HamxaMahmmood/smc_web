import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IMedicine extends Document {
  generic: string;
  brands: string[];
}

const MedicineSchema = new Schema<IMedicine>(
  {
    generic: { type: String, required: true, unique: true, trim: true },
    brands: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.Medicine || model<IMedicine>("Medicine", MedicineSchema);