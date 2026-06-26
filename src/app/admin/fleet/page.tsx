'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  UploadCloud,
  Loader2,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Crane {
  id: string;
  modelName: string;
  brand?: string | null;
  capacity: number;
  boomLength: number;
  auxBoomLength?: number | null;
  pricePerMonth?: number | null;
  discountPercent: number;
  available: boolean;
  displayOrder: number;
  description: string;
  images: string[];
}

interface CraneForm {
  modelName: string;
  brand: string;
  capacity: string;
  boomLength: string;
  auxBoomLength: string;
  pricePerMonth: string;
  discountPercent: string;
  description: string;
  available: boolean;
  images: string[];
}

const emptyForm: CraneForm = {
  modelName: '',
  brand: '',
  capacity: '',
  boomLength: '',
  auxBoomLength: '',
  pricePerMonth: '',
  discountPercent: '0',
  description: '',
  available: true,
  images: [],
};

const priceFmt = new Intl.NumberFormat('ru-RU');

export default function FleetPage() {
  const t = useTranslations('Admin.fleet');
  const [cranes, setCranes] = useState<Crane[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<CraneForm>(emptyForm);
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCranes = useCallback(async () => {
    try {
      const res = await axios.get<Crane[]>('/api/admin/cranes');
      setCranes(res.data);
    } catch {
      toast.error(t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCranes();
  }, [fetchCranes]);

  // Purge the public fleet cache so edits show on the site immediately.
  const revalidatePublic = () =>
    fetch("/revalidate", { method: "POST" }).catch(() => {});

  const set = <K extends keyof CraneForm>(key: K, value: CraneForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (crane: Crane) => {
    setEditingId(crane.id);
    setForm({
      modelName: crane.modelName,
      brand: crane.brand ?? '',
      capacity: String(crane.capacity ?? ''),
      boomLength: String(crane.boomLength ?? ''),
      auxBoomLength: crane.auxBoomLength != null ? String(crane.auxBoomLength) : '',
      pricePerMonth: crane.pricePerMonth != null ? String(crane.pricePerMonth) : '',
      discountPercent: String(crane.discountPercent ?? 0),
      description: crane.description ?? '',
      available: crane.available,
      images: crane.images ?? [],
    });
    setModalOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post<{ url: string }>('/api/admin/upload', fd);
      set('images', [res.data.url]);
      toast.success(t('toast.uploaded'));
    } catch {
      toast.error(t('toast.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      modelName: form.modelName,
      brand: form.brand || null,
      capacity: form.capacity,
      boomLength: form.boomLength,
      auxBoomLength: form.auxBoomLength,
      pricePerMonth: form.pricePerMonth,
      discountPercent: form.discountPercent,
      description: form.description,
      available: form.available,
      images: form.images,
    };
    try {
      if (editingId) {
        await axios.put(`/api/admin/cranes/${editingId}`, payload);
        toast.success(t('toast.updated'));
      } else {
        await axios.post('/api/admin/cranes', payload);
        toast.success(t('toast.added'));
      }
      setModalOpen(false);
      setEditingId(null);
      fetchCranes();
      revalidatePublic();
    } catch {
      toast.error(t('toast.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (crane: Crane) => {
    // Optimistic flip.
    setCranes((list) =>
      list.map((c) =>
        c.id === crane.id ? { ...c, available: !c.available } : c
      )
    );
    try {
      await axios.put(`/api/admin/cranes/${crane.id}`, {
        available: !crane.available,
      });
      toast.success(t('toast.statusUpdated'));
      revalidatePublic();
    } catch {
      toast.error(t('toast.saveError'));
      fetchCranes();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await axios.delete(`/api/admin/cranes/${id}`);
      toast.success(t('toast.deleted'));
      fetchCranes();
      revalidatePublic();
    } catch {
      toast.error(t('toast.deleteError'));
    }
  };

  const filtered = cranes.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.modelName.toLowerCase().includes(q) ||
      (c.brand ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-sm text-foreground/50 mt-1">
            {cranes.length} · {cranes.filter((c) => c.available).length}{' '}
            {t('available').toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="bg-brand-surface border border-brand-primary/15 rounded-xl px-4 py-2.5 text-sm focus:border-brand-primary outline-none w-40 sm:w-56"
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-primary text-black px-5 py-2.5 rounded-xl font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <Plus size={18} /> {t('add')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24 text-foreground/40">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((crane) => {
            const hasDiscount = crane.discountPercent > 0;
            return (
              <div key={crane.id} className="premium-card !p-0 overflow-hidden flex flex-col">
                <div className="relative h-44 bg-brand-surface">
                  {crane.images?.[0] ? (
                    <Image
                      src={crane.images[0]}
                      alt={crane.modelName}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className={`object-cover ${crane.available ? '' : 'grayscale opacity-50'}`}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-foreground/20 text-xs">
                      {t('image')}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-brand-primary text-black px-2.5 py-1 rounded-full text-xs font-black">
                      {crane.capacity}t
                    </span>
                    {hasDiscount && (
                      <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-black">
                        -{crane.discountPercent}%
                      </span>
                    )}
                  </div>
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      crane.available
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-foreground/10 text-foreground/40'
                    }`}
                  >
                    {crane.available ? t('available') : t('hidden')}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-lg leading-tight">{crane.modelName}</h3>
                      {crane.brand && (
                        <span className="text-xs text-foreground/40">{crane.brand}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 mb-4">
                    {crane.pricePerMonth != null ? (
                      <div className="flex items-baseline gap-2">
                        {hasDiscount && (
                          <span className="text-xs text-foreground/40 line-through">
                            {priceFmt.format(crane.pricePerMonth)}
                          </span>
                        )}
                        <span className="text-brand-primary font-black">
                          {priceFmt.format(
                            Math.round(
                              crane.pricePerMonth * (1 - crane.discountPercent / 100)
                            )
                          )}
                        </span>
                        <span className="text-[10px] text-foreground/40 uppercase">UZS</span>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground/40">—</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-brand-primary/10">
                    <button
                      onClick={() => toggleAvailable(crane)}
                      title={crane.available ? t('hide') : t('show')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-brand-surface hover:bg-brand-primary/10 text-foreground/70 transition-colors"
                    >
                      {crane.available ? <EyeOff size={15} /> : <Eye size={15} />}
                      {crane.available ? t('hide') : t('show')}
                    </button>
                    <button
                      onClick={() => openEdit(crane)}
                      className="p-2 rounded-lg bg-brand-surface hover:bg-brand-primary hover:text-black transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(crane.id)}
                      className="p-2 rounded-lg bg-brand-surface hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-foreground/40">
              {t('noCranes')}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-primary/20 rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-5 border-b border-brand-primary/10">
              <h2 className="text-xl font-black">{editingId ? t('edit') : t('add')}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-brand-primary/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image uploader */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  {t('image')}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-brand-primary/20 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-brand-primary/50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                  {form.images[0] ? (
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={form.images[0]} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                      {uploading ? (
                        <Loader2 className="animate-spin text-brand-primary" size={20} />
                      ) : (
                        <UploadCloud className="text-foreground/30" size={22} />
                      )}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-semibold">
                      {uploading ? t('uploading') : t('dropImage')}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">{t('imageHint')}</p>
                  </div>
                </div>
              </div>

              <Field label={t('model')}>
                <input
                  required
                  value={form.modelName}
                  onChange={(e) => set('modelName', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('brand')}>
                <input
                  value={form.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('capacity')}>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={form.capacity}
                  onChange={(e) => set('capacity', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('boom')}>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={form.boomLength}
                  onChange={(e) => set('boomLength', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('auxBoom')}>
                <input
                  type="number"
                  step="0.1"
                  value={form.auxBoomLength}
                  onChange={(e) => set('auxBoomLength', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('pricePerMonth')}>
                <input
                  type="number"
                  value={form.pricePerMonth}
                  onChange={(e) => set('pricePerMonth', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t('discount')}>
                <div className="relative">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary" />
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={form.discountPercent}
                    onChange={(e) => set('discountPercent', e.target.value)}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>
              <Field label={t('availableCol')}>
                <button
                  type="button"
                  onClick={() => set('available', !form.available)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-colors ${
                    form.available
                      ? 'border-green-500/40 bg-green-500/10 text-green-400'
                      : 'border-brand-primary/15 bg-background text-foreground/50'
                  }`}
                >
                  <span className="text-sm font-bold">
                    {form.available ? t('available') : t('hidden')}
                  </span>
                  <span
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      form.available ? 'bg-green-500' : 'bg-foreground/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                        form.available ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </span>
                </button>
              </Field>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  {t('description')}
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-primary/15 font-bold text-sm hover:bg-brand-primary/5"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary text-black font-black text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full bg-background border border-brand-primary/15 rounded-xl px-4 py-2.5 text-sm focus:border-brand-primary outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
