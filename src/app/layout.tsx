import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Funnel_Display({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const body = Funnel_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const ticket = IBM_Plex_Mono({
  variable: "--font-ticket",
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
    "restorano technologijos",
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
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lt"
      className={`${display.variable} ${body.variable} ${ticket.variable} overflow-x-clip antialiased`}
    >
      <body className="min-h-dvh overflow-x-clip">
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
