import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

const instrumentSans = Instrument_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: "FIKI Transit | Non-Medical Transportation & Mobility Services",
    template: "%s | FIKI Transit",
  },
  description:
    "FIKI Transit provides safe, reliable, and cost-effective non-medical transportation (NEMT), wheelchair rides, hospital trips, and private charters in Madison, WI and surrounding communities.",
  keywords: [
    "FIKI Transit",
    "Non-Medical Transportation",
    "NEMT Madison WI",
    "Wheelchair Transportation",
    "Medical Ride Service",
    "Senior Mobility Transport",
    "Dane County Transportation",
    "Private Charter Madison",
  ],
  authors: [{ name: "FIKI Transit" }],
  creator: "FIKI Transit",
  metadataBase: new URL("https://fikitransit.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fikitransit.com",
    title: "FIKI Transit | Safe & Reliable Transportation in Madison, WI",
    description:
      "Safe, reliable non-medical transportation to hospitals, rehab, assisted living, and private events across Madison and surrounding communities.",
    siteName: "FIKI Transit",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIKI Transit | Non-Medical Transportation Services",
    description:
      "Safe, reliable non-medical transportation to hospitals, rehab, assisted living, and private events across Madison, WI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", instrumentSans.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
