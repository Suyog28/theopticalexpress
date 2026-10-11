"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocalePath, useT } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function SearchForm({
  className,
  autoFocus,
  id = "site-search",
}: {
  className?: string;
  autoFocus?: boolean;
  id?: string;
}) {
  const t = useT();
  const router = useRouter();
  const lp = useLocalePath();
  const [q, setQ] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `${lp("/search")}?q=${encodeURIComponent(query)}` : lp("/search"));
  }
  return (
    <form role="search" onSubmit={submit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {t("listing.searchLabel")}
      </label>
      <Search
        className="text-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("nav.searchPlaceholder")}
        autoFocus={autoFocus}
        className="border-line placeholder:text-muted/80 focus:border-secondary focus:ring-secondary/20 h-10 w-full rounded-sm border bg-white pr-3 pl-10 text-sm focus:ring-2 focus:outline-none"
      />
    </form>
  );
}
