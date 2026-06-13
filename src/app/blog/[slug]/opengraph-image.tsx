import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post by Eduardo Lucas";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? "Blog – Eduardo Lucas";
  const excerpt = post?.excerpt ?? "";
  const tags = post?.tags?.slice(0, 4) ?? [];
  const truncatedExcerpt =
    excerpt.length > 110 ? excerpt.slice(0, 110) + "…" : excerpt;
  const fontSize = title.length > 60 ? "48px" : title.length > 40 ? "56px" : "68px";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #00d4ff 0%, #7c3aed 100%)",
            display: "flex",
          }}
        />

        {/* Brand + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span
              style={{ color: "#f1f5f9", fontSize: "22px", fontWeight: 700 }}
            >
              Eduardo
            </span>
            <span
              style={{ color: "#00d4ff", fontSize: "22px", fontWeight: 700 }}
            >
              .
            </span>
          </div>
          <span style={{ color: "#475569", fontSize: "15px" }}>
            eduardo-lucas-dev.com
          </span>
        </div>

        {/* Title + excerpt */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              color: "#f1f5f9",
              fontSize,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: "20px",
              maxWidth: "980px",
            }}
          >
            {title}
          </div>
          {truncatedExcerpt && (
            <div
              style={{
                color: "#94a3b8",
                fontSize: "22px",
                lineHeight: 1.45,
                maxWidth: "860px",
              }}
            >
              {truncatedExcerpt}
            </div>
          )}
        </div>

        {/* Footer: tags + author */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          {/* Tags */}
          <div style={{ display: "flex", gap: "8px" }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(0, 212, 255, 0.10)",
                  border: "1px solid rgba(0, 212, 255, 0.28)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  color: "#00d4ff",
                  fontSize: "14px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(124,58,237,0.25) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00d4ff",
                fontSize: "15px",
                fontWeight: 900,
              }}
            >
              EL
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span
                style={{ color: "#f1f5f9", fontSize: "17px", fontWeight: 700 }}
              >
                Eduardo Lucas
              </span>
              <span style={{ color: "#475569", fontSize: "13px" }}>
                Senior Python/Django · Data Architect
              </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #7c3aed 50%, transparent 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
