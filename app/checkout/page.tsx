'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';
import AddressCard from '@/app/components/address/AddressCard';
import AddressForm from '@/app/components/address/AddressForm';
import PaymentStep from '@/app/checkout/components/PaymentStep';
import CheckoutSummary from '@/app/checkout/components/CheckoutSummary';
import {
    emptyAddress,
    type PayData,
    type ShipData,
    type Step,
    toAddressInput,
} from '@/app/checkout/components/checkoutState';
import {
    createBackendOrder,
    createUserAddress,
    fetchUserAddresses,
    type UserAddress,
    type UserAddressInput,
    updateUserAddress,
} from '@/app/lib/apiClient';
import { useCart } from '@/app/context/CartContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { getUserSession } from '@/app/lib/session';

export default function CheckoutPage() {
    const { items, total, clearCart, itemCount } = useCart();
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const [step, setStep] = useState<Step>('shipping');
    const [orderRef] = useState(() => `K-${Math.floor(Math.random() * 90000) + 10000}`);
    const [ship, setShip] = useState<ShipData>({ name: '', email: '', address: '', city: '', country: '', zip: '' });
    const [pay, setPay] = useState<PayData>({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState<UserAddressInput>(emptyAddress);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressBusy, setAddressBusy] = useState(false);

    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;
    const selectedAddress = useMemo(() => addresses.find((entry) => entry.address_id === selectedAddressId) || null, [addresses, selectedAddressId]);

    const validateShip = () => {
        const e: Record<string, string> = {};
        if (!ship.name) e.name = 'Required';
        if (!ship.email || !ship.email.includes('@')) e.email = 'Valid email required';
        if (!ship.address) e.address = 'Required';
        if (!ship.city) e.city = 'Required';
        if (!ship.country) e.country = 'Required';
        if (!ship.zip) e.zip = 'Required';
        setErrors((prev) => ({ ...prev, ...e }));
        return Object.keys(e).length === 0;
    };

    const validatePay = () => {
        const e: Record<string, string> = {};
        if (!pay.cardName) e.cardName = 'Required';
        if (!pay.cardNumber || pay.cardNumber.replace(/ /g, '').length !== 16) e.cardNumber = 'Valid 16-digit number required';
        if (!pay.expiry || !/^\d{2}\/\d{2}$/.test(pay.expiry)) e.expiry = 'MM/YY required';
        if (!pay.cvv || pay.cvv.length < 3) e.cvv = 'Required';
        setErrors((prev) => ({ ...prev, ...e }));
        return Object.keys(e).length === 0;
    };

    useEffect(() => {
        const session = getUserSession();
        setIsAuthenticated(Boolean(session?.token));
        if (session?.email) setShip((prev) => ({ ...prev, email: session.email }));
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchUserAddresses()
            .then((list) => {
                setAddresses(list);
                if (list[0]) {
                    setSelectedAddressId(list[0].address_id);
                    setShip((prev) => ({
                        ...prev,
                        name: list[0].FullName || prev.name,
                        address: list[0].address || prev.address,
                        city: list[0].city || prev.city,
                        country: list[0].country || prev.country,
                        zip: list[0].pinCode || prev.zip,
                    }));
                }
            })
            .catch(() => setAddresses([]));
    }, [isAuthenticated]);

    const saveAddress = async () => {
        if (!addressForm.FullName || !addressForm.phone1 || !addressForm.address || !addressForm.city || !addressForm.pinCode) {
            setErrors((prev) => ({ ...prev, address: 'Please fill required address fields' }));
            return;
        }
        try {
            setAddressBusy(true);
            const saved = editingAddressId
                ? await updateUserAddress(editingAddressId, addressForm)
                : await createUserAddress(addressForm);
            setAddresses((prev) => {
                const exists = prev.some((entry) => entry.address_id === saved.address_id);
                return exists ? prev.map((entry) => (entry.address_id === saved.address_id ? saved : entry)) : [saved, ...prev];
            });
            setSelectedAddressId(saved.address_id);
            setShip((prev) => ({ ...prev, name: saved.FullName, address: saved.address, city: saved.city, country: saved.country, zip: saved.pinCode }));
            setShowAddressForm(false);
            setEditingAddressId(null);
            setAddressForm(emptyAddress);
            setErrors((prev) => ({ ...prev, address: '' }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, address: error instanceof Error ? error.message : 'Could not save address' }));
        } finally {
            setAddressBusy(false);
        }
    };

    if (items.length === 0 && step !== 'confirmed') {
        return (
            <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
                <Comp1 />
                <div className="pt-40 pb-20 px-8 text-center">
                    <h1 className="font-brand text-6xl md:text-7xl uppercase mb-6">Your Bag is Empty</h1>
                    <Link href="/shop" className="font-brand text-2xl uppercase underline hover:text-[#b90c1b] transition-colors">Continue Shopping</Link>
                </div>
                <Comp7 />
            </main>
        );
    }

    return (
        <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
            <Comp1 />
            <div className="pt-8 pb-5 px-4 md:px-8 max-w-[1440px] mx-auto">
                <header className="mb-12 border-b-4 border-[#1c1b1b] pb-8">
                    <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">Secure Checkout</span>
                    <h1 className="font-brand text-5xl md:text-8xl uppercase tracking-tighter mt-2">Checkout</h1>
                    {step !== 'confirmed' && <p className="mt-3 font-headline text-[10px] uppercase tracking-widest opacity-60">Step: {step}</p>}
                </header>

                {step === 'confirmed' ? (
                    <section className="text-center py-16 flex flex-col items-center gap-6">
                        <h2 className="font-brand text-5xl md:text-7xl uppercase">Order Placed</h2>
                        <p className="font-headline text-xs uppercase tracking-widest opacity-60">Order {orderRef} confirmed for {ship.email}</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/user/orders" className="bg-[#1c1b1b] text-white px-8 py-3 font-headline text-xs uppercase tracking-widest hover:bg-[#b90c1b]">Track Order</Link>
                            <Link href="/shop" className="border border-[#1c1b1b]/20 px-8 py-3 font-headline text-xs uppercase tracking-widest hover:border-[#1c1b1b]">Continue Shopping</Link>
                        </div>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14 items-start">
                        <section className="xl:col-span-7 flex flex-col gap-7">
                            {step === 'shipping' && (
                                <>
                                    <h2 className="font-brand text-3xl uppercase tracking-widest">Shipping Information</h2>

                                    {isAuthenticated && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-headline text-[10px] uppercase tracking-[0.25em] opacity-60">Saved Addresses</h3>
                                                <button
                                                    onClick={() => {
                                                        setShowAddressForm(true);
                                                        setEditingAddressId(null);
                                                        setAddressForm(emptyAddress);
                                                    }}
                                                    className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] hover:underline"
                                                >
                                                    Add New
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {addresses.map((entry) => (
                                                    <AddressCard
                                                        key={entry.address_id}
                                                        address={entry}
                                                        selected={selectedAddressId === entry.address_id}
                                                        onSelect={() => {
                                                            setSelectedAddressId(entry.address_id);
                                                            setShip((prev) => ({ ...prev, name: entry.FullName, address: entry.address, city: entry.city, country: entry.country, zip: entry.pinCode }));
                                                        }}
                                                        onEdit={() => {
                                                            setShowAddressForm(true);
                                                            setEditingAddressId(entry.address_id);
                                                            setAddressForm(toAddressInput(entry));
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            {showAddressForm && (
                                                <AddressForm
                                                    value={addressForm}
                                                    busy={addressBusy}
                                                    error={errors.address}
                                                    submitLabel={editingAddressId ? 'Update Address' : 'Save Address'}
                                                    onChange={setAddressForm}
                                                    onSubmit={saveAddress}
                                                    onCancel={() => {
                                                        setShowAddressForm(false);
                                                        setEditingAddressId(null);
                                                        setAddressForm(emptyAddress);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            ['Full Name', ship.name, (v: string) => setShip((p) => ({ ...p, name: v })), 'name'],
                                            ['Email', ship.email, (v: string) => setShip((p) => ({ ...p, email: v })), 'email'],
                                            ['City', ship.city, (v: string) => setShip((p) => ({ ...p, city: v })), 'city'],
                                            ['Country', ship.country, (v: string) => setShip((p) => ({ ...p, country: v })), 'country'],
                                            ['ZIP', ship.zip, (v: string) => setShip((p) => ({ ...p, zip: v })), 'zip'],
                                        ].map(([label, value, onChange, key]) => (
                                            <label key={key as string} className="flex flex-col gap-2">
                                                <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-60">{label as string}</span>
                                                <input value={value as string} onChange={(event) => (onChange as (v: string) => void)(event.target.value)} className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                                                {errors[key as string] && <span className="font-headline text-[9px] uppercase tracking-widest text-[#b90c1b]">{errors[key as string]}</span>}
                                            </label>
                                        ))}
                                        <label className="md:col-span-2 flex flex-col gap-2">
                                            <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-60">Address</span>
                                            <input value={ship.address} onChange={(event) => setShip((p) => ({ ...p, address: event.target.value }))} className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                                            {errors.address && <span className="font-headline text-[9px] uppercase tracking-widest text-[#b90c1b]">{errors.address}</span>}
                                        </label>
                                    </div> */}

                                    <button
                                        onClick={() => {
                                            if (!validateShip()) return;
                                            if (isAuthenticated && !selectedAddress && !showAddressForm) {
                                                setErrors((prev) => ({ ...prev, address: 'Please select or save an address first' }));
                                                return;
                                            }
                                            setErrors({});
                                            setStep('payment');
                                        }}
                                        className="self-start bg-[#1c1b1b] text-white px-8 py-4 font-headline text-xs uppercase tracking-widest hover:bg-[#b90c1b]"
                                    >
                                        Continue to Payment
                                    </button>
                                </>
                            )}

                            {step === 'payment' && (
                                <PaymentStep
                                    pay={pay}
                                    errors={errors}
                                    busy={isPlacingOrder}
                                    totalText={`${currency}${finalTotal.toFixed(2)}`}
                                    onBack={() => setStep('shipping')}
                                    onPayChange={setPay}
                                    onSubmit={async () => {
                                        if (!validatePay()) return;
                                        try {
                                            setIsPlacingOrder(true);
                                            await createBackendOrder(items.map((item) => ({ product_id: item.id, quantity: item.qty, size: item.size, color: item.color })), selectedAddressId || undefined);
                                            clearCart();
                                            setErrors({});
                                            setStep('confirmed');
                                        } catch (error) {
                                            setErrors({ payment: error instanceof Error ? error.message : 'Could not place order' });
                                        } finally {
                                            setIsPlacingOrder(false);
                                        }
                                    }}
                                />
                            )}
                        </section>
                        <CheckoutSummary
                            items={items}
                            itemCount={itemCount}
                            currency={currency}
                            subtotal={total}
                            shipping={shipping}
                            total={finalTotal}
                        />
                    </div>
                )}
            </div>
            <Comp7 />
        </main>
    );
}
