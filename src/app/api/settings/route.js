import { NextResponse } from "next/server";
import { connectDB } from "@/@lib/api/db";
import * as settingsService from "@/services/settings.service";

export async function GET() {
  try {
    await connectDB();
    const result = await settingsService.getSettings();
    return NextResponse.json(result || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const contentType = req.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries());

      // Correctly handle boolean and number types from FormData
      if (payload.ShowStats !== undefined) {
        payload.ShowStats = payload.ShowStats === "true";
      }
      if (payload.StudentCount !== undefined) {
        payload.StudentCount = parseInt(payload.StudentCount) || 0;
      }
    } else {
      payload = await req.json();
    }

    const result = await settingsService.updateSettings(payload);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
