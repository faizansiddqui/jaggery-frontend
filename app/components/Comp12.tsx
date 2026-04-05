"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/app/lib/apiClient";

export default function Comp12() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubscribe = async () => {
    try {
      setMessage("");
      setError("");

      const normalized = email.trim().toLowerCase();
      if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        setError("ENTER A VALID EMAIL ADDRESS");
        return;
      }
      if (!accepted) {
        setError("PLEASE ACCEPT PRIVACY POLICY");
        return;
      }

      setLoading(true);
      await subscribeNewsletter(normalized, "landing-secondary");
      setMessage("SUBSCRIBED SUCCESSFULLY");
      setEmail("");
      setAccepted(false);
    } catch (subscribeError) {
      setError(subscribeError instanceof Error ? subscribeError.message.toUpperCase() : "SUBSCRIBE FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="py-32 px-8 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-brand text-7xl text-on-surface uppercase mb-6 leading-none">
              JOIN THE
              <br />
              INNER CIRCLE
            </h2>
            <p className="font-body text-lg text-zinc-500 uppercase tracking-widest max-w-md">
              Subscribe for early access to limited drops, members-only events,
              and kinetic field reports.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                className="w-full border-b-2 border-on-surface py-6 px-0 text-2xl font-headline font-black focus:border-primary focus:ring-0 placeholder:text-zinc-300 bg-transparent uppercase"
                placeholder="EMAIL ADDRESS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={onSubscribe}
                disabled={loading}
                className="absolute right-0 bottom-6 font-brand text-3xl text-primary hover:translate-x-2 transition-transform disabled:opacity-50"
              >
                {loading ? "SUBSCRIBING..." : "SUBSCRIBE →"}
              </button>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="w-5 h-5 border-2 border-on-surface rounded-none checked:bg-primary focus:ring-0"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="text-xs font-headline font-bold text-zinc-400 uppercase tracking-widest">
                I accept the privacy policy and terms of service
              </span>
            </label>
            {error ? <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p> : null}
            {message ? <p className="font-headline text-[10px] uppercase tracking-widest text-green-600">{message}</p> : null}
          </div>
        </div>
      </section>
    </>
  );
}
