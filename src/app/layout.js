'use client';
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "./navbar/page";
import "./globals.css";

// Import local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Import Google font
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <LanguageProvider>
          {/* Navbar is now persistent and wrapped by the provider */}
          {/* <Navbar /> */}
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
