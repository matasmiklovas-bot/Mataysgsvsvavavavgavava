"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState, type ReactNode } from "react";
import { unsplashLoader } from "@/lib/images";

type PhotoProps = Omit<ImageProps, "loader" | "onError" | "ref"> & {
  /** Rendered instead of the image if it cannot be loaded. */
  fallback: ReactNode;
};

/** next/image backed by the Unsplash CDN, with a designed fallback if the photo fails. */
export function Photo({ fallback, alt, ...props }: PhotoProps) {
  const [failed, setFailed] = useState(false);

  // An image can fail before React hydrates and attaches onError, so check once on mount.
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;
  return (
    <Image
      {...props}
      ref={checkLoaded}
      alt={alt}
      loader={typeof props.src === "string" && props.src.startsWith("http") ? unsplashLoader : undefined}
      onError={() => setFailed(true)}
    />
  );
}
