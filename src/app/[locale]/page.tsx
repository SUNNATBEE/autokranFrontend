import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Fleet } from "@/components/sections/Fleet";
import { Calculator } from "@/components/sections/Calculator";
import { Projects } from "@/components/sections/Projects";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { Partners } from "@/components/sections/Partners";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { companyInfo, siteConfig } from "@/constants";
import { fetchPublicCranes, discountedPrice } from "@/lib/cranes";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Seo" });

  // DB-driven fleet (falls back to the built-in list if the API is empty/down).
  const cranes = await fetchPublicCranes();

  // FAQ content (also emitted as FAQPage structured data for rich results).
  const tFaq = await getTranslations({ locale, namespace: "Faq" });
  const faqItems = tFaq.raw("items") as { q: string; a: string }[];

  // Distinct tonnages offered (deduped) — used to build the service catalog.
  const tonnages = [...new Set(cranes.map((c) => c.tonnage))].sort(
    (a, b) => a - b
  );

  // Structured data graph — LocalBusiness + WebSite + Service.
  // A connected @graph helps Google understand the entity and can produce a
  // richer local-business / service result.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#business`,
        name: companyInfo.shortName,
        legalName: companyInfo.name,
        description: t("description"),
        url: `${siteConfig.url}/${locale}`,
        telephone: companyInfo.phone,
        foundingDate: String(companyInfo.founded),
        image: siteConfig.ogImage,
        logo: `${siteConfig.url}/favicon.svg`,
        priceRange: siteConfig.priceRange,
        currenciesAccepted: "UZS",
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
        contactPoint: {
          "@type": "ContactPoint",
          telephone: companyInfo.phone,
          contactType: "customer service",
          availableLanguage: ["uz", "ru", "en"],
        },
        sameAs: [companyInfo.telegram, companyInfo.instagram],
        areaServed: { "@type": "Country", name: "Uzbekistan" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: companyInfo.shortName,
        description: t("description"),
        publisher: { "@id": `${siteConfig.url}/#business` },
        inLanguage: ["uz", "ru", "en"],
      },
      {
        "@type": "Service",
        "@id": `${siteConfig.url}/#service`,
        serviceType: "Avtokran ijarasi / Crane rental",
        provider: { "@id": `${siteConfig.url}/#business` },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: companyInfo.shortName,
          itemListElement: tonnages.map((ton) => {
            // Cheapest available price for this tonnage (after discount).
            const prices = cranes
              .filter((c) => c.tonnage === ton)
              .map((c) => discountedPrice(c))
              .filter((p): p is number => p != null);
            const lowPrice = prices.length ? Math.min(...prices) : undefined;
            return {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `${ton} tonnalik avtokran ijarasi`,
              },
              priceCurrency: "UZS",
              ...(lowPrice ? { price: String(lowPrice) } : {}),
              availability: "https://schema.org/InStock",
            };
          }),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
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
        <Calculator cranes={cranes} />
        <Fleet cranes={cranes} />
        <Projects craneCount={cranes.length} />
        <Reviews />
        <Faq />
        <Partners />
        <Footer />
        <FloatingContact />
      </main>
    </>
  );
}
