"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded bg-accent/20 border border-accent/40 group-hover:border-accent/80 transition-colors duration-300" />
            <div className="absolute inset-1 rounded bg-accent/30" />
            <span className="absolute inset-0 flex items-center justify-center text-accent text-xs font-black font-mono">
              EL
            </span>
          </div>
          <span className="font-semibold text-ink tracking-tight">
            Eduardo<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                    active
                      ? "text-accent"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded bg-accent/8 border border-accent/20" />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="mailto:eduardolucas40@gmail.com"
            className="px-4 py-2 text-sm font-semibold text-bg bg-accent rounded hover:bg-accent-dim transition-colors duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-muted hover:text-ink transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5 px-6 py-4">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded text-sm font-medium transition-colors ${
                    pathname === l.href
                      ? "text-accent bg-accent/10"
                      : "text-muted hover:text-ink hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 flex items-center gap-3">
              <a
                href="mailto:eduardolucas40@gmail.com"
                className="flex-1 block px-4 py-3 text-sm font-semibold text-center text-bg bg-accent rounded"
              >
                Hire Me
              </a>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
