'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
}

interface SponsorFormValues {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  displayOrder: string;
}

export default function SponsorsPage() {
  const t = useTranslations('Admin.sponsors');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } =
    useForm<SponsorFormValues>();

  const fetchSponsors = useCallback(async () => {
    try {
      const res = await axios.get<Sponsor[]>('/api/admin/sponsors');
      setSponsors(res.data);
    } catch {
      toast.error(t('toast.loadError'));
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await axios.get<Sponsor[]>('/api/admin/sponsors');
        if (active) setSponsors(res.data);
      } catch {
        if (active) toast.error(t('toast.loadError'));
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const onSubmit = async (data: SponsorFormValues) => {
    try {
      if (editingId) {
        await axios.put(`/api/admin/sponsors/${editingId}`, data);
        toast.success(t('toast.updated'));
      } else {
        await axios.post('/api/admin/sponsors', data);
        toast.success(t('toast.added'));
      }
      setModalOpen(false);
      reset();
      setEditingId(null);
      fetchSponsors();
    } catch {
      toast.error(t('toast.saveError'));
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setValue('name', sponsor.name);
    setValue('logoUrl', sponsor.logoUrl);
    setValue('websiteUrl', sponsor.websiteUrl ?? '');
    setValue('displayOrder', String(sponsor.displayOrder));
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('deleteConfirm'))) {
      try {
        await axios.delete(`/api/admin/sponsors/${id}`);
        toast.success(t('toast.deleted'));
        fetchSponsors();
      } catch {
        toast.error(t('toast.deleteError'));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
        <button
          onClick={() => { reset(); setEditingId(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} /> {t('add')}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo & Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover bg-gray-100"
                  />
                  <span className="font-medium text-gray-900">{sponsor.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {sponsor.websiteUrl ? <a href={sponsor.websiteUrl} target="_blank" className="text-indigo-600 hover:underline">{sponsor.websiteUrl}</a> : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sponsor.displayOrder}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(sponsor)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(sponsor.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No sponsors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{editingId ? t('edit') : t('add')}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input {...register('name', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                <input {...register('logoUrl', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <input {...register('websiteUrl')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input type="number" {...register('displayOrder')} defaultValue={0} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
