import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { sectionTitleClass } from "@/components/section-heading";

export function Contact() {
  const { email, phone } = siteConfig.contacts;
  return (
    <section id="forma" aria-labelledby="forma-title" className="scroll-mt-14 bg-night text-night-text">
      <div className="mx-auto grid max-w-7xl gap-y-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <h2 id="forma-title" className={`${sectionTitleClass} max-w-[14ch]`}>
            Pažiūrėkime, kaip tai veiktų jūsų restorane.
          </h2>
          <p className="mt-5 max-w-[26rem] text-[1.0625rem] leading-relaxed text-night-muted sm:text-[1.125rem]">
            Paliksite kontaktus, o mes paskambinsime ir suderinsime demonstracijos laiką. Tai nieko neįpareigoja.
          </p>
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
        </div>
        <Reveal delay={100} className="rounded-surface bg-paper p-6 text-ink sm:p-10 lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
