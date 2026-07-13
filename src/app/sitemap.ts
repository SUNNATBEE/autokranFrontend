import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants";
import { routing } from "@/i18n/routing";

/* ------------------------------------------------------------------ */
/*  ⚠️  DIQQAT                                                         */
/*  Sitemap quyidagi URL'larni o'z ichiga oladi. Agar ular uchun       */
/*  route fayllari mavjud bo'lmasa (/[locale]/about, /contact,         */
/*  /services, /fleet, /faq, /cranes/[slug]), Google 404 xatolarni     */
/*  topadi va bu SEO ga zarar keltiradi.                                */
/*  Avval ushbu sahifalar uchun page komponentlarini yarating!         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Raw crane record returned by the backend `/api/cranes` endpoint. */
interface DbCrane {
  id: string;
  modelName: string;
  brand?: string | null;
  capacity: number;
  /** Optional ISO‑date string the crane was last updated at. */
  updatedAt?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Build a URL‑friendly slug from a crane model name. */
function craneSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Produce the locale‑aware alternate‑language map for a given path. */
function alternatesFor(path: string): {
  languages: Record<string, string>;
} {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])
  );
  return { languages };
}

/* ------------------------------------------------------------------ */
/*  Crane fetcher                                                      */
/* ------------------------------------------------------------------ */

async function fetchCranes(): Promise<DbCrane[]> {
  const base = (process.env.BACKEND_URL || "http://localhost:4000").replace(
    /\/+$/,
    ""
  );
  try {
    const res = await fetch(`${base}/api/cranes`, {
      // The sitemap is generated at build time (SSG), but ISR can re‑run it
      // when the admin purges the cache via /revalidate.
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = (await res.json()) as DbCrane[];
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API unreachable — return empty so the sitemap still ships with
    // static pages.
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  Sitemap generator                                                  */
/* ------------------------------------------------------------------ */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch DB cranes (async, build‑time / ISR).
  const cranes = await fetchCranes();

  const entries: MetadataRoute.Sitemap = [];

  /* ---- Static pages (per locale) ---- */

  for (const locale of routing.locales) {
    const isDefault = locale === routing.defaultLocale;
    const prio = (p: number) => (isDefault ? p : Math.round((p - 0.1) * 10) / 10);

    // 1. Homepage
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: prio(1.0),
      alternates: alternatesFor(""),
    });

    // 2. About
    entries.push({
      url: `${siteConfig.url}/${locale}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: prio(0.7),
      alternates: alternatesFor("/about"),
    });

    // 3. Contact
    entries.push({
      url: `${siteConfig.url}/${locale}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: prio(0.8),
      alternates: alternatesFor("/contact"),
    });

    // 4. Services
    entries.push({
      url: `${siteConfig.url}/${locale}/services`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: prio(0.8),
      alternates: alternatesFor("/services"),
    });

    // 5. Fleet (catalogue overview)
    entries.push({
      url: `${siteConfig.url}/${locale}/fleet`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: prio(0.9),
      alternates: alternatesFor("/fleet"),
    });

    // 6. FAQ
    entries.push({
      url: `${siteConfig.url}/${locale}/faq`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: prio(0.6),
      alternates: alternatesFor("/faq"),
    });
  }

  /* ---- Dynamic crane detail pages (per locale × per crane) ---- */

  for (const locale of routing.locales) {
    for (const crane of cranes) {
      const slug = craneSlug(crane.modelName);
      const lastMod = crane.updatedAt ? new Date(crane.updatedAt) : now;

      entries.push({
        url: `${siteConfig.url}/${locale}/cranes/${slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${siteConfig.url}/${l}/cranes/${slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
