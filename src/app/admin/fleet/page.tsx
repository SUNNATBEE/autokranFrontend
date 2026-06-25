'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FleetPage() {
  const t = useTranslations('Admin.fleet');
  const [cranes, setCranes] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchCranes = async () => {
    try {
      const res = await axios.get('/api/admin/cranes');
      setCranes(res.data);
    } catch (err) {
      toast.error(t('toast.loadError'));
    }
  };

  useEffect(() => {
    fetchCranes();
  }, []);

  const onSubmit = async (data: any) => {
    // Convert comma-separated images string to array if necessary, here we just assume data.images is text
    const payload = {
      ...data,
      images: data.images ? data.images.split(',').map((u: string) => u.trim()) : [],
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
      reset();
      setEditingId(null);
      fetchCranes();
    } catch (err) {
      toast.error(t('toast.saveError'));
    }
  };

  const handleEdit = (crane: any) => {
    setEditingId(crane.id);
    setValue('modelName', crane.modelName);
    setValue('capacity', crane.capacity);
    setValue('boomLength', crane.boomLength);
    setValue('price', crane.price);
    setValue('description', crane.description);
    setValue('images', crane.images?.join(', '));
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('deleteConfirm'))) {
      try {
        await axios.delete(`/api/admin/cranes/${id}`);
        toast.success(t('toast.deleted'));
        fetchCranes();
      } catch (err) {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('model')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('capacity')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('boom')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('price')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cranes.map((crane) => (
              <tr key={crane.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{crane.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{crane.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{crane.boomLength}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{crane.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(crane)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(crane.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {cranes.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No cranes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{editingId ? t('edit') : t('add')}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Model Name</label>
                <input {...register('modelName', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input {...register('price', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Lifting Capacity (tons)</label>
                <input type="number" step="0.1" {...register('capacity', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Boom Length (meters)</label>
                <input type="number" step="0.1" {...register('boomLength', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Images (comma separated URLs)</label>
                <input {...register('images')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://..., https://..." />
              </div>
              <div className="col-span-2 mt-5 sm:flex sm:flex-row-reverse">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
