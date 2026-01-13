import { Article } from "@/models/index";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "ID tələb olunur" }, { status: 400 });
    }

    // Sequelize increment
    const result = await Article.increment("viewCount", {
      by: 1,
      where: { Id: id, isDeleted: false },
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
