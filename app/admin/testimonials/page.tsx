'use client';

import { useEffect, useState } from 'react';
import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  fetchAdminTestimonials,
  updateAdminTestimonial,
  type AdminTestimonial,
} from '@/app/lib/apiClient';

type FormState = {
  quote: string;
  name: string;
  role: string;
  order: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  quote: '',
  name: '',
  role: '',
  order: '0',
  isActive: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const rows = await fetchAdminTestimonials();
      setItems(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const startEdit = (item: AdminTestimonial) => {
    setEditingId(item.id);
    setForm({
      quote: item.quote,
      name: item.name,
      role: item.role,
      order: String(item.order),
      isActive: item.isActive,
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const quote = form.quote.trim();
    const name = form.name.trim();
    if (!quote || !name) {
      setError('Quote and name are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const payload = {
        quote,
        name,
        role: form.role.trim(),
        order: Number(form.order || 0),
        isActive: form.isActive,
      };
      if (editingId) {
        await updateAdminTestimonial(editingId, payload);
        setMessage('Testimonial updated.');
      } else {
        await createAdminTestimonial(payload);
        setMessage('Testimonial created.');
      }
      await load();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this testimonial?');
    if (!ok) return;
    try {
      setDeletingId(id);
      setError('');
      await deleteAdminTestimonial(id);
      setMessage('Testimonial deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl text-slate-100">
      <header>
        <p className="font-headline text-[10px] tracking-[0.3em] text-primary">Content</p>
        <h1 className="font-brand text-4xl md:text-5xl tracking-tight mt-2">Testimonials</h1>
        <p className="text-white/50 text-sm mt-2">
          Manage homepage testimonial carousel. Lower order numbers appear first. Only active items show on the site.
        </p>
      </header>

      {error ? (
        <div className="border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">{error}</div>
      ) : null}
      {message ? (
        <div className="border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-800">{message}</div>
      ) : null}

      <form onSubmit={onSubmit} className="border border-outline/20 bg-[#0a0a0b] p-6 space-y-4">
        <h2 className="font-headline text-xs tracking-widest">{editingId ? 'Edit testimonial' : 'Add testimonial'}</h2>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest opacity-60">Quote</span>
          <textarea
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            rows={4}
            className="bg-[#0a0a0b] border border-outline/30 rounded-lg px-3 py-2 text-sm"
            required
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest opacity-60">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-[#0a0a0b] border border-outline/30 rounded-lg px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest opacity-60">Role / Title</span>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="bg-[#0a0a0b] border border-outline/30 rounded-lg px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest opacity-60">Sort order</span>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              className="bg-[#0a0a0b] border border-outline/30 rounded-lg px-3 py-2 text-sm w-28"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            <span className="text-xs tracking-widest">Active (visible on homepage)</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-on-primary px-6 py-2 rounded-full text-xs font-bold tracking-widest disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="border border-outline/30 px-6 py-2 rounded-full text-xs tracking-widest">
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <section className="border border-outline/20 bg-[#0a0a0b] p-6">
        <h2 className="font-headline text-xs tracking-widest mb-4">All testimonials</h2>
        {loading ? (
          <p className="text-sm opacity-60">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm opacity-60">No testimonials yet. Add one above.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className={`border border-outline/15 rounded-xl p-4 flex flex-col gap-2 ${editingId === item.id ? 'ring-2 ring-primary/40' : ''}`}
              >
                <p className="text-sm italic text-white/70 line-clamp-3">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex flex-wrap justify-between gap-2 items-start">
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs tracking-widest opacity-60">{item.role || '—'}</p>
                    <p className="text-[10px] tracking-widest mt-1">
                      Order {item.order} · {item.isActive ? 'Active' : 'Hidden'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-xs tracking-widest border border-outline/30 px-3 py-1 rounded-full hover:border-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs tracking-widest border border-error/40 text-error px-3 py-1 rounded-full hover:bg-error/10 disabled:opacity-50"
                    >
                      {deletingId === item.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
