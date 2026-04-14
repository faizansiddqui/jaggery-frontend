'use client';

import type React from 'react';

type OtpStepFormProps = {
    otp: string;
    isLoading: boolean;
    error: string | null;
    onOtpChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
    onBack: () => void;
};

export default function OtpStepForm({
    otp,
    isLoading,
    error,
    onOtpChange,
    onSubmit,
    onBack,
}: OtpStepFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                    OTP Code
                </label>
                <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none text-center tracking-[0.5em]"
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="bg-error/10 text-error text-sm p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-primary text-on-primary py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
            >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
                type="button"
                onClick={onBack}
                className="w-full text-on-surface-variant text-sm hover:text-primary transition-colors"
            >
                Use different email
            </button>
        </form>
    );
}
