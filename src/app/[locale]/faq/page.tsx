import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/constants";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/faq`])
  );

  return {
    title: t("faqTitle"),
    description: t("faqDescription"),
    keywords: t("faqKeywords"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/faq`,
      languages: { ...languages, "x-default": `${siteConfig.url}/${routing.defaultLocale}/faq` },
    },
    openGraph: {
      title: t("faqTitle"),
      description: t("faqDescription"),
      url: `${siteConfig.url}/${locale}/faq`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: t("ogAlt") }],
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-primary selection:text-black pt-24">
        <Faq />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
