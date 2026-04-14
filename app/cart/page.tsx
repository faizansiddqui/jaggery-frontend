"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import {
    fetchUserAddresses,
    createUserAddress,
    updateUserAddress,
    createBackendOrder,
    verifyBackendPayment,
    type UserAddress,
    type UserAddressInput,
} from "@/app/lib/apiClient";
import { fetchBackendProducts, stockForCartLine } from "@/app/lib/backendProducts";
import { createProductHref } from "@/app/data/products";
import AddressCard from "@/app/components/address/AddressCard";
import AddressForm from "@/app/components/address/AddressForm";
import AddressModal from "@/app/components/address/AddressModal";

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

const SHIPPING = 0;

export default function CartCheckoutPage() {
    const router = useRouter();
    const { items, removeItem, updateQty, itemCount, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { settings } = useSiteSettings();
    const currencySymbol = settings.currencySymbol || "₹";
    const [isProcessing, setIsProcessing] = useState(false);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [addressError, setAddressError] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [stockByCartKey, setStockByCartKey] = useState<Record<string, number>>({});
    const [productHrefById, setProductHrefById] = useState<Record<number, string>>({});
    const [isCheckingStock, setIsCheckingStock] = useState(false);
    const [newAddress, setNewAddress] = useState<UserAddressInput>({
        FullName: "",
        phone1: "",
        phone2: "",
        address: "",
        address_line2: "",
        city: "",
        state: "",
        district: "",
        pinCode: "",
        country: "India",
        addressType: "Home",
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Load addresses
    useEffect(() => {
        const loadAddresses = async () => {
            if (!isAuthenticated) {
                setIsLoadingAddresses(false);
                return;
            }
            try {
                const data = await fetchUserAddresses();
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddressId(data[0].address_id);
                }
            } catch (error) {
                console.error("Failed to load addresses:", error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };
        loadAddresses();
    }, [isAuthenticated]);

    useEffect(() => {
        let active = true;
        const loadStock = async () => {
            if (!items.length) {
                if (active) {
                    setStockByCartKey({});
                    setProductHrefById({});
                    setIsCheckingStock(false);
                }
                return;
            }
            setIsCheckingStock(true);
            try {
                const products = await fetchBackendProducts();
                const productMap = new Map(products.map((product) => [Number(product.id), product]));
                const next: Record<string, number> = {};
                const hrefs: Record<number, string> = {};
                for (const item of items) {
                    const product = productMap.get(Number(item.id));
                    const key = `${Number(item.id)}|${String(item.size || "").trim().toLowerCase()}|${String(item.color || "").trim().toLowerCase()}`;
                    if (!product) {
                        next[key] = 0;
                        continue;
                    }
                    hrefs[Number(item.id)] = createProductHref(product);
                    next[key] = stockForCartLine(product, item.size);
                }
                if (active) {
                    setStockByCartKey(next);
                    setProductHrefById(hrefs);
                }
            } catch {
                if (active) {
                    setStockByCartKey({});
                    setProductHrefById({});
                }
            } finally {
                if (active) setIsCheckingStock(false);
            }
        };
        loadStock();
        return () => {
            active = false;
        };
    }, [items]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + SHIPPING;
    const getCartKey = (id: number, size: string, color: string) =>
        `${Number(id)}|${String(size || "").trim().toLowerCase()}|${String(color || "").trim().toLowerCase()}`;
    const hasStockIssue = items.some((item) => {
        const available = stockByCartKey[getCartKey(item.id, item.size, item.color || "")];
        return typeof available === "number" && (available <= 0 || item.qty > available);
    });

    const resetAddressForm = () => {
        setEditingAddressId(null);
        setAddressError("");
        setNewAddress({
            FullName: "",
            phone1: "",
            phone2: "",
            address: "",
            address_line2: "",
            city: "",
            state: "",
            district: "",
            pinCode: "",
            country: "India",
            addressType: "Home",
        });
    };

    const openEditAddress = (addr: UserAddress) => {
        setEditingAddressId(addr.address_id);
        setAddressError("");
        setNewAddress({
            FullName: addr.FullName || "",
            phone1: addr.phone1 || "",
            phone2: addr.phone2 || "",
            address: addr.address || "",
            address_line2: addr.address_line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            district: addr.district || "",
            pinCode: addr.pinCode || "",
            country: addr.country || "India",
            addressType: addr.addressType || "Home",
        });
        setShowAddAddress(true);
    };

    const handleAddressSubmit = async () => {
        if (!newAddress.FullName || !newAddress.phone1 || !newAddress.address || !newAddress.city || !newAddress.pinCode) {
            setAddressError("Please fill all required fields.");
            return;
        }
        try {
            setAddressError("");
            if (editingAddressId) {
                const updated = await updateUserAddress(editingAddressId, newAddress);
                setAddresses((prev) => prev.map((addr) => (addr.address_id === editingAddressId ? updated : addr)));
                setSelectedAddressId(updated.address_id);
            } else {
                const created = await createUserAddress(newAddress);
                setAddresses((prev) => [...prev, created]);
                setSelectedAddressId(created.address_id);
            }
            setShowAddAddress(false);
            resetAddressForm();
        } catch {
            setAddressError("Failed to save address.");
        }
    };

    const handlePayment = async () => {
        if (!itemCount || isProcessing) return;
        if (isCheckingStock || hasStockIssue) {
            setPaymentError("Some items are out of stock. Please update your cart to continue.");
            return;
        }

        if (!selectedAddressId) {
            alert("Please select a delivery address.");
            return;
        }

        if (!isAuthenticated) {
            alert("Please login to continue.");
            router.push("/user/auth");
            return;
        }

        setIsProcessing(true);
        setPaymentError("");

        try {
            const data = await createBackendOrder(
                items.map((item) => ({
                    product_id: item.id,
                    quantity: item.qty,
                    size: item.size,
                    color: item.color || "",
                    price: item.price,
                })),
                selectedAddressId
            ) as Record<string, unknown>;
            const orderId = (data.order as Record<string, unknown>)?.id as string;
            const localOrderId = String(data.local_order_id || "");
            const razorpayRuntimeKey = String(data.key || "");
            if (!orderId || !razorpayRuntimeKey) throw new Error("Razorpay is not configured yet.");

            const selectedAddress = addresses.find(a => a.address_id === selectedAddressId);

            const razorpay = new window.Razorpay({
                key: razorpayRuntimeKey,
                amount: Number(data.amount || Math.round(total * 100)),
                currency: String(data.currency || "INR"),
                name: "Amila Gold",
                description: `${itemCount} items`,
                order_id: orderId,
                prefill: {
                    name: selectedAddress?.FullName || "",
                    email: user?.email || "",
                    contact: selectedAddress?.phone1 || "",
                },
                theme: {
                    color: "#1f4d1d",
                },
                handler: async (paymentResponse: Record<string, unknown>) => {
                    try {
                        const verifyData = await verifyBackendPayment({
                            razorpay_order_id: String(paymentResponse.razorpay_order_id || ""),
                            razorpay_payment_id: String(paymentResponse.razorpay_payment_id || ""),
                            razorpay_signature: String(paymentResponse.razorpay_signature || ""),
                            items: items.map((item) => ({
                                product_id: item.id,
                                quantity: item.qty,
                                size: item.size,
                                color: item.color || "",
                                price: item.price,
                            })),
                            address_id: selectedAddressId || undefined,
                            email: user?.email || "",
                        }) as Record<string, unknown>;
                        if (verifyData.status) {
                            clearCart();
                            router.push(`/order/success?order_id=${encodeURIComponent(String(verifyData.order_id || localOrderId || ""))}`);
                        } else {
                            router.push(`/order/failed?error=${encodeURIComponent(String(verifyData.message || "Payment verification failed"))}`);
                        }
                    } catch {
                        router.push(`/order/failed?error=${encodeURIComponent("Payment verification failed")}`);
                    }
                },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
            });

            razorpay.open();
        } catch (_error) {
            setPaymentError(_error instanceof Error ? _error.message : "Payment could not be started. Please try again.");
            setIsProcessing(false);
        }
    };

    if (!itemCount) {
        return (
            <main className="min-h-screen pt-24 pb-12 px-6 max-w-6xl mx-auto flex items-center justify-center">
                <div className="text-center space-y-6">
                    <span className="material-symbols-outlined text-7xl text-secondary opacity-30">shopping_cart</span>
                    <h1 className="font-headline text-4xl text-primary font-bold">Your cart is empty</h1>
                    <p className="text-on-surface-variant">Start adding products to your collection.</p>
                    <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 gap-8 lg:gap-12">
            <section className="flex-1 space-y-8 min-w-0">
                <header>
                    <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-primary">
                        Your Harvest Selection
                    </h1>
                    <p className="mt-2 text-on-surface-variant font-body">{itemCount} items in your cart.</p>
                </header>

                <div className="space-y-6">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="bg-surface-container-low rounded-xl p-4 flex gap-4 sm:gap-6 items-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface-container-highest shrink-0 relative">
                                {productHrefById[item.id] ? (
                                    <Link href={productHrefById[item.id]} className="block w-full h-full relative" aria-label={`View ${item.name}`}>
                                        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" sizes="96px" />
                                    </Link>
                                ) : (
                                    <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" sizes="96px" />
                                )}
                            </div>

                            {(() => {
                                const available = stockByCartKey[getCartKey(item.id, item.size, item.color || "")];
                                const outOfStock = typeof available === "number" && available <= 0;
                                const exceedsStock = typeof available === "number" && item.qty > available && available > 0;
                                return (
                            <div className="flex-1 min-w-0">
                                <h3 className="font-headline text-lg sm:text-xl text-primary font-bold break-words">{item.name}</h3>
                                <p className="text-on-surface-variant text-xs sm:text-sm font-label uppercase tracking-widest break-words">
                                    {item.size}{item.color ? ` • ${item.color}` : ""}
                                </p>
                                {outOfStock ? (
                                    <p className="mt-2 text-[11px] uppercase tracking-widest font-bold text-error">Out of stock</p>
                                ) : exceedsStock ? (
                                    <p className="mt-2 text-[11px] uppercase tracking-widest font-bold text-error">Only {available} left in stock</p>
                                ) : typeof available === "number" ? (
                                    <p className="mt-2 text-[11px] uppercase tracking-widest font-bold text-primary/70">{available} in stock</p>
                                ) : null}

                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
                                    <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1 gap-4 w-fit">
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.size, -1, item.color)}
                                            className="text-primary hover:text-secondary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                        <span className="font-body font-bold text-sm">{String(item.qty).padStart(2, "0")}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.size, 1, item.color)}
                                            disabled={outOfStock || (typeof available === "number" && item.qty >= available)}
                                            className="text-primary hover:text-secondary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-headline text-lg sm:text-xl font-bold text-secondary">
                                            {currencySymbol}{(item.price * item.qty).toFixed(2)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                            className="text-on-surface-variant hover:text-secondary transition-colors"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                );
                            })()}
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-outline-variant/20 space-y-4">
                    <div className="flex justify-between font-body text-on-surface-variant">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-body text-on-surface-variant">
                        <span>Shipping</span>
                        <span>{currencySymbol}{SHIPPING.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-4 border-t border-outline-variant/20">
                        <span className="font-headline text-2xl text-primary font-bold">Total</span>
                        <span className="font-headline text-3xl text-secondary font-black">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <section data-lenis-prevent="true" className="flex-1 bg-surface-container-low lg:bg-surface-container rounded-3xl p-2 sm:p-8 lg:p-12 min-w-0 lg:sticky lg:top-32 self-start h-fit">
                <div className="max-w-md mx-auto space-y-8">
                    <h2 className="font-headline text-2xl text-primary font-bold">Select Delivery Address</h2>

                    {!isAuthenticated ? (
                        <div className="text-center py-8">
                            <p className="text-on-surface-variant mb-4">Please login to continue</p>
                            <Link href="/user/auth" className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                                Login to Continue
                            </Link>
                        </div>
                    ) : isLoadingAddresses ? (
                        <div className="text-center py-8">
                            <div className="animate-pulse text-primary font-headline italic">Loading addresses...</div>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-on-surface-variant mb-4">No saved addresses found</p>
                            <button
                                onClick={() => {
                                    resetAddressForm();
                                    setShowAddAddress(true);
                                }}
                                className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Add Address
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hidden">
                            {addresses.map((addr) => (
                                <AddressCard
                                    key={addr.address_id}
                                    address={addr}
                                    selected={selectedAddressId === addr.address_id}
                                    onSelect={() => setSelectedAddressId(addr.address_id)}
                                    onEdit={() => openEditAddress(addr)}
                                />
                            ))}

                            <button
                                onClick={() => {
                                    resetAddressForm();
                                    setShowAddAddress(true);
                                }}
                                className="w-full py-4 border-2 border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add New Address
                            </button>
                        </div>
                    )}

                    {addressError ? <p className="text-xs text-error">{addressError}</p> : null}
                    {showAddAddress && (
                        <AddressModal
                            title={editingAddressId ? "Edit Address" : "Add New Address"}
                            onClose={() => {
                                setShowAddAddress(false);
                                resetAddressForm();
                            }}
                        >
                            <AddressForm
                                value={newAddress}
                                onChange={setNewAddress}
                                onSubmit={handleAddressSubmit}
                                onCancel={() => {
                                    setShowAddAddress(false);
                                    resetAddressForm();
                                }}
                                submitLabel={editingAddressId ? "Update Address" : "Save Address"}
                                error={addressError}
                            />
                        </AddressModal>
                    )}

                    <button
                        type="button"
                        onClick={handlePayment}
                        disabled={isProcessing || !selectedAddressId || !isAuthenticated || isCheckingStock || hasStockIssue}
                        className="w-full bg-primary text-on-primary py-4 rounded-full font-headline text-lg font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
                    >
                        <span className="material-symbols-outlined">credit_card</span>
                        <span>{isProcessing ? "Processing..." : isCheckingStock ? "Verifying stock..." : hasStockIssue ? "Stock issue in cart" : `Pay ${currencySymbol}${total.toFixed(2)}`}</span>
                    </button>

                    <p className="text-center text-on-surface-variant text-xs font-body">
                        Secure checkout via Razorpay
                    </p>
                    {paymentError ? <p className="text-center text-xs text-error">{paymentError}</p> : null}
                </div>
            </section>
        </main>
    );
}
