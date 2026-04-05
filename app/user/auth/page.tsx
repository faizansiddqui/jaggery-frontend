
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendOtp, verifyOtp } from '@/app/lib/apiClient';
import { setUserSession } from '@/app/lib/session';

export default function AuthRoute() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSendOtp = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendOtp(email.trim().toLowerCase());
      setOtpSent(true);
      setMessage('OTP sent. Check your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (otp.trim().length !== 4) {
      setError('Enter a valid 4-digit OTP');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await verifyOtp(email.trim().toLowerCase(), otp.trim());
      if (!result.token) throw new Error('Invalid token from server');
      setUserSession({ token: result.token, email: result.email });
      setMessage(result.isNew ? 'Account created successfully.' : 'Login successful.');
      const params = new URLSearchParams(window.location.search);
      const requestedPath = String(params.get('next') || '').trim();
      const safeNextPath = requestedPath.startsWith('/') ? requestedPath : '/user/profile';
      window.location.href = safeNextPath;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf8f8] text-[#1c1b1b] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl bg-[#f6f3f2] border-l-8 border-[#b90c1b] p-8 md:p-12">
        <Link href="/" className="font-headline text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100">
          Back to Shop
        </Link>
        <h1 className="font-brand text-6xl uppercase leading-[0.85] mt-5 mb-3">Access Riot</h1>
        <p className="font-headline text-[11px] uppercase tracking-widest opacity-60 mb-8">
          Login / Signup with email OTP
        </p>

        <div className="space-y-5">
          <div>
            <label className="font-headline text-[10px] uppercase tracking-widest opacity-60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@streetriot.com"
              className="w-full bg-white border-2 border-[#1c1b1b]/20 px-4 py-3 font-headline text-sm tracking-wider mt-1 focus:outline-none focus:border-[#b90c1b]"
            />
          </div>

          {otpSent && (
            <div>
              <label className="font-headline text-[10px] uppercase tracking-widest opacity-60">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="4-digit code"
                className="w-full bg-white border-2 border-[#1c1b1b]/20 px-4 py-3 font-headline text-sm tracking-[0.4em] mt-1 focus:outline-none focus:border-[#b90c1b]"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onSendOtp}
              disabled={loading}
              className="bg-[#1c1b1b] text-white px-6 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#b90c1b] transition-colors disabled:opacity-40"
            >
              {loading ? 'Please Wait...' : otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
            {otpSent && (
              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={loading}
                className="border-2 border-[#1c1b1b] px-6 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#1c1b1b] hover:text-white transition-colors disabled:opacity-40"
              >
                Verify & Continue
              </button>
            )}
          </div>

          {message && <p className="font-headline text-[10px] uppercase tracking-widest text-green-700">{message}</p>}
          {error && <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p>}
        </div>
      </section>
    </main>
  );
}