"use client";

import { ChevronRight } from "lucide-react";
import { LocaleLink, useT } from "@/i18n/client";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  const t = useT();
  return (
    <nav aria-label={t("common.breadcrumb")}>
      <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />}
            {item.href ? (
              <LocaleLink href={item.href} className="hover:text-navy hover:underline">
                {item.label}
              </LocaleLink>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
