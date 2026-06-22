import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

const MAX_RETRIES = 3;

async function generateMRNumber(): Promise<string> {
  // Sort by mrNumber descending (not createdAt) to always get the true highest
  const latest = await Patient.findOne({}, { mrNumber: 1 })
    .sort({ mrNumber: -1 })
    .lean() as { mrNumber?: string } | null;

  if (!latest?.mrNumber) return "00000001";

  const lastNum = parseInt(latest.mrNumber, 10);
  if (isNaN(lastNum)) return "00000001";
  return String(lastNum + 1).padStart(8, "0");
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // existing validation (unchanged)
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ success: false, error: "Patient name is required" }, { status: 400 });
    }
    if (body.ageValue === undefined || body.ageValue === null || body.ageValue === "") {
      return NextResponse.json({ success: false, error: "Age is required" }, { status: 400 });
    }
    const ageNum = Number(body.ageValue);
    if (isNaN(ageNum) || ageNum < 0) {
      return NextResponse.json({ success: false, error: "Valid age is required" }, { status: 400 });
    }

    // existing medication filter (unchanged)
    const medications = (body.medications || [])
      .filter((m: { drug?: string }) => m.drug && m.drug.trim() !== "")
      .map((m: {
        drug?: string; frequency?: string; dosage?: string; duration?: string;
        instruction?: string; frequencyUrdu?: string; dosageUrdu?: string;
        durationUrdu?: string; instructionUrdu?: string;
      }) => ({
        drug:            (m.drug            || "").trim().slice(0, 500),
        frequency:       (m.frequency       || "").trim().slice(0, 200),
        dosage:          (m.dosage          || "").trim().slice(0, 200),
        duration:        (m.duration        || "").trim().slice(0, 200),
        instruction:     (m.instruction     || "").trim().slice(0, 200),
        frequencyUrdu:   (m.frequencyUrdu   || "").trim().slice(0, 200),
        dosageUrdu:      (m.dosageUrdu      || "").trim().slice(0, 200),
        durationUrdu:    (m.durationUrdu    || "").trim().slice(0, 200),
        instructionUrdu: (m.instructionUrdu || "").trim().slice(0, 200),
      }));

    // shared patient fields builder
    const patientFields = {
      name:                body.name.trim().slice(0, 200),
      gender:              ["Male", "Female", "Other"].includes(body.gender) ? body.gender : "Male",
      age:                 ageNum,
      ageUnit:             body.ageUnit === "Months" ? "Months" : "Years",
      clinic:              ["islamabad", "siddique"].includes(body.clinic) ? body.clinic : "islamabad",
      contact:             (body.contact             || "").trim().slice(0, 100),
      address:             (body.address             || "").trim().slice(0, 500),
      complaint:           (body.complaint           || "").trim().slice(0, 2000),
      clinicalExamination: (body.clinicalExamination || "").trim().slice(0, 5000),
      diagnosis:           (body.diagnosis           || "").trim().slice(0, 2000),
      investigation:       (body.investigation       || "").trim().slice(0, 2000),
      medications,
      visitDate: new Date(),
    };

    // ── RETURNING PATIENT — reuse provided MR number ──
    const providedMr = (body.mrNumber || "").toString().trim();
    if (providedMr) {
      const existing = await Patient.findOne({ mrNumber: providedMr });
      if (!existing) {
        return NextResponse.json(
          { success: false, error: `MR number ${providedMr} not found in records` },
          { status: 404 }
        );
      }
      const patient = new Patient({ ...patientFields, mrNumber: providedMr });
      await patient.save();
      return NextResponse.json({ success: true, data: patient }, { status: 201 });
    }

    // ── NEW PATIENT — generate MR number (existing retry loop, unchanged) ──
    let savedPatient = null;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const mrNumber = await generateMRNumber();
        const patient = new Patient({ ...patientFields, mrNumber });
        await patient.save();
        savedPatient = patient;
        break;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("E11000") || msg.includes("duplicate key")) {
          lastError = err instanceof Error ? err : new Error(msg);
          await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
          continue;
        }
        throw err;
      }
    }

    if (!savedPatient) {
      return NextResponse.json(
        { success: false, error: `MR number conflict after ${MAX_RETRIES} attempts. Please try again.` },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, data: savedPatient }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[POST /api/patients]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // ── Single patient lookup by MR number ──
    const mrNumber = searchParams.get("mrNumber");
    if (mrNumber) {
      const patient = await Patient.findOne({ mrNumber: mrNumber.trim() })
        .sort({ visitDate: -1 })
        .lean();
      if (!patient) {
        return NextResponse.json(
          { success: false, error: "MR number not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: patient }, { status: 200 });
    }

    // ── existing paginated list (unchanged below this line) ──
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip  = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      Patient.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Patient.countDocuments(),
    ]);
    return NextResponse.json({ success: true, data: patients, total, page, limit }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[GET /api/patients]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}