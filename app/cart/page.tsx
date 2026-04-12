"use client";
import React, { useState } from "react";
import Link from "next/link";

const cartItems = [
  {
    id: "heritage-block",
    name: "Amila Gold Heritage Block",
    variant: "500G • Pure Sugarcane",
    qty: 2,
    price: 32.0,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlg3Tk97gQdImvXIc1DiL6lbLqyxz9L6jrOFORydsoFpQVXGnpa6YoMOTPTzx9VEbyykHqJnMdmeZk8ku7ibD8GVoeZtTQ6h3s71NtsfTQYI8fUYbe70UESC6iUJtSWJXk5lv4JGr0UlaRVQ9NghI5HgrGjJbkafVW1GNe7EB-JRMV8fsD66Eb2WLecxTX7LSnA5dhvRdq8oCI9B62otWTQ6qwccrdx77IYCLNFZMtJFn2y6E3AeNU3i-CePrKC309bRbI4ypVzfo",
  },
  {
    id: "crushed-amber",
    name: "Crushed Amber Jaggery",
    variant: "250G • Fine Grinds",
    qty: 1,
    price: 14.0,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX2993NzZ0Um5qMDBQAhmDGLYVnLlAidv2KRQ4EHI7kV_BHUGeQ3mF9SKJJZLorc-MMfen_jV9OJCER_-TFBPf5rqfIZ_xClPbAv476JP0qq-wKw3hkeXrR-Yzqs6Zc58yRjUw89eSWXu4mf4VX9fxN1ripzK28QEb9Od-EQhUCAhFat83PKXt325QLEnYyZWuk_9WBSPSm6WVd9FHG4tTgAWNJW8UAbbs1HAg0ZfHEpz5srx3iOob1KgI6KfDeD55jF66Pig0eKU",
  },
];

const SHIPPING = 8.0;

export default function CartCheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [qtys, setQtys] = useState<Record<string, number>>({ "heritage-block": 2, "crushed-amber": 1 });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price / item.qty) * qtys[item.id], 0);
  const total = subtotal + SHIPPING;

  const updateQty = (id: string, delta: number) =>
    setQtys((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));

  return (
    <main className="min-h-screen pt-24 pb-12 flex flex-col lg:flex-row max-w-[1440px] mx-auto px-6 lg:px-12 gap-12">
      {/* Left: Order Summary */}
      <section className="flex-1 space-y-8 lg:sticky lg:top-32 h-fit">
        <header>
          <h1 className="font-headline text-4xl lg:text-5xl font-medium tracking-tight text-primary">
            Your Harvest Selection
          </h1>
          <p className="mt-2 text-on-surface-variant font-body">Review your items before we prepare your shipment.</p>
        </header>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-surface-container-low rounded-xl p-4 flex gap-6 items-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-xl text-primary font-bold">{item.name}</h3>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">{item.variant}</p>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1 gap-4">
                    <button onClick={() => updateQty(item.id, -1)} className="text-primary hover:text-secondary transition-colors">
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-body font-bold text-sm">{String(qtys[item.id]).padStart(2, '0')}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-primary hover:text-secondary transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <span className="font-headline text-xl font-bold text-secondary">
                    ${((item.price / item.qty) * qtys[item.id]).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-8 border-t border-outline-variant/20 space-y-4">
          <div className="flex justify-between font-body text-on-surface-variant">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-body text-on-surface-variant">
            <span>Standard Shipping (Purity Assured)</span>
            <span>${SHIPPING.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-4">
            <span className="font-headline text-2xl text-primary font-bold">Total Investment</span>
            <span className="font-headline text-3xl text-secondary font-black">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Promise Badge */}
        <div className="hidden lg:block relative h-40 overflow-hidden rounded-xl bg-primary-container text-on-primary mt-12 p-8">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-full shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-3xl text-white icon-filled">eco</span>
            </div>
            <div>
              <h4 className="font-headline text-xl font-bold italic">The Modern Agrarian Promise</h4>
              <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                Every shipment is hand-packed in sustainable parchment and sealed with our wax guarantee of purity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Checkout Form */}
      <section className="flex-1 bg-surface-container-low lg:bg-surface-container rounded-3xl p-8 lg:p-12">
        <div className="max-w-md mx-auto space-y-12">
          {/* Shipping */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-8 rounded-full border-2 border-secondary text-secondary flex items-center justify-center font-bold">1</span>
              <h2 className="font-headline text-2xl text-primary font-bold">Shipping Sanctuary</h2>
            </div>
            <form className="space-y-6">
              {[
                { label: "Full Name", placeholder: "Julian Vane", span: 2 },
                { label: "Street Address", placeholder: "12 Heritage Lane", span: 2 },
                { label: "City", placeholder: "Portland", span: 1 },
                { label: "Zip Code", placeholder: "97201", span: 1 },
              ].map((f) => (
                <div key={f.label} className={f.span === 2 ? "col-span-2" : ""}>
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-on-surface font-body outline-none transition-colors"
                  />
                </div>
              ))}
            </form>
          </div>

          {/* Payment */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-8 rounded-full border-2 border-secondary text-secondary flex items-center justify-center font-bold">2</span>
              <h2 className="font-headline text-2xl text-primary font-bold">Payment Method</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === "card" ? "border-secondary bg-secondary-container/10 text-secondary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined mb-2">credit_card</span>
                <span className="font-label text-xs font-bold uppercase tracking-wider">Credit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === "paypal" ? "border-secondary bg-secondary-container/10 text-secondary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined mb-2">account_balance_wallet</span>
                <span className="font-label text-xs font-bold uppercase tracking-wider">PayPal</span>
              </button>
            </div>
            {paymentMethod === "card" && (
              <div className="space-y-6">
                {[
                  { label: "Card Number", placeholder: "•••• •••• •••• 4242" },
                  { label: "Expiry", placeholder: "MM / YY" },
                  { label: "CVC", placeholder: "•••" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 px-0 pb-2 text-on-surface font-body outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-8">
            <button className="w-full bg-primary text-on-primary py-5 rounded-full font-headline text-xl font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-xl">
              <span>Place Order</span>
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
            <p className="text-center mt-6 text-on-surface-variant text-xs font-body italic">
              Securely processed via Amila Encrypted Vault.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
