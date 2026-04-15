'use client';

import React, { useState } from 'react';
import { useAuth, useRedirectIfAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthHeader from '@/app/user/auth/components/AuthHeader';
import EmailStepForm from '@/app/user/auth/components/EmailStepForm';
import OtpStepForm from '@/app/user/auth/components/OtpStepForm';

export default function UserAuthPage() {
  const { loginStep, loginEmail, isLoading, error, sendLoginOtp, verifyLoginOtp, resetLogin } = useAuth();
  const searchParams = useSearchParams();
  const blockedFlag = searchParams?.get('blocked') === '1';
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Redirect to profile if already logged in
  useRedirectIfAuth('/user/profile');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await sendLoginOtp(email.trim());
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) {
      await verifyLoginOtp(otp.trim());
    }
  };

  return (
    <main className="min-h-[10vh] md:min-h-screen flex items-center justify-center px-6 py-4 md:py-15 bg-surface">
      <div className="w-full max-w-md">
        <AuthHeader loginStep={loginStep} loginEmail={loginEmail} />

        {blockedFlag && !error && (
          <div className="bg-error/10 text-error text-sm p-3 rounded-lg mb-6">
            You are blocked. Please contact support.
          </div>
        )}

        {loginStep === 'email' ? (
          <EmailStepForm
            email={email}
            isLoading={isLoading}
            error={error}
            onEmailChange={setEmail}
            onSubmit={handleSendOtp}
          />
        ) : (
          <OtpStepForm
            otp={otp}
            isLoading={isLoading}
            error={error}
            onOtpChange={setOtp}
            onSubmit={handleVerifyOtp}
            onBack={resetLogin}
          />
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-on-surface-variant text-sm hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
