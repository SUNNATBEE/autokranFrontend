"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FleetCrane } from "@/lib/cranes";
import { discountedPrice } from "@/lib/cranes";
import { BookingModal } from "../BookingModal";

const priceFmt = new Intl.NumberFormat("ru-RU");

// Rough working-days-per-month divisor used to derive a daily rate from the
// monthly price. The result is clearly labelled as an estimate.
const DAYS_PER_MONTH = 26;

export const Calculator = ({ cranes }: { cranes: FleetCrane[] }) => {
  const t = useTranslations("Calculator");
  const [isModalOpen, setModalOpen] = useState(false);

  // One representative (cheapest available) priced crane per tonnage.
  const options = useMemo(() => {
    const byTon = new Map<number, FleetCrane>();
    for (const c of cranes) {
      if (c.pricePerMonth == null) continue;
      const cur = byTon.get(c.tonnage);
      const price = discountedPrice(c)!;
      if (!cur || price < discountedPrice(cur)!) byTon.set(c.tonnage, c);
    }
    return [...byTon.entries()]
      .map(([tonnage, crane]) => ({ tonnage, crane }))
      .sort((a, b) => a.tonnage - b.tonnage);
  }, [cranes]);

  const [tonnage, setTonnage] = useState<number | null>(
    options[0]?.tonnage ?? null
  );
  const [days, setDays] = useState(7);

  const selected = options.find((o) => o.tonnage === tonnage);
  const estimate = useMemo(() => {
    if (!selected) return null;
    const monthly = discountedPrice(selected.crane)!;
    const daily = monthly / DAYS_PER_MONTH;
    return Math.round(daily * Math.max(1, days));
  }, [selected, days]);

  // No priced cranes → don't render the section at all.
  if (options.length === 0) return null;

  return (
    <section id="calculator" className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-sm mb-3">
              <CalcIcon size={18} /> {t("subtitle")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
              {t("title")}
            </h2>
          </motion.div>

          <div className="premium-card !p-8 md:!p-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tonnage */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">
                  {t("tonnageLabel")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {options.map((o) => (
                    <button
                      key={o.tonnage}
                      type="button"
                      onClick={() => setTonnage(o.tonnage)}
                      className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all ${
                        tonnage === o.tonnage
                          ? "bg-brand-primary text-black shadow-lg shadow-brand-primary/20"
                          : "bg-brand-surface border border-brand-primary/10 text-foreground/70 hover:border-brand-primary/40"
                      }`}
                    >
                      {o.tonnage} {t("ton")}
                    </button>
                  ))}
                </div>

                {/* Days */}
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mt-8 mb-3">
                  {t("daysLabel")}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="flex-1 accent-brand-primary"
                  />
                  <span className="w-20 text-center font-black text-lg bg-brand-surface border border-brand-primary/10 rounded-xl py-2">
                    {days}
                  </span>
                </div>
              </div>

              {/* Estimate */}
              <div className="flex flex-col justify-between bg-gradient-to-br from-brand-primary/10 to-transparent rounded-2xl p-6 border border-brand-primary/20">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    {t("estimateLabel")}
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-brand-primary leading-none">
                      {estimate != null ? priceFmt.format(estimate) : "—"}
                    </span>
                    <span className="text-sm font-bold text-foreground/50">
                      {t("currency")}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/40 mt-3 leading-relaxed">
                    {t("estimateNote")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary text-black py-4 rounded-xl font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-lg shadow-brand-primary/10"
                >
                  {t("orderNow")}
                  <MoveRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        craneModel={selected ? `${selected.tonnage} ${t("ton")} · ${days} ${t("perDay")}` : undefined}
      />
    </section>
  );
};
