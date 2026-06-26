"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "./PhoneInput";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
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
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error sending contact request:", error);
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
            className="relative w-full max-w-md bg-brand-surface border border-brand-primary/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
            
            <button
              onClick={onClose}
              type="button"
              className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-brand-primary hover:text-black transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                  {t('title')}
                </h2>
                <p className="text-foreground/60 font-medium">
                  {t('description')}
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
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t('nameLabel')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                      <input
                        type="text"
                        placeholder={t('namePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full bg-foreground/5 border rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-medium text-foreground ${
                          submitted && name.trim().length < 2
                            ? "border-red-500/60"
                            : "border-foreground/10 focus:border-brand-primary"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t('phoneLabel')}
                    </label>
                    <PhoneInput
                      onChange={(full, valid) => {
                        setPhone(full);
                        setPhoneValid(valid);
                      }}
                      showError={submitted}
                      errorText={tb('phoneInvalid')}
                    />
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
                    className="w-full bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-brand-primary/20 cursor-pointer"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
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
