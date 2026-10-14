import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

const navLink = "inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 hover:text-white active:text-white/70";
const contactLink =
  "inline-flex min-h-10 items-center rounded-sm underline decoration-white/0 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-white/60";

export function Footer() {
  const { email, phone, company, companyCode } = siteConfig.contacts;
  return (
    <footer className="border-t border-white/10 bg-night text-[15px] text-night-muted">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[22rem]">
            <Logo tone="light" />
            <p className="mt-4 text-pretty">QR užsakymai restoranams, kavinėms ir barams Lietuvoje.</p>
            {(email || phone) && (
              <p className="mt-3 flex flex-col items-start text-night-text">
                {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className={contactLink}>{phone}</a>}
                {email && <a href={`mailto:${email}`} className={contactLink}>{email}</a>}
              </p>
            )}
          </div>
          <nav aria-label="Poraštės nuorodos">
            <ul className="grid grid-cols-2 gap-x-12 sm:flex sm:gap-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/#forma" className={navLink}>
                  Prototipas
                </Link>
              </li>
              <li>
                <Link href="/privatumas" className={navLink}>
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
        {/* CC BY 4.0 requires a visible credit and a note that the photo was changed. */}
        <p className="mt-3 text-[13px] text-night-muted/80">
          Šaltibarščių nuotrauka:{" "}
          <a
            href="https://commons.wikimedia.org/w/index.php?curid=177162547"
            className="underline underline-offset-2 hover:text-white"
          >
            Continentaleurope
          </a>
          ,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="underline underline-offset-2 hover:text-white">
            CC BY 4.0
          </a>
          , apkarpyta ir pakeistas fonas.
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
