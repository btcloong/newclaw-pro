import { NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";

// GET /api/projects/[id] - 获取项目详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await db.select().from(projects).where(eq(projects.id, id));

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching project detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project detail" },
      { status: 500 }
    );
  }
}
