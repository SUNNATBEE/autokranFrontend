import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Outside `/api/*` so the Next rewrite to the backend doesn't capture it.
export const dynamic = "force-dynamic";

/**
 * On-demand revalidation of the public fleet. Called by the admin panel after a
 * crane is created/updated/deleted so changes appear on the site immediately
 * instead of waiting for the ISR window. Gated on the admin cookie (worst case
 * if spoofed: a harmless cache refresh). Revalidates every locale instance of
 * the home route at once via the dynamic route pattern.
 */
export async function POST() {
  const store = await cookies();
  if (!store.get("admin_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/[locale]", "page");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
