import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description: "Kaip „Kvitas“ tvarko duomenis, kuriuos paliekate prototipo užklausos formoje.",
  alternates: { canonical: "/privatumas" },
};

/*
  TODO (site owner): have this text reviewed, and fill in company name, code and e-mail in
  src/config/site.ts so they appear below.
*/
export default function PrivacyPage() {
  const { company, companyCode, email } = siteConfig.contacts;
  return (
    <>
      <Header />
      <main className="bg-paper">
        <article className="mx-auto max-w-[44rem] px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-[15px] text-ink-2">
            <Link href="/" className="hover:underline">
              ← Į pradžią
            </Link>
          </p>
          <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.04em] sm:text-[3.5rem]">
            Privatumo politika
          </h1>
          <p className="mt-5 text-[1.125rem] text-ink-2">
            Ši politika paaiškina, kaip tvarkome duomenis, kuriuos paliekate prototipo užklausos
            formoje.
          </p>

          <Section title="Kas tvarko duomenis">
            Duomenis tvarko {company || "„Kvitas“"}
            {companyCode ? `, įmonės kodas ${companyCode}` : ""}.
            {email ? ` Susisiekti galite el. paštu ${email}.` : " Susisiekti galite per svetainės formą."}
          </Section>

          <Section title="Kokius duomenis renkame">
            Restorano pavadinimą, jūsų vardą, telefono numerį arba el. pašto adresą, pasirinktą
            įrangos variantą ir žinutę, jei juos nurodote. Kitų duomenų forma nerenka.
          </Section>

          <Section title="Kam juos naudojame">
            Tik tam, kad atsakytume į jūsų užklausą, paruoštume prototipą ir, jei susitarsime,
            parengtume pasiūlymą. Reklaminių laiškų nesiunčiame.
          </Section>

          <Section title="Teisinis pagrindas">
            Jūsų sutikimas, kurį duodate siųsdami formą, ir veiksmai prieš sudarant sutartį jūsų
            prašymu.
          </Section>

          <Section title="Kiek laiko saugome">
            Tiek, kiek reikia atsakyti į užklausą ir tęsti pokalbį. Jei sutartis nesudaroma,
            duomenis ištriname, kai jų nebereikia, arba anksčiau, jei to paprašote.
          </Section>

          <Section title="Kam perduodame">
            Duomenų neparduodame. Jie gali būti perduoti tik paslaugų teikėjams, per kuriuos
            gauname formą ir el. laiškus, ir tik tiek, kiek reikia šiam tikslui.
          </Section>

          <Section title="Jūsų teisės">
            Galite prašyti susipažinti su savo duomenimis, juos ištaisyti arba ištrinti, apriboti
            jų tvarkymą ar atšaukti sutikimą. Jei manote, kad duomenys tvarkomi netinkamai,
            galite kreiptis į Valstybinę duomenų apsaugos inspekciją.
          </Section>

          <Section title="Slapukai">
            Svetainė nenaudoja reklaminių ar lankytojus sekančių slapukų.
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-ink-2">{children}</p>
    </section>
  );
}
