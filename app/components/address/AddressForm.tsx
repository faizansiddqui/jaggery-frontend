'use client';

import type { UserAddressInput } from '@/app/lib/apiClient';

interface AddressFormProps {
    value: UserAddressInput;
    busy?: boolean;
    error?: string;
    submitLabel: string;
    onChange: (next: UserAddressInput) => void;
    onSubmit: () => void;
    onCancel?: () => void;
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <label className="flex flex-col gap-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-60">{label}</span>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
            />
        </label>
    );
}

export default function AddressForm({
    value,
    busy = false,
    error = '',
    submitLabel,
    onChange,
    onSubmit,
    onCancel,
}: AddressFormProps) {
    const setField = (key: keyof UserAddressInput, fieldValue: string) => {
        onChange({ ...value, [key]: fieldValue });
    };

    return (
        <div className="bg-[#f6f3f2] border border-[#1c1b1b]/10 p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" value={value.FullName} onChange={(next) => setField('FullName', next)} />
                <Field label="Phone" value={value.phone1} onChange={(next) => setField('phone1', next)} />
                <Field label="Alt Phone" value={value.phone2} onChange={(next) => setField('phone2', next)} />
                <Field label="Pincode" value={value.pinCode} onChange={(next) => setField('pinCode', next)} />
                <Field label="Country" value={value.country} onChange={(next) => setField('country', next)} />
                <Field label="State" value={value.state} onChange={(next) => setField('state', next)} />
                <Field label="City/Town" value={value.city} onChange={(next) => setField('city', next)} />
                <Field label="District" value={value.district} onChange={(next) => setField('district', next)} />
                <div className="md:col-span-2">
                    <Field label="Address Line 1" value={value.address} onChange={(next) => setField('address', next)} />
                </div>
                <div className="md:col-span-2">
                    <Field
                        label="Address Line 2"
                        value={value.address_line2}
                        onChange={(next) => setField('address_line2', next)}
                    />
                </div>
                <label className="flex flex-col gap-2">
                    <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-60">Address Type</span>
                    <select
                        value={value.addressType}
                        onChange={(event) => setField('addressType', event.target.value)}
                        className="bg-white border border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                    >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
            </div>

            {error && <p className="mt-4 font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p>}

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    onClick={onSubmit}
                    disabled={busy}
                    className="bg-[#1c1b1b] text-white px-5 py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b] transition-colors disabled:opacity-70"
                >
                    {busy ? 'Saving...' : submitLabel}
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        className="border border-[#1c1b1b]/20 px-5 py-3 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
