import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Diagnosis.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const name = (body.name || "").toString().trim();
    if (!name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });

    const existing = await Diagnosis.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });
    if (!existing) await Diagnosis.create({ name });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}