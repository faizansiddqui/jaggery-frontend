'use client';

import { useEffect } from 'react';
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
                className="bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
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
    const countryDialCode = (countryName: string) => {
        const map: Record<string, string> = {
            india: '+91',
            us: '+1',
            usa: '+1',
            'united states': '+1',
            uk: '+44',
            'united kingdom': '+44',
            uae: '+971',
            canada: '+1',
            australia: '+61',
        };
        const key = String(countryName || '').trim().toLowerCase();
        return map[key] || '+91';
    };

    const normalizePhone = (raw: string) => {
        const cleaned = String(raw || '').replace(/[^\d+]/g, '').trim();
        if (!cleaned) return '';
        if (cleaned.startsWith('+')) return cleaned;
        if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`;
        const noLeadingZero = cleaned.replace(/^0+/, '');
        const code = countryDialCode(value.country);
        return `${code}${noLeadingZero}`;
    };

    const setField = (key: keyof UserAddressInput, fieldValue: string) => {
        if (key === 'phone1' || key === 'phone2') {
            onChange({ ...value, [key]: normalizePhone(fieldValue) });
            return;
        }
        onChange({ ...value, [key]: fieldValue });
    };

    useEffect(() => {
        const pin = String(value.pinCode || '').replace(/\D/g, '');
        if (pin.length !== 6) return;
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                const first = Array.isArray(data) ? data[0] : null;
                const office = Array.isArray(first?.PostOffice) ? first.PostOffice[0] : null;
                if (!office) return;

                // Keep auto-fill helpful, but never override user's manual edits.
                const hasDistrict = String(value.district || '').trim().length > 0;
                const hasState = String(value.state || '').trim().length > 0;
                const hasCountry = String(value.country || '').trim().length > 0;
                const hasCity = String(value.city || '').trim().length > 0;

                const nextDistrict = hasDistrict ? value.district : String(office.District || '');
                const nextState = hasState ? value.state : String(office.State || '');
                const nextCountry = hasCountry ? value.country : String(office.Country || 'India');
                const nextCity = hasCity ? value.city : String(office.Block || office.Name || '');

                if (
                    nextDistrict === value.district &&
                    nextState === value.state &&
                    nextCountry === value.country &&
                    nextCity === value.city
                ) {
                    return;
                }

                onChange({
                    ...value,
                    pinCode: pin,
                    district: nextDistrict,
                    state: nextState,
                    country: nextCountry,
                    city: nextCity,
                });
            } catch {
                // ignore pincode lookup failures
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [onChange, value.pinCode]);

    return (
        <div className="bg-white border border-outline-variant/20 rounded-2xl p-5 md:p-6">
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
                        className="bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
                    >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
            </div>

            {error && <p className="mt-4 font-headline text-[10px] uppercase tracking-widest text-error">{error}</p>}

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    onClick={onSubmit}
                    disabled={busy}
                    className="bg-primary text-on-primary px-5 py-3 rounded-full font-headline text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                    {busy ? 'Saving...' : submitLabel}
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        className="border border-outline-variant/30 rounded-full px-5 py-3 font-headline text-[10px] uppercase tracking-widest hover:border-primary"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
