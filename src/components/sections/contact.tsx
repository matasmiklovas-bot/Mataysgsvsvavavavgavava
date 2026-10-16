import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  { title: "Paliekate kontaktus", text: "Užtenka pavadinimo ir telefono ar el. pašto." },
  { title: "Paruošiame prototipą", text: "Su jūsų meniu, staliukais ir planšetėmis." },
  { title: "Nusprendžiate", text: "Patiks, paleidžiame. Nepatiks, nieko nemokate." },
];

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="scroll-mt-14 bg-night text-night-text">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="forma-title"
          tone="light"
          title={<>Nemokamas prototipas <br className="max-sm:hidden" />jūsų restoranui.</>}
          lead="Paliksite kontaktus, paruošime prototipą ir parodysime. Patiks, pirksite. Nepatiks, nieko nemokate."
        />
        <Reveal className="text-center">
          {(phone || email) && (
            <dl className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[1.0625rem]">
              {phone && (
                <div>
                  <dt className="text-night-muted">Telefonas</dt>
                  <dd className="font-medium">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex min-h-10 items-center underline decoration-white/0 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-white/60">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-night-muted">El. paštas</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${email}`} className="inline-flex min-h-10 items-center underline decoration-white/0 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-white/60">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </Reveal>
        <Reveal delay={60}>
          <ol className="mx-auto mt-10 grid max-w-2xl gap-2 sm:mt-14 sm:grid-cols-3 sm:gap-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3 rounded-[1.25rem] border border-white/10 px-4 py-3 sm:block sm:px-5 sm:py-4"
              >
                <span className="text-[14px] leading-6 font-semibold text-tomato-bright tabular-nums">{index + 1}</span>
                <div>
                  <p className="font-semibold text-night-text sm:mt-1">{step.title}</p>
                  <p className="mt-0.5 text-[15px] leading-snug text-pretty text-night-muted sm:mt-1">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={120} className="mx-auto mt-4 max-w-2xl rounded-[2rem] bg-paper p-6 text-ink sm:mt-5 sm:p-10">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
