"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, User, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  craneModel?: string;
}

export const BookingModal = ({ isOpen, onClose, craneModel }: BookingModalProps) => {
  const t = useTranslations("Booking");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          craneModel,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", location: "" });
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error sending booking:", error);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-brand-surface border border-brand-primary/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
            
            <button
              onClick={onClose}
              type="button"
              className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-brand-primary hover:text-black transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                  {t('title')}
                </h2>
                <p className="text-foreground/60 font-medium">
                  {craneModel ? (
                    <span className="text-brand-primary font-bold">{craneModel}</span>
                  ) : t('description')}
                </p>
              </div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t('success')}</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t('nameLabel')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                      <input
                        required
                        type="text"
                        placeholder={t('namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-12 pr-6 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t('phoneLabel')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                      <input
                        required
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-12 pr-6 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t('locationLabel')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                      <input
                        required
                        type="text"
                        placeholder={t('locationPlaceholder')}
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-12 pr-6 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all font-medium text-foreground"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={20} />
                      <p className="text-sm font-medium">{t('error')}</p>
                    </div>
                  )}

                  <button
                    disabled={status === "sending"}
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-brand-primary/20"
                  >
                    {status === "sending" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        {t('submit')}
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};