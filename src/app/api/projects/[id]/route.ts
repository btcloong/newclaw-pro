import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects/[id] - 获取单个项目
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = db.projects.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
