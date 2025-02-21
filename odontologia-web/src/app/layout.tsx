import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowDent",
  description: "Con FlowDent, tu salud dental está en las mejores manos. Experimenta una atención personalizada y resultados excepcionales.",
  keywords: ["odontología", "salud dental", "dentista", "limplantes dentales", "blanqueamiento dental"],
  authors: [{ name: "FlowBiz" }],
  openGraph: {
    title: "FlowDent",
    description: "Con FlowDent, tu salud dental está en las mejores manos. Experimenta una atención personalizada y resultados excepcionales.",
    url: "https://odontologia-web.vercel.app/",
    siteName: "FlowDent",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
