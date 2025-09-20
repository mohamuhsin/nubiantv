import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Montserrat, Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar/navbar";
import Follow from "@/components/Footer/footer";
import { Providers } from "@/components/Providers/providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// Primary font
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Optional fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <Navbar />
          {children}
          <Follow />
          <Analytics />
          {/* Sonner Toaster for global toast notifications */}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
