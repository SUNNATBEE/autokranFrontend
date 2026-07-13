import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig, companyInfo } from "@/constants";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { ContactPageClient } from "./ContactPageClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/contact`])
  );

  return {
    title: `${t("title")} — Contact`,
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/contact`,
      languages: { ...languages, "x-default": `${siteConfig.url}/${routing.defaultLocale}/contact` },
    },
    openGraph: {
      title: `${t("title")} — Contact`,
      description: t("description"),
      url: `${siteConfig.url}/${locale}/contact`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-primary selection:text-black pt-24">
        <ContactPageClient />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
