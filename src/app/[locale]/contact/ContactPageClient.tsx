"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, Phone, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { companyInfo } from "@/constants";
import { PhoneInput } from "@/components/PhoneInput";

export const ContactPageClient = () => {
  const t = useTranslations("Contact");
  const tb = useTranslations("Booking");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (name.trim().length < 2 || !phoneValid) return;
    setStatus("sending");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setPhone("");
        setPhoneValid(false);
        setSubmitted(false);
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">
              {t("title")}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mt-3">
              {t("title")}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-black mb-8 tracking-tight uppercase">
                {companyInfo.shortName}
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-10">
                {companyInfo.description}
              </p>

              <div className="space-y-6">
                <a
                  href={`tel:+998${companyInfo.phoneRaw}`}
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                    <Phone size={22} className="text-brand-primary group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-0.5">
                      {t("phoneLabel")}
                    </span>
                    <span className="font-bold text-lg group-hover:text-brand-primary transition-colors">
                      {companyInfo.phone}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-brand-primary" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-0.5">
                      Address
                    </span>
                    <span className="font-bold text-lg">
                      {companyInfo.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-12">
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
                <a
                  href={companyInfo.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#229ED9] text-white px-6 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={20} />
                  Telegram
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-brand-surface border border-brand-primary/10 rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-black mb-2 tracking-tight">
                {t("title")}
              </h3>
              <p className="text-foreground/60 mb-8">
                {t("description")}
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t("success")}</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t("nameLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("namePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-foreground/5 border rounded-2xl py-4 px-6 outline-none transition-all font-medium text-foreground ${
                        submitted && name.trim().length < 2
                          ? "border-red-500/60"
                          : "border-foreground/10 focus:border-brand-primary"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t("phoneLabel")}
                    </label>
                    <PhoneInput
                      onChange={(full, valid) => {
                        setPhone(full);
                        setPhoneValid(valid);
                      }}
                      showError={submitted}
                      errorText={tb("phoneInvalid")}
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={20} />
                      <p className="text-sm font-medium">{t("error")}</p>
                    </div>
                  )}

                  <button
                    disabled={status === "sending"}
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-brand-primary/20 cursor-pointer"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        {t("submit")}
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
