import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import { Article, Video, Category } from "@/models";
import { Op } from "sequelize";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, video, article, book

    if (!q) return NextResponse.json({ data: [] });

    const searchResults = [];

    // Search Articles (Titles and Content)
    if (type === "all" || type === "article") {
      const articles = await Article.findAll({
        where: {
          isDeleted: false,
          [Op.or]: [
            { Title: { [Op.like]: `%${q}%` } },
            { Content: { [Op.like]: `%${q}%` } },
          ],
        },
        limit: 10,
        attributes: ["Id", "Title", "Slug", "Thumb_img"],
      });
      searchResults.push(
        ...articles.map((a: any) => ({ ...a.toJSON(), searchType: "article" }))
      );
    }

    // Search Videos (Titles only)
    if (type === "all" || type === "video") {
      const videos = await Video.findAll({
        where: {
          isDeleted: false,
          Title: { [Op.like]: `%${q}%` },
          // Filter by Video types if needed (e.g., exclude books if they share the table)
        },
        limit: 10,
        attributes: ["Id", "Title", "Link", "Thumb_img"],
      });
      searchResults.push(
        ...videos.map((v: any) => ({ ...v.toJSON(), searchType: "video" }))
      );
    }

    // Note: If Books are in a separate table or have a specific 'Type' in Video table,
    // add that logic here similarly.

    return NextResponse.json({ data: searchResults });
  } catch (err: any) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
