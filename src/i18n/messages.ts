import en from "../../messages/en.json";
import mr from "../../messages/mr.json";
import hi from "../../messages/hi.json";
import type { Locale } from "@/types/i18n";

export type Messages = typeof en;

/** Every leaf key in the message tree, e.g. "nav.home" | "cart.subtotal" | … */
type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;
export type TranslateVars = Record<string, string | number>;
export type Translate = (key: MessageKey, vars?: TranslateVars) => string;

const dictionaries: Record<Locale, Messages> = {
  en,
  mr: mr as Messages,
  hi: hi as Messages,
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

function lookup(messages: unknown, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split(".")) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

export function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Build a translate function. Falls back to English, then to the key itself. */
export function createTranslator(messages: Messages): Translate {
  return (key, vars) => {
    const template = lookup(messages, key) ?? lookup(en, key) ?? key;
    return interpolate(template, vars);
  };
}

export function getTranslator(locale: Locale): Translate {
  return createTranslator(getMessages(locale));
}

/** Translate a dynamic key (e.g. built from data). Use sparingly; prefer typed keys. */
export function dynamicKey(key: string): MessageKey {
  return key as MessageKey;
}
