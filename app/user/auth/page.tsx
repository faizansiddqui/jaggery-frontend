'use client';

import React, { useState } from 'react';
import { useAuth, useRedirectIfAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthHeader from './components/AuthHeader';
import EmailStepForm from './components/EmailStepForm';
import OtpStepForm from './components/OtpStepForm';

export default function UserAuthPage() {
  const { loginStep, loginEmail, isLoading, error, sendLoginOtp, verifyLoginOtp, resetLogin } = useAuth();
  const searchParams = useSearchParams();
  const blockedFlag = searchParams?.get('blocked') === '1';
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useRedirectIfAuth('/user/profile');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) await sendLoginOtp(email.trim());
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) await verifyLoginOtp(otp.trim());
  };

  return (
    <main className="flex items-center justify-center pt-10 sm:px-6 lg:px-8 bg-surface font-['Poppins']">
      <div className="w-full max-w-[440px] bg-surface-container-highest backdrop-blur-xl border border-outline/10 p-8 md:p-12 rounded-[2.5rem] shadow-xl transition-all duration-500">
        
        <AuthHeader loginStep={loginStep} loginEmail={loginEmail} />

        {blockedFlag && !error && (
          <div className="bg-error/10 border border-error/20 text-error text-xs p-4 rounded-2xl mb-6 text-center animate-pulse">
            You are blocked. Please contact support.
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
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
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-on-surface-variant/60 text-xs font-medium uppercase tracking-widest hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-lg">←</span> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}