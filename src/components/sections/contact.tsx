import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

const nextSteps = [
  { title: "Paliekate kontaktus", text: "Užtenka restorano pavadinimo, vardo ir telefono arba el. pašto." },
  { title: "Suderiname laiką", text: "Paskambiname ar parašome ir randame jums patogų laiką." },
  { title: "Parodome demonstraciją", text: "Pamatote, kaip užsakymas keliautų jūsų salėje, virtuvėje ir bare." },
];

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="relative isolate scroll-mt-14 overflow-hidden bg-night text-night-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(50%_60%_at_25%_0%,rgb(229_150_90/0.10),transparent_70%)]"
      />
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
            paleidimą. Tai nieko neįpareigoja.
          </p>

          <ol className="mt-10 grid gap-6">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-night-line text-[15px] font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-[16px] text-night-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {(phone || email) && (
            <dl className="mt-10 grid gap-4 border-t border-night-line pt-8 text-[1.0625rem]">
              {phone && (
                <div>
                  <dt className="text-night-muted">Telefonas</dt>
                  <dd className="mt-0.5 font-medium">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-night-muted">El. paštas</dt>
                  <dd className="mt-0.5 font-medium">
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </Reveal>
        <Reveal delay={120} className="rounded-[2rem] bg-paper p-6 text-ink shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] sm:p-9">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
