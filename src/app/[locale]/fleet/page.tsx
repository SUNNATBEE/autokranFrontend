import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/constants";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Fleet } from "@/components/sections/Fleet";
import { Calculator } from "@/components/sections/Calculator";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { fetchPublicCranes } from "@/lib/cranes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/fleet`])
  );

  return {
    title: `${t("title")} — Our Fleet`,
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/fleet`,
      languages: { ...languages, "x-default": `${siteConfig.url}/${routing.defaultLocale}/fleet` },
    },
    openGraph: {
      title: `${t("title")} — Our Fleet`,
      description: t("description"),
      url: `${siteConfig.url}/${locale}/fleet`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function FleetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cranes = await fetchPublicCranes();

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-primary selection:text-black pt-24">
        <Fleet cranes={cranes} />
        <Calculator cranes={cranes} />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
