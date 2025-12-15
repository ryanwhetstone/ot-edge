import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/header";
import ToastProvider from "@/components/ToastProvider";

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "OT Edge",
  description: "OT Edge - Your OT platform",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} font-sans antialiased`}
      >
        <Suspense fallback={<div className="h-16 border-b" />}>
          <Header />
        </Suspense>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
