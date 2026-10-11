import { FileWarning } from "lucide-react";
import type { MessageKey, Translate, TranslateVars } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatDate } from "@/components/reviews/store-reviews";
import { siteConfig } from "@/config/site";

export type PolicyKey = "shipping" | "returns" | "privacy" | "terms";

/** Draft policy template. All copy is clearly labelled as requiring business approval. */
export function PolicyPage({
  policy,
  t,
  locale,
  vars,
}: {
  policy: PolicyKey;
  t: Translate;
  locale: Locale;
  vars?: TranslateVars;
}) {
  const k = (s: string) => `policies.${policy}.${s}` as MessageKey;
  const sections = [1, 2, 3, 4].map((n) => ({
    title: t(k(`p${n}Title`)),
    body: t(k(`p${n}`), vars),
  }));
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[{ href: "/", label: t("common.home") }, { label: t(`meta.${policy}`) }]}
      />
      <article className="mx-auto mt-8 max-w-prose">
        <div
          role="note"
          className="border-warning/25 bg-warning-bg text-warning flex gap-3 rounded-sm border p-4 text-sm font-medium"
        >
          <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t("policies.draftBanner")}
        </div>
        <h1 className="font-display text-headline text-ink mt-8">{t(`meta.${policy}`)}</h1>
        <p className="text-muted mt-2 text-xs">
          {t("policies.lastUpdated", { date: formatDate(siteConfig.research.date, locale) })}
        </p>
        <p className="text-muted mt-6 text-lg leading-relaxed">{t(k("intro"))}</p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="font-display text-ink text-xl">{s.title}</h2>
            <p className="text-muted mt-3 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
