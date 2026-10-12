import Link from "next/link";
import { navItems, siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center" aria-label="Stalas, į pradžią">
          <Logo />
        </Link>
        <nav aria-label="Pagrindinė navigacija" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-[16px] font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/#forma"
          className="inline-flex h-11 items-center rounded-md bg-tomato px-4 text-[15px] font-semibold text-white transition-colors hover:bg-tomato-dark sm:px-5"
        >
          <span className="sm:hidden">{siteConfig.ctaShort}</span>
          <span className="max-sm:hidden">{siteConfig.cta}</span>
        </Link>
      </div>
    </header>
  );
}
