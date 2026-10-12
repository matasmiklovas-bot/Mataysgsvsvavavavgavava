import type { ImageLoaderProps } from "next/image";

/**
 * Photos are served from the Unsplash CDN (images.unsplash.com), which resizes and
 * converts to AVIF/WebP on the fly. Using it as the next/image loader keeps responsive
 * srcsets without routing every image through our own server.
 */
export function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}

export const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

export const photos = {
  // Portrait for the hero. Put your own photo at public/hero.jpg and set this to "/hero.jpg".
  // Default: a smiling, confident professional from Unsplash (Unsplash License).
  hero: unsplash("photo-1573496359142-b8d87734a5a2"),
} as const;
