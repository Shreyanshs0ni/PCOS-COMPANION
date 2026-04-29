import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PCOS Companion — Your Wellness Coach",
  description: "AI-powered health companion for women with PCOS. Track symptoms, log daily wellness, get personalized insights, and take control of your health journey.",
  keywords: ["PCOS", "health tracker", "wellness", "women's health", "AI coach"],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth">
        <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: "var(--font-body)" }}>
          <main className="max-w-md mx-auto min-h-dvh relative flex flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
            <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full blur-3xl opacity-40" style={{ background: "var(--primary-100)" }} />
            <div className="pointer-events-none absolute top-24 -right-20 h-56 w-56 rounded-full blur-3xl opacity-35" style={{ background: "var(--accent-100)" }} />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
