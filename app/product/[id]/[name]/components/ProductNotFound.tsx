"use client";

import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">
          No Product Found
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter text-primary">
          Product not available
        </h1>
        <p className="mt-4 text-base md:text-lg text-on-surface-variant/80">
          This product doesn’t exist or is currently unavailable.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-on-secondary shadow-xl shadow-secondary/20 hover:brightness-110"
          >
            Back to Shop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant hover:border-primary hover:text-primary"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

