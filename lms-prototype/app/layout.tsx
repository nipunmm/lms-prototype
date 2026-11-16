import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import { StoreHydrator } from "@/components/shared/store-hydrator";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Solo Teacher Platform",
  description: "Public website, student learning, and staff portal for a modern Sri Lankan teacher brand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${display.variable} ${body.variable} ${sinhala.variable}`}>
      <body className="min-h-full">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
