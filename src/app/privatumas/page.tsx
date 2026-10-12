import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Privatumo politika",
  alternates: { canonical: "/privatumas" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[44rem] px-4 py-16 sm:px-6">
        <h1 className="font-display text-[2.5rem] leading-tight font-semibold">Privatumo politika</h1>
        <p className="mt-6 text-ink-2">
          <span className="todo">
            [TODO: privatumo politikos tekstas: duomenų valdytojas ir jo rekvizitai, kokie duomenys renkami per
            formą, kokiu tikslu, kiek laiko saugomi, kam perduodami (pvz., formų paslaugai), asmens teisės ir
            kontaktai užklausoms.]
          </span>
        </p>
        <p className="mt-8">
          <Link href="/" className="font-semibold underline underline-offset-4">
            ← Į pradžią
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
