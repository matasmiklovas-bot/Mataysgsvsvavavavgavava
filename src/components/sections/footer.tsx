import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

export function Footer() {
  const { email, phone, company, companyCode } = siteConfig.contacts;
  return (
    <footer className="bg-paper text-[15px] text-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-line pb-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-[22rem]">QR užsakymai restoranams, kavinėms ir barams Lietuvoje.</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Kontaktai</p>
            <p className="mt-2"><span className="todo">{email}</span></p>
            <p className="mt-1"><span className="todo">{phone}</span></p>
            <p className="mt-3">
              <span className="todo">{company}</span>, <span className="todo">{companyCode}</span>
            </p>
          </div>
          <nav aria-label="Poraštės nuorodos">
            <ul className="grid gap-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/privatumas" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
                  Privatumo politika
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="pt-6">
          © <CurrentYear /> {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
