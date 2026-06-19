import { NextRequest, NextResponse } from "next/server";
import { getAllVideosWithSelection } from "@/services/videosWithSelected";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || ""; // ← Axtarış
  const selectedOnly = searchParams.get("selectedOnly") === "true";
  const type = searchParams.get("type");
  const isAdmin = true;

  const result = await getAllVideosWithSelection(
    limit,
    (page - 1) * limit,
    search,
    selectedOnly,
    type !== null ? parseInt(type) : undefined,
    isAdmin
  );

  return NextResponse.json({
    success: true,
    total: result.count,
    data: result.data,
  });
}
