'use client';

import type { UserAddress } from '@/app/lib/apiClient';

interface AddressCardProps {
    address: UserAddress;
    selected: boolean;
    onSelect: () => void;
    onEdit: () => void;
}

export default function AddressCard({ address, selected, onSelect, onEdit }: AddressCardProps) {
    return (
        <article
            className={`rounded-2xl border p-4 transition-colors ${selected ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface hover:border-primary/50'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-brand text-2xl uppercase leading-none">{address.FullName}</p>
                    <p className="mt-2 font-headline text-[10px] uppercase tracking-widest opacity-60">{address.addressType || 'Home'}</p>
                </div>
                {selected && <span className="material-symbols-outlined text-[#b90c1b]">check_circle</span>}
            </div>

            <p className="mt-3 font-headline text-[10px] uppercase tracking-widest opacity-70 leading-relaxed">
                {address.address}
                {address.address_line2 ? `, ${address.address_line2}` : ''}, {address.city}, {address.state}, {address.country} {address.pinCode}
            </p>
            <p className="mt-2 font-headline text-[10px] uppercase tracking-widest opacity-50">{address.phone1}</p>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={onSelect}
                    className={`px-3 py-2 rounded-full font-headline text-[10px] uppercase tracking-widest transition-colors ${selected ? 'bg-primary text-on-primary' : 'border border-outline-variant/30 hover:border-primary'}`}
                >
                    {selected ? 'Selected' : 'Use This'}
                </button>
                <button
                    onClick={onEdit}
                    className="px-3 py-2 rounded-full border border-outline-variant/30 font-headline text-[10px] uppercase tracking-widest hover:border-primary"
                >
                    Edit
                </button>
            </div>
        </article>
    );
}
