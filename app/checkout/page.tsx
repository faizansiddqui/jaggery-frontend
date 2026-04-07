'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';
import AddressCard from '@/app/components/address/AddressCard';
import AddressForm from '@/app/components/address/AddressForm';
import PaymentStep from '@/app/checkout/components/PaymentStep';
import CheckoutSummary from '@/app/checkout/components/CheckoutSummary';
import {
    emptyAddress,
    type ShipData,
    type Step,
    toAddressInput,
} from '@/app/checkout/components/checkoutState';
import {
    createBackendOrder,
    createUserAddress,
    fetchPublicSiteSettings,
    fetchUserAddresses,
    validatePromoCode,
    type UserAddress,
    type UserAddressInput,
    updateUserAddress,
    verifyBackendPayment,
} from '@/app/lib/apiClient';
import { useCart } from '@/app/context/CartContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { clearCheckoutPromoState, getCheckoutPromoState, getUserSession } from '@/app/lib/session';
import { launchRazorpayCheckout } from '@/app/checkout/lib/razorpayCheckout';

function AddressCardSkeleton() {
    return (
        <div className="border border-[#1c1b1b]/10 bg-white p-4 animate-pulse">
            <div className="h-5 w-32 bg-[#1c1b1b]/10" />
            <div className="mt-2 h-3 w-20 bg-[#1c1b1b]/10" />
            <div className="mt-4 h-3 w-full bg-[#1c1b1b]/10" />
            <div className="mt-2 h-3 w-5/6 bg-[#1c1b1b]/10" />
            <div className="mt-4 h-3 w-24 bg-[#1c1b1b]/10" />
            <div className="mt-5 flex gap-2">
                <div className="h-8 w-20 bg-[#1c1b1b]/10" />
                <div className="h-8 w-16 bg-[#1c1b1b]/10" />
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart, itemCount, isHydrating } = useCart();
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const [step, setStep] = useState<Step>('shipping');
    const [ship, setShip] = useState<ShipData>({ name: '', email: '', address: '', city: '', country: '', zip: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState<UserAddressInput>(emptyAddress);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressBusy, setAddressBusy] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressLoadError, setAddressLoadError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);

    const shipping = 0;
    const finalTotal = Math.max(0, total + shipping - promoDiscount);
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

    useEffect(() => {
        const session = getUserSession();
        setIsAuthenticated(Boolean(session?.token));
        if (session?.email) setShip((prev) => ({ ...prev, email: session.email }));
        setAuthChecked(true);
    }, []);

    useEffect(() => {
        if (!authChecked || isAuthenticated) return;
        const nextPath = encodeURIComponent('/checkout');
        router.replace(`/user/auth?next=${nextPath}`);
    }, [authChecked, isAuthenticated, router]);

    useEffect(() => {
        const saved = getCheckoutPromoState();
        if (saved?.code) setPromoCode(saved.code);
    }, []);

    useEffect(() => {
        if (!promoCode || !items.length) {
            setPromoDiscount(0);
            return;
        }

        validatePromoCode({
            code: promoCode,
            items: items.map((item) => ({
                product_id: item.id,
                quantity: item.qty,
                color: item.color,
                size: item.size,
                price: item.price,
            })),
        })
            .then((result) => {
                setPromoDiscount(Number(result.discountAmount || 0));
            })
            .catch(() => {
                setPromoDiscount(0);
                setPromoCode('');
                clearCheckoutPromoState();
            });
    }, [promoCode, items]);

    useEffect(() => {
        if (!isAuthenticated) return;
        setAddressLoading(true);
        setAddressLoadError('');

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
            .catch((error) => {
                setAddresses([]);
                setAddressLoadError(error instanceof Error ? error.message : 'Could not load saved addresses.');
            })
            .finally(() => {
                setAddressLoading(false);
            });
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

    if (!authChecked) {
        return (
            <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
                <Comp1 />
                <div className="pt-40 pb-20 px-8 text-center">
                    <h1 className="font-brand text-5xl md:text-6xl uppercase mb-6">Checking Session</h1>
                    <p className="font-headline text-xs uppercase tracking-widest opacity-60">Please wait...</p>
                </div>
                <Comp7 />
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
                <Comp1 />
                <div className="pt-40 pb-20 px-8 text-center">
                    <h1 className="font-brand text-5xl md:text-6xl uppercase mb-6">Login Required</h1>
                    <p className="font-headline text-xs uppercase tracking-widest opacity-60">Redirecting to secure login...</p>
                    <Link
                        href="/user/auth?next=%2Fcheckout"
                        className="inline-block mt-6 font-brand text-2xl uppercase underline hover:text-[#b90c1b] transition-colors"
                    >
                        Continue to Login
                    </Link>
                </div>
                <Comp7 />
            </main>
        );
    }

    if (!isHydrating && items.length === 0) {
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
                    <p className="mt-3 font-headline text-[10px] uppercase tracking-widest opacity-60">Step: {step}</p>
                </header>

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

                                        <div
                                            className="max-h-[360px] md:max-h-none overflow-y-auto md:overflow-visible overscroll-contain touch-pan-y pr-1"
                                            onWheel={(event) => event.stopPropagation()}
                                            onTouchMove={(event) => event.stopPropagation()}
                                            style={{ WebkitOverflowScrolling: 'touch' }}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {addressLoading
                                                    ? Array.from({ length: 4 }).map((_, index) => (
                                                        <AddressCardSkeleton key={`addr-skeleton-${index}`} />
                                                    ))
                                                    : addresses.map((entry) => (
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
                                        </div>

                                        {!addressLoading && !addresses.length && !addressLoadError ? (
                                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">
                                                No saved addresses yet. Add your first address.
                                            </p>
                                        ) : null}

                                        {addressLoadError ? (
                                            <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">
                                                {addressLoadError}
                                            </p>
                                        ) : null}
                                    </div>
                                )}

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
                                errors={errors}
                                busy={isPlacingOrder}
                                totalText={`${currency}${finalTotal.toFixed(2)}`}
                                onBack={() => setStep('shipping')}
                                onSubmit={async () => {
                                    if (isAuthenticated && !selectedAddressId) {
                                        setErrors({ payment: 'Please select a shipping address before payment.' });
                                        return;
                                    }

                                    try {
                                        setIsPlacingOrder(true);
                                        setErrors({});

                                        const orderPayload = await createBackendOrder(
                                            items.map((item) => ({
                                                product_id: item.id,
                                                quantity: item.qty,
                                                size: item.size,
                                                color: item.color,
                                            })),
                                            selectedAddressId || undefined,
                                            promoCode || undefined,
                                        );

                                        const orderData = (orderPayload.order || {}) as Record<string, unknown>;
                                        const razorpayOrderId = String(orderData.id || '');
                                        const razorpayKey = String(orderPayload.key || '');
                                        const amount = Number(orderPayload.amount || 0);
                                        const payCurrency = String(orderPayload.currency || 'INR');

                                        if (!razorpayOrderId || !razorpayKey || !amount) {
                                            throw new Error('Invalid payment order response from server.');
                                        }

                                        const liveSettings = await fetchPublicSiteSettings().catch(() => null);
                                        const razorpayStoreName = (
                                            String(liveSettings?.siteName || settings.siteName || settings.navbarTitle || 'STREETRIOT')
                                                .trim()
                                                .toUpperCase() || 'STREETRIOT'
                                        );

                                        const payment = await launchRazorpayCheckout({
                                            key: razorpayKey,
                                            amount,
                                            currency: payCurrency,
                                            orderId: razorpayOrderId,
                                            name: razorpayStoreName,
                                            description: `${razorpayStoreName} CHECKOUT`,
                                            prefill: {
                                                name: ship.name,
                                                email: ship.email,
                                            },
                                        });

                                        const verifyRes = await verifyBackendPayment(payment);
                                        const orderCode = String(verifyRes.order_code || verifyRes.order_id || '');
                                        const paymentId = String(payment.razorpay_payment_id || '');

                                        clearCart();
                                        clearCheckoutPromoState();

                                        const query = new URLSearchParams({
                                            orderCode,
                                            paymentId,
                                        });
                                        router.push(`/checkout/success?${query.toString()}`);
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
            </div>
            <Comp7 />
        </main>
    );
}
