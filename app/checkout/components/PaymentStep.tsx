'use client';

interface PayData {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

interface PaymentStepProps {
    pay: PayData;
    errors: Record<string, string>;
    busy: boolean;
    totalText: string;
    onBack: () => void;
    onPayChange: (next: PayData) => void;
    onSubmit: () => void;
}

export default function PaymentStep({ pay, errors, busy, totalText, onBack, onPayChange, onSubmit }: PaymentStepProps) {
    const formatCard = (val: string) => val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    const formatExpiry = (val: string) => {
        const v = val.replace(/\D/g, '').slice(0, 4);
        return v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
    };

    return (
        <div className="flex flex-col gap-5">
            <button onClick={onBack} className="self-start font-headline text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">
                Back to Shipping
            </button>
            <h2 className="font-brand text-3xl uppercase tracking-widest">Payment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    value={pay.cardName}
                    onChange={(event) => onPayChange({ ...pay, cardName: event.target.value })}
                    placeholder="Name on Card"
                    className="md:col-span-2 bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                />
                <input
                    value={pay.cardNumber}
                    onChange={(event) => onPayChange({ ...pay, cardNumber: formatCard(event.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    className="md:col-span-2 bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                />
                <input
                    value={pay.expiry}
                    onChange={(event) => onPayChange({ ...pay, expiry: formatExpiry(event.target.value) })}
                    placeholder="MM/YY"
                    className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                />
                <input
                    value={pay.cvv}
                    onChange={(event) => onPayChange({ ...pay, cvv: event.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="CVV"
                    className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                />
            </div>

            <button
                onClick={onSubmit}
                className="self-start bg-[#b90c1b] text-white px-8 py-4 font-headline text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-70"
                disabled={busy}
            >
                {busy ? 'Placing Order...' : `Place Order - ${totalText}`}
            </button>
            {errors.payment && <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{errors.payment}</p>}
        </div>
    );
}
