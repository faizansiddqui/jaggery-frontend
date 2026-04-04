export interface UserSession {
    token: string;
    email: string;
}

const TOKEN_KEY = 'streetriot_user_token';
const EMAIL_KEY = 'streetriot_user_email';
const CART_ID_KEY = 'streetriot_cart_id';

function isBrowser() {
    return typeof window !== 'undefined';
}

export function getBackendBaseUrl() {
    const configured = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (configured) return configured.replace(/\/$/, '');
    return 'http://localhost:8080';
}

export function getUserSession(): UserSession | null {
    if (!isBrowser()) return null;
    const token = window.localStorage.getItem(TOKEN_KEY) || '';
    const email = window.localStorage.getItem(EMAIL_KEY) || '';
    if (!token || !email) return null;
    return { token, email };
}

export function setUserSession(session: UserSession) {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, session.token);
    window.localStorage.setItem(EMAIL_KEY, session.email);
}

export function clearUserSession() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(EMAIL_KEY);
}

export function getUserEmail() {
    return getUserSession()?.email || '';
}

export function getUserToken() {
    return getUserSession()?.token || '';
}

export function getCartId() {
    if (!isBrowser()) return '';
    return window.localStorage.getItem(CART_ID_KEY) || '';
}

export function setCartId(cartId: string) {
    if (!isBrowser()) return;
    if (!cartId) {
        window.localStorage.removeItem(CART_ID_KEY);
        return;
    }
    window.localStorage.setItem(CART_ID_KEY, cartId);
}
