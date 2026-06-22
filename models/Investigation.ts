import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IInvestigation extends Document {
  name: string;
}

const InvestigationSchema = new Schema<IInvestigation>(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true }
);

export default models.Investigation || model<IInvestigation>("Investigation", InvestigationSchema);