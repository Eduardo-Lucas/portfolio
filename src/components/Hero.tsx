"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const WORDS = ["Data Architect", "Python Engineer", "Django Expert", "ERP Modernizer", "AI Enthusiast"];

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const type = () => {
      const current = WORDS[indexRef.current];
      const el = wordRef.current;
      if (!el) return;

      if (!deletingRef.current) {
        el.textContent = current.slice(0, charRef.current + 1);
        charRef.current++;
        if (charRef.current === current.length) {
          deletingRef.current = true;
          timerRef.current = setTimeout(type, 1800);
          return;
        }
        timerRef.current = setTimeout(type, 80);
      } else {
        el.textContent = current.slice(0, charRef.current - 1);
        charRef.current--;
        if (charRef.current === 0) {
          deletingRef.current = false;
          indexRef.current = (indexRef.current + 1) % WORDS.length;
          timerRef.current = setTimeout(type, 300);
          return;
        }
        timerRef.current = setTimeout(type, 45);
      }
    };
    timerRef.current = setTimeout(type, 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />

      {/* Diagonal accent line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-full opacity-10"
          style={{ background: "linear-gradient(180deg, transparent, #00d4ff 40%, #7c3aed 60%, transparent)" }} />
        <div className="absolute top-0 left-20 w-px h-2/3 opacity-5"
          style={{ background: "linear-gradient(180deg, transparent, #00d4ff, transparent)" }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-accent/20">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-xs font-mono text-accent tracking-widest uppercase">
            Available for Senior Roles
          </span>
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
          <span className="text-ink">Eduardo</span>
          <br />
          <span className="gradient-text">Lucas</span>
        </h1>

        {/* Typewriter */}
        <div className="h-12 flex items-center justify-center mb-6">
          <span className="text-xl md:text-2xl font-mono text-muted">
            <span ref={wordRef} className="text-ink" />
            <span className="inline-block w-0.5 h-6 bg-accent ml-0.5 animate-pulse" />
          </span>
        </div>

        {/* Summary */}
        <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed mb-10">
          Senior Python/Django Developer with{" "}
          <span className="text-ink font-semibold">25+ years in enterprise IT</span>.
          I build scalable, data-driven systems that modernise ERP, streamline operations,
          and drive measurable business value.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {[
            { value: "25+", label: "Years in IT" },
            { value: "10+", label: "Years in Python" },
            { value: "5", label: "Continents" },
            { value: "∞", label: "Curiosity" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-xs text-muted uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/career"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg font-semibold rounded hover:bg-accent-dim transition-colors duration-200"
          >
            View My Career
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3.5 glass border border-white/10 text-ink font-semibold rounded hover:border-accent/40 hover:text-accent transition-all duration-200"
          >
            Read My Blog
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted2">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
