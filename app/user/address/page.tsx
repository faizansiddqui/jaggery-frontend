'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';
import AddressCard from '@/app/components/address/AddressCard';
import AddressForm from '@/app/components/address/AddressForm';
import {
    createUserAddress,
    fetchUserAddresses,
    type UserAddress,
    type UserAddressInput,
    updateUserAddress,
} from '@/app/lib/apiClient';
import { useRequireUserSession } from '@/app/lib/guards';

const emptyAddress: UserAddressInput = {
    FullName: '',
    phone1: '',
    phone2: '',
    country: 'India',
    state: '',
    city: '',
    district: '',
    pinCode: '',
    address: '',
    address_line2: '',
    addressType: 'Home',
};

const toForm = (row: UserAddress): UserAddressInput => ({
    FullName: row.FullName,
    phone1: row.phone1,
    phone2: row.phone2,
    country: row.country,
    state: row.state,
    city: row.city,
    district: row.district,
    pinCode: row.pinCode,
    address: row.address,
    address_line2: row.address_line2,
    addressType: row.addressType || 'Home',
});

export default function UserAddressPage() {
    const { ready, authenticated } = useRequireUserSession('/user/auth');
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [formValue, setFormValue] = useState<UserAddressInput>(emptyAddress);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authenticated) return;
        fetchUserAddresses()
            .then((rows) => {
                setAddresses(rows);
                if (rows[0]) setSelectedAddressId(rows[0].address_id);
            })
            .catch(() => setMessage('Could not load addresses'));
    }, [authenticated]);

    const selectedAddress = useMemo(
        () => addresses.find((row) => row.address_id === selectedAddressId) || null,
        [addresses, selectedAddressId]
    );

    const saveAddress = async () => {
        if (!formValue.FullName || !formValue.phone1 || !formValue.address || !formValue.city || !formValue.pinCode) {
            setMessage('Please fill required fields');
            return;
        }

        try {
            setBusy(true);
            const saved = editingId
                ? await updateUserAddress(editingId, formValue)
                : await createUserAddress(formValue);
            setAddresses((prev) => {
                const exists = prev.some((item) => item.address_id === saved.address_id);
                return exists ? prev.map((item) => (item.address_id === saved.address_id ? saved : item)) : [saved, ...prev];
            });
            setSelectedAddressId(saved.address_id);
            setEditingId(null);
            setShowForm(false);
            setFormValue(emptyAddress);
            setMessage(editingId ? 'Address updated' : 'Address added');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Could not save address');
        } finally {
            setBusy(false);
        }
    };

    if (!ready || !authenticated) return <main className="min-h-screen bg-[#fcf8f8]" />;

    return (
        <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
            <Comp1 />
            <div className="pt-28 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto">
                <header className="mb-12 border-b-4 border-[#1c1b1b] pb-8 flex flex-wrap justify-between gap-4 items-end">
                    <div>
                        <span className="font-headline text-[10px] uppercase tracking-[0.35em] text-[#b90c1b] font-black">Account</span>
                        <h1 className="font-brand text-5xl md:text-7xl uppercase tracking-tighter mt-2">Address Book</h1>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/user/profile" className="border border-[#1c1b1b]/20 px-4 py-2 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]">
                            Back Profile
                        </Link>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormValue(emptyAddress);
                                setShowForm(true);
                            }}
                            className="bg-[#1c1b1b] text-white px-4 py-2 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b]"
                        >
                            Add Address
                        </button>
                    </div>
                </header>

                {message && <p className="mb-4 font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{message}</p>}

                {showForm && (
                    <div className="mb-6">
                        <AddressForm
                            value={formValue}
                            busy={busy}
                            error={message.includes('could') ? message : ''}
                            submitLabel={editingId ? 'Update Address' : 'Save Address'}
                            onChange={setFormValue}
                            onSubmit={saveAddress}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormValue(emptyAddress);
                            }}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.length === 0 ? (
                            <div className="md:col-span-2 bg-white border border-[#1c1b1b]/10 p-8">
                                <p className="font-headline text-xs uppercase tracking-widest opacity-50">No saved addresses yet.</p>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <AddressCard
                                    key={address.address_id}
                                    address={address}
                                    selected={selectedAddressId === address.address_id}
                                    onSelect={() => setSelectedAddressId(address.address_id)}
                                    onEdit={() => {
                                        setEditingId(address.address_id);
                                        setFormValue(toForm(address));
                                        setShowForm(true);
                                    }}
                                />
                            ))
                        )}
                    </section>

                    <aside className="lg:col-span-4">
                        <div className="bg-[#f6f3f2] border-l-8 border-[#b90c1b] p-6 sticky top-28">
                            <h2 className="font-brand text-3xl uppercase tracking-widest mb-4">Selected</h2>
                            {selectedAddress ? (
                                <>
                                    <p className="font-brand text-2xl uppercase">{selectedAddress.FullName}</p>
                                    <p className="mt-3 font-headline text-[10px] uppercase tracking-widest opacity-70 leading-relaxed">
                                        {selectedAddress.address}
                                        {selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''}
                                        {`, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} ${selectedAddress.pinCode}`}
                                    </p>
                                    <p className="mt-2 font-headline text-[10px] uppercase tracking-widest opacity-60">{selectedAddress.phone1}</p>
                                    <Link href="/checkout" className="mt-6 inline-block bg-[#1c1b1b] text-white px-5 py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b]">
                                        Use In Checkout
                                    </Link>
                                </>
                            ) : (
                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Select an address to continue.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
            <Comp7 />
        </main>
    );
}
