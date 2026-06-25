"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to monitoring (replace with your APM/Sentry call).
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-brand-primary mb-4 tracking-tighter">
          500
        </p>
        <h1 className="text-2xl font-black mb-3 tracking-tight">
          Xatolik yuz berdi
        </h1>
        <p className="text-foreground/60 mb-8">
          Kutilmagan xatolik. Iltimos, qaytadan urinib ko‘ring. / Something went
          wrong.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-brand-primary text-black px-8 py-3 rounded-full font-black hover:scale-105 active:scale-95 transition-transform"
        >
          Qayta urinish
        </button>
      </div>
    </main>
  );
}
