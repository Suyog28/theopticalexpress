"use client";

import { LocaleLink, useT } from "@/i18n/client";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  const t = useT();
  return (
    <div className="container-site py-20">
      <EmptyState
        title={t("notFound.title")}
        text={t("notFound.text")}
        action={
          <LocaleLink href="/" className={buttonClasses()}>
            {t("notFound.cta")}
          </LocaleLink>
        }
      />
    </div>
  );
}
