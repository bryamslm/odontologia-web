import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowDental",
  description: "Con FlowDental, tu salud dental está en las mejores manos. Experimenta una atención personalizada y resultados excepcionales.",
  keywords: ["odontología", "salud dental", "dentista", "limplantes dentales", "blanqueamiento dental"],
  authors: [{ name: "FlowBiz" }],
  openGraph: {
    title: "FlowDental",
    description: "Con FlowDental, tu salud dental está en las mejores manos. Experimenta una atención personalizada y resultados excepcionales.",
    url: "https://odontologia-web.vercel.app/",
    siteName: "FlowDental",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
  );
}
