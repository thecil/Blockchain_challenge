"use client";
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          <ToastContainer />
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
