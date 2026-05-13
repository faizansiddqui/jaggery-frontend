import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60">
          404 • No Page Found
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter text-primary">
          Page not found
        </h1>
        <p className="mt-4 text-base md:text-lg text-on-surface-variant/80">
          The page you’re looking for doesn’t exist (or it was moved).
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-on-primary shadow-xl shadow-primary/20 hover:brightness-110"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant hover:border-primary hover:text-primary"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
}

