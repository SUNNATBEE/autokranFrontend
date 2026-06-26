"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "./PhoneInput";
import type { LocationValue } from "./LocationPicker";

// Leaflet is browser-only and heavy — load it lazily when the modal opens.
const LocationPicker = dynamic(
  () => import("./LocationPicker").then((m) => m.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-52 w-full rounded-2xl bg-foreground/5 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    ),
  }
);

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  craneModel?: string;
}

export const BookingModal = ({ isOpen, onClose, craneModel }: BookingModalProps) => {
  const t = useTranslations("Booking");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [location, setLocation] = useState<LocationValue>({
    address: "",
    lat: null,
    lng: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const reset = () => {
    setName("");
    setPhone("");
    setPhoneValid(false);
    setLocation({ address: "", lat: null, lng: null });
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (name.trim().length < 2 || !phoneValid || location.address.trim().length < 2) {
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          location: location.address,
          lat: location.lat,
          lng: location.lng,
          craneModel,
        }),
      });
      if (response.ok) {
        setStatus("success");
        reset();
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
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-brand-surface border border-brand-primary/20 rounded-3xl shadow-2xl my-4 max-h-[94vh] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-brand-surface/95 backdrop-blur border-b border-brand-primary/10 px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {t("title")}
                </h2>
                <p className="text-foreground/60 text-sm mt-0.5">
                  {craneModel ? (
                    <span className="text-brand-primary font-bold">{craneModel}</span>
                  ) : (
                    t("description")
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="p-2 rounded-full bg-foreground/5 hover:bg-brand-primary hover:text-black transition-all flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
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
                  <p className="text-foreground/50 text-sm">{t("successNote")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t("nameLabel")}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder={t("namePlaceholder")}
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

                  {/* Phone */}
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
                      errorText={t("phoneInvalid")}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {t("locationLabel")}
                    </label>
                    <LocationPicker onChange={setLocation} />
                    {submitted && location.address.trim().length < 2 && (
                      <p className="text-red-500 text-xs px-1 font-medium">
                        {t("locationRequired")}
                      </p>
                    )}
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
                    className="w-full bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black py-4 sm:py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-brand-primary/20"
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
