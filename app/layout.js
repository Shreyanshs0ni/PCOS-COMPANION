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
      <html lang="en">
        <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: "var(--font-body)" }}>
          <main className="max-w-md mx-auto min-h-dvh relative flex flex-col" style={{ background: "var(--bg)" }}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
