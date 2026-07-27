import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backlink Hunter AI",
  description: "End-to-End SEO Audit and Backlink Discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        <header className="flex justify-between items-center p-4 max-w-6xl mx-auto border-b border-slate-800">
          <Link href="/" className="font-bold text-xl text-white tracking-wide">
            Backlink <span className="text-blue-500">Hunter AI</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/seo-audit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm transition">
              SEO Audit Dashboard
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
