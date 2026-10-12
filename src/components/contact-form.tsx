"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";

/**
 * Form delivery. TODO: paste a Formspree form URL (https://formspree.io/f/...) or
 * Web3Forms endpoint (https://api.web3forms.com/submit) here, plus the access key for Web3Forms.
 * While FORM_ENDPOINT is empty, submitting opens the visitor's e-mail app with a pre-filled message.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const FORM_ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";

const CONTACT_EMAIL = siteConfig.contacts.email.startsWith("[TODO") ? "" : siteConfig.contacts.email;

type Values = { restaurant: string; name: string; contact: string; tables: string; message: string };
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const tableOptions = ["iki 10", "10–25", "25+"];

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
  const [values, setValues] = useState<Values>({ restaurant: "", name: "", contact: "", tables: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mail" | "error">("idle");
  const [sentName, setSentName] = useState("");

  function set(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      tables: values.tables,
      message: values.message.trim(),
    };
    setSentName(data.name);

    if (!FORM_ENDPOINT) {
      const body = [
        `Restoranas: ${data.restaurant}`,
        `Vardas: ${data.name}`,
        `Kontaktas: ${data.contact}`,
        data.tables && `Staliukų: ${data.tables}`,
        data.message && `\n${data.message}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Demonstracija: ${data.restaurant}`,
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
          subject: `Demonstracija: ${data.restaurant}`,
          ...data,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent" || status === "mail") {
    return (
      <div role="status" className="py-6">
        <p className="text-[2.2rem] leading-tight font-semibold tracking-[-0.03em]">Ačiū, {sentName}!</p>
        {status === "sent" ? (
          <p className="mt-3 text-ink-2">
            Susisieksime <span className="todo">[TODO: per kiek laiko]</span>.
          </p>
        ) : (
          <p className="mt-3 text-ink-2">
            Atsidarė jūsų el. pašto programa su paruoštu laišku. Išsiųskite jį ir susisieksime{" "}
            <span className="todo">[TODO: per kiek laiko]</span>.
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
          Kiek turite staliukų? <span className="font-normal text-ink-2">(neprivaloma)</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {tableOptions.map((option) => {
            const checked = values.tables === option;
            return (
              <label
                key={option}
                className={`flex min-h-11 cursor-pointer items-center rounded-full border px-5 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato ${
                  checked ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink-2"
                }`}
              >
                <input
                  type="radio"
                  name="tables"
                  value={option}
                  checked={checked}
                  onChange={() => set("tables", option)}
                  className="sr-only"
                />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Input label="Žinutė" optional name="message" multiline value={values.message} onChange={set} />

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-13 w-full items-center justify-center rounded-full bg-tomato px-8 text-[1.0625rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-tomato-bright disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? "Siunčiama…" : siteConfig.cta}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-3 text-[16px] text-tomato-dark">
            Nepavyko išsiųsti. Pabandykite dar kartą arba parašykite mums{" "}
            {CONTACT_EMAIL ? <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : <span className="todo">[TODO: el. paštas]</span>}.
          </p>
        )}
        <p className="mt-4 text-[16px] text-ink-2">
          Siųsdami sutinkate, kad su jumis susisiektume dėl demonstracijos.{" "}
          <Link href="/privatumas" className="font-semibold text-ink underline underline-offset-4">
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
  const className = `w-full rounded-xl border bg-white px-4 text-[1.0625rem] text-ink outline-none transition-colors focus:border-ink focus:ring-4 focus:ring-ink/10 ${
    error ? "border-tomato border-2" : "border-line hover:border-ink-2"
  }`;
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required && <span aria-hidden="true" className="text-tomato-dark"> *</span>}
        {optional && <span className="font-normal text-ink-2"> (neprivaloma)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[16px] text-ink-2">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
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
        <p id={`${id}-error`} className="mt-1.5 text-[16px] font-semibold text-tomato-dark">
          {error}
        </p>
      )}
    </div>
  );
}
