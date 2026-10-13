import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { DemoSection } from "@/components/sections/demo-section";
import { Team } from "@/components/sections/team";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
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
    { "@type": "Offer", name: "Įdiegimas", price: siteConfig.pricing.setup, priceCurrency: "EUR" },
    { "@type": "Offer", name: "Mėnesio mokestis (sistema ir priežiūra)", price: siteConfig.pricing.monthly, priceCurrency: "EUR" },
    { "@type": "Offer", name: "Įrangos nuoma per mėnesį", price: siteConfig.pricing.equipmentRent, priceCurrency: "EUR" },
  ],
};

export default function Home() {
  return (
    <>
      <a
        href="#turinys"
        className="sr-only fixed top-2 left-2 z-[100] rounded-md bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only"
      >
        Pereiti prie turinio
      </a>
      <Header overHero />
      <main id="turinys" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <DemoSection />
        <Team />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
