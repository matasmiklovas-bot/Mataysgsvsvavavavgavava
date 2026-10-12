/**
 * Central site configuration. Change the brand name, URL and contact endpoint here.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Stalas",
  tagline: "QR užsakymų sistema restoranams",
  title: "Stalas — QR užsakymų sistema restoranams",
  description:
    "QR užsakymų sistema, kuri sujungia jūsų klientus, virtuvę, barą ir personalą į vieną sklandžiai veikiančią sistemą. Įdiegimas 400 €, mėnesinis mokestis 1 €.",
  url: resolveSiteUrl(),
  locale: "lt_LT",
  pricing: {
    setup: 400,
    monthly: 1,
  },
  /**
   * Optional endpoint that accepts a JSON POST from the contact form
   * (e.g. your own API or a form service). When empty, the form runs in demo mode
   * and nothing is sent anywhere.
   */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
} as const;

export const navItems = [
  { href: "#kaip-veikia", label: "Kaip veikia" },
  { href: "#naudos", label: "Naudos" },
  { href: "#kaina", label: "Kaina" },
] as const;
