'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import {
    adminLogout,
    adminResetPassword,
    createAdminInstagramGalleryItem,
    deleteAdminInstagramGalleryItem,
    fetchAdminSiteSettings,
    updateAdminSiteSettings,
    type SiteSettings,
} from '@/app/lib/apiClient';
import { clearAdminSession, getAdminUsername } from '@/app/lib/adminSession';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type SettingsForm = {
    siteName: string;
    navbarTitle: string;
    footerTitle: string;
    footerDescription: string;
    companyAddress: string;
    companyEmail: string;
    emailFooterDescription: string;
    currencySymbol: string;
    instagramUrl: string;
    instagramHandle: string;
    twitterUrl: string;
    facebookUrl: string;
};

type SocialUrlField = 'instagramUrl' | 'twitterUrl' | 'facebookUrl';

type InstagramGalleryItem = SiteSettings['instagramGallery'][number];

const SOCIAL_FIELD_META: Record<SocialUrlField, { label: string; hosts: string[] }> = {
    instagramUrl: { label: 'Instagram', hosts: ['instagram.com', 'instagr.am'] },
    twitterUrl: { label: 'Twitter', hosts: ['x.com', 'twitter.com'] },
    facebookUrl: { label: 'Facebook', hosts: ['facebook.com', 'fb.com'] },
};

const normalizeSocialUrl = (value: string) => {
    const input = String(value || '').trim();
    if (!input) return '';
    if (/^https?:\/\//i.test(input)) return input;
    return `https://${input}`;
};

const hasAllowedSocialHost = (hostname: string, allowedHosts: string[]) => {
    const safeHost = String(hostname || '').toLowerCase();
    return allowedHosts.some((domain) => safeHost === domain || safeHost.endsWith(`.${domain}`));
};

const validateSocialUrls = (form: SettingsForm) => {
    const nextValues: Pick<SettingsForm, SocialUrlField> = {
        instagramUrl: '',
        twitterUrl: '',
        facebookUrl: '',
    };

    const problems: string[] = [];

    (Object.keys(SOCIAL_FIELD_META) as SocialUrlField[]).forEach((field) => {
        const meta = SOCIAL_FIELD_META[field];
        const normalized = normalizeSocialUrl(form[field]);
        if (!normalized) {
            nextValues[field] = '';
            return;
        }

        let parsed: URL;
        try {
            parsed = new URL(normalized);
        } catch {
            problems.push(`${meta.label} URL is invalid.`);
            return;
        }

        if (parsed.protocol !== 'https:') {
            problems.push(`${meta.label} URL must start with https://.`);
            return;
        }

        if (!hasAllowedSocialHost(parsed.hostname, meta.hosts)) {
            problems.push(`${meta.label} URL must point to ${meta.hosts.join(' or ')}.`);
            return;
        }

        nextValues[field] = parsed.toString();
    });

    return {
        nextValues,
        error: problems.length ? problems.join(' ') : '',
    };
};

export default function AdminSettings() {
    const username = getAdminUsername() || 'admin';
    const { settings, applyLocalSettings, refreshSettings } = useSiteSettings();

    const [form, setForm] = useState<SettingsForm>({
        siteName: settings.siteName,
        navbarTitle: settings.navbarTitle,
        footerTitle: settings.footerTitle,
        footerDescription: settings.footerDescription,
        companyAddress: settings.companyAddress,
        companyEmail: settings.companyEmail,
        emailFooterDescription: settings.emailFooterDescription,
        currencySymbol: settings.currencySymbol,
        instagramUrl: settings.instagramUrl,
        instagramHandle: settings.instagramHandle,
        twitterUrl: settings.twitterUrl,
        facebookUrl: settings.facebookUrl,
    });

    const [instagramItems, setInstagramItems] = useState<InstagramGalleryItem[]>(settings.instagramGallery || []);
    const [newInstagramUsername, setNewInstagramUsername] = useState(settings.instagramHandle || 'kinetic_riot');
    const [newInstagramFile, setNewInstagramFile] = useState<File | null>(null);
    const [newInstagramInputKey, setNewInstagramInputKey] = useState(0);
    const [uploadingInstagram, setUploadingInstagram] = useState(false);
    const [processingInstagramId, setProcessingInstagramId] = useState<string | null>(null);
    const [savingInstagramHandle, setSavingInstagramHandle] = useState(false);

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
                    footerDescription: data.footerDescription,
                    companyAddress: data.companyAddress,
                    companyEmail: data.companyEmail,
                    emailFooterDescription: data.emailFooterDescription,
                    currencySymbol: data.currencySymbol,
                    instagramUrl: data.instagramUrl,
                    instagramHandle: data.instagramHandle,
                    twitterUrl: data.twitterUrl,
                    facebookUrl: data.facebookUrl,
                });
                setInstagramItems(data.instagramGallery || []);
                setNewInstagramUsername(data.instagramHandle || 'kinetic_riot');
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
            form.footerDescription !== settings.footerDescription ||
            form.companyAddress !== settings.companyAddress ||
            form.companyEmail !== settings.companyEmail ||
            form.emailFooterDescription !== settings.emailFooterDescription ||
            form.currencySymbol !== settings.currencySymbol ||
            form.instagramUrl !== settings.instagramUrl ||
            form.instagramHandle !== settings.instagramHandle ||
            form.twitterUrl !== settings.twitterUrl ||
            form.facebookUrl !== settings.facebookUrl
        );
    }, [form, settings]);

    const updateField = (key: keyof SettingsForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const instagramHandleDirty = form.instagramHandle.trim() !== (settings.instagramHandle || '').trim();

    const onSave = async () => {
        setMessage('');
        setError('');

        const socialValidation = validateSocialUrls(form);
        if (socialValidation.error) {
            setError(socialValidation.error);
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                ...socialValidation.nextValues,
                updatedBy: username,
            };

            const updated = await updateAdminSiteSettings(payload);
            applyLocalSettings(updated);
            setInstagramItems(updated.instagramGallery || []);
            await refreshSettings();
            setMessage('Settings updated and saved to database.');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const onSaveInstagramHandle = async () => {
        if (!instagramHandleDirty) return;

        try {
            setSavingInstagramHandle(true);
            setMessage('');
            setError('');
            const updated = await updateAdminSiteSettings({
                instagramHandle: form.instagramHandle,
                updatedBy: username,
            });
            applyLocalSettings(updated);
            setInstagramItems(updated.instagramGallery || []);
            setNewInstagramUsername(updated.instagramHandle || 'kinetic_riot');
            await refreshSettings();
            setMessage('Instagram handle updated successfully.');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Failed to update Instagram handle.');
        } finally {
            setSavingInstagramHandle(false);
        }
    };

    const onCancelInstagramHandle = () => {
        updateField('instagramHandle', settings.instagramHandle || 'kinetic_riot');
        setMessage('Instagram handle changes discarded.');
        setError('');
    };

    const onAddInstagramItem = async () => {
        if (!newInstagramFile) {
            setError('Select an image to upload for Instagram feed.');
            return;
        }

        try {
            setUploadingInstagram(true);
            setMessage('');
            setError('');

            const updated = await createAdminInstagramGalleryItem({
                username: newInstagramUsername || form.instagramHandle || 'kinetic_riot',
                image: newInstagramFile,
                updatedBy: username,
            });

            applyLocalSettings(updated);
            setInstagramItems(updated.instagramGallery || []);
            setNewInstagramFile(null);
            setNewInstagramInputKey((prev) => prev + 1);
            await refreshSettings();
            setMessage('Instagram image uploaded successfully.');
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload Instagram image.');
        } finally {
            setUploadingInstagram(false);
        }
    };

    const onDeleteInstagramItem = async (itemId: string) => {
        const confirmed = window.confirm('Delete this Instagram feed item permanently?');
        if (!confirmed) return;

        try {
            setProcessingInstagramId(itemId);
            setMessage('');
            setError('');

            const updated = await deleteAdminInstagramGalleryItem(itemId, username);
            applyLocalSettings(updated);
            setInstagramItems(updated.instagramGallery || []);
            await refreshSettings();
            setMessage('Instagram item deleted successfully.');
        } catch (itemError) {
            setError(itemError instanceof Error ? itemError.message : 'Failed to delete Instagram item.');
        } finally {
            setProcessingInstagramId(null);
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

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-12">
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
                            <label className="md:col-span-2 flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Footer Description</span>
                                <textarea
                                    value={form.footerDescription}
                                    onChange={(e) => updateField('footerDescription', e.target.value)}
                                    rows={3}
                                    className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-[#b90c1b]"
                                />
                            </label>
                            <label className="md:col-span-2 flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Company Address</span>
                                <textarea
                                    value={form.companyAddress}
                                    onChange={(e) => updateField('companyAddress', e.target.value)}
                                    rows={3}
                                    className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-[#b90c1b]"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Company Email</span>
                                <input
                                    autoComplete="off"
                                    value={form.companyEmail}
                                    onChange={(e) => updateField('companyEmail', e.target.value)}
                                    className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-headline text-xs uppercase tracking-widest focus:border-[#b90c1b] outline-none"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Social URLs</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="instagramHandle" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Instagram Handle</label>
                            <div className="flex items-center gap-2">
                                <input autoComplete="off" value={form.instagramHandle} onChange={(e) => updateField('instagramHandle', e.target.value)} placeholder="kinetic_riot" className="flex-1 bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                                <button
                                    type="button"
                                    onClick={onSaveInstagramHandle}
                                    title="Save Instagram handle"
                                    disabled={!instagramHandleDirty || savingInstagramHandle}
                                    className="w-10 h-10 border border-[#ffffff]/20 flex items-center justify-center hover:bg-[#ffffff]/10 disabled:opacity-40"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancelInstagramHandle}
                                    title="Cancel Instagram handle changes"
                                    disabled={!instagramHandleDirty || savingInstagramHandle}
                                    className="w-10 h-10 border border-[#ffffff]/20 flex items-center justify-center hover:bg-[#ffffff]/10 disabled:opacity-40"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <label htmlFor="instagramUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Instagram URL</label>
                            <input autoComplete="off" value={form.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} placeholder="Instagram URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                            <label htmlFor="twitterUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Twitter URL</label>
                            <input autoComplete="off" value={form.twitterUrl} onChange={(e) => updateField('twitterUrl', e.target.value)} placeholder="Twitter URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                            <label htmlFor="facebookUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Facebook URL</label>
                            <input autoComplete="off" value={form.facebookUrl} onChange={(e) => updateField('facebookUrl', e.target.value)} placeholder="Facebook URL" className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                            <p className="font-headline text-[9px] uppercase tracking-widest opacity-40">Use secure URLs only (https://). Allowed domains: instagram.com, x.com/twitter.com, facebook.com</p>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Instagram Feed Manager</h3>

                        <div className="border border-[#ffffff]/10 p-6 flex flex-col gap-4">
                            <p className="font-headline text-[9px] uppercase tracking-[0.25em] opacity-50">Upload New Feed Image</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                                <label className="flex flex-col gap-2 md:col-span-1">
                                    <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Image</span>
                                    <input
                                        key={newInstagramInputKey}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewInstagramFile(e.target.files?.[0] || null)}
                                        className="bg-[#0f0f0f] border border-[#ffffff]/15 px-4 py-3 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                                    />
                                </label>

                                <button
                                    onClick={onAddInstagramItem}
                                    disabled={uploadingInstagram || !newInstagramFile}
                                    title="Add Instagram item"
                                    className="bg-[#b90c1b] text-white py-3 px-6 font-headline text-[11px] uppercase tracking-widest hover:bg-[#d21628] disabled:opacity-40 flex items-center justify-center"
                                >
                                    {uploadingInstagram ? <Save className="w-4 h-4 animate-pulse" /> : <Plus className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {instagramItems.length === 0 ? (
                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No Instagram images found.</p>
                            ) : (
                                instagramItems.map((item) => (
                                    <div key={item.id} className="border border-[#ffffff]/10 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-2 w-full h-28 overflow-hidden border border-[#ffffff]/10 bg-[#0f0f0f]">
                                            <Image src={item.imageUrl} alt={item.username || 'instagram'} width={300} height={300} unoptimized className="w-full h-full object-cover" />
                                        </div>

                                        <div className="md:col-span-2 flex gap-2 justify-end">
                                            <button
                                                onClick={() => onDeleteInstagramItem(item.id)}
                                                disabled={processingInstagramId === item.id}
                                                title="Delete Instagram item"
                                                className="w-9 h-9 bg-[#b90c1b] text-white flex items-center justify-center hover:bg-[#d21628] disabled:opacity-40"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-10 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2 flex flex-col gap-8">
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
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Company Email: {form.companyEmail || 'not set'}</p>
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
