import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

export function Footer() {
  const { email, phone, company, companyCode } = siteConfig.contacts;
  return (
    <footer className="bg-paper text-[15px] text-ink-2">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="flex flex-col gap-10 border-b border-line pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[22rem]">
            <Logo />
            <p className="mt-4">QR užsakymai restoranams, kavinėms ir barams Lietuvoje.</p>
            {(email || phone) && (
              <p className="mt-4 flex flex-col gap-1 text-ink">
                {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">{phone}</a>}
                {email && <a href={`mailto:${email}`} className="hover:underline">{email}</a>}
              </p>
            )}
          </div>
          <nav aria-label="Poraštės nuorodos">
            <ul className="grid grid-cols-2 gap-x-12 sm:flex sm:gap-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-11 items-center hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/#forma" className="inline-flex min-h-11 items-center hover:text-ink">
                  Demonstracija
                </Link>
              </li>
              <li>
                <Link href="/privatumas" className="inline-flex min-h-11 items-center hover:text-ink">
                  Privatumo politika
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 pt-6 text-[14px] sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {company || siteConfig.name}
            {companyCode && <> · įm. k. {companyCode}</>}
          </p>
          <p>Sukurta restoranams Lietuvoje</p>
        </div>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
