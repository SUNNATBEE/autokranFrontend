"use client";

import { motion } from "framer-motion";
import { partners, projects } from "@/constants";
import { useTranslations } from "next-intl";

export const Partners = () => {
  const t = useTranslations("Partners");

  return (
    <section id="partners" className="py-16 md:py-24 bg-brand-surface relative overflow-hidden border-y border-brand-primary/10 space-y-20 md:space-y-32">
      {/* Adjust padding and spacing for mobile devices */}
      {/* Partners Section */}
      <div>
        {/* Flexbox wrap and alignment for mobile headers */}
        <div className="container mx-auto px-6 mb-10 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tighter uppercase italic">
              {t('title1')} <span className="text-brand-primary">{t('title2')}</span>
            </h2>
          </div>
        </div>

        <div className="flex gap-8 overflow-hidden group">
          <motion.div 
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -400] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
              <div 
                 key={idx} 
                 className="bg-brand-surface/50 border border-brand-primary/10 px-16 py-10 rounded-2xl flex items-center justify-center transition-all hover:bg-brand-primary hover:border-brand-primary hover:scale-105 active:scale-95 group/partner"
              >
                 <span className="text-3xl font-black text-foreground/40 group-hover/partner:text-black transition-colors uppercase italic tracking-widest">
                    {partner}
                 </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="container mx-auto px-6 mb-10 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tighter uppercase italic">
              {t('projectsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-foreground/50 font-medium">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex gap-8 overflow-hidden group">
          <motion.div 
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -1500] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...projects, ...projects, ...projects].map((project, idx) => (
              <div 
                 key={idx} 
                 className="bg-brand-surface/50 border border-brand-primary/10 px-12 py-8 rounded-2xl flex items-center justify-center transition-all hover:bg-brand-primary hover:border-brand-primary hover:scale-105 active:scale-95 group/partner"
              >
                 <span className="text-2xl font-black text-foreground/40 group-hover/partner:text-black transition-colors uppercase italic tracking-widest">
                    {project}
                 </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Background Decor */}
      {/* Background Decor: Reduced width on mobile to not hide too much content */}
      <div className="absolute top-0 right-0 w-16 sm:w-64 h-full bg-gradient-to-l from-brand-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-16 sm:w-64 h-full bg-gradient-to-r from-brand-surface to-transparent z-10 pointer-events-none" />
    </section>
  );
};


