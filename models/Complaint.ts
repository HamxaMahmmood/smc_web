import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IComplaint extends Document {
  name: string;
}

const ComplaintSchema = new Schema<IComplaint>(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true }
);

export default models.Complaint || model<IComplaint>("Complaint", ComplaintSchema);