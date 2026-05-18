import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

const LOGO_EXTENSIONS = new Set([".svg", ".png", ".webp", ".avif", ".jpg", ".jpeg"]);

export async function GET() {
  try {
    const logosDir = path.join(process.cwd(), "public", "logos");
    const entries = await readdir(logosDir, { withFileTypes: true });
    const logos = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => LOGO_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => `/logos/${name}`);
    return NextResponse.json({ logos });
  } catch {
    return NextResponse.json({ logos: [] });
  }
}
