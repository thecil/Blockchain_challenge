"use client";
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Blockchain Challenge",
  description: "Blockchain Challenge for Rather Labs"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class">
          <Providers>
            <Header />
            <main className="flex-grow px-4">{children}</main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
