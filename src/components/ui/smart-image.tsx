"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const FALLBACK_IMAGE = "/images/fallback/frame.svg";

/**
 * next/image with a branded fallback, so a missing or failed asset never shows a
 * broken-image icon.
 */
export function SmartImage({ src, alt, className, ...props }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const failed = failedSrc !== null && failedSrc === src;
  return (
    <Image
      {...props}
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      className={cn(failed && "object-contain p-8 opacity-60", className)}
      onError={() => setFailedSrc(src)}
      unoptimized={failed || props.unoptimized}
    />
  );
}
