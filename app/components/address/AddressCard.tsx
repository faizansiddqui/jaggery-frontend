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
            className={`border p-4 transition-colors ${selected ? 'border-[#b90c1b] bg-[#fff7f7]' : 'border-[#1c1b1b]/10 bg-white'}`}
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
                    className={`px-3 py-2 font-headline text-[10px] uppercase tracking-widest transition-colors ${selected ? 'bg-[#b90c1b] text-white' : 'border border-[#1c1b1b]/20 hover:border-[#1c1b1b]'}`}
                >
                    {selected ? 'Selected' : 'Use This'}
                </button>
                <button
                    onClick={onEdit}
                    className="px-3 py-2 border border-[#1c1b1b]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]"
                >
                    Edit
                </button>
            </div>
        </article>
    );
}
