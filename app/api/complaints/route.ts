import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Complaint.find().sort({ name: 1 }).lean();
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

    const existing = await Complaint.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });
    if (!existing) await Complaint.create({ name });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}