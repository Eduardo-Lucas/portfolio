import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Eduardo Lucas",
  url: "https://www.eduardo-lucas-dev.com",
  jobTitle: "Senior Python Developer & Data Architect",
  description:
    "Senior Python/Django Developer and Data Architect based in Salvador, Bahia, Brazil, with 25+ years of enterprise IT experience.",
  worksFor: [
    { "@type": "Organization", name: "Fornax Tecnologia" },
    { "@type": "Organization", name: "DGTAX" },
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Salvador" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Salvador",
    addressRegion: "Bahia",
    addressCountry: "BR",
  },
  sameAs: [
    "https://linkedin.com/in/eduardolucas40",
    "https://github.com/Eduardo-Lucas",
    "https://medium.com/@CariocaBotafogo",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eduardo-lucas-dev.com"),
  title: "Eduardo Lucas – Senior Python/Django Developer & Data Architect in Salvador, Brazil",
  description:
    "Senior Python/Django Developer and Data Architect at DGTAX, based in Salvador, Bahia, Brazil. 25+ years of enterprise IT experience in scalable APIs, ERP modernisation, and data architecture.",
  keywords: ["Python", "Django", "Data Architect", "Software Engineer", "Salvador Bahia", "DGTAX", "Eduardo Lucas"],
  authors: [{ name: "Eduardo Lucas" }],
  openGraph: {
    title: "Eduardo Lucas – Senior Python/Django Developer & Data Architect in Salvador, Brazil",
    description:
      "Senior Python/Django Developer and Data Architect at DGTAX, based in Salvador, Bahia, Brazil. 25+ years of enterprise IT experience.",
    type: "website",
    url: "https://www.eduardo-lucas-dev.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Eduardo Lucas – Blog"
          href="https://www.eduardo-lucas-dev.com/rss"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();(function(){try{var n=new Date(),s=new Date('2026-06-11'),e=new Date('2026-07-20');if(n>=s&&n<e)document.documentElement.classList.add('copa');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
