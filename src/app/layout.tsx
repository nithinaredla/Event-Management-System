"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Navbar />
          <main className="flex-grow p-6">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
