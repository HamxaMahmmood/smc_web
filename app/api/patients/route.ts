import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

// Auto-generate MR number
async function generateMRNumber(): Promise<string> {
  const count = await Patient.countDocuments();
  const num = (count + 1).toString().padStart(8, "0");
  return num;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const mrNumber = await generateMRNumber();

    const patient = new Patient({
      ...body,
      mrNumber,
      visitDate: new Date(),
    });

    await patient.save();

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
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
