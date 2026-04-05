'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminLogout, adminResetPassword, fetchAdminSiteSettings, updateAdminSiteSettings } from '@/app/lib/apiClient';
import { clearAdminSession, getAdminUsername } from '@/app/lib/adminSession';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type SettingsForm = {
    siteName: string;
    navbarTitle: string;
    footerTitle: string;
    currencySymbol: string;
    instagramUrl: string;
    twitterUrl: string;
    facebookUrl: string;
};

export default function AdminSettings() {
    const username = getAdminUsername() || 'admin';
    const { settings, applyLocalSettings, refreshSettings } = useSiteSettings();

    const [form, setForm] = useState<SettingsForm>({
        siteName: settings.siteName,
        navbarTitle: settings.navbarTitle,
        footerTitle: settings.footerTitle,
        currencySymbol: settings.currencySymbol,
        instagramUrl: settings.instagramUrl,
        twitterUrl: settings.twitterUrl,
        facebookUrl: settings.facebookUrl,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchAdminSiteSettings();
                setForm({
                    siteName: data.siteName,
                    navbarTitle: data.navbarTitle,
                    footerTitle: data.footerTitle,
                    currencySymbol: data.currencySymbol,
                    instagramUrl: data.instagramUrl,
                    twitterUrl: data.twitterUrl,
                    facebookUrl: data.facebookUrl,
                });
                applyLocalSettings(data);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : 'Could not load settings.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [applyLocalSettings]);

    const dirty = useMemo(() => {
        return (
            form.siteName !== settings.siteName ||
            form.navbarTitle !== settings.navbarTitle ||
            form.footerTitle !== settings.footerTitle ||
            form.currencySymbol !== settings.currencySymbol ||
            form.instagramUrl !== settings.instagramUrl ||
            form.twitterUrl !== settings.twitterUrl ||
            form.facebookUrl !== settings.facebookUrl
        );
    }, [form, settings]);

    const updateField = (key: keyof SettingsForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSave = async () => {
        try {
            setSaving(true);
            setMessage('');
            setError('');

            const payload = {
                ...form,
                updatedBy: username,
            };

            const updated = await updateAdminSiteSettings(payload);
            applyLocalSettings(updated);
            await refreshSettings();
            setMessage('Settings updated and saved to database.');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const onResetPassword = async () => {
        try {
            setResettingPassword(true);
            setMessage('');
            setError('');
            await adminResetPassword(username, currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setMessage('Admin password updated successfully.');
        } catch (resetError) {
            setError(resetError instanceof Error ? resetError.message : 'Password reset failed.');
        } finally {
            setResettingPassword(false);
        }
    };

    const onLogout = async () => {
        try {
            await adminLogout();
        } catch {
            // ignore and clear local session
        }
        clearAdminSession();
        window.location.href = '/admin/login';
    };

    return (
        <div className="flex flex-col gap-12">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">SYSTEM PARAMETERS</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Portal Settings</h2>
            </header>

            {error && (
                <div className="border border-[#b90c1b]/30 bg-[#b90c1b]/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-[#ff929d]">{error}</p>
                </div>
            )}

            {message && (
                <div className="border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-green-300">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 flex flex-col gap-12">
                    <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Global Branding</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Store Name</span>
                                <input autoComplete="off" value={form.siteName} onChange={(e) => updateField('siteName', e.target.value)} className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-brand text-2xl uppercase focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Currency Symbol</span>
                                <input autoComplete="off" value={form.currencySymbol} onChange={(e) => updateField('currencySymbol', e.target.value)} className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-brand text-2xl uppercase focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Navbar Title</span>
                                <input autoComplete="off" value={form.navbarTitle} onChange={(e) => updateField('navbarTitle', e.target.value)} className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-brand text-2xl uppercase focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Footer Title</span>
                                <input autoComplete="off" value={form.footerTitle} onChange={(e) => updateField('footerTitle', e.target.value)} className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-brand text-2xl uppercase focus:border-[#b90c1b] outline-none" />
                            </label>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Social URLs</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="instagramUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Instagram URL</label>
                            <input autoComplete="off" value={form.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} placeholder="Instagram URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                            <label htmlFor="twitterUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Twitter URL</label>
                            <input autoComplete="off" value={form.twitterUrl} onChange={(e) => updateField('twitterUrl', e.target.value)} placeholder="Twitter URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                            <label htmlFor="facebookUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Facebook URL</label>
                            <input autoComplete="off" value={form.facebookUrl} onChange={(e) => updateField('facebookUrl', e.target.value)} placeholder="Facebook URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    <section className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col gap-6">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Security</h3>
                        <input autoComplete="off" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                        <input autoComplete="off" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                        <button onClick={onResetPassword} disabled={resettingPassword || !currentPassword || !newPassword} className="border border-[#ffffff]/20 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#ffffff]/10 disabled:opacity-40">
                            {resettingPassword ? 'Updating...' : 'Reset Admin Password'}
                        </button>
                        <button onClick={onLogout} className="bg-[#b90c1b] text-white py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#d21628]">
                            Logout Admin
                        </button>
                    </section>

                    <section className="bg-[#b90c1b] p-10 flex flex-col gap-6 text-white">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-white/20 pb-6">Runtime Preview</h3>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Navbar: {form.navbarTitle || 'STREETRIOT'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Footer: {form.footerTitle || 'STREETRIOT'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Currency: {form.currencySymbol || '$'}</p>
                    </section>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={onSave} disabled={loading || saving || !dirty} className="bg-[#ffffff] text-[#1c1b1b] px-12 py-6 font-brand text-2xl uppercase hover:bg-[#b90c1b] hover:text-[#ffffff] transition-all disabled:opacity-40">
                    {saving ? 'Saving...' : 'Commit Changes'}
                </button>
            </div>
        </div>
    );
}
