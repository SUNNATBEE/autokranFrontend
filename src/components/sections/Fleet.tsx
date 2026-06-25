"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { craneData } from "@/constants";
import { MoveRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BookingModal } from "../BookingModal";

export const Fleet = () => {
  const t = useTranslations("Fleet");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrane, setSelectedCrane] = useState<string | undefined>(undefined);

  const handleBook = (model: string) => {
    setSelectedCrane(model);
    setIsModalOpen(true);
  };

  return (
    <section id="fleet" className="py-20 md:py-32 bg-brand-surface/30 overflow-hidden">
      {/* Adjust padding for mobile devices */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-6 md:mb-8 tracking-tighter"
          >
            {t.rich('title', {
              br: () => <br />,
            })} <br/>
            <span className="text-brand-primary">{t('subtitle')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-foreground/60 font-medium"
          >
             {t('description')}
          </motion.p>
        </div>

        {/* CSS Grid for fluid card layout: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {craneData.map((crane, idx) => (
            <motion.div
              key={crane.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card group"
            >
              <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
                 <Image
                    src={crane.image}
                    alt={`${crane.brand} ${crane.model} — ${crane.tonnage} ${t('ton')} avtokran`}
                    fill
                    loading={idx < 3 ? undefined : "lazy"}
                    priority={idx < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute top-4 right-4 bg-brand-primary text-black px-4 py-1.5 rounded-full font-black text-sm shadow-xl z-10">
                   {crane.tonnage} {t('ton').toUpperCase()}
                 </div>
              </div>

              <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight group-hover:text-brand-primary transition-colors">
                 {crane.model}
              </h3>
              <p className="text-foreground/50 text-sm mb-6 leading-relaxed line-clamp-2">
                 {t('craneDescription', { ton: crane.tonnage })}
              </p>

              <div className="space-y-3 mb-8 border-t border-brand-primary/10 pt-6 text-sm">
                <div className="flex justify-between items-center text-foreground/80">
                  <span className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-primary" /> {t('mainBoom')}</span>
                  <span className="font-bold text-foreground">{crane.mainBoom}m</span>
                </div>
                <div className="flex justify-between items-center text-foreground/80">
                   <span className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-primary" /> {t('maxBoom')}</span>
                   <span className="font-bold text-foreground">{crane.auxBoom}m</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="text-center py-2 bg-brand-surface rounded-xl border border-brand-primary/10">
                    <span className="text-sm font-bold text-brand-primary">{t('negotiablePrice')}</span>
                 </div>
                 
                  <button 
                     onClick={() => handleBook(crane.model)}
                     className="flex items-center justify-center gap-3 bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black p-4 rounded-xl font-black transition-all group/btn shadow-lg shadow-brand-primary/10 w-full"
                  >
                     {t('order')}
                     <MoveRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
        
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          craneModel={selectedCrane}
        />
      </div>
    </section>
  );
};

