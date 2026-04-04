'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addCartItem, clearCartItems, fetchCartItems, updateCartItem } from '@/app/lib/apiClient';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  color: string;
  size: string;
  image: string;
  collection: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: number, size: string, color?: string) => void;
  updateQty: (id: number, size: string, delta: number, color?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const toNumber = (value: unknown, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const normalizeItem = (input: Partial<CartItem> | Record<string, unknown>): CartItem => {
    const source = input as Partial<CartItem> & Record<string, unknown>;
    const id = toNumber(source.id, 0);
    const qty = Math.max(1, Math.floor(toNumber(source.qty, 1)));
    const price = Math.max(0, toNumber(source.price, 0));
    return {
      id,
      name: String(source.name || 'Product'),
      price,
      qty,
      color: String(source.color || 'Default'),
      size: String(source.size || 'M'),
      image: String(source.image || ''),
      collection: String(source.collection || 'CART ITEM'),
    };
  };

  const mergeByKey = (input: CartItem[]) => {
    const merged = new Map<string, CartItem>();
    input.forEach((item) => {
      const safe = normalizeItem(item);
      const key = `${safe.id}|${safe.color}|${safe.size}|${safe.name}`;
      const prev = merged.get(key);
      if (prev) {
        merged.set(key, { ...prev, qty: prev.qty + safe.qty });
      } else {
        merged.set(key, safe);
      }
    });
    return Array.from(merged.values());
  };

  const mapBackendItem = (item: Record<string, unknown>): CartItem => ({
    id: toNumber(item.product_id ?? item.id, 0),
    name: String(item.title || 'Product'),
    price: toNumber(item.price, 0),
    qty: Math.max(1, Math.floor(toNumber(item.qty, 1))),
    color: String(item.color || 'Default'),
    size: String(item.size || 'M'),
    image: String(item.image || ''),
    collection: 'CART ITEM',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sr_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(mergeByKey(parsed.map((entry) => normalizeItem(entry as Record<string, unknown>))));
        }
      }
    } catch { }

    fetchCartItems()
      .then((serverItems) => {
        if (serverItems.length > 0) {
          setItems(mergeByKey(serverItems.map((i) => mapBackendItem(i as Record<string, unknown>))));
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    localStorage.setItem('sr_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'qty'>) => {
    const safeItem = normalizeItem(item as Record<string, unknown>);
    setItems(prev => {
      const existing = prev.find(i => i.id === safeItem.id && i.color === safeItem.color && i.size === safeItem.size && i.name === safeItem.name);
      if (existing) {
        return prev.map(i => i.id === safeItem.id && i.color === safeItem.color && i.size === safeItem.size && i.name === safeItem.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...safeItem, qty: 1 }];
    });

    if (safeItem.id > 0) {
      addCartItem({
        product_id: safeItem.id,
        color: safeItem.color,
        size: safeItem.size,
        qty: 1,
        price: safeItem.price,
        mrp: safeItem.price,
        title: safeItem.name,
        image: safeItem.image,
      }).catch(() => { });
    }
  };

  const removeItem = (id: number, size: string, color = '') => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size && (color ? i.color === color : true))));
    if (id > 0) updateCartItem(id, size, 0, color).catch(() => { });
  };

  const updateQty = (id: number, size: string, delta: number, color = '') => {
    setItems(prev => {
      const next = prev.map(i => i.id === id && i.size === size && (color ? i.color === color : true) ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
      const target = next.find(i => i.id === id && i.size === size && (color ? i.color === color : true));
      if (target && id > 0) updateCartItem(id, size, target.qty, target.color).catch(() => { });
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    clearCartItems().catch(() => { });
  };
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
