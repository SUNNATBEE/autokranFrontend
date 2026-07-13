"use client";

import { Suspense, useEffect, useState } from "react";
import { Globe, Send, Phone, MapPin, Shield } from "lucide-react";
import { companyInfo } from "@/constants";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { Link } from "@/i18n/routing";

function FooterContent() {
  const t = useTranslations("Footer");
  const adminT = useTranslations("AdminLogin");
  const navT = useTranslations("Navbar");
  const searchParams = useSearchParams();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [displayPhone, setDisplayPhone] = useState(`+998 ${companyInfo.phoneRaw}`);
  const [displayAddress, setDisplayAddress] = useState(companyInfo.address);
  const [telegramUrl, setTelegramUrl] = useState(companyInfo.telegram);

  useEffect(() => {
    if (searchParams.get("admin") === "login") {
      setIsLoginOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.phoneNumbers?.[0]) setDisplayPhone(data.phoneNumbers[0]);
        if (data.address) setDisplayAddress(data.address);
        if (data.telegramBot) setTelegramUrl(data.telegramBot);
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <footer className="bg-background pt-24 pb-28 md:pb-32 overflow-hidden border-t border-brand-primary/10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-8 group cursor-pointer">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="text-black font-black text-xl">A</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-foreground">
                  AUTOKRAN<span className="text-brand-primary">.UZ</span>
                </span>
              </div>
              <p className="text-foreground/60 leading-relaxed mb-8">
                {t("description")}
              </p>
              <div className="flex gap-4">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="p-4 bg-brand-surface rounded-2xl hover:bg-brand-primary group transition-all border border-brand-primary/5"
                >
                  <Send
                    size={24}
                    className="text-foreground group-hover:text-black transition-colors"
                  />
                </a>
                <a
                  href={companyInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="p-4 bg-brand-surface rounded-2xl hover:bg-brand-primary group transition-all border border-brand-primary/5"
                >
                  <Globe
                    size={24}
                    className="text-foreground group-hover:text-black transition-colors"
                  />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-foreground mb-8">
                {t("links")}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-foreground/60 hover:text-brand-primary transition-colors"
                  >
                    {navT("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-foreground/60 hover:text-brand-primary transition-colors"
                  >
                    {navT("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fleet"
                    className="text-foreground/60 hover:text-brand-primary transition-colors"
                  >
                    {navT("fleet")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-foreground/60 hover:text-brand-primary transition-colors"
                  >
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-foreground/60 hover:text-brand-primary transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black text-foreground mb-8">
                {t("contact")}
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-surface rounded-xl border border-brand-primary/5">
                    <Phone size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <span className="block text-foreground/40 text-xs font-bold uppercase tracking-widest mb-1">
                      {t("phoneLabel")}
                    </span>
                    <a
                      href={`tel:${displayPhone.replace(/\s/g, "")}`}
                      className="text-foreground font-bold hover:text-brand-primary transition-colors"
                    >
                      {displayPhone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-surface rounded-xl border border-brand-primary/5">
                    <MapPin size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <span className="block text-foreground/40 text-xs font-bold uppercase tracking-widest mb-1">
                      {t("addressLabel")}
                    </span>
                    <span className="text-foreground font-bold">
                      {displayAddress}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-brand-primary/5 pt-12 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-foreground/40 uppercase tracking-widest"
            suppressHydrationWarning
          >
            <p>
              © {new Date().getFullYear()} {companyInfo.shortName}. {t("rights")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-brand-primary transition-colors">
                {t("privacy")}
              </a>
              <a href="#" className="hover:text-brand-primary transition-colors">
                {t("terms")}
              </a>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-1.5 opacity-30 hover:opacity-100 hover:text-brand-primary transition-all normal-case tracking-normal"
                aria-label={adminT("title")}
              >
                <Shield size={14} />
                <span className="text-xs font-semibold">{adminT("footerButton")}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}

export const Footer = () => (
  <Suspense fallback={null}>
    <FooterContent />
  </Suspense>
);
