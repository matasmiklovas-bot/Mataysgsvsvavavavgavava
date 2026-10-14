"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { buttonClass } from "@/components/ui";
import { playSound } from "@/components/demo/sounds";
import { equipmentLabel, setEquipment, useEquipment, type Equipment } from "@/components/equipment-choice";

/**
 * Form delivery. TODO: paste a Formspree form URL (https://formspree.io/f/...) or
 * Web3Forms endpoint (https://api.web3forms.com/submit) here, plus the access key for Web3Forms.
 * While FORM_ENDPOINT is empty, submitting opens the visitor's e-mail app with a pre-filled message.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const FORM_ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";

const CONTACT_EMAIL = siteConfig.contacts.email;

type Values = { restaurant: string; name: string; contact: string; message: string };
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const equipmentChips: Record<Equipment, string> = {
  savo: "Savo įranga",
  nuoma: `Nuoma ${siteConfig.pricing.equipmentRent} €/mėn.`,
};

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.restaurant.trim().length < 2) errors.restaurant = "Įrašykite restorano ar kavinės pavadinimą.";
  if (v.name.trim().length < 2) errors.name = "Įrašykite savo vardą.";
  const contact = v.contact.trim();
  const digits = contact.replace(/\D/g, "");
  if (!contact) errors.contact = "Įrašykite telefoną arba el. paštą, kad galėtume susisiekti.";
  else if (contact.includes("@") ? !EMAIL_RE.test(contact) : digits.length < 8 || /[^\d\s+()-]/.test(contact))
    errors.contact = "Patikrinkite: pvz., +370 600 12345 arba vardas@restoranas.lt.";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ restaurant: "", name: "", contact: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mail" | "error">("idle");
  const [sentName, setSentName] = useState("");
  const equipment = useEquipment();
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The form is replaced by the thank-you note; move focus there so keyboard users aren't dropped.
  const done = status === "sent" || status === "mail";
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function set(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const found = validate(values);
    setErrors(found);
    setTouched({ restaurant: true, name: true, contact: true });
    const first = (["restaurant", "name", "contact"] as Field[]).find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const data = {
      restaurant: values.restaurant.trim(),
      name: values.name.trim(),
      contact: values.contact.trim(),
      equipment: equipment ? equipmentLabel[equipment] : "",
      message: values.message.trim(),
    };
    setSentName(data.name);

    if (!FORM_ENDPOINT) {
      const body = [
        `Restoranas: ${data.restaurant}`,
        `Vardas: ${data.name}`,
        `Kontaktas: ${data.contact}`,
        data.equipment && `Įranga: ${data.equipment}`,
        data.message && `\n${data.message}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Prototipas: ${data.restaurant}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...(FORM_ACCESS_KEY ? { access_key: FORM_ACCESS_KEY } : {}),
          subject: `Prototipas: ${data.restaurant}`,
          ...data,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      playSound("success");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <div role="status" className="animate-fade-up py-8 text-center">
        <span className="mx-auto flex size-16 animate-scale-in items-center justify-center rounded-full bg-ready text-white">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" className="animate-check [stroke-dasharray:1]" />
          </svg>
        </span>
        <p
          ref={doneRef}
          tabIndex={-1}
          className="mt-6 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-balance outline-none!"
        >
          Ačiū, {sentName}!
        </p>
        {status === "sent" ? (
          <p className="mx-auto mt-3 max-w-[26rem] text-pretty text-ink-2">
            Gavome jūsų užklausą. Netrukus susisieksime dėl prototipo.
          </p>
        ) : (
          <p className="mx-auto mt-3 max-w-[26rem] text-pretty text-ink-2">
            Atsidarė jūsų el. pašto programa su paruoštu laišku. Išsiųskite jį, ir netrukus
            susisieksime.
          </p>
        )}
      </div>
    );
  }

  const show = (f: Field) => (touched[f] ? errors[f] : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5">
      <Input label="Restorano pavadinimas" name="restaurant" required autoComplete="organization" value={values.restaurant} error={show("restaurant")} onChange={set} onBlur={() => { setTouched((t) => ({ ...t, restaurant: true })); setErrors(validate(values)); }} />
      <Input label="Vardas" name="name" required autoComplete="given-name" value={values.name} error={show("name")} onChange={set} onBlur={() => { setTouched((t) => ({ ...t, name: true })); setErrors(validate(values)); }} />
      <Input
        label="Telefonas arba el. paštas"
        hint="Užtenka vieno."
        name="contact"
        required
        autoComplete="email"
        value={values.contact}
        error={show("contact")}
        onChange={set}
        onBlur={() => { setTouched((t) => ({ ...t, contact: true })); setErrors(validate(values)); }}
      />

      <fieldset>
        <legend className="font-semibold">
          Įranga <span className="font-normal text-ink-2">(neprivaloma)</span>
        </legend>
        {/* A native-feeling segmented control: one white thumb slides to the chosen side. */}
        <div className="relative mt-2 grid grid-cols-2 rounded-full bg-paper-2 p-1">
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_2px_6px_-2px_rgb(0_0_0/0.12)] transition-[translate,scale,opacity] duration-300 ease-[var(--ease-out-soft)] ${
              equipment ? "scale-100 opacity-100" : "scale-95 opacity-0"
            } ${equipment === "nuoma" ? "translate-x-full" : "translate-x-0"}`}
          />
          {(Object.keys(equipmentChips) as Equipment[]).map((option) => {
            const checked = equipment === option;
            return (
              <label
                key={option}
                className={`relative flex min-h-11 cursor-pointer touch-manipulation items-center justify-center rounded-full px-2 text-center text-[15px] whitespace-nowrap transition-[color,scale] duration-150 select-none active:scale-[0.98] sm:text-[1.0625rem] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato-bright ${
                  checked ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="equipment-form"
                  value={option}
                  checked={checked}
                  onChange={() => {
                    playSound("tap");
                    setEquipment(option);
                  }}
                  className="sr-only"
                />
                {equipmentChips[option]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Input label="Žinutė" optional name="message" multiline value={values.message} onChange={set} />

      <div>
        {/* aria-disabled rather than disabled: the button keeps its colour and focus while sending. */}
        <button
          type="submit"
          aria-disabled={status === "sending" || undefined}
          className={`${buttonClass({ full: true })} aria-disabled:bg-tomato-dark`}
        >
          {status === "sending" ? (
            <span className="inline-flex animate-fade-in items-center gap-2.5">
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Siunčiama…
            </span>
          ) : (
            siteConfig.cta
          )}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-3 animate-fade-up text-[16px] text-pretty text-tomato-dark">
            Nepavyko išsiųsti. Patikrinkite interneto ryšį ir pabandykite dar kartą
            {CONTACT_EMAIL ? (
              <>
                {" "}arba parašykite{" "}
                <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </>
            ) : null}
            .
          </p>
        )}
        <p className="mt-4 text-[16px] text-pretty text-ink-2">
          Siųsdami sutinkate, kad su jumis susisiektume dėl prototipo.{" "}
          <Link
            href="/privatumas"
            className="rounded-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ink"
          >
            Privatumo politika
          </Link>
        </p>
      </div>
    </form>
  );
}

type InputProps = {
  label: string;
  name: Field;
  value: string;
  onChange: (field: Field, value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  autoComplete?: string;
};

function Input({ label, name, value, onChange, onBlur, error, hint, required, optional, multiline, autoComplete }: InputProps) {
  const id = useId();
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  // Focus is shown by the ink border and a soft halo; the site-wide tomato outline is switched off
  // here because on a text field red reads as an error. Errors add an inset ring, so nothing shifts.
  const className = `w-full appearance-none rounded-xl border bg-white px-4 text-[1.0625rem] text-ink outline-none! transition-[border-color,box-shadow] duration-200 ease-out focus:ring-4 ${
    error
      ? "border-tomato inset-ring-1 inset-ring-tomato focus:ring-tomato/15"
      : "border-line hover:border-[#c4c0b8] focus:border-ink focus:ring-ink/10"
  }`;
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required && <span aria-hidden="true" className="text-tomato-dark"> *</span>}
        {optional && <span className="font-normal text-ink-2"> (neprivaloma)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[15px] text-ink-2">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${className} mt-2 py-3`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={onBlur}
          className={`${className} mt-2 h-12`}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex animate-fade-up items-start gap-1.5 text-[15px] font-medium text-tomato-dark">
          <svg viewBox="0 0 16 16" className="mt-[3px] size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.75v3.75M8 11h.01" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <span className="text-pretty">{error}</span>
        </p>
      )}
    </div>
  );
}
