import { cacheLife } from "next/cache";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-sm">
            <a href="#pradzia" className="inline-block rounded-lg" aria-label="Į puslapio pradžią">
              <Logo />
            </a>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
              {siteConfig.tagline}: klientai, virtuvė, baras ir personalas — vienoje sistemoje.
            </p>
          </div>
          <nav aria-label="Poraštės navigacija">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[14.5px] text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[13px] text-fg-subtle sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}
          </p>
          <p>Nuotraukos: Unsplash</p>
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
