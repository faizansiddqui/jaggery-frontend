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
    uploadAdminSiteLogo,
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
    companyPhone: string;
    emailFooterDescription: string;
    currencySymbol: string;
    instagramUrl: string;
    instagramHandle: string;
    youtubeUrl: string;
    facebookUrl: string;
};

type SocialUrlField = 'instagramUrl' | 'youtubeUrl' | 'facebookUrl';

type InstagramGalleryItem = SiteSettings['instagramGallery'][number];

const SOCIAL_FIELD_META: Record<SocialUrlField, { label: string; hosts: string[] }> = {
    instagramUrl: { label: 'Instagram', hosts: ['instagram.com', 'instagr.am'] },
    youtubeUrl: { label: 'YouTube', hosts: ['youtube.com', 'youtu.be'] },
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
        youtubeUrl: '',
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
        companyPhone: settings.companyPhone,
        emailFooterDescription: settings.emailFooterDescription,
        currencySymbol: settings.currencySymbol,
        instagramUrl: settings.instagramUrl,
        instagramHandle: settings.instagramHandle,
        youtubeUrl: settings.youtubeUrl,
        facebookUrl: settings.facebookUrl,
    });

    const [instagramItems, setInstagramItems] = useState<InstagramGalleryItem[]>(settings.instagramGallery || []);
    const [newInstagramUsername, setNewInstagramUsername] = useState(settings.instagramHandle || 'apex_thrill');
    const [newInstagramFile, setNewInstagramFile] = useState<File | null>(null);
    const [newInstagramInputKey, setNewInstagramInputKey] = useState(0);
    const [uploadingInstagram, setUploadingInstagram] = useState(false);
    const [processingInstagramId, setProcessingInstagramId] = useState<string | null>(null);
    const [savingInstagramHandle, setSavingInstagramHandle] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoInputKey, setLogoInputKey] = useState(0);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState('');

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
                    companyPhone: data.companyPhone,
                    emailFooterDescription: data.emailFooterDescription,
                    currencySymbol: data.currencySymbol,
                    instagramUrl: data.instagramUrl,
                    instagramHandle: data.instagramHandle,
                    youtubeUrl: data.youtubeUrl,
                    facebookUrl: data.facebookUrl,
                });
                setInstagramItems(data.instagramGallery || []);
                setNewInstagramUsername(data.instagramHandle || 'apex_thrill');
                applyLocalSettings(data);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : 'Could not load settings.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [applyLocalSettings]);

    useEffect(() => {
        if (!logoFile) {
            setLogoPreviewUrl('');
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(logoFile);
        setLogoPreviewUrl(nextPreviewUrl);

        return () => {
            URL.revokeObjectURL(nextPreviewUrl);
        };
    }, [logoFile]);

    const dirty = useMemo(() => {
        return (
            form.siteName !== settings.siteName ||
            form.navbarTitle !== settings.navbarTitle ||
            form.footerTitle !== settings.footerTitle ||
            form.footerDescription !== settings.footerDescription ||
            form.companyAddress !== settings.companyAddress ||
            form.companyEmail !== settings.companyEmail ||
            form.companyPhone !== settings.companyPhone ||
            form.emailFooterDescription !== settings.emailFooterDescription ||
            form.currencySymbol !== settings.currencySymbol ||
            form.instagramUrl !== settings.instagramUrl ||
            form.instagramHandle !== settings.instagramHandle ||
            form.youtubeUrl !== settings.youtubeUrl ||
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
            setNewInstagramUsername(updated.instagramHandle || 'apex_thrill');
            await refreshSettings();
            setMessage('Instagram handle updated successfully.');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Failed to update Instagram handle.');
        } finally {
            setSavingInstagramHandle(false);
        }
    };

    const onCancelInstagramHandle = () => {
        updateField('instagramHandle', settings.instagramHandle || 'apex_thrill');
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
                username: newInstagramUsername || form.instagramHandle || 'apex_thrill',
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

    const onUploadLogo = async () => {
        if (!logoFile) {
            setError('Select a logo image first.');
            return;
        }

        try {
            setUploadingLogo(true);
            setMessage('');
            setError('');
            const updated = await uploadAdminSiteLogo({
                logo: logoFile,
                updatedBy: username,
            });
            applyLocalSettings(updated);
            setInstagramItems(updated.instagramGallery || []);
            setLogoFile(null);
            setLogoPreviewUrl('');
            setLogoInputKey((prev) => prev + 1);
            await refreshSettings();
            setMessage('Brand logo updated successfully.');
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload brand logo.');
        } finally {
            setUploadingLogo(false);
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

    const activeLogoPreview = logoPreviewUrl || settings.logoUrl || '';

    return (
        <div className="flex flex-col gap-12">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">SYSTEM PARAMETERS</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Portal Settings</h2>
            </header>

            {error && (
                <div className="border border-primary bg-primary/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-primary">{error}</p>
                </div>
            )}

            {message && (
                <div className="border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-green-300">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-12">
                <div className="lg:col-span-8 flex flex-col gap-12">
                    <section className="flex flex-col gap-8 bg-[#ffffff] border border-primary/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-primary/10 pb-6">Global Branding</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Store Name</span>
                                <input autoComplete="off" value={form.siteName} onChange={(e) => updateField('siteName', e.target.value)} className="bg-transparent border-b-2 border-primary/10 py-3 font-brand text-2xl focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Currency Symbol</span>
                                <input autoComplete="off" value={form.currencySymbol} onChange={(e) => updateField('currencySymbol', e.target.value)} className="bg-transparent border-b-2 border-primary/10 py-3 font-brand text-2xl focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Navbar Title</span>
                                <input autoComplete="off" value={form.navbarTitle} onChange={(e) => updateField('navbarTitle', e.target.value)} className="bg-transparent border-b-2 border-primary/10 py-3 font-brand text-2xl focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Footer Title</span>
                                <input autoComplete="off" value={form.footerTitle} onChange={(e) => updateField('footerTitle', e.target.value)} className="bg-transparent border-b-2 border-primary/10 py-3 font-brand text-2xl focus:border-[#b90c1b] outline-none" />
                            </label>
                            <label className="md:col-span-2 flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Footer Description</span>
                                <textarea
                                    value={form.footerDescription}
                                    onChange={(e) => updateField('footerDescription', e.target.value)}
                                    rows={3}
                                    className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary"
                                />
                            </label>
                            <label className="md:col-span-2 flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Company Address</span>
                                <textarea
                                    value={form.companyAddress}
                                    onChange={(e) => updateField('companyAddress', e.target.value)}
                                    rows={3}
                                    className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Company Email</span>
                                <input
                                    autoComplete="off"
                                    value={form.companyEmail}
                                    onChange={(e) => updateField('companyEmail', e.target.value)}
                                    className="bg-transparent border-b-2 border-primary/10 py-3 font-headline text-xs tracking-widest focus:border-[#b90c1b] outline-none"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-headline text-[9px] tracking-widest opacity-40">Company Phone</span>
                                <input
                                    autoComplete="off"
                                    value={form.companyPhone}
                                    onChange={(e) => updateField('companyPhone', e.target.value)}
                                    className="bg-transparent border-b-2 border-primary/10 py-3 font-headline text-xs tracking-widest focus:border-[#b90c1b] outline-none"
                                />
                            </label>
                        </div>

                        <div className="border border-primary/10 p-6 flex flex-col gap-4">
                            <p className="font-headline text-[9px] uppercase tracking-[0.25em] opacity-50">Brand Logo</p>
                            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 items-end">
                                <div className="w-[140px] h-[140px] border border-outline/10 bg-surface-container flex items-center justify-center overflow-hidden">
                                    {activeLogoPreview ? (
                                        <Image src={activeLogoPreview} alt={form.siteName || 'brand logo'} width={240} height={120} unoptimized className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">No logo</span>
                                    )}
                                </div>
                                <div className='flex items-start flex-col gap-9'>
                                    <label className="flex flex-col gap-2">
                                        <span className="font-headline text-[9px] tracking-widest opacity-40">Upload Logo</span>
                                        <input
                                            key={logoInputKey}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                            className="bg-surface-container border border-outline/15 px-2 py-3 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={onUploadLogo}
                                        disabled={uploadingLogo || !logoFile}
                                        className="bg-primary text-white py-3 px-6 font-headline text-[11px] uppercase tracking-widest hover:bg-primary/30 disabled:opacity-40"
                                    >
                                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8 bg-[#ffffff] border border-primary/10 p-10">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-primary/10 pb-6">Social URLs</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="instagramUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Instagram URL</label>
                            <input autoComplete="off" value={form.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} placeholder="Instagram URL" className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary" />
                            <label htmlFor="youtubeUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">YouTube URL</label>
                            <input autoComplete="off" value={form.youtubeUrl} onChange={(e) => updateField('youtubeUrl', e.target.value)} placeholder="YouTube URL" className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary" />
                            <label htmlFor="facebookUrl" className="font-headline text-[9px] uppercase tracking-widest opacity-40">Facebook URL</label>
                            <input autoComplete="off" value={form.facebookUrl} onChange={(e) => updateField('facebookUrl', e.target.value)} placeholder="Facebook URL" className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary" />
                            <p className="font-headline text-[9px] uppercase tracking-widest opacity-40">Use secure URLs only (https://). Allowed domains: instagram.com, youtube.com/youtu.be, facebook.com</p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-10 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2 flex flex-col gap-8">
                    <section className="bg-[#ffffff] border border-primary/10 p-10 flex flex-col gap-6">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-primary/10 pb-6">Security</h3>
                        <input autoComplete="off" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary" />
                        <input autoComplete="off" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="bg-surface-container border border-outline/15 px-4 py-3 font-headline text-xs tracking-widest focus:outline-none focus:border-primary" />
                        <button onClick={onResetPassword} disabled={resettingPassword || !currentPassword || !newPassword} className="border border-[#ffffff]/20 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#ffffff]/10 disabled:opacity-40">
                            {resettingPassword ? 'Updating...' : 'Reset Admin Password'}
                        </button>
                        <button onClick={onLogout} className="bg-primary text-white py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-primary/30">
                            Logout Admin
                        </button>
                    </section>

                    <section className="bg-primary p-10 flex flex-col gap-6 text-white">
                        <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-white/20 pb-6">Runtime Preview</h3>
                        {activeLogoPreview ? (
                            <div className="w-full h-24 border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
                                <Image src={activeLogoPreview} alt={form.siteName || 'brand logo'} width={260} height={100} unoptimized className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : null}
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Navbar: {form.navbarTitle || 'APEX THRILL'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Footer: {form.footerTitle || 'APEX THRILL'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Company Email: {form.companyEmail || 'not set'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Company Phone: {form.companyPhone || 'not set'}</p>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-80">Currency: {form.currencySymbol || '$'}</p>
                    </section>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={onSave} disabled={loading || saving || !dirty} className="bg-[#ffffff] text-[#1c1b1b] px-12 py-6 font-brand text-2xl uppercase hover:bg-primary hover:text-[#ffffff] transition-all disabled:opacity-40">
                    {saving ? 'Saving...' : 'Commit Changes'}
                </button>
            </div>
        </div>
    );
}
