import { Homepage } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const homepage = await Homepage.findOne();
    if (!homepage) {
      return NextResponse.json(
        { success: false, message: "Homepage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: homepage });
  } catch (error: any) {
    console.error("Error fetching homepage:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
