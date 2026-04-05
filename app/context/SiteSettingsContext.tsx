'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchPublicSiteSettings, type SiteSettings } from '@/app/lib/apiClient';

const defaultSettings: SiteSettings = {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'STREETRIOT',
    navbarTitle: process.env.NEXT_PUBLIC_SITE_NAME || 'STREETRIOT',
    footerTitle: process.env.NEXT_PUBLIC_SITE_NAME || 'STREETRIOT',
    currencySymbol: process.env.NEXT_PUBLIC_CURRENCY || '$',
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    updatedAt: null,
};

type SiteSettingsContextType = {
    settings: SiteSettings;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
    applyLocalSettings: (patch: Partial<SiteSettings>) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

const hasSameSettings = (a: SiteSettings, b: SiteSettings) => {
    return (
        a.siteName === b.siteName &&
        a.navbarTitle === b.navbarTitle &&
        a.footerTitle === b.footerTitle &&
        a.currencySymbol === b.currencySymbol &&
        a.instagramUrl === b.instagramUrl &&
        a.twitterUrl === b.twitterUrl &&
        a.facebookUrl === b.facebookUrl &&
        (a.updatedAt || null) === (b.updatedAt || null)
    );
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSettings = useCallback(async () => {
        try {
            const latest = await fetchPublicSiteSettings();
            setSettings((prev) => {
                const next = { ...prev, ...latest };
                return hasSameSettings(prev, next) ? prev : next;
            });
        } catch {
            // keep defaults if backend settings endpoint fails
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSettings();
    }, [refreshSettings]);

    const applyLocalSettings = useCallback((patch: Partial<SiteSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch };
            return hasSameSettings(prev, next) ? prev : next;
        });
    }, []);

    const value = useMemo(
        () => ({ settings, isLoading, refreshSettings, applyLocalSettings }),
        [settings, isLoading, refreshSettings, applyLocalSettings],
    );

    return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within SiteSettingsProvider');
    }
    return context;
}
