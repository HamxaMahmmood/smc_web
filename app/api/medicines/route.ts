import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Medicine from "@/models/Medicine";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  try {
    await dbConnect();
    const medicines = await Medicine.find().sort({ generic: 1 }).lean();
    return NextResponse.json({ success: true, data: medicines }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[GET /api/medicines]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const generic = (body.generic || "").toString().trim();
    const brand   = (body.brand    || "").toString().trim();
    const pkg     = (body.package  || "").toString().trim();

    if (!generic) {
      return NextResponse.json(
        { success: false, error: "Generic name is required" },
        { status: 400 }
      );
    }

    let medicine = await Medicine.findOne({
      generic: new RegExp(`^${escapeRegex(generic)}$`, "i"),
    });

    if (!medicine) {
      medicine = new Medicine({
        generic,
        brands:   brand ? [brand] : [],
        packages: pkg   ? [pkg]   : [],
      });
      await medicine.save();
    } else {
      let changed = false;
      if (brand) {
        const exists = medicine.brands.some(
          (b: string) => b.toLowerCase() === brand.toLowerCase()
        );
        if (!exists) { medicine.brands.push(brand); changed = true; }
      }
      if (pkg) {
        const exists = medicine.packages.some(
          (p: string) => p.toLowerCase() === pkg.toLowerCase()
        );
        if (!exists) { medicine.packages.push(pkg); changed = true; }
      }
      if (changed) await medicine.save();
    }
    return NextResponse.json({ success: true, data: medicine }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[POST /api/medicines]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const generic = (searchParams.get("generic") || "").trim();
    const brand   = (searchParams.get("brand")   || "").trim();

    const pkg   = (searchParams.get("package") || "").trim();

    if (!generic || (!brand && !pkg)) {
      return NextResponse.json({ success: false, error: "Generic and either brand or package are required" }, { status: 400 });
    }

    const medicine = await Medicine.findOne({
      generic: new RegExp(`^${escapeRegex(generic)}$`, "i"),
    });
    if (!medicine) {
      return NextResponse.json({ success: false, error: "Generic not found" }, { status: 404 });
    }

    if (brand) {
      medicine.brands = medicine.brands.filter(
        (b: string) => b.toLowerCase() !== brand.toLowerCase()
      );
    }
    if (pkg) {
      medicine.packages = medicine.packages.filter(
        (p: string) => p.toLowerCase() !== pkg.toLowerCase()
      );
    }
    await medicine.save();

    return NextResponse.json({ success: true, data: medicine }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}