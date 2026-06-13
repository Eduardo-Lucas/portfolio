import Link from "next/link";
import { Mail } from "lucide-react";
import LinkedInIcon from "@/components/LinkedInIcon";
import GitHubIcon from "@/components/GitHubIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link href="/" className="text-ink font-semibold">
              Eduardo<span className="text-accent">.</span>
            </Link>
            <p className="text-muted text-sm mt-1">
              Senior Python Engineer · Data Architect · São Paulo, Brazil
            </p>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            {[
              { href: "/about", label: "About" },
              { href: "/career", label: "Career" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/blog", label: "Blog" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted text-sm hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/eduardolucas40"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-accent transition-colors"
            >
              <LinkedInIcon size={18} />
            </a>
            <a
              href="https://github.com/Eduardo-Lucas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-accent transition-colors"
            >
              <GitHubIcon size={18} />
            </a>
            <a
              href="mailto:eduardolucas40@gmail.com"
              aria-label="Email"
              className="text-muted hover:text-accent transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted2 text-xs">
            © {new Date().getFullYear()} Eduardo Lucas. All rights reserved.
          </p>
          <p className="text-muted2 text-xs font-mono">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
