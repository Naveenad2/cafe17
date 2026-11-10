import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, Instrument_Sans, Norican } from "next/font/google";
import { Providers } from "@/components/providers/SmoothScroll";
import { seoKeywords } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";
import { site } from "@/data/site";
import "./globals.css";

const shoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-shoulders",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Helvetica Neue", "sans-serif"],
});

const norican = Norican({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-norican",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

const title = "Cafe 17 Ravipuram, Kochi | Burgers, Steaks, Pasta & Desserts";
const description =
  "Cafe 17 in Ravipuram, Kochi: burgers, steaks, pastas, BOWLR rice bowls, mocktails and desserts across two floors since 2014. Open daily, 12 noon–11:30 pm.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Cafe 17 Kochi",
  },
  description,
  keywords: seoKeywords,
  applicationName: "Cafe 17",
  authors: [{ name: "Cafe 17" }],
  creator: "Cafe 17",
  publisher: "Cafe 17",
  category: "Restaurant",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Cafe 17",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Ravipuram, Kochi",
    "geo.position": `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${shoulders.variable} ${norican.variable} ${instrument.variable} ${plex.variable} antialiased`}
    >
      <body className="grain min-h-dvh">
        <a
          href="#menu"
          className="fixed left-4 top-4 z-[70] -translate-y-24 bg-lime px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-transform focus:translate-y-0"
        >
          Skip to menu
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
