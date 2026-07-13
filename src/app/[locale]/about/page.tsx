import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig, companyInfo } from "@/constants";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { Partners } from "@/components/sections/Partners";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/about`])
  );

  return {
    title: `${t("title")} — About Us`,
    description: companyInfo.description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/about`,
      languages: { ...languages, "x-default": `${siteConfig.url}/${routing.defaultLocale}/about` },
    },
    openGraph: {
      title: `${t("title")} — About Us`,
      description: companyInfo.description,
      url: `${siteConfig.url}/${locale}/about`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-primary selection:text-black pt-24">
        <About />
        <Partners />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
