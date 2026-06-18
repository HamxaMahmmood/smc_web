import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

async function generateMRNumber(): Promise<string> {
  // Find the highest existing MR number and increment
  // This is safer than countDocuments under concurrent requests
  const latest = await Patient.findOne({}, { mrNumber: 1 })
    .sort({ createdAt: -1 })
    .lean() as { mrNumber?: string } | null;

  if (!latest || !latest.mrNumber) {
    return "00000001";
  }

  const lastNum = parseInt(latest.mrNumber, 10);
  if (isNaN(lastNum)) return "00000001";
  return String(lastNum + 1).padStart(8, "0");
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json({ success: false, error: "Patient name is required" }, { status: 400 });
    }
    if (body.age === undefined || body.age === null || isNaN(Number(body.age))) {
      return NextResponse.json({ success: false, error: "Valid age is required" }, { status: 400 });
    }

    const mrNumber = await generateMRNumber();

    const patient = new Patient({
      name: body.name.trim(),
      gender: body.gender || "Male",
      age: Number(body.age),
      mrNumber,
      complaint: body.complaint || "",
      clinicalExamination: body.clinicalExamination || "",
      diagnosis: body.diagnosis || "",
      investigation: body.investigation || "",
      medications: (body.medications || []).map((m: {
        drug?: string;
        frequency?: string;
        dosage?: string;
        duration?: string;
        instruction?: string;
        frequencyUrdu?: string;
        dosageUrdu?: string;
        durationUrdu?: string;
        instructionUrdu?: string;
      }) => ({
        drug: m.drug || "",
        frequency: m.frequency || "",
        dosage: m.dosage || "",
        duration: m.duration || "",
        instruction: m.instruction || "",
        frequencyUrdu: m.frequencyUrdu || "",
        dosageUrdu: m.dosageUrdu || "",
        durationUrdu: m.durationUrdu || "",
        instructionUrdu: m.instructionUrdu || "",
      })),
      visitDate: new Date(),
    });

    await patient.save();

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Duplicate MR number — retry once
    if (message.includes("duplicate key") || message.includes("E11000")) {
      return NextResponse.json({ success: false, error: "MR number conflict, please try again" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Patient.countDocuments();

    return NextResponse.json({ success: true, data: patients, total }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}