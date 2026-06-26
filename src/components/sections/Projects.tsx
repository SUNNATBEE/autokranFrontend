"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { companyInfo, projectShowcase } from "@/constants";

export const Projects = ({ craneCount }: { craneCount: number }) => {
  const t = useTranslations("Projects");
  const years = new Date().getFullYear() - companyInfo.founded;

  const stats = [
    { value: `${years}+`, label: t("experience") },
    { value: `${craneCount}+`, label: t("cranesLabel") },
    { value: `${projectShowcase.length * 15}+`, label: t("projectsLabel") },
    { value: "24/7", label: t("serviceLabel") },
  ];

  return (
    <section id="projects" className="py-20 md:py-32 bg-brand-surface/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-brand-primary font-bold uppercase tracking-widest text-sm"
          >
            {t("subtitle")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-3"
          >
            {t("title")}
          </motion.h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="premium-card text-center"
            >
              <p className="text-3xl md:text-5xl font-black text-brand-primary leading-none">
                {s.value}
              </p>
              <p className="text-xs md:text-sm font-medium text-foreground/50 mt-2 uppercase tracking-wide">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Project gallery */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projectShowcase.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden group"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-white font-black text-lg md:text-xl tracking-tight drop-shadow-lg">
                  {p.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
