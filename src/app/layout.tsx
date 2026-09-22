import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderController from "../components/ui/HeaderController";
import Footer from "../components/Footer";
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
  title: "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
  description: "Conbell Engineering is a leading provider of heavy industrial fabrication and conveyor systems, delivering precision-engineered solutions for diverse industries.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HeaderController>
          {children}
        </HeaderController>
        <Footer />
      </body>
    </html>
  );
}
