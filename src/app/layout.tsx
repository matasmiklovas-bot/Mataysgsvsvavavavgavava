import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Monospace is used only for kitchen tickets and the bill.
const ticket = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "QR užsakymai",
    "QR meniu",
    "restoranų užsakymų sistema",
    "užsakymai nuo staliuko",
    "virtuvės užsakymų ekranas",
    "QR užsakymai kavinei",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lt"
      className={`${display.variable} ${body.variable} ${ticket.variable} overflow-x-clip antialiased`}
    >
      <body className="min-h-dvh overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
