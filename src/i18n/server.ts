import "server-only";
import { notFound } from "next/navigation";
import { getMessages, getTranslator } from "./messages";
import { isLocale, type Locale } from "./routing";

/** Resolve and validate the [locale] route param, returning a translator for it. */
export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale: locale as Locale, t: getTranslator(locale), messages: getMessages(locale) };
}
