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
  name: "Stalas",
  title: "Stalas · QR užsakymai restoranams, kavinėms ir barams",
  description:
    "Svečias nuskenuoja kodą ant staliuko ir užsisako telefone. Patiekalai iškart patenka į virtuvės planšetę, gėrimai į baro. 400 € už įdiegimą ir 1 € per mėnesį.",
  url: resolveSiteUrl(),
  locale: "lt_LT",
  pricing: {
    setup: 400,
    monthly: 1,
  },
  cta: "Užsisakyti demonstraciją",
  ctaShort: "Demonstracija",
  // TODO: fill in real contact details and company data.
  contacts: {
    email: "[TODO: el. paštas]",
    phone: "[TODO: telefonas]",
    company: "[TODO: įmonės pavadinimas]",
    companyCode: "[TODO: įmonės kodas]",
  },
} as const;

export const navItems = [
  { href: "/#demo", label: "Kaip veikia" },
  { href: "/#kaina", label: "Kaina" },
  { href: "/#duk", label: "DUK" },
] as const;
