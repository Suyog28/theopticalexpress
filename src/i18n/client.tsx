"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { createTranslator, type Messages, type Translate } from "./messages";
import { localePath } from "./routing";
import type { Locale } from "@/types/i18n";

interface I18nContextValue {
  locale: Locale;
  t: Translate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: createTranslator(messages) }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): Translate {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

/** Returns a function that prefixes app paths with the active locale. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path) => localePath(locale, path);
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

/** next/link that automatically prefixes the active locale. External/hash links pass through. */
export function LocaleLink({ href, ...props }: LinkProps) {
  const locale = useLocale();
  const external = /^(https?:|mailto:|tel:|#)/.test(href);
  return <NextLink href={external ? href : localePath(locale, href)} {...props} />;
}
