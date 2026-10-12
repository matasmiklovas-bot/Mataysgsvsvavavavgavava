import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="scroll-mt-14 bg-night text-night-text">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <h2
            id="forma-title"
            className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.5rem]"
          >
            Pažiūrėkime, kaip tai veiktų jūsų restorane.
          </h2>
          <p className="mt-5 max-w-[32rem] text-[1.125rem] leading-relaxed text-night-muted">
            Parodysime demonstraciją ir atsakysime į klausimus apie planšetes, mokėjimus ir
            paleidimą.{" "}
            <span className="todo">[TODO: patikrinti, ar demonstracija rodoma su restorano meniu]</span>
          </p>
          <dl className="mt-10 grid gap-5 text-[1.0625rem]">
            <div>
              <dt className="text-night-muted">Telefonas</dt>
              <dd className="mt-0.5 font-medium">
                <span className="todo">{phone}</span>
              </dd>
            </div>
            <div>
              <dt className="text-night-muted">El. paštas</dt>
              <dd className="mt-0.5 font-medium">
                <span className="todo">{email}</span>
              </dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={120} className="rounded-[2rem] bg-paper p-6 text-ink sm:p-9">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
