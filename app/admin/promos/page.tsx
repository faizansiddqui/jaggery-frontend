'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createAdminPromo,
  deleteAdminPromo,
  fetchAdminProductsLite,
  fetchAdminPromos,
  type AdminProductLite,
  type PromoCodeConfig,
  updateAdminPromo,
} from '@/app/lib/apiClient';

type PromoFormState = {
  code: string;
  description: string;
  scope: 'CART' | 'PRODUCT';
  discountType: 'PERCENT' | 'FLAT';
  discountValue: string;
  minCartValue: string;
  maxDiscount: string;
  requiredProductId: string;
  requiredQty: string;
  usageLimit: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
};

const emptyForm: PromoFormState = {
  code: '',
  description: '',
  scope: 'CART',
  discountType: 'FLAT',
  discountValue: '',
  minCartValue: '0',
  maxDiscount: '0',
  requiredProductId: '',
  requiredQty: '1',
  usageLimit: '0',
  startAt: '',
  endAt: '',
  isActive: true,
};

const toDatetimeLocal = (value: string | null) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().slice(0, 16);
};

const toISOFromInput = (value: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const countWords = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export default function AdminPromosPage() {
  const [rows, setRows] = useState<PromoCodeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState<PromoFormState>(emptyForm);
  const [products, setProducts] = useState<AdminProductLite[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  const descriptionWords = useMemo(() => countWords(form.description), [form.description]);

  const loadRows = async () => {
    setLoading(true);
    setError('');
    try {
      const promos = await fetchAdminPromos();
      setRows(promos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load promos');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const items = await fetchAdminProductsLite();
      setProducts(items);
    } catch (err) {
      setProductsError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingId('');
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const wordCount = countWords(form.description);
    if (wordCount < 10 || wordCount > 20) {
      setError(`Description must be 10-20 words. Current: ${wordCount}`);
      return;
    }
    if (!form.code.trim()) {
      setError('Promo code is required');
      return;
    }
    if (!Number(form.discountValue) || Number(form.discountValue) <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }
    if (form.scope === 'PRODUCT' && (!Number(form.requiredProductId) || Number(form.requiredQty) <= 0)) {
      setError('Product scope requires valid product id and quantity');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
        scope: form.scope,
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        minCartValue: Number(form.minCartValue || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        requiredProductId: form.scope === 'PRODUCT' ? Number(form.requiredProductId || 0) : 0,
        requiredQty: form.scope === 'PRODUCT' ? Number(form.requiredQty || 1) : 1,
        usageLimit: Number(form.usageLimit || 0),
        startAt: toISOFromInput(form.startAt),
        endAt: toISOFromInput(form.endAt),
        isActive: form.isActive,
        updatedBy: 'admin',
      };

      if (editingId) {
        await updateAdminPromo(editingId, payload);
        setMessage('Promo updated');
      } else {
        await createAdminPromo({ ...payload, createdBy: 'admin' });
        setMessage('Promo created');
      }
      await loadRows();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save promo');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (promo: PromoCodeConfig) => {
    setEditingId(promo.id);
    setError('');
    setMessage('');
    setForm({
      code: promo.code,
      description: promo.description,
      scope: promo.scope,
      discountType: promo.discountType,
      discountValue: String(promo.discountValue || ''),
      minCartValue: String(promo.minCartValue || 0),
      maxDiscount: String(promo.maxDiscount || 0),
      requiredProductId: promo.requiredProductId ? String(promo.requiredProductId) : '',
      requiredQty: String(promo.requiredQty || 1),
      usageLimit: String(promo.usageLimit || 0),
      startAt: toDatetimeLocal(promo.startAt),
      endAt: toDatetimeLocal(promo.endAt),
      isActive: promo.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promo code?')) return;
    setError('');
    setMessage('');
    try {
      await deleteAdminPromo(id);
      setMessage('Promo deleted');
      await loadRows();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete promo');
    }
  };

  return (
    <section className="space-y-8 text-slate-100">
      <header className="border-b border-[#ffffff]/10 pb-6">
        <h1 className="font-brand text-5xl tracking-tight">Promo Codes</h1>
        <p className="font-headline text-[10px] tracking-[0.25em] opacity-60 mt-2">
          Cart and product-triggered discount campaigns
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-[#ffffff]/5 border border-[#ffffff]/10 p-6 space-y-4">
          <h2 className="font-brand text-2xl tracking-widest">
            {editingId ? 'Edit Promo' : 'Create Promo'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Code</span>
              <input
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs tracking-widest"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Scope</span>
              <select
                value={form.scope}
                onChange={(e) => setForm((prev) => ({ ...prev, scope: e.target.value as PromoFormState['scope'] }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs tracking-widest"
              >
                <option value="CART">CART</option>
                <option value="PRODUCT">PRODUCT</option>
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">
                Description ({descriptionWords} words)
              </span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs tracking-wide"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Discount Type</span>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, discountType: e.target.value as PromoFormState['discountType'] }))
                }
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs tracking-widest"
              >
                <option value="FLAT">FLAT</option>
                <option value="PERCENT">PERCENT</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Discount Value</span>
              <input
                type="number"
                min={0}
                value={form.discountValue}
                onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Min Cart Value</span>
              <input
                type="number"
                min={0}
                value={form.minCartValue}
                onChange={(e) => setForm((prev) => ({ ...prev, minCartValue: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Max Discount</span>
              <input
                type="number"
                min={0}
                value={form.maxDiscount}
                onChange={(e) => setForm((prev) => ({ ...prev, maxDiscount: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
            {form.scope === 'PRODUCT' && (
              <>
                <label className="space-y-2 md:col-span-2">
                  <span className="font-headline text-[10px] tracking-widest opacity-70">Product</span>
                  <div className="space-y-2">
                    <select
                      value={form.requiredProductId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, requiredProductId: e.target.value }))
                      }
                      className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs tracking-[0.4em]"
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => {
                        const id = Number(product.product_id || 0);
                        if (!id) return null;
                        const labelParts = [
                          `#${id}`,
                          product.name || product.collection,
                          product.category,
                        ].filter(Boolean);
                        const label = labelParts.length ? labelParts.join(' · ') : 'Unnamed product';
                        return (
                          <option key={id} value={String(id)}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                    {productsLoading && (
                      <p className="font-headline text-[8px] tracking-widest opacity-50">
                        Loading products…
                      </p>
                    )}
                    {productsError && (
                      <p className="font-headline text-[8px] tracking-widest text-[#ff7878]">
                        {productsError}
                      </p>
                    )}
                    {!productsLoading && !productsError && products.length === 0 && (
                      <p className="font-headline text-[8px] tracking-widest opacity-40">
                        No products synced yet
                      </p>
                    )}
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="font-headline text-[10px] tracking-widest opacity-70">Required Qty</span>
                  <input
                    type="number"
                    min={1}
                    value={form.requiredQty}
                    onChange={(e) => setForm((prev) => ({ ...prev, requiredQty: e.target.value }))}
                    className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
                  />
                </label>
              </>
            )}
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Usage Limit</span>
              <input
                type="number"
                min={0}
                value={form.usageLimit}
                onChange={(e) => setForm((prev) => ({ ...prev, usageLimit: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">Start At</span>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm((prev) => ({ ...prev, startAt: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
            <label className="space-y-2">
              <span className="font-headline text-[10px] tracking-widest opacity-70">End At</span>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm((prev) => ({ ...prev, endAt: e.target.value }))}
                className="w-full bg-[#1c1b1b] border border-[#ffffff]/20 px-3 py-2 font-headline text-xs"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 font-headline text-[10px] tracking-widest">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Active
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 bg-[#b90c1b] text-white font-headline text-[10px] tracking-widest disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Promo' : 'Create Promo'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 bg-[#ffffff]/10 font-headline text-[10px] tracking-widest"
              >
                Cancel Edit
              </button>
            )}
          </div>
          {error && <p className="font-headline text-[10px] tracking-widest text-[#ff7878]">{error}</p>}
          {message && <p className="font-headline text-[10px] tracking-widest text-[#7fffa0]">{message}</p>}
        </form>

        <div className="bg-[#ffffff]/5 border border-[#ffffff]/10 p-6">
          <h2 className="font-brand text-2xl tracking-widest mb-4">Existing Promos</h2>
          {loading ? (
            <p className="font-headline text-[10px] tracking-widest opacity-60">Loading promos...</p>
          ) : rows.length === 0 ? (
            <p className="font-headline text-[10px] tracking-widest opacity-60">No promos found.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((promo) => (
                <div key={promo.id} className="border border-[#ffffff]/10 p-4 bg-[#1c1b1b]/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-brand text-xl">{promo.code}</p>
                      <p className="font-headline text-[10px] tracking-widest opacity-60 mt-1">
                        {promo.scope} / {promo.discountType} / USED {promo.usedCount}
                        {promo.usageLimit > 0 ? ` OF ${promo.usageLimit}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-headline text-[10px] tracking-widest px-2 py-1 ${promo.isActive ? 'bg-green-700/30 text-green-200' : 'bg-[#ffffff]/10 opacity-70'
                          }`}
                      >
                        {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <button
                        onClick={() => startEdit(promo)}
                        className="font-headline text-[10px] tracking-widest underline underline-offset-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="font-headline text-[10px] tracking-widest text-[#ff7878]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="font-headline text-[10px] tracking-widest opacity-80 mt-3">{promo.description}</p>
                  <p className="font-headline text-[10px] tracking-widest opacity-50 mt-2">
                    Discount: {promo.discountType === 'PERCENT' ? `${promo.discountValue}%` : promo.discountValue}
                    {' | '}
                    Min Cart: {promo.minCartValue}
                    {' | '}
                    Max Discount: {promo.maxDiscount}
                    {promo.scope === 'PRODUCT'
                      ? ` | Product ID ${promo.requiredProductId} Qty ${promo.requiredQty}`
                      : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
