import type { Product } from '@/app/data/products';
import { normalizeBackendProduct } from '@/app/lib/backendProducts';
import { getBackendBaseUrl, getCartId, getUserEmail, getUserToken, setCartId } from '@/app/lib/session';
import { getAdminToken } from '@/app/lib/adminSession';

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

export interface AdminOrderItem {
    product_id: number;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
}

export interface AdminOrder {
    _id?: string;
    order_id?: number;
    order_code?: string;
    status: string;
    payment_status?: string;
    payment_method?: string;
    amount?: number;
    createdAt?: string;
    FullName?: string;
    user_email?: string;
    items: AdminOrderItem[];
}

export interface AdminCustomer {
    email: string;
    name: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderAt: string | null;
    activeSessions: number;
    status: string;
}

export interface AdminCustomerOverview {
    stats: {
        totalCustomers: number;
        activeSessions: number;
        conversionRate: number;
        churnRate: number;
    };
    customers: AdminCustomer[];
}

export interface SiteSettings {
    siteName: string;
    navbarTitle: string;
    footerTitle: string;
    currencySymbol: string;
    instagramUrl: string;
    twitterUrl: string;
    facebookUrl: string;
    updatedBy?: string;
    updatedAt?: string | null;
}

export interface AdminCustomerActivity {
    customer: {
        email: string;
        name: string;
        isBlocked: boolean;
        blockedReason: string;
        blockedAt: string | null;
    };
    summary: {
        activeSessions: number;
        ordersCount: number;
        totalSpent: number;
        wishlistCount: number;
        recentSearches: string[];
        recentViewed: number[];
    };
    orders: Array<{
        orderId: number | null;
        orderCode: string;
        status: string;
        amount: number;
        itemCount: number;
        createdAt: string | null;
    }>;
    wishlist: Array<{
        productId: number;
        productCode: string;
        name: string;
        price: number;
        image: string;
        addedAt: string | null;
    }>;
    cartEvents: Array<{
        type: string;
        title: string;
        occurredAt: string | null;
        metadata?: Record<string, unknown>;
    }>;
    timeline: Array<{
        type: string;
        title: string;
        occurredAt: string | null;
        order_code?: string;
        product_id?: number;
        metadata?: Record<string, unknown>;
    }>;
}

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
    const adminToken = getAdminToken();
    if (adminToken) {
        headers.set('x-admin-token', adminToken);
    }

    let response: Response;
    try {
        response = await fetch(`${base}${path}`, {
            ...options,
            headers,
            cache: 'no-store',
        });
    } catch {
        throw new Error(`Failed to fetch. Check backend server and CORS at ${base}`);
    }

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
    const payload = { cart_id: getCartId(), email: getUserEmail(), ...item };
    const data = await request('/user/add-to-cart', { method: 'POST', body: JSON.stringify(payload) });
    if (typeof data.cart_id === 'string' && data.cart_id) setCartId(data.cart_id);
    return Array.isArray(data.items) ? data.items : [];
}

export async function updateCartItem(productId: number, size: string, qty: number, color = '') {
    const payload = { cart_id: getCartId(), email: getUserEmail(), product_id: productId, color, size, qty };
    const data = await request('/user/update-cart-item', { method: 'POST', body: JSON.stringify(payload) });
    return Array.isArray(data.items) ? data.items : [];
}

export async function clearCartItems() {
    const payload = { cart_id: getCartId(), email: getUserEmail() };
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

export async function adminLogout() {
    return request('/api/auth/admin-logout', {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
    const data = await request('/admin/get-orders');
    const rows = Array.isArray(data.orders) ? data.orders : [];

    return rows.map((entry) => {
        const row = asRecord(entry);
        const itemRows = Array.isArray(row.items) ? row.items : [];

        return {
            _id: typeof row._id === 'string' ? row._id : undefined,
            order_id: Number(row.order_id || 0) || undefined,
            order_code: typeof row.order_code === 'string' ? row.order_code : undefined,
            status: String(row.status || 'pending'),
            payment_status: typeof row.payment_status === 'string' ? row.payment_status : undefined,
            payment_method: typeof row.payment_method === 'string' ? row.payment_method : undefined,
            amount: Number(row.amount || 0),
            createdAt: typeof row.createdAt === 'string' ? row.createdAt : undefined,
            FullName: typeof row.FullName === 'string' ? row.FullName : undefined,
            user_email: typeof row.user_email === 'string' ? row.user_email : undefined,
            items: itemRows.map((item) => {
                const mapped = asRecord(item);
                return {
                    product_id: Number(mapped.product_id || 0),
                    quantity: Number(mapped.quantity || 0),
                    price: Number(mapped.price || 0),
                    color: typeof mapped.color === 'string' ? mapped.color : undefined,
                    size: typeof mapped.size === 'string' ? mapped.size : undefined,
                };
            }),
        } as AdminOrder;
    });
}

export async function updateAdminOrderStatus(orderId: string, status: string, productId?: number) {
    const payload: Record<string, unknown> = {
        order_id: orderId,
        status,
    };
    if (typeof productId === 'number' && Number.isFinite(productId)) {
        payload.product_id = productId;
    }

    return request('/admin/update-order-status', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function fetchAdminCustomersOverview(): Promise<AdminCustomerOverview> {
    const data = await request('/admin/customers/overview');
    const stats = asRecord(data.stats);
    const customerRows = Array.isArray(data.customers) ? data.customers : [];

    return {
        stats: {
            totalCustomers: Number(stats.totalCustomers || 0),
            activeSessions: Number(stats.activeSessions || 0),
            conversionRate: Number(stats.conversionRate || 0),
            churnRate: Number(stats.churnRate || 0),
        },
        customers: customerRows.map((entry) => {
            const row = asRecord(entry);
            return {
                email: String(row.email || ''),
                name: String(row.name || ''),
                ordersCount: Number(row.ordersCount || 0),
                totalSpent: Number(row.totalSpent || 0),
                lastOrderAt: row.lastOrderAt ? String(row.lastOrderAt) : null,
                activeSessions: Number(row.activeSessions || 0),
                status: String(row.status || 'NEW'),
            } as AdminCustomer;
        }),
    };
}

const mapSiteSettings = (value: unknown): SiteSettings => {
    const row = asRecord(value);
    return {
        siteName: String(row.siteName || 'STREETRIOT'),
        navbarTitle: String(row.navbarTitle || row.siteName || 'STREETRIOT'),
        footerTitle: String(row.footerTitle || row.siteName || 'STREETRIOT'),
        currencySymbol: String(row.currencySymbol || '$'),
        instagramUrl: String(row.instagramUrl || ''),
        twitterUrl: String(row.twitterUrl || ''),
        facebookUrl: String(row.facebookUrl || ''),
        updatedBy: row.updatedBy ? String(row.updatedBy) : undefined,
        updatedAt: row.updatedAt ? String(row.updatedAt) : null,
    };
};

export async function fetchAdminSiteSettings(): Promise<SiteSettings> {
    const data = await request('/admin/settings');
    return mapSiteSettings(data.settings);
}

export async function fetchPublicSiteSettings(): Promise<SiteSettings> {
    const data = await request('/admin/settings/public');
    return mapSiteSettings(data.settings);
}

export async function updateAdminSiteSettings(payload: Partial<SiteSettings>) {
    const data = await request('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
    return mapSiteSettings(data.settings);
}

export async function updateAdminCustomerStatus(email: string, isBlocked: boolean, blockedReason = '') {
    return request(`/admin/customers/${encodeURIComponent(email)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked, blockedReason }),
    });
}

export async function fetchAdminCustomerActivity(email: string): Promise<AdminCustomerActivity> {
    const data = await request(`/admin/customers/${encodeURIComponent(email)}/activity`);
    const payload = asRecord(data);
    return {
        customer: {
            email: String(asRecord(payload.customer).email || email),
            name: String(asRecord(payload.customer).name || ''),
            isBlocked: Boolean(asRecord(payload.customer).isBlocked),
            blockedReason: String(asRecord(payload.customer).blockedReason || ''),
            blockedAt: asRecord(payload.customer).blockedAt ? String(asRecord(payload.customer).blockedAt) : null,
        },
        summary: {
            activeSessions: Number(asRecord(payload.summary).activeSessions || 0),
            ordersCount: Number(asRecord(payload.summary).ordersCount || 0),
            totalSpent: Number(asRecord(payload.summary).totalSpent || 0),
            wishlistCount: Number(asRecord(payload.summary).wishlistCount || 0),
            recentSearches: Array.isArray(asRecord(payload.summary).recentSearches) ? (asRecord(payload.summary).recentSearches as string[]) : [],
            recentViewed: Array.isArray(asRecord(payload.summary).recentViewed) ? (asRecord(payload.summary).recentViewed as number[]) : [],
        },
        orders: Array.isArray(payload.orders) ? (payload.orders as AdminCustomerActivity['orders']) : [],
        wishlist: Array.isArray(payload.wishlist) ? (payload.wishlist as AdminCustomerActivity['wishlist']) : [],
        cartEvents: Array.isArray(payload.cartEvents) ? (payload.cartEvents as AdminCustomerActivity['cartEvents']) : [],
        timeline: Array.isArray(payload.timeline) ? (payload.timeline as AdminCustomerActivity['timeline']) : [],
    };
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
