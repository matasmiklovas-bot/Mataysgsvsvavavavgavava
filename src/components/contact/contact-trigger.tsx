"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

export const OPEN_CONTACT_EVENT = "open-contact";

export function openContact() {
  window.dispatchEvent(new Event(OPEN_CONTACT_EVENT));
}

/**
 * Opens the contact dialog from anywhere on the page.
 * Without JavaScript it falls back to a plain link to the contact section.
 */
export function ContactTrigger({
  onClick,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"a">, "href">) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    openContact();
  }

  return (
    <a href="#kontaktai" onClick={handleClick} aria-haspopup="dialog" {...props}>
      {children}
    </a>
  );
}
