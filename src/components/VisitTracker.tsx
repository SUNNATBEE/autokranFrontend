"use client";

import { useEffect } from "react";

/**
 * Fires a single, fire-and-forget page-view beacon per browser session to the
 * backend so the admin dashboard can show in-panel visit counts. No PII is
 * sent. Richer analytics come from Vercel Analytics (<Analytics/>).
 */
export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("v_tracked")) return;
      sessionStorage.setItem("v_tracked", "1");
    } catch {
      // sessionStorage blocked — still count this load once.
    }
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  return null;
}
