"use client";

import { useId, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Send } from "lucide-react";
import { siteConfig } from "@/config/site";

type Field = "restaurant" | "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "demo" }
  | { kind: "error"; message: string };

const empty: Values = { restaurant: "", name: "", email: "", phone: "", message: "" };
const MESSAGE_MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.restaurant.trim().length < 2) errors.restaurant = "Įrašykite restorano pavadinimą.";
  if (values.name.trim().length < 2) errors.name = "Įrašykite kontaktinio asmens vardą.";
  if (!values.email.trim()) errors.email = "Įrašykite el. pašto adresą.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "El. pašto adresas atrodo neteisingas, pvz., vardas@restoranas.lt.";
  if (values.phone.trim() && (!PHONE_RE.test(values.phone.trim()) || values.phone.replace(/\D/g, "").length < 7))
    errors.phone = "Telefono numeris atrodo neteisingas, pvz., +370 600 00000.";
  if (values.message.length > MESSAGE_MAX)
    errors.message = `Žinutė per ilga — ne daugiau kaip ${MESSAGE_MAX} simbolių.`;
  return errors;
}

const fieldOrder: Field[] = ["restaurant", "name", "email", "phone", "message"];

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const isDemoMode = !siteConfig.contactEndpoint;

  function update(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
    if (status.kind !== "idle" && status.kind !== "sending") setStatus({ kind: "idle" });
  }

  function blur(field: Field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(values);
    setErrors(found);
    setTouched({ restaurant: true, name: true, email: true, phone: true, message: true });

    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      setStatus({ kind: "error", message: "Patikrinkite pažymėtus laukus." });
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (isDemoMode) {
      setStatus({ kind: "demo" });
      return;
    }

    // Honeypot: real visitors never fill this hidden field.
    const trap = new FormData(form).get("company_website");
    if (trap) {
      setStatus({ kind: "success" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(siteConfig.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          restaurant: values.restaurant.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus({ kind: "success" });
      setValues(empty);
      setTouched({});
    } catch {
      setStatus({
        kind: "error",
        message: "Nepavyko išsiųsti užklausos. Patikrinkite interneto ryšį ir pabandykite dar kartą.",
      });
    }
  }

  const showError = (field: Field) => (touched[field] ? errors[field] : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="glass-strong rounded-[1.75rem] p-6 sm:p-8">
      {isDemoMode && (
        <p className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-amber-100/90">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span>
            <strong className="font-medium text-amber-100">Demonstracinis režimas.</strong> Forma
            dar neprijungta prie serverio ar el. pašto paslaugos, todėl duomenys niekur
            nesiunčiami.
          </span>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Restorano pavadinimas"
          name="restaurant"
          autoComplete="organization"
          value={values.restaurant}
          error={showError("restaurant")}
          onChange={update}
          onBlur={blur}
          required
        />
        <TextField
          label="Kontaktinio asmens vardas"
          name="name"
          autoComplete="name"
          value={values.name}
          error={showError("name")}
          onChange={update}
          onBlur={blur}
          required
        />
        <TextField
          label="El. paštas"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          error={showError("email")}
          onChange={update}
          onBlur={blur}
          required
        />
        <TextField
          label="Telefono numeris"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          error={showError("phone")}
          onChange={update}
          onBlur={blur}
        />
        <div className="sm:col-span-2">
          <TextField
            label="Trumpa žinutė"
            name="message"
            multiline
            value={values.message}
            error={showError("message")}
            onChange={update}
            onBlur={blur}
            hint={`${values.message.length}/${MESSAGE_MAX}`}
            placeholder="Pvz., kiek turite staliukų, ar naudojate barą, kada būtų patogu susitikti."
          />
        </div>
      </div>

      {/* Honeypot field, hidden from people and assistive technology */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Svetainė
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] text-fg-subtle">
          <span aria-hidden="true">*</span> Privalomi laukai
        </p>
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-white to-[#e7e2ff] px-7 text-[15px] font-medium text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_10px_30px_-10px_rgba(139,92,246,0.7)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status.kind === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          Prašyti demonstracijos
        </button>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden mt-5">
        {status.kind === "success" && (
          <Notice tone="success" icon={<CheckCircle2 className="size-4.5" aria-hidden="true" />}>
            Ačiū! Užklausą gavome — susisieksime su jumis nurodytais kontaktais.
          </Notice>
        )}
        {status.kind === "demo" && (
          <Notice tone="info" icon={<Info className="size-4.5" aria-hidden="true" />}>
            Forma užpildyta teisingai, tačiau <strong className="font-medium">žinutė nebuvo išsiųsta</strong>:
            forma veikia demonstraciniu režimu.
          </Notice>
        )}
        {status.kind === "error" && (
          <Notice tone="error" icon={<AlertCircle className="size-4.5" aria-hidden="true" />}>
            {status.message}
          </Notice>
        )}
      </div>
    </form>
  );
}

function Notice({
  tone,
  icon,
  children,
}: {
  tone: "success" | "info" | "error";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = {
    success: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-100",
    info: "border-violet-300/25 bg-violet-400/[0.08] text-violet-100",
    error: "border-red-400/25 bg-red-400/[0.08] text-red-100",
  }[tone];
  return (
    <p className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[14px] leading-relaxed ${styles}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

type TextFieldProps = {
  label: string;
  name: Field;
  value: string;
  error?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  placeholder?: string;
  onChange: (field: Field, value: string) => void;
  onBlur: (field: Field) => void;
};

function TextField({
  label,
  name,
  value,
  error,
  hint,
  required,
  multiline,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  onChange,
  onBlur,
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    value,
    placeholder,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onBlur: () => onBlur(name),
    className: `w-full rounded-xl border bg-ink-950/60 px-4 text-[15px] text-fg placeholder:text-fg-subtle/70 transition-colors outline-none focus:border-violet-300/60 focus:bg-ink-950 focus:ring-4 focus:ring-violet-500/15 ${
      error ? "border-red-400/60" : "border-white/10 hover:border-white/20"
    }`,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[14px] font-medium text-fg">
          {label}
          {required && (
            <span className="text-violet-300" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        {hint && (
          <span id={hintId} className="font-mono text-[11.5px] text-fg-subtle">
            {hint}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          {...shared}
          rows={4}
          onChange={(event) => onChange(name, event.target.value)}
          className={`${shared.className} min-h-28 resize-y py-3`}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(event) => onChange(name, event.target.value)}
          className={`${shared.className} h-12`}
        />
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-[13px] text-red-300">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
