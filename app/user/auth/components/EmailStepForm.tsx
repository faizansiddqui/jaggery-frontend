'use client';

import type React from 'react';

type EmailStepFormProps = {
    email: string;
    isLoading: boolean;
    error: string | null;
    onEmailChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
};

export default function EmailStepForm({
    email,
    isLoading,
    error,
    onEmailChange,
    onSubmit,
}: EmailStepFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                    Email Address
                </label>
                <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none"
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
                disabled={isLoading}
                className="w-full bg-primary text-on-primary py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
            >
                {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
        </form>
    );
}
