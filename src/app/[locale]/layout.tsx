import type { Metadata, Viewport } from "next";
import { Jost, Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { siteConfig } from "@/config/site";
import { getMessages, getTranslator } from "@/i18n/messages";
import { I18nProvider } from "@/i18n/client";
import { LOCALES, LOCALE_LABELS, isLocale } from "@/i18n/routing";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/layout/toaster";
import { WhatsAppAssist } from "@/components/layout/whatsapp-assist";
import { DemoRibbon } from "@/components/layout/demo-ribbon";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const notoSansDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-deva",
  display: "swap",
});
const notoSerifDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-deva",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getTranslator(locale);
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: `${siteConfig.brand.name} · ${t("meta.home")}`,
      template: `%s · ${siteConfig.brand.name}`,
    },
    description: t("meta.siteDescription"),
    // Demo build: keep it out of search engines until the owner approves launch.
    robots: siteConfig.flags.demoMode ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#0B2236",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslator(locale);
  const messages = getMessages(locale);

  return (
    <html
      lang={LOCALE_LABELS[locale].htmlLang}
      suppressHydrationWarning
      className={`${inter.variable} ${jost.variable} ${notoSansDeva.variable} ${notoSerifDeva.variable}`}
    >
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <I18nProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="bg-navy sr-only z-50 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            {t("common.skipToContent")}
          </a>
          <AnnouncementBar locale={locale} t={t} />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer t={t} />
          <DemoRibbon
            label={t("common.demoMode")}
            text={t("common.demoSite")}
            closeLabel={t("common.close")}
          />
          <WhatsAppAssist />
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
