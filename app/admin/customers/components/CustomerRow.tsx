'use client';

import type { AdminCustomer } from '@/app/lib/apiClient';

type CustomerRowProps = {
    customer: AdminCustomer;
    index: number;
    busy: boolean;
    lifetimeValue: string;
    statusClass: string;
    onOpenActivity: (email: string) => void;
    onToggleStatus: (email: string, currentlyBlocked: boolean) => void;
};

export default function CustomerRow({
    customer,
    index,
    busy,
    lifetimeValue,
    statusClass,
    onOpenActivity,
    onToggleStatus,
}: CustomerRowProps) {
    const normalizedStatus = String(customer.status || '').toUpperCase() || 'NEW';
    const isBlocked = normalizedStatus === 'BLOCKED';

    return (
        <div className="grid grid-cols-12 gap-8 p-8 border-b border-[#ffffff]/5 last:border-none hover:bg-[#ffffff]/2 transition-colors items-center">
            <div className="col-span-1 text-black/80 font-headline text-[10px] opacity-40">{String(index + 1).padStart(2, '0')}</div>
            <div className="col-span-4 flex items-center gap-6">
                <div className="w-12 h-12 bg-black/10 text-black/80 flex items-center justify-center font-brand text-xl">
                    {String(customer.name || '').charAt(0)}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-brand text-black t text-2xl tracking-widest">{customer.name}</span>
                    <span className="font-headline text-black/80 text-[9px] tracking-widest opacity-40">{customer.email}</span>
                </div>
            </div>
            <div className="col-span-2 text-black/90 font-brand text-3xl">{customer.ordersCount}</div>
            <div className="col-span-2 font-brand text-3xl text-primary">{lifetimeValue}</div>
            <div className="col-span-1 flex justify-end">
                <span className={`px-4 py-1 font-headline text-[8px] tracking-widest font-black ${statusClass}`}>{normalizedStatus}</span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
                <button
                    onClick={() => onOpenActivity(customer.email)}
                    className="px-3 py-2 font-headline text-[9px] text-black/80 tracking-widest border border-[#ffffff]/15 border-secondary"
                >
                    Activity
                </button>
                <button
                    disabled={busy}
                    onClick={() => onToggleStatus(customer.email, isBlocked)}
                    className={`px-3 py-2 font-headline text-[9px] tracking-widest border disabled:opacity-40 ${isBlocked
                        ? 'border-green-500/40 text-green-300 hover:border-green-300'
                        : 'border-red-500/40 text-red-300 hover:border-red-300'
                        }`}
                >
                    {busy ? '...' : isBlocked ? 'Unblock' : 'Block'}
                </button>
            </div>
        </div>
    );
}
