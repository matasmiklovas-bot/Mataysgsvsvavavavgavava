import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Benefits } from "@/components/sections/benefits";
import { Pricing } from "@/components/sections/pricing";
import { MobileCta } from "@/components/sections/mobile-cta";
import { ContactDialog } from "@/components/contact/contact-dialog";
import { Footer } from "@/components/sections/footer";
import { siteConfig } from "@/config/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
  url: siteConfig.url,
  inLanguage: "lt",
  offers: [
    {
      "@type": "Offer",
      name: "Vienkartinis sistemos įdiegimas",
      price: siteConfig.pricing.setup,
      priceCurrency: "EUR",
    },
    {
      "@type": "Offer",
      name: "Mėnesinis sistemos mokestis",
      price: siteConfig.pricing.monthly,
      priceCurrency: "EUR",
    },
  ],
};

export default function Home() {
  return (
    <>
      <a
        href="#turinys"
        className="sr-only fixed top-3 left-3 z-[100] rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-950 focus:not-sr-only"
      >
        Pereiti prie turinio
      </a>
      <Header />
      <main id="turinys" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Pricing />
      </main>
      <Footer />
      <MobileCta />
      <ContactDialog />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
