import { craneData } from "@/constants";

/** Normalized crane shape consumed by the public Fleet section. */
export interface FleetCrane {
  id: string;
  model: string;
  brand?: string;
  tonnage: number;
  mainBoom: number;
  auxBoom?: number;
  image: string;
  pricePerMonth: number | null;
  discountPercent: number;
}

/** Raw crane record as returned by the backend `/api/cranes` endpoint. */
interface DbCrane {
  id: string;
  modelName: string;
  brand?: string | null;
  capacity: number;
  boomLength: number;
  auxBoomLength?: number | null;
  pricePerMonth?: number | null;
  discountPercent?: number | null;
  images?: string[];
}

const FALLBACK_IMAGE = "/images/hero-bg.avif";

function normalizeDbCrane(c: DbCrane): FleetCrane {
  return {
    id: c.id,
    model: c.modelName,
    brand: c.brand ?? undefined,
    tonnage: c.capacity,
    mainBoom: c.boomLength,
    auxBoom: c.auxBoomLength ?? undefined,
    image: c.images?.[0] || FALLBACK_IMAGE,
    pricePerMonth: c.pricePerMonth ?? null,
    discountPercent: c.discountPercent ?? 0,
  };
}

/** Built-in fleet used when the DB is empty or unreachable (keeps the site full). */
const fallbackCranes: FleetCrane[] = craneData.map((c) => ({
  id: String(c.id),
  model: c.model,
  brand: c.brand,
  tonnage: c.tonnage,
  mainBoom: c.mainBoom,
  auxBoom: c.auxBoom,
  image: c.image,
  pricePerMonth: c.pricePerMonth ?? null,
  discountPercent: 0,
}));

/**
 * Server-side fetch of the public fleet. Reads directly from the backend
 * (BACKEND_URL) so admin edits show up on the site. Revalidates every 60s
 * (ISR) — fast + SEO-friendly, while still reflecting changes within a minute.
 * Falls back to the built-in fleet if the DB is empty or the API fails.
 */
export async function fetchPublicCranes(): Promise<FleetCrane[]> {
  const base = (process.env.BACKEND_URL || "http://localhost:4000").replace(
    /\/+$/,
    ""
  );
  try {
    const res = await fetch(`${base}/api/cranes`, {
      // 60s ISR fallback; the admin also purges this on demand via /revalidate
      // (revalidatePath) so edits appear on the site immediately.
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = (await res.json()) as DbCrane[];
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeDbCrane);
      }
    }
  } catch {
    // Network/DB error — fall through to the built-in fleet.
  }
  return fallbackCranes;
}

/** Final price after applying a crane's discount (rounded to whole UZS). */
export function discountedPrice(crane: FleetCrane): number | null {
  if (crane.pricePerMonth == null) return null;
  if (!crane.discountPercent) return crane.pricePerMonth;
  return Math.round(crane.pricePerMonth * (1 - crane.discountPercent / 100));
}
