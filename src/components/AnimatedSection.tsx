"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const TRANSFORMS: Record<string, string> = {
  up: "translateY(24px)",
  left: "translateX(-24px)",
  right: "translateX(24px)",
  none: "",
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tx = TRANSFORMS[direction] ?? "";

    // Direct DOM manipulation — never touches React's render, so no hydration mismatch.
    el.style.opacity = "0";
    if (tx) el.style.transform = tx;

    const reveal = () => {
      el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
      el.style.opacity = "1";
      el.style.transform = "";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delay > 0 ? setTimeout(reveal, delay) : reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  // No inline styles in JSX — server and client render identical markup, no hydration warning.
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
