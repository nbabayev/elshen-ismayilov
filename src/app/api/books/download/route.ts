import { NextResponse } from "next/server";
import cloudinary from "@/@lib/api/cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

/**
 * PdfUrl-dən Cloudinary public_id çıxarır.
 * Nümunə:
 * https://res.cloudinary.com/xxx/raw/upload/v123/books/pdf/abc.pdf
 * → books/pdf/abc.pdf
 */
function parseCloudinaryPublicId(url: string): {
  publicId: string;
  resourceType: "raw" | "image" | "auto";
} | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("res.cloudinary.com")) return null;
    if (CLOUD_NAME && !parsed.pathname.includes(`/${CLOUD_NAME}/`)) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    // [cloud, resource_type, type, (v123)?, ...publicId]
    const cloudIdx = CLOUD_NAME ? parts.indexOf(CLOUD_NAME) : 0;
    const resourceType = (parts[cloudIdx + 1] || "raw") as
      | "raw"
      | "image"
      | "auto";
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx < 0) return null;

    let idParts = parts.slice(uploadIdx + 1);
    // version segment: v123456
    if (idParts[0] && /^v\d+$/.test(idParts[0])) {
      idParts = idParts.slice(1);
    }
    if (!idParts.length) return null;

    return {
      publicId: decodeURIComponent(idParts.join("/")),
      resourceType: resourceType === "image" ? "image" : "raw",
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfUrl = searchParams.get("url");
    const fileName = searchParams.get("filename") || "kitab.pdf";
    const inline = searchParams.get("inline") === "1";

    if (!pdfUrl) {
      return NextResponse.json({ error: "PDF URL yoxdur" }, { status: 400 });
    }

    const parsed = parseCloudinaryPublicId(pdfUrl);
    if (!parsed) {
      return NextResponse.json({ error: "Yanlış PDF URL" }, { status: 400 });
    }

    // Public delivery PDF-ləri Cloudinary-də 401 verir.
    // private_download_url API secret ilə müvəqqəti icazəli link yaradır.
    const authenticatedUrl = cloudinary.utils.private_download_url(
      parsed.publicId,
      "",
      {
        resource_type: parsed.resourceType,
        type: "upload",
        attachment: true,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
      }
    );

    const upstream = await fetch(authenticatedUrl, { redirect: "follow" });
    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            "PDF Cloudinary-dən oxuna bilmədi. Admin-dən PDF-i yenidən yükləyin.",
          status: upstream.status,
        },
        { status: 502 }
      );
    }

    const bytes = await upstream.arrayBuffer();
    const head = Buffer.from(bytes.slice(0, 5)).toString("utf8");
    if (!head.startsWith("%PDF")) {
      return NextResponse.json(
        { error: "Fayl PDF deyil və ya zədələnib" },
        { status: 502 }
      );
    }

    const safeName = fileName.replace(/[^\w.\-əıöüğçşƏİÖÜĞÇŞ ]+/gi, "_");
    const disposition = inline ? "inline" : "attachment";

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${safeName}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
