import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants";
import { routing } from "@/i18n/routing";

/* ================================================================== */
/*  SEO-OPTIMIZED SITEMAP — v4 (autokran keyword focused)              */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Build hreflang alternates for a given path (e.g. "/about"). */
function alternatesFor(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {
    "x-default": `${siteConfig.url}/${routing.defaultLocale}${path}`,
    ...Object.fromEntries(
      routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])
    ),
  };
  return { languages };
}

/** Priority helper — default locale gets slightly higher priority. */
function prio(isDefault: boolean, base: number): number {
  return isDefault ? base : Math.round((base - 0.1) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Sitemap generator                                                  */
/* ------------------------------------------------------------------ */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const nowISO = now.toISOString();
  const entries: MetadataRoute.Sitemap = [];

  /* ---- Static pages (per locale) ---- */

  for (const locale of routing.locales) {
    const isDefault = locale === routing.defaultLocale;

    // 1. Homepage — highest priority, daily updates
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: nowISO,
      changeFrequency: "daily" as const,
      priority: prio(isDefault, 1.0),
      alternates: alternatesFor(""),
    });

    // 2. Fleet / Avtopark — weekly updates, high priority
    entries.push({
      url: `${siteConfig.url}/${locale}/fleet`,
      lastModified: nowISO,
      changeFrequency: "weekly" as const,
      priority: prio(isDefault, 0.9),
      alternates: alternatesFor("/fleet"),
    });

    // 3. About — monthly
    entries.push({
      url: `${siteConfig.url}/${locale}/about`,
      lastModified: nowISO,
      changeFrequency: "monthly" as const,
      priority: prio(isDefault, 0.8),
      alternates: alternatesFor("/about"),
    });

    // 4. Contact — monthly
    entries.push({
      url: `${siteConfig.url}/${locale}/contact`,
      lastModified: nowISO,
      changeFrequency: "monthly" as const,
      priority: prio(isDefault, 0.8),
      alternates: alternatesFor("/contact"),
    });

    // 5. FAQ — monthly
    entries.push({
      url: `${siteConfig.url}/${locale}/faq`,
      lastModified: nowISO,
      changeFrequency: "monthly" as const,
      priority: prio(isDefault, 0.7),
      alternates: alternatesFor("/faq"),
    });
  }

  return entries;
}
