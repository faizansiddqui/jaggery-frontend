'use client';

interface PaymentStepProps {
    errors: Record<string, string>;
    busy: boolean;
    totalText: string;
    onBack: () => void;
    onSubmit: () => void;
}

export default function PaymentStep({ errors, busy, totalText, onBack, onSubmit }: PaymentStepProps) {
    return (
        <div className="flex flex-col gap-5">
            <button onClick={onBack} className="self-start font-headline text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">
                Back to Shipping
            </button>
            <h2 className="font-brand text-3xl uppercase tracking-widest">Payment Details</h2>

            <div className="bg-white border border-[#1c1b1b]/10 p-5 space-y-3">
                <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Payment Gateway</p>
                <p className="font-brand text-3xl uppercase">Razorpay Secure Checkout</p>
                <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">
                    UPI, Cards, Netbanking and Wallets supported inside the secure Razorpay popup.
                </p>
            </div>

            <button
                onClick={onSubmit}
                className="self-start bg-[#b90c1b] text-white px-8 py-4 font-headline text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-70"
                disabled={busy}
            >
                {busy ? 'Opening Razorpay...' : `Pay ${totalText} with Razorpay`}
            </button>
            {errors.payment && <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{errors.payment}</p>}
        </div>
    );
}
