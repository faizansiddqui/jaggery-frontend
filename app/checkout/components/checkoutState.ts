import type { UserAddress, UserAddressInput } from '@/app/lib/apiClient';

export type Step = 'shipping' | 'payment' | 'confirmed';

export interface ShipData {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zip: string;
}

export interface PayData {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export const emptyAddress: UserAddressInput = {
    FullName: '',
    phone1: '',
    phone2: '',
    country: 'India',
    state: '',
    city: '',
    district: '',
    pinCode: '',
    address: '',
    address_line2: '',
    addressType: 'Home',
};

export const toAddressInput = (item: UserAddress): UserAddressInput => ({
    FullName: item.FullName,
    phone1: item.phone1,
    phone2: item.phone2,
    country: item.country || 'India',
    state: item.state,
    city: item.city,
    district: item.district,
    pinCode: item.pinCode,
    address: item.address,
    address_line2: item.address_line2,
    addressType: item.addressType || 'Home',
});