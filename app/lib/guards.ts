'use client';

import { useEffect, useState } from 'react';
import { getUserSession } from '@/app/lib/session';
import { hasAdminSession } from '@/app/lib/adminSession';

export function useRequireUserSession(redirectPath = '/user/auth', enabled = true) {
    const [ready, setReady] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setAuthenticated(false);
            setReady(true);
            return;
        }

        const session = getUserSession();
        const ok = Boolean(session?.token && session?.email);
        setAuthenticated(ok);
        setReady(true);
        if (!ok && typeof window !== 'undefined' && window.location.pathname !== redirectPath) {
            window.location.replace(redirectPath);
        }
    }, [redirectPath, enabled]);

    return { ready, authenticated };
}

export function useRequireAdminSession(redirectPath = '/admin/login', enabled = true) {
    const [ready, setReady] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setAuthenticated(false);
            setReady(true);
            return;
        }

        const ok = hasAdminSession();
        setAuthenticated(ok);
        setReady(true);
        if (!ok && typeof window !== 'undefined' && window.location.pathname !== redirectPath) {
            window.location.replace(redirectPath);
        }
    }, [redirectPath, enabled]);

    return { ready, authenticated };
}
