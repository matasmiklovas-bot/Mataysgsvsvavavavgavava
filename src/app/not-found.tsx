import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative isolate overflow-hidden bg-night text-night-text">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_40%,rgb(229_140_80/0.14),transparent_70%)]"
        />
        <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <p className="text-[14px] font-semibold tracking-[0.08em] text-tomato-bright uppercase">Klaida 404</p>
          <h1 className="mt-4 text-[clamp(2.25rem,6.4vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance">
            Tokio puslapio nėra.
          </h1>
          <p className="mt-4 text-[1.125rem] text-night-muted">
            Gal nuoroda pasikeitė. Grįžkite į pradžią ir rasite viską vienoje vietoje.
          </p>
          <Link href="/" className={`${buttonClass()} mt-9`}>
            Į pradžią
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
