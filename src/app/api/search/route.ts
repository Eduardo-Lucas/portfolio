import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/blog";

export const dynamic = "force-static";

export async function GET() {
  const index = await getSearchIndex();

  return NextResponse.json(index, {
    headers: {
      // Browsers must revalidate so a new deploy's index shows up immediately;
      // the CDN still serves the prerendered copy and is purged on each deploy.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
