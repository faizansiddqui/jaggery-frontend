"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import AddressCard from "@/app/components/address/AddressCard";
import AddressForm from "@/app/components/address/AddressForm";
import AddressModal from "@/app/components/address/AddressModal";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const SHIPPING = 0;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState("");
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

  const [stockByCartKey, setStockByCartKey] = useState<Record<string, number>>({});
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!isAuthenticated) {
        setIsLoadingAddresses(false);
        return;
      }
      try {
        const data = await fetchUserAddresses();
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].address_id);
      } catch {
        // keep empty
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    loadAddresses();
  }, [isAuthenticated]);

  const getCartKey = (id: number, size: string, color: string) =>
    `${Number(id)}|${String(size || "").trim().toLowerCase()}|${String(color || "").trim().toLowerCase()}`;

  useEffect(() => {
    let active = true;
    const loadStock = async () => {
      if (!items.length) {
        if (active) {
          setStockByCartKey({});
          setIsCheckingStock(false);
        }
        return;
      }
      setIsCheckingStock(true);
      try {
        const products = await fetchBackendProducts();
        const productMap = new Map(products.map((product) => [Number(product.id), product]));
        const next: Record<string, number> = {};
        for (const item of items) {
          const product = productMap.get(Number(item.id));
          const key = getCartKey(item.id, item.size, item.color || "");
          if (!product) {
            next[key] = 0;
            continue;
          }
          next[key] = stockForCartLine(product, item.size);
        }
        if (active) setStockByCartKey(next);
      } catch {
        if (active) setStockByCartKey({});
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

  const hasStockIssue = items.some((item) => {
    const available = stockByCartKey[getCartKey(item.id, item.size, item.color || "")];
    return typeof available === "number" && (available <= 0 || item.qty > available);
  });

  const totalLabel = useMemo(() => `${currencySymbol}${total.toFixed(2)}`, [currencySymbol, total]);

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
      setPaymentError("Please select a delivery address.");
      return;
    }
    if (!isAuthenticated) {
      router.push("/user/auth");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      const data = (await createBackendOrder(
        items.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          size: item.size,
          color: item.color || "",
          price: item.price,
        })),
        selectedAddressId
      )) as Record<string, unknown>;

      const orderId = (data.order as Record<string, unknown>)?.id as string;
      const localOrderId = String(data.local_order_id || "");
      const razorpayRuntimeKey = String(data.key || "");
      if (!orderId || !razorpayRuntimeKey) throw new Error("Razorpay is not configured yet.");

      const selectedAddress = addresses.find((a) => a.address_id === selectedAddressId);

      const razorpay = new window.Razorpay({
        key: razorpayRuntimeKey,
        amount: Number(data.amount || Math.round(total * 100)),
        currency: String(data.currency || "INR"),
        name: settings.siteName || "Amila Gold",
        description: `${itemCount} items`,
        order_id: orderId,
        prefill: {
          name: selectedAddress?.FullName || "",
          email: user?.email || "",
          contact: selectedAddress?.phone1 || "",
        },
        theme: { color: "#154212" },
        handler: async (paymentResponse: Record<string, unknown>) => {
          try {
            const verifyData = (await verifyBackendPayment({
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
            })) as Record<string, unknown>;

            if (verifyData.status) {
              clearCart();
              router.push(
                `/order/success?order_id=${encodeURIComponent(String(verifyData.order_id || localOrderId || ""))}`
              );
            } else {
              router.push(
                `/order/failed?error=${encodeURIComponent(String(verifyData.message || "Payment verification failed"))}`
              );
            }
          } catch {
            router.push(`/order/failed?error=${encodeURIComponent("Payment verification failed")}`);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });

      razorpay.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment could not be started. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!itemCount) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6 max-w-6xl mx-auto flex items-center justify-center">
        <div className="text-center space-y-6">
          <span className="material-symbols-outlined text-7xl text-secondary opacity-30">shopping_cart</span>
          <h1 className="font-headline text-4xl text-primary font-bold">Your cart is empty</h1>
          <p className="text-on-surface-variant">Add products before checkout.</p>
          <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-5 lg:pb-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
      <div className="flex items-start justify-between gap-8 lg:gap-12 flex-col lg:flex-row">
        <section className="flex-1 min-w-0 space-y-6">
          <header className="flex items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">Delivery details</h1>
              <p className="mt-2 text-on-surface-variant">Choose address and complete payment.</p>
            </div>
            <Link href="/cart" className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined">west</span>
              Back to cart
            </Link>
          </header>

          {!isAuthenticated ? (
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 text-center">
              <p className="text-on-surface-variant mb-4">Please login to continue</p>
              <Link href="/user/auth" className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                Login
              </Link>
            </div>
          ) : isLoadingAddresses ? (
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8">
              <div className="animate-pulse text-primary font-headline italic">Loading addresses...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 text-center">
                  <p className="text-on-surface-variant mb-4">No saved addresses found</p>
                  <button
                    type="button"
                    onClick={() => {
                      resetAddressForm();
                      setShowAddAddress(true);
                    }}
                    className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Add address
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] md:max-h-full overflow-y-auto hide-scrollbar overflow-y-auto md:grid md:grid-cols-2 gap-4" data-lenis-prevent="true">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.address_id}
                      address={addr}
                      selected={selectedAddressId === addr.address_id}
                      onSelect={() => setSelectedAddressId(addr.address_id)}
                      onEdit={() => openEditAddress(addr)}
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  resetAddressForm();
                  setShowAddAddress(true);
                }}
                className="w-full py-4 border-2 border-dashed border-outline-variant/50 rounded-2xl text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 bg-surface"
              >
                <span className="material-symbols-outlined">add</span>
                Add new address
              </button>

              {addressError ? <p className="text-sm text-error">{addressError}</p> : null}
              {showAddAddress && (
                <AddressModal
                  title={editingAddressId ? "Edit address" : "Add new address"}
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
                    submitLabel={editingAddressId ? "Update address" : "Save address"}
                    error={addressError}
                  />
                </AddressModal>
              )}
            </div>
          )}
        </section>

        <aside className="w-full lg:w-[420px] lg:sticky lg:top-28 self-start">
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
            <h2 className="font-headline text-2xl text-primary font-bold">Order Summary</h2>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span>{currencySymbol}{SHIPPING.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                <span className="font-headline text-xl font-bold text-primary">Total</span>
                <span className="font-headline text-2xl font-black text-secondary">{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing || !selectedAddressId || !isAuthenticated || isCheckingStock || hasStockIssue}
              className="mt-6 w-full bg-primary text-on-primary py-4 rounded-full font-headline text-lg font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
            >
              <span className="material-symbols-outlined">credit_card</span>
              <span>
                {isProcessing
                  ? "Processing..."
                  : isCheckingStock
                    ? "Verifying stock..."
                    : hasStockIssue
                      ? "Stock issue in cart"
                      : `Pay ${currencySymbol}${total.toFixed(2)}`}
              </span>
            </button>

            <p className="text-center text-on-surface-variant text-xs font-body mt-3">Secure checkout via Razorpay</p>
            {paymentError ? <p className="text-center text-sm text-error mt-2">{paymentError}</p> : null}
          </div>
        </aside>
      </div>

      {/* Mobile bottom pay bar */}
      <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface/90 backdrop-blur border-t border-outline-variant/20">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] text-on-surface-variant">Total</div>
            <div className="font-headline text-lg font-black text-secondary truncate">{totalLabel}</div>
          </div>
          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing || !selectedAddressId || !isAuthenticated || isCheckingStock || hasStockIssue}
            className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-60"
          >
            Pay
          </button>
        </div>
      </div>
    </main>
  );
}

