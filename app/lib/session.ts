export interface UserSession {
    token: string;
    email: string;
}

const TOKEN_KEY = 'streetriot_user_token';
const EMAIL_KEY = 'streetriot_user_email';
const CART_ID_KEY = 'streetriot_cart_id';
const PROD_BACKEND_FALLBACK = 'https://street-riot-backend-production.up.railway.app';

function normalizeBackendUrl(input: string) {
    let value = String(input || '').trim();
    if (!value) return '';

    // Common typo guard for Railway domain.
    value = value.replace(/\.railiway\.app/gi, '.railway.app');

    if (!/^https?:\/\//i.test(value)) {
        value = `https://${value}`;
    }

    return value.replace(/\/$/, '');
}

function isBrowser() {
    return typeof window !== 'undefined';
}

export function getBackendBaseUrl() {
    return getBackendBaseUrlCandidates()[0] || 'http://localhost:8080';
}

export function getBackendBaseUrlCandidates() {
    const configuredRaw = String(process.env.NEXT_PUBLIC_BACKEND_URL || '').trim();
    const configured = normalizeBackendUrl(configuredRaw);
    const typoFixedFromRaw = normalizeBackendUrl(configuredRaw.replace(/\.railiway\.app/gi, '.railway.app'));
    const list: string[] = [];

    if (configured) list.push(configured);
    if (typoFixedFromRaw && !list.includes(typoFixedFromRaw)) list.push(typoFixedFromRaw);

    if (process.env.NODE_ENV === 'production') {
        if (!list.includes(PROD_BACKEND_FALLBACK)) list.push(PROD_BACKEND_FALLBACK);
    } else {
        if (isBrowser()) {
            const host = window.location.hostname;
            const isLocalHost = host === 'localhost' || host === '127.0.0.1';
            if (!isLocalHost && !list.includes(PROD_BACKEND_FALLBACK)) {
                list.push(PROD_BACKEND_FALLBACK);
            }
        }
        if (!list.includes('http://localhost:8080')) list.push('http://localhost:8080');
    }

    if (!list.length) list.push('http://localhost:8080');
    return list;
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
