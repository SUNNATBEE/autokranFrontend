"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ContactModal } from "../ContactModal";

export const Hero = () => {
  const t = useTranslations("Hero");
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Ensure section doesn't cause horizontal scrolling on mobile */}
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6">
            <span className="text-brand-primary font-bold text-sm tracking-widest uppercase">{t('badge')}</span>
          </div>
          
          {/* Mobile-optimized typography: reduced base size, scales up on md/lg screens */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground leading-none mb-6 md:mb-8 tracking-tighter">
            {t('title1')} <br/> 
            {t('title2')} <br/>
            <span className="text-brand-primary">{t('title3')}</span>
          </h1>
          
          {/* Improved readability on mobile with adjusted text size and margins */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/60 max-w-xl mb-8 md:mb-12 leading-relaxed">
            {t('description')}
          </p>
          
          {/* Flexbox layout for buttons: full width on mobile, inline on larger screens */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <a href="#fleet" className="w-full sm:w-auto text-center bg-brand-primary text-black px-10 py-4 rounded-full font-black text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/20">
              {t('viewFleet')}
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="w-full sm:w-auto text-center border-2 border-foreground/20 text-foreground px-10 py-4 rounded-full font-black text-lg hover:border-brand-primary hover:text-brand-primary hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t('contact')}
            </button>
          </div>
          
          {/* Mobile-friendly stats grid: wrap on small screens, spaced out on desktop */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center gap-8 md:gap-12 text-sm text-foreground/40 font-bold tracking-widest uppercase border-t border-foreground/5 pt-8 md:pt-12">
            <div className="flex-1 min-w-[100px]">
              <span className="block text-3xl sm:text-4xl font-black text-foreground mb-1 tracking-tighter">20+</span>
              {t('expYears')}
            </div>
            <div className="flex-1 min-w-[100px]">
              <span className="block text-3xl sm:text-4xl font-black text-foreground mb-1 tracking-tighter">24/7</span>
              {t('service')}
            </div>
            <div className="flex-1 min-w-[100px]">
              <span className="block text-3xl sm:text-4xl font-black text-foreground mb-1 tracking-tighter">100%</span>
              {t('safety')}
            </div>
          </div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent blur-3xl rounded-full" />
          <Image
            src="/images/zoomlion_130t_new.png"
            alt="AUTOKRAN.UZ — 130 tonnalik avtokran ijarasi, O'zbekistondagi eng kuchli yuk ko'tarish texnikasi"
            width={800}
            height={1000}
            priority
            sizes="(max-width: 1024px) 0px, 40vw"
            className="w-full h-auto object-cover rounded-3xl rotate-2 hover:rotate-0 transition-all duration-700 shadow-2xl relative z-10"
          />
        </motion.div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};

