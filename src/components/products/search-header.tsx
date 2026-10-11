"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useT } from "@/i18n/client";
import { Button } from "@/components/ui/button";

/** Search box for the search page; keeps the query in the URL (?q=…). */
export function SearchHeader() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("q") ?? "";
  const [q, setQ] = useState(current);
  const [synced, setSynced] = useState(current);

  // Keep the input in sync when the query changes from elsewhere (e.g. header search).
  if (current !== synced) {
    setSynced(current);
    setQ(current);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-10">
      <form role="search" onSubmit={submit} className="flex max-w-xl gap-2">
        <label htmlFor="search-page-input" className="sr-only">
          {t("listing.searchLabel")}
        </label>
        <div className="relative flex-1">
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="search-page-input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            autoFocus={!current}
            className="border-line-strong focus:border-secondary focus:ring-secondary/20 h-12 w-full rounded-sm border bg-white pr-3 pl-10 text-[0.9375rem] focus:ring-2 focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg" className="h-12">
          {t("listing.searchButton")}
        </Button>
      </form>
      <p className="text-muted mt-4 text-sm">
        {current ? (
          <span className="font-display text-ink text-xl">
            {t("listing.searchResultsFor", { q: current })}
          </span>
        ) : (
          t("listing.searchPrompt")
        )}
      </p>
    </div>
  );
}
