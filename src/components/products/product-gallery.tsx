"use client";

import { useState, type KeyboardEvent } from "react";
import type { ProductImage } from "@/types/product";
import { SmartImage } from "@/components/ui/smart-image";
import { useLocale, useT } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const t = useT();
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div
      className="flex flex-col-reverse gap-3 self-start md:flex-row md:items-start lg:sticky lg:top-36"
      aria-label={t("product.gallery")}
      role="group"
    >
      {images.length > 1 && (
        <div className="flex gap-3 md:flex-col" onKeyDown={onKey}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-pressed={i === index}
              aria-label={t("product.showImage", { index: i + 1 })}
              onClick={() => setIndex(i)}
              className={cn(
                "bg-ivory-deep ring-offset-ivory relative h-20 w-16 shrink-0 overflow-hidden rounded-sm ring-offset-2 transition md:h-24 md:w-20",
                i === index ? "ring-navy ring-2" : "opacity-70 hover:opacity-100",
              )}
            >
              <SmartImage src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="bg-ivory-deep relative aspect-[4/5] min-w-0 flex-1 overflow-hidden rounded-sm">
        {current && (
          <SmartImage
            key={current.src}
            src={current.src}
            alt={current.alt[locale] || name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-fade-in object-cover"
          />
        )}
      </div>
    </div>
  );
}
