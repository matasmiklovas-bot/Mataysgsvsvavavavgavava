import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="relative isolate scroll-mt-14 overflow-hidden bg-night text-night-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(50%_60%_at_50%_0%,rgb(229_150_90/0.10),transparent_70%)]"
      />
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="forma-title"
          eyebrow="Susisiekime"
          tone="light"
          title="Pažiūrėkime, kaip tai veiktų jūsų restorane."
          lead="Paliksite kontaktus, paskambinsime ir parodysime. Tai nieko neįpareigoja."
        />
        <Reveal className="text-center">
          {(phone || email) && (
            <dl className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[1.0625rem]">
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
        <Reveal delay={120} className="mt-12 rounded-[2rem] bg-paper p-6 text-ink shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] sm:mt-14 sm:p-10">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
