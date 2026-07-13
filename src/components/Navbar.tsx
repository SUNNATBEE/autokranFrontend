"use client";

import { Phone, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { companyInfo } from "@/constants";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md py-3 md:py-4 shadow-lg border-b border-brand-primary/10" : "bg-transparent py-4 md:py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
             <span className="text-black font-black text-xl">A</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            AUTOKRAN<span className="text-brand-primary">.UZ</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1.5">
            <Home size={16} />
            {t('home')}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-brand-primary transition-colors">{t('about')}</Link>
          <Link href="/fleet" className="text-sm font-medium hover:text-brand-primary transition-colors">{t('fleet')}</Link>
          <Link href="/faq" className="text-sm font-medium hover:text-brand-primary transition-colors">{t('faq')}</Link>
          <a href="#calculator" className="text-sm font-medium hover:text-brand-primary transition-colors">{t('calculator')}</a>
          <a href="#projects" className="text-sm font-medium hover:text-brand-primary transition-colors">{t('projects')}</a>

          <div className="h-6 w-[1px] bg-foreground/10 mx-2" />
          
          <LanguageSwitcher />
          <ThemeToggle />
          
          <a 
            href={`tel:+998${companyInfo.phoneRaw}`}
            className="flex items-center gap-2 bg-brand-primary text-black px-6 py-2.5 rounded-full font-bold group hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
          >
            <Phone size={18} className="fill-black" />
            {companyInfo.phone}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu: Fluid layout, transforms into full-width hamburger menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-brand-primary/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
           <Link href="/" className="text-lg font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
             <Home size={18} />
             {t('home')}
           </Link>
           <Link href="/about" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
           <Link href="/fleet" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t('fleet')}</Link>
           <Link href="/faq" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t('faq')}</Link>
           <a href="#calculator" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t('calculator')}</a>
           <a href="#projects" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>{t('projects')}</a>
           <a 
            href={`tel:+998${companyInfo.phoneRaw}`}
            className="flex items-center justify-center gap-3 bg-brand-primary text-black p-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20"
          >
            <Phone size={20} />
            {companyInfo.phone}
          </a>
        </div>
      )}
    </nav>
  );
};

