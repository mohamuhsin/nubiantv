import type { Metadata } from "next";
import { Montserrat, Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar/navbar";

import "./globals.css";
import Follow from "./components/Footer/footer";

// Use Montserrat as your primary font
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Optional fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nubian TV",
  description: "Asas Ta Nubi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Navbar />
        {children}
        <Follow />
      </body>
    </html>
  );
}
