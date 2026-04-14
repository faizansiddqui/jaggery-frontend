'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createAdminBanner,
  deleteAdminBanner,
  fetchAdminBanners,
  type AdminBanner,
  updateAdminBanner,
} from '@/app/lib/apiClient';

type BannerFormState = {
  title: string;
  subtitle: string;
  targetUrl: string;
  imageUrl: string;
  order: string;
  isActive: boolean;
  imageFile: File | null;
};

const initialForm: BannerFormState = {
  title: '',
  subtitle: '',
  targetUrl: '',
  imageUrl: '',
  order: '0',
  isActive: true,
  imageFile: null,
};

export default function AdminBannersPage() {
  const [items, setItems] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<BannerFormState>(initialForm);

  const editingItem = useMemo(
    () => items.find((item) => item.id === editingId) || null,
    [items, editingId]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const rows = await fetchAdminBanners();
      setItems(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId('');
  };

  const validateForm = () => {
    if (!form.title.trim() || !form.subtitle.trim() || !form.targetUrl.trim()) {
      return 'Title, subtitle and target URL are required.';
    }
    if (!form.imageFile && !form.imageUrl.trim() && !editingItem?.imageUrl) {
      return 'Banner image is required.';
    }
    return '';
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        targetUrl: form.targetUrl.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
        order: Number(form.order || 0),
        isActive: form.isActive,
        image: form.imageFile || undefined,
      };

      if (editingId) {
        await updateAdminBanner(editingId, payload);
        setMessage('Banner updated.');
      } else {
        await createAdminBanner(payload);
        setMessage('Banner created.');
      }

      await load();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save banner.');
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (item: AdminBanner) => {
    setEditingId(item.id);
    setError('');
    setMessage('');
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      targetUrl: item.targetUrl || '',
      imageUrl: item.imageUrl || '',
      order: String(item.order ?? 0),
      isActive: item.isActive !== false,
      imageFile: null,
    });
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError('');
      setMessage('');
      await deleteAdminBanner(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
      setMessage('Banner deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete banner.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-brand text-4xl tracking-tight">Banners</h1>
        <p className="mt-2 text-on-surface-variant text-sm">Manage homepage hero banners.</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-outline/20 p-6 bg-surface">
        <input
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Title"
          className="border border-outline/30 px-3 py-2 bg-background"
          required
        />
        <input
          value={form.subtitle}
          onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
          placeholder="Subtitle"
          className="border border-outline/30 px-3 py-2 bg-background"
          required
        />
        <input
          value={form.targetUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, targetUrl: event.target.value }))}
          placeholder="Target URL (e.g. /shop)"
          className="border border-outline/30 px-3 py-2 bg-background"
          required
        />
        <input
          value={form.imageUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
          placeholder="Image URL (optional if file uploaded)"
          className="border border-outline/30 px-3 py-2 bg-background"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setForm((prev) => ({ ...prev, imageFile: event.target.files?.[0] || null }))}
          className="border border-outline/30 px-3 py-2 bg-background"
        />
        <input
          type="number"
          value={form.order}
          onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
          placeholder="Order"
          className="border border-outline/30 px-3 py-2 bg-background"
        />
        <label className="md:col-span-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
          />
          Active
        </label>
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-on-primary text-xs tracking-widest disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-outline/30 text-xs tracking-widest">
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-error text-sm">{error}</p> : null}
      {message ? <p className="text-secondary text-sm">{message}</p> : null}

      {loading ? (
        <div className="text-sm text-on-surface-variant">Loading banners...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-outline/20 p-4 bg-surface flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-52 h-24 bg-surface-container-high overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-headline text-sm tracking-widest">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
                <p className="text-[11px] text-on-surface-variant mt-1 truncate">{item.targetUrl}</p>
                <p className="text-[10px] tracking-widest opacity-50 mt-1">Order: {item.order} • {item.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => beginEdit(item)}
                  className="px-3 py-2 border border-outline/30 text-xs tracking-widest"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="px-3 py-2 border border-error text-error text-xs tracking-widest disabled:opacity-60"
                >
                  {deletingId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="text-sm text-on-surface-variant">No banners yet.</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
