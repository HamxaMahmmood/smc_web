import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IDiagnosis extends Document {
  name: string;
}

const DiagnosisSchema = new Schema<IDiagnosis>(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true }
);

export default models.Diagnosis || model<IDiagnosis>("Diagnosis", DiagnosisSchema);