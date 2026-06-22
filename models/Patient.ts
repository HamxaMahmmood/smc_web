import mongoose, { Schema, Document } from "mongoose";

// IMedication interface — add the four Urdu fields
export interface IMedication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
  frequencyUrdu?: string;
  dosageUrdu?: string;
  durationUrdu?: string;
  instructionUrdu?: string;
}


// IPatient interface — add clinic
// IPatient interface — add contact and address
export interface IPatient extends Document {
  name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  ageUnit: "Years" | "Months";
  clinic: string;
  mrNumber: string;
  contact: string;
  address: string;
  complaint: string;
  clinicalExamination: string;
  diagnosis: string;
  investigation: string;
  medications: IMedication[];
  visitDate: Date;
  createdAt: Date;
}

// MedicationSchema — add the four Urdu fields
const MedicationSchema = new Schema<IMedication>({
  drug: { type: String, required: true },
  frequency: { type: String, default: "" },
  dosage: { type: String, default: "" },
  duration: { type: String, default: "" },
  instruction: { type: String, default: "" },
  frequencyUrdu: { type: String, default: "" },
  dosageUrdu: { type: String, default: "" },
  durationUrdu: { type: String, default: "" },
  instructionUrdu: { type: String, default: "" },
});

// PatientSchema — remove unique: true from mrNumber, add contact + address
const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    age: { type: Number, required: true },
    ageUnit: { type: String, enum: ["Years", "Months"], default: "Years" },
    clinic: { type: String, enum: ["islamabad", "siddique"], default: "islamabad" },
    mrNumber: { type: String, required: true, trim: true },  // unique removed
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
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
