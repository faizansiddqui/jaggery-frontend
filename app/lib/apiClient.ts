import type { Product } from '@/app/data/products';
import { normalizeBackendProduct } from '@/app/lib/backendProducts';
import { getBackendBaseUrl, getCartId, getUserEmail, getUserToken, setCartId } from '@/app/lib/session';

type AnyRecord = Record<string, unknown>;

export interface CartPayloadItem {
    product_id: number;
    color: string;
    size: string;
    qty: number;
    price: number;
    mrp: number;
    title: string;
    image: string;
}

export interface UserAddress {
    id: number;
    address_id: number;
    FullName: string;
    phone1: string;
    phone2: string;
    email: string;
    country: string;
    state: string;
    city: string;
    district: string;
    pinCode: string;
    address: string;
    address_line2: string;
    addressType: string;
}

export type UserAddressInput = Omit<UserAddress, 'id' | 'address_id' | 'email'>;

function asRecord(value: unknown): AnyRecord {
    return value && typeof value === 'object' ? (value as AnyRecord) : {};
}

function mapAddress(row: AnyRecord): UserAddress {
    const id = Number(row.address_id || row.id || 0);
    return {
        id,
        address_id: id,
        FullName: String(row.FullName || ''),
        phone1: String(row.phone1 || ''),
        phone2: String(row.phone2 || ''),
        email: String(row.email || ''),
        country: String(row.country || 'India'),
        state: String(row.state || ''),
        city: String(row.city || ''),
        district: String(row.district || ''),
        pinCode: String(row.pinCode || ''),
        address: String(row.address || ''),
        address_line2: String(row.address_line2 || ''),
        addressType: String(row.addressType || 'Home'),
    };
}

async function request(path: string, options: RequestInit = {}, auth = false) {
    const base = getBackendBaseUrl();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (auth) {
        const token = getUserToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${base}${path}`, {
        ...options,
        headers,
        cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error((asRecord(data).message as string) || `Request failed: ${response.status}`);
    }
    return asRecord(data);
}

export async function sendOtp(email: string) {
    return request('/api/auth/user/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

export async function verifyOtp(email: string, otp: string) {
    const data = await request('/api/auth/user/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
    });

    return {
        token: String(data.token || ''),
        email: String(data.email || email),
        isNew: Boolean(data.isNew),
        profile: asRecord(data.profile),
    };
}

export async function fetchUserProfile() {
    return request('/user/get-user-profile', { method: 'POST', body: JSON.stringify({}) }, true);
}

export async function updateUserProfile(payload: { name: string; gender: string }) {
    return request('/user/update-user-profile', { method: 'POST', body: JSON.stringify(payload) }, true);
}

export async function fetchWishlistProducts(): Promise<Product[]> {
    const email = getUserEmail();
    if (!email) return [];
    const data = await request('/user/wishlist/list', { method: 'POST', body: JSON.stringify({ email }) }, true);
    const products = Array.isArray(data.products) ? data.products : [];
    return products.map(normalizeBackendProduct);
}

export async function addWishlistProduct(productId: number) {
    const email = getUserEmail();
    return request('/user/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ email, product_id: productId }),
    }, true);
}

export async function removeWishlistProduct(productId: number) {
    const email = getUserEmail();
    return request('/user/wishlist/remove', {
        method: 'POST',
        body: JSON.stringify({ email, product_id: productId }),
    }, true);
}

export async function fetchCartItems() {
    const cart_id = getCartId();
    const data = await request('/user/get-user-cart', {
        method: 'POST',
        body: JSON.stringify({ cart_id }),
    });
    if (typeof data.cart_id === 'string' && data.cart_id) setCartId(data.cart_id);
    return Array.isArray(data.items) ? data.items : [];
}

export async function addCartItem(item: CartPayloadItem) {
    const payload = { cart_id: getCartId(), ...item };
    const data = await request('/user/add-to-cart', { method: 'POST', body: JSON.stringify(payload) });
    if (typeof data.cart_id === 'string' && data.cart_id) setCartId(data.cart_id);
    return Array.isArray(data.items) ? data.items : [];
}

export async function updateCartItem(productId: number, size: string, qty: number, color = '') {
    const payload = { cart_id: getCartId(), product_id: productId, color, size, qty };
    const data = await request('/user/update-cart-item', { method: 'POST', body: JSON.stringify(payload) });
    return Array.isArray(data.items) ? data.items : [];
}

export async function clearCartItems() {
    const payload = { cart_id: getCartId() };
    const data = await request('/user/clear-cart', { method: 'POST', body: JSON.stringify(payload) });
    return Array.isArray(data.items) ? data.items : [];
}

export async function fetchOrders() {
    const email = getUserEmail();
    const data = await request('/user/get-orders', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
    return Array.isArray(data.orders) ? data.orders : [];
}

export async function fetchUserAddresses(): Promise<UserAddress[]> {
    const email = getUserEmail();
    const data = await request('/user/get-user-addresess', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }, true);
    const rows = Array.isArray(data.addresses) ? data.addresses : Array.isArray(data.data) ? data.data : [];
    return rows.map((entry) => mapAddress(asRecord(entry)));
}

export async function createUserAddress(payload: UserAddressInput): Promise<UserAddress> {
    const data = await request('/user/create-newAddress', {
        method: 'POST',
        body: JSON.stringify(payload),
    }, true);
    return mapAddress(asRecord(data.address || data.data));
}

export async function updateUserAddress(addressId: number, payload: UserAddressInput): Promise<UserAddress> {
    const data = await request('/user/update-user-address', {
        method: 'PATCH',
        body: JSON.stringify({ ...payload, address_id: addressId }),
    }, true);
    return mapAddress(asRecord(data.address || data.data));
}

export async function createBackendOrder(items: Array<{ product_id: number; quantity: number; size: string; color?: string }>, address_id?: number) {
    const email = getUserEmail();
    return request('/user/create-order', {
        method: 'POST',
        body: JSON.stringify({ items, address_id: address_id || null, email }),
    });
}

export async function cancelUserOrder(orderRef: string) {
    const email = getUserEmail();
    return request('/user/cancel-order', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderRef, email }),
    });
}

export async function requestUserOrderReturn(orderRef: string, reason = 'Requested by user') {
    const email = getUserEmail();
    return request('/user/return-order', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderRef, reason, email }),
    }, true);
}

export async function adminLogin(username: string, password: string) {
    return request('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

export async function adminResetPassword(username: string, currentPassword: string, newPassword: string) {
    return request('/api/auth/admin-reset', {
        method: 'POST',
        body: JSON.stringify({ username, currentPassword, newPassword }),
    });
}

export async function submitProductReview(payload: {
    productId: number;
    rating: number;
    text: string;
    title?: string;
    userName: string;
    email?: string;
    image?: File;
}) {
    const base = getBackendBaseUrl();
    const form = new FormData();
    form.append('product_id', String(payload.productId));
    form.append('review_rate', String(payload.rating));
    form.append('review_text', payload.text);
    form.append('review_title', payload.title || '');
    form.append('user_name', payload.userName || 'Anonymous');
    form.append('email', payload.email || getUserEmail() || 'guest@streetriot.com');
    if (payload.image) form.append('reviewImage', payload.image);

    const response = await fetch(`${base}/user/product-reviews`, {
        method: 'POST',
        body: form,
        cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((asRecord(data).message as string) || 'Failed to submit review');
    return asRecord(data);
}

export async function fetchProductReviews(productId: number) {
    const data = await request(`/user/get-product-reviews/${productId}`);
    return Array.isArray(data.reviews) ? data.reviews : [];
}
