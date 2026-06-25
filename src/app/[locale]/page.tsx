import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Fleet } from "@/components/sections/Fleet";
import { Partners } from "@/components/sections/Partners";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { companyInfo, siteConfig } from "@/constants";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Seo" });

  // Structured data — helps Google show a rich local-business result.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: companyInfo.shortName,
    legalName: companyInfo.name,
    description: t("description"),
    url: `${siteConfig.url}/${locale}`,
    telephone: companyInfo.phone,
    foundingDate: String(companyInfo.founded),
    image: siteConfig.ogImage,
    priceRange: siteConfig.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address,
      addressLocality: siteConfig.addressLocality,
      addressCountry: siteConfig.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [companyInfo.telegram, companyInfo.instagram],
    areaServed: { "@type": "Country", name: "Uzbekistan" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-background text-foreground selection:bg-brand-primary selection:text-black">
        <Navbar />
        <Hero />
        <About />
        <Fleet />
        <Partners />
        <Footer />
      </main>
    </>
  );
}
