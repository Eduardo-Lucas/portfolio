import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/blog";

export const dynamic = "force-static";

export async function GET() {
  const index = await getSearchIndex();

  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
