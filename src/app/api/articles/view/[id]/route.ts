import { Article } from "@/models/index";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID tələb olunur" }, { status: 400 });
    }
    const articleId = parseInt(id);
    // Sequelize increment
    const result = await Article.increment("viewCount", {
      by: 1,
      where: { Id: articleId, isDeleted: false },
    });

    return NextResponse.json({
      success: true,
      // message: "View count updated",
    });
  } catch (error) {
    console.error("View count error:", error);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
