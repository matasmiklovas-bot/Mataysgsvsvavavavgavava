import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

export function Footer() {
  const { email, phone, company, companyCode } = siteConfig.contacts;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[22rem] text-[16px] text-ink-2">
            QR užsakymai restoranams, kavinėms ir barams Lietuvoje.
          </p>
        </div>
        <div className="text-[16px]">
          <p className="font-semibold">Kontaktai</p>
          <p className="mt-2 text-ink-2"><span className="todo">{email}</span></p>
          <p className="mt-1 text-ink-2"><span className="todo">{phone}</span></p>
          <p className="mt-3 text-ink-2">
            <span className="todo">{company}</span>, <span className="todo">{companyCode}</span>
          </p>
        </div>
        <nav aria-label="Poraštės nuorodos" className="text-[16px]">
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/privatumas" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Privatumo politika
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-[14px] text-ink-2 sm:px-6">
        © <CurrentYear /> {siteConfig.name}
      </p>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
