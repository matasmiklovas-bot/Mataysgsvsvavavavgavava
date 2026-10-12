import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="scroll-mt-16 border-t border-line bg-paper-2">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2
            id="forma-title"
            className="font-display text-[2.25rem] leading-[1.02] font-bold text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            Pažiūrėkime, kaip tai veiktų jūsų restorane
          </h2>
          <p className="mt-5 max-w-[32rem] text-ink-2">
            Parodysime demonstraciją su jūsų meniu pavyzdžiu ir atsakysime į klausimus apie planšetes,
            mokėjimus ir paleidimą.{" "}
            <span className="todo">[TODO: patikrinti, ar demonstracija rodoma su restorano meniu]</span>
          </p>
          <dl className="mt-8 grid gap-3 text-[1.0625rem]">
            <div>
              <dt className="text-ink-2">Telefonas</dt>
              <dd className="font-semibold">
                <span className="todo">{phone}</span>
              </dd>
            </div>
            <div>
              <dt className="text-ink-2">El. paštas</dt>
              <dd className="font-semibold">
                <span className="todo">{email}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg bg-paper p-5 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
