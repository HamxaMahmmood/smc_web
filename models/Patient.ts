import mongoose, { Schema, Document } from "mongoose";

export interface IMedication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
}

export interface IPatient extends Document {
  name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  mrNumber: string;
  complaint: string;
  clinicalExamination: string;
  diagnosis: string;
  investigation: string;
  medications: IMedication[];
  visitDate: Date;
  createdAt: Date;
}

const MedicationSchema = new Schema<IMedication>({
  drug: { type: String, required: true },
  frequency: { type: String, default: "" },
  dosage: { type: String, default: "" },
  duration: { type: String, default: "" },
  instruction: { type: String, default: "" },
});

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    age: { type: Number, required: true },
    mrNumber: { type: String, required: true, unique: true, trim: true },
    complaint: { type: String, default: "" },
    clinicalExamination: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    investigation: { type: String, default: "" },
    medications: { type: [MedicationSchema], default: [] },
    visitDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Text index for search
PatientSchema.index({ name: "text", mrNumber: "text", diagnosis: "text" });

export default mongoose.models.Patient ||
  mongoose.model<IPatient>("Patient", PatientSchema);
