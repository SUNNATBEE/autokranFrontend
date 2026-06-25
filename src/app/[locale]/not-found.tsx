import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-brand-primary mb-4 tracking-tighter">
          404
        </p>
        <h1 className="text-2xl font-black mb-3 tracking-tight">
          Sahifa topilmadi
        </h1>
        <p className="text-foreground/60 mb-8">
          Siz qidirgan sahifa mavjud emas yoki ko‘chirilgan. / Page not found.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-primary text-black px-8 py-3 rounded-full font-black hover:scale-105 active:scale-95 transition-transform"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}
