import { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "../globals.css";
import { siteConfig, companyInfo, verification } from "@/constants";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { VisitTracker } from "@/components/VisitTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const OG_LOCALES: Record<string, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateViewport(): Promise<Viewport> {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: dark)", color: "#121214" },
      { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    ],
    width: "device-width",
    initialScale: 1,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  // Per-locale canonical + hreflang alternates.
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`])
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${companyInfo.shortName}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    applicationName: companyInfo.shortName,
    authors: [{ name: companyInfo.name }],
    creator: companyInfo.name,
    publisher: companyInfo.name,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: { ...languages, "x-default": `${siteConfig.url}/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "website",
      siteName: companyInfo.shortName,
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.url}/${locale}`,
      locale: OG_LOCALES[locale] ?? "uz_UZ",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    // Ownership verification for Search Console / Webmaster
    verification: {
      // Google kaliti to'g'ridan-to'g'ri shu yerga yozildi:
      google: "j1hfo-Zn7gseZdMQjYYVO-dPkDrqYbqKzoNE1VFMtN0",
      ...(verification.yandex ? { yandex: verification.yandex } : {}),
      ...(verification.bing
        ? { other: { "msvalidate.01": verification.bing } }
        : {}),
    },
    formatDetection: { telephone: true, address: true },
  };
}

// Set the initial theme before paint to avoid a flash of the wrong color scheme.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <VisitTracker />
        <Analytics />
      </body>
    </html>
  );
}