"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal = ({ isOpen, onClose }: AdminLoginModalProps) => {
  const t = useTranslations("AdminLogin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(t("invalidCredentials"));
        } else {
          setError(t("genericError"));
        }
        return;
      }

      window.location.href = data.redirectTo;
    } catch {
      setError(t("connectionError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={handleClose}
            aria-label={t("close")}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-md bg-brand-surface border border-brand-primary/20 rounded-3xl shadow-2xl p-8"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-foreground/5 hover:bg-brand-primary hover:text-black transition-all"
              aria-label={t("close")}
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary border border-brand-primary/30 rounded-full mb-3">
                {t("badge")}
              </span>
              <h3 className="text-2xl font-black text-foreground tracking-tight">
                {t("title")}
              </h3>
              <p className="text-foreground/60 text-sm mt-1">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <User size={16} className="text-brand-primary" />
                  {t("username")}
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 px-5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none font-medium"
                  placeholder={t("usernamePlaceholder")}
                  required
                  autoComplete="username"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <Lock size={16} className="text-brand-primary" />
                  {t("password")}
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-4 pl-5 pr-12 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none font-medium"
                    placeholder={t("passwordPlaceholder")}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-foreground/40 hover:text-brand-primary transition-colors"
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
