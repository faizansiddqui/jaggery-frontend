const ADMIN_TOKEN_KEY = 'streetriot_admin_token';
const ADMIN_USER_KEY = 'streetriot_admin_user';

function isBrowser() {
    return typeof window !== 'undefined';
}

export function getAdminToken() {
    if (!isBrowser()) return '';
    return window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function getAdminUsername() {
    if (!isBrowser()) return '';
    return window.localStorage.getItem(ADMIN_USER_KEY) || '';
}

export function setAdminSession(token: string, username: string) {
    if (!isBrowser()) return;
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    window.localStorage.setItem(ADMIN_USER_KEY, username);
}

export function clearAdminSession() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.localStorage.removeItem(ADMIN_USER_KEY);
}

export function hasAdminSession() {
    return Boolean(getAdminToken());
}
