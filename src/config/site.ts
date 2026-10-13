/**
 * Site-wide settings. Everything marked TODO must be filled in by the site owner.
 */

function resolveSiteUrl(): string {
  // TODO: set NEXT_PUBLIC_SITE_URL to the real domain (used for canonical, OG, sitemap and the hero QR code).
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Kvitas",
  title: "Kvitas · QR užsakymai restoranams, kavinėms ir barams",
  description:
    "Svečias nuskenuoja kodą ant staliuko ir užsisako telefone. Patiekalai iškart patenka į virtuvės planšetę, gėrimai į baro. 400 € už įdiegimą, o toliau 0 € per mėnesį: sistema ir priežiūra nemokamos.",
  url: resolveSiteUrl(),
  locale: "lt_LT",
  pricing: {
    /** One-time setup, EUR. */
    setup: 400,
    /** Monthly fee for the system, support and changes on request, EUR. */
    monthly: 0,
    /** Optional rent of all equipment (tablets etc.) per month, EUR. */
    equipmentRent: 50,
  },
  cta: "Užsisakyti demonstraciją",
  ctaShort: "Demonstracija",
  /**
   * TODO: fill in real contact details and company data.
   * Empty values are simply not shown on the page.
   */
  contacts: {
    email: "" as string,
    phone: "" as string,
    company: "" as string,
    companyCode: "" as string,
  },
} as const;

export const navItems = [
  { href: "/#demo", label: "Kaip veikia" },
  { href: "/#kaina", label: "Kaina" },
  { href: "/#duk", label: "DUK" },
] as const;
