'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchAdminContactSubmissions,
    fetchAdminNewsletterSubscribers,
    fetchAdminProductNotifyRequests,
    markAdminContactSolved,
    type ContactSubmission,
    type NewsletterSubscriber,
    type ProductNotifyRequest,
} from '@/app/lib/apiClient';
import { getAdminUsername } from '@/app/lib/adminSession';

export default function AdminCommunicationsPage() {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [productNotifyRequests, setProductNotifyRequests] = useState<ProductNotifyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState('');
    const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            setError('');
            const [subscriberData, contactData, productNotifyData] = await Promise.all([
                fetchAdminNewsletterSubscribers(),
                fetchAdminContactSubmissions(),
                fetchAdminProductNotifyRequests(),
            ]);
            setSubscribers(subscriberData.subscribers);
            setContacts(contactData.contacts);
            setProductNotifyRequests(productNotifyData.requests);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Could not load communications data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const stats = useMemo(() => {
        const open = contacts.filter((item) => item.status === 'open').length;
        const solved = contacts.filter((item) => item.status === 'solved').length;
        const activeSubs = subscribers.filter((item) => item.isActive).length;
        const pendingStockAlerts = productNotifyRequests.filter((item) => item.status === 'pending' && item.isActive).length;
        return {
            totalSubs: subscribers.length,
            activeSubs,
            open,
            solved,
            pendingStockAlerts,
        };
    }, [contacts, subscribers, productNotifyRequests]);

    const onMarkSolved = async (contactId: string) => {
        const solvedBy = getAdminUsername() || 'admin';
        try {
            setProcessingId(contactId);
            setError('');
            setMessage('');

            await markAdminContactSolved(contactId, {
                solvedBy,
                resolutionMessage: resolutionDrafts[contactId] || '',
            });

            await load();
            setMessage('Contact marked as solved and customer email sent.');
        } catch (solveError) {
            setError(solveError instanceof Error ? solveError.message : 'Failed to mark contact solved.');
        } finally {
            setProcessingId('');
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">COMMUNICATION CONTROL</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Subscribers & Contact Desk</h2>
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Total Subscribers</p>
                    <p className="font-brand text-4xl mt-4">{stats.totalSubs}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Active Subscribers</p>
                    <p className="font-brand text-4xl mt-4">{stats.activeSubs}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Open Queries</p>
                    <p className="font-brand text-4xl mt-4 text-[#ff929d]">{stats.open}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Solved Queries</p>
                    <p className="font-brand text-4xl mt-4 text-green-300">{stats.solved}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Pending Stock Alerts</p>
                    <p className="font-brand text-4xl mt-4 text-amber-300">{stats.pendingStockAlerts}</p>
                </div>
            </div>

            <section className="bg-[#1c1b1b] border border-[#ffffff]/10 p-6 md:p-8 flex flex-col gap-4">
                <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-4">Newsletter Subscribers</h3>
                {loading ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading subscribers...</p>
                ) : subscribers.length === 0 ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No subscribers yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#ffffff]/10 font-headline text-[9px] uppercase tracking-widest opacity-60">
                                    <th className="text-left py-3">Email</th>
                                    <th className="text-left py-3">Source</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Last Campaign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="border-b border-[#ffffff]/5 text-sm">
                                        <td className="py-3 font-headline uppercase tracking-wide">{subscriber.email}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide opacity-70">{subscriber.source}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide">{subscriber.isActive ? 'Active' : 'Inactive'}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide opacity-70">{subscriber.lastNotifiedType || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="bg-[#1c1b1b] border border-[#ffffff]/10 p-6 md:p-8 flex flex-col gap-4">
                <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-4">Contact Submissions</h3>
                {loading ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading contact requests...</p>
                ) : contacts.length === 0 ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No contact submissions yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="border border-[#ffffff]/10 p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                <div className="lg:col-span-8 flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20">{contact.ticketCode}</span>
                                        <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20">{contact.department}</span>
                                        <span className={`font-headline text-[9px] uppercase tracking-widest px-2 py-1 border ${contact.status === 'solved' ? 'border-green-400/30 text-green-300' : 'border-[#b90c1b]/30 text-[#ff929d]'}`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                    <p className="font-brand text-2xl uppercase leading-none">{contact.name}</p>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">{contact.email}</p>
                                    <p className="font-headline text-xs leading-6 opacity-90 whitespace-pre-wrap">{contact.message}</p>
                                    {contact.resolutionMessage ? (
                                        <p className="font-headline text-[10px] uppercase tracking-widest text-green-300/90">Resolution: {contact.resolutionMessage}</p>
                                    ) : null}
                                </div>

                                <div className="lg:col-span-4 flex flex-col gap-3">
                                    <textarea
                                        value={resolutionDrafts[contact.id] || ''}
                                        onChange={(e) => setResolutionDrafts((prev) => ({ ...prev, [contact.id]: e.target.value }))}
                                        placeholder="Resolution note (optional)"
                                        disabled={contact.status === 'solved'}
                                        rows={4}
                                        className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b] disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => onMarkSolved(contact.id)}
                                        disabled={contact.status === 'solved' || processingId === contact.id}
                                        className="bg-[#b90c1b] text-white py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#d21628] disabled:opacity-40"
                                    >
                                        {contact.status === 'solved' ? 'Solved' : processingId === contact.id ? 'Updating...' : 'Mark Solved'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-[#1c1b1b] border border-[#ffffff]/10 p-6 md:p-8 flex flex-col gap-4">
                <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-4">Product Stock Notify Requests</h3>
                {loading ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading stock alerts...</p>
                ) : productNotifyRequests.length === 0 ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No stock notify requests yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] border-collapse">
                            <thead>
                                <tr className="border-b border-[#ffffff]/10 font-headline text-[9px] uppercase tracking-widest opacity-60">
                                    <th className="text-left py-3">Email</th>
                                    <th className="text-left py-3">Product</th>
                                    <th className="text-left py-3">Source</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Requested</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productNotifyRequests.map((item) => (
                                    <tr key={item.id} className="border-b border-[#ffffff]/5 text-sm">
                                        <td className="py-3 font-headline uppercase tracking-wide">{item.email}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide">{item.product_name || `#${item.product_id}`}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide opacity-70">{item.source}</td>
                                        <td className="py-3 font-headline uppercase tracking-wide">
                                            {item.status === 'pending' && item.isActive ? 'Pending' : 'Notified'}
                                        </td>
                                        <td className="py-3 font-headline uppercase tracking-wide opacity-70">
                                            {item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
