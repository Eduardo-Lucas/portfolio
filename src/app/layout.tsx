import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eduardo-lucas-dev.com"),
  title: "Eduardo Lucas – Senior Python Engineer & Data Architect",
  description:
    "Senior Python/Django Developer with 25+ years of enterprise IT experience. Specialising in scalable APIs, ERP modernisation, and data architecture.",
  keywords: ["Python", "Django", "Data Architect", "Software Engineer", "Brazil", "Eduardo Lucas"],
  authors: [{ name: "Eduardo Lucas" }],
  openGraph: {
    title: "Eduardo Lucas – Senior Python Engineer & Data Architect",
    description:
      "Senior Python/Django Developer with 25+ years of enterprise IT experience.",
    type: "website",
    url: "https://www.eduardo-lucas-dev.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
