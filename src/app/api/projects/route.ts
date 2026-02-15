import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    const projects = db.projects.findAll({ limit: 50 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
