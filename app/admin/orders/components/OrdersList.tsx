'use client';

import React, { useState } from 'react';
import { 
  Box, 
  ChevronRight, 
  ExternalLink, 
  Layers, 
  Tag, 
  Clock, 
  User, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import {
  type AdminOrder,
  formatDate,
  formatStatusLabel,
  getCustomerName,
  getOrderKey,
  getOrderTotal,
  normalizeStatus,
} from '../orders.utils';

type Props = {
  orders: AdminOrder[];
  currency: string;
  onOpen: (order: AdminOrder) => void;
};

export default function OrdersList({ orders, currency, onOpen }: Props) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  function truncateCustomer(order: AdminOrder) {
    const email = String(order.user_email || '').trim();
    return email || 'GUEST_USER';
  }

  if (orders.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50">
        <Box className="text-slate-200 mb-4" size={48} />
        <p className="font-black text-[10px] tracking-[0.4em] uppercase text-slate-400">
          No Orders Detected
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        {currentOrders.map((order) => {
          const orderKey = getOrderKey(order) || `${order.user_email || 'guest'}-${order.createdAt || ''}`;
          const status = normalizeStatus(order.status || 'pending');
          const total = getOrderTotal(order);

          const isCompleted = status === 'completed' || status === 'delivered' || status === 'confirmed';
          const isPending = status === 'pending' || status === 'processing';

          return (
            <article
              key={orderKey}
              onClick={() => onOpen(order)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-red-600/30 hover:shadow-xl hover:shadow-slate-200/50 md:p-6"
            >
              <div className="relative z-10 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-center">
                
                {/* Column 1: Identity */}
                <div className="space-y-3 lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 group-hover:bg-red-50 group-hover:text-red-600 group-hover:ring-red-100 transition-all">
                      <User size={20} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        ID: {order.order_id || order.order_code || 'UNASSIGNED'}
                      </span>
                      <h3 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase transition-colors">
                        {getCustomerName(order)}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      <Clock size={12} className="text-red-600" />
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      <CreditCard size={12} className="text-red-600" />
                      {String(order.payment_method || 'DIGITAL')}
                    </div>
                  </div>
                </div>

                {/* Column 2: Details Grid */}
                <div className="grid grid-cols-2 gap-2 lg:col-span-3">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Assets</p>
                     <div className="flex items-center gap-2">
                       <Layers size={14} className="text-slate-900" />
                       <span className="text-sm font-black text-slate-900">{order.items.length} Units</span>
                     </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment</p>
                     <div className="flex items-center gap-2">
                       <Tag size={14} className="text-slate-900" />
                       <span className="text-[10px] font-black uppercase text-slate-600">{String(order.payment_status || 'UNPAID')}</span>
                     </div>
                  </div>
                </div>

                {/* Column 3: Status */}
                <div className="lg:col-span-2 flex items-center justify-start lg:justify-center">
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 ring-1 ${
                    isCompleted ? 'bg-emerald-50 ring-emerald-100 text-emerald-600' : 
                    isPending ? 'bg-amber-50 ring-amber-100 text-amber-600' : 
                    'bg-rose-50 ring-rose-100 text-rose-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {formatStatusLabel(status)}
                    </span>
                  </div>
                </div>

                {/* Column 4: Total & Action */}
                <div className="flex items-center justify-between lg:col-span-3 lg:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-red-600">Amount</p>
                    <p className="text-2xl font-black italic tracking-tighter text-slate-900">
                      {currency}{total.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(order);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-red-600 hover:-translate-y-1 shadow-lg shadow-slate-200"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                 <div className="text-[9px] font-medium tracking-widest text-slate-400 uppercase italic">
                  Trace: {truncateCustomer(order)}
                </div>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </div>
            </article>
          );
        })}
      </div>

      {/* Modern Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Showing <span className="text-slate-900">{indexOfFirstItem + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLastItem, orders.length)}</span> of <span className="text-slate-900">{orders.length}</span> Records
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-10 w-10 rounded-xl text-[10px] font-black transition-all ${
                    currentPage === i + 1 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}