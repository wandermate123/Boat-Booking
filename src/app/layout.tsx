import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { WhatsAppSupportButton } from "@/components/boating/WhatsAppSupportButton";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "River Experiences · Wandermate Varanasi",
    template: "%s · Wandermate Varanasi",
  },
  description:
    "Curated Ganga cruises in Varanasi — dawn silence, heritage ghats, Aarti by boat, and private sunset charters. Book with Wandermate.",
  openGraph: {
    title: "River Experiences · Wandermate Varanasi",
    description:
      "Premium boating on the Ganges. Vetted partners, transparent pricing, seamless booking.",
    type: "website",
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
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        {children}
        <WhatsAppSupportButton />
      </body>
    </html>
  );
}
