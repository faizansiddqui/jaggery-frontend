'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchAdminContactSubmissions,
    fetchAdminNewsletterSubscribers,
    fetchAdminProductNotifyRequests,
    markAdminContactSolved,
    updateAdminProductNotifyRequest,
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
    const [updatingNotifyId, setUpdatingNotifyId] = useState('');
    const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'subscribers' | 'contacts' | 'stock'>('subscribers');

    const [subscriberQuery, setSubscriberQuery] = useState('');
    const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [subscriberSort, setSubscriberSort] = useState<'recent' | 'email' | 'status'>('recent');

    const [contactQuery, setContactQuery] = useState('');
    const [contactStatusFilter, setContactStatusFilter] = useState<'all' | 'open' | 'solved'>('all');
    const [contactSort, setContactSort] = useState<'recent' | 'status' | 'name'>('recent');

    const [stockQuery, setStockQuery] = useState('');
    const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'pending' | 'notified'>('all');
    const [stockActiveFilter, setStockActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [stockSort, setStockSort] = useState<'recent' | 'status' | 'product'>('recent');

    const load = async (options?: { silent?: boolean }) => {
        const silent = options?.silent === true;
        try {
            if (!silent) setLoading(true);
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
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            load({ silent: true });
        }, 30000);
        return () => clearInterval(interval);
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

    const onRefresh = async () => {
        await load();
    };

    const onUpdateNotifyStatus = async (requestId: string, nextStatus: 'pending' | 'notified') => {
        try {
            setUpdatingNotifyId(requestId);
            setError('');
            setMessage('');
            await updateAdminProductNotifyRequest(requestId, { status: nextStatus });
            await load();
            setMessage(nextStatus === 'pending' ? 'Notify request reset to pending.' : 'Notify request marked as notified.');
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : 'Failed to update notify request.');
        } finally {
            setUpdatingNotifyId('');
        }
    };

    const filteredSubscribers = useMemo(() => {
        const query = subscriberQuery.trim().toLowerCase();
        return subscribers
            .filter((item) => {
                if (subscriberStatusFilter === 'active' && !item.isActive) return false;
                if (subscriberStatusFilter === 'inactive' && item.isActive) return false;
                if (query && !item.email.toLowerCase().includes(query)) return false;
                return true;
            })
            .sort((a, b) => {
                if (subscriberSort === 'email') return a.email.localeCompare(b.email);
                if (subscriberSort === 'status') return Number(b.isActive) - Number(a.isActive);
                const aDate = a.subscribedAt ? new Date(a.subscribedAt).getTime() : 0;
                const bDate = b.subscribedAt ? new Date(b.subscribedAt).getTime() : 0;
                return bDate - aDate;
            });
    }, [subscribers, subscriberQuery, subscriberStatusFilter, subscriberSort]);

    const filteredContacts = useMemo(() => {
        const query = contactQuery.trim().toLowerCase();
        return contacts
            .filter((item) => {
                if (contactStatusFilter !== 'all' && item.status !== contactStatusFilter) return false;
                if (query && !(item.email.toLowerCase().includes(query) || item.name.toLowerCase().includes(query))) return false;
                return true;
            })
            .sort((a, b) => {
                if (contactSort === 'name') return a.name.localeCompare(b.name);
                if (contactSort === 'status') return a.status.localeCompare(b.status);
                const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bDate - aDate;
            });
    }, [contacts, contactQuery, contactStatusFilter, contactSort]);

    const filteredStockRequests = useMemo(() => {
        const query = stockQuery.trim().toLowerCase();
        return productNotifyRequests
            .filter((item) => {
                if (stockStatusFilter !== 'all' && item.status !== stockStatusFilter) return false;
                if (stockActiveFilter === 'active' && !item.isActive) return false;
                if (stockActiveFilter === 'inactive' && item.isActive) return false;
                if (query) {
                    const productMatch = (item.product_name || '').toLowerCase().includes(query);
                    const emailMatch = item.email.toLowerCase().includes(query);
                    if (!productMatch && !emailMatch) return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (stockSort === 'product') return (a.product_name || '').localeCompare(b.product_name || '');
                if (stockSort === 'status') return a.status.localeCompare(b.status);
                const aDate = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
                const bDate = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
                return bDate - aDate;
            });
    }, [productNotifyRequests, stockQuery, stockStatusFilter, stockActiveFilter, stockSort]);

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
                <div className="flex flex-wrap items-center gap-3 border-b border-[#ffffff]/10 pb-4">
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border ${activeTab === 'subscribers' ? 'border-[#b90c1b] text-white bg-[#b90c1b]/20' : 'border-[#ffffff]/15 text-white/60 hover:text-white'}`}
                    >
                        Newsletter Subscribers
                    </button>
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border ${activeTab === 'contacts' ? 'border-[#b90c1b] text-white bg-[#b90c1b]/20' : 'border-[#ffffff]/15 text-white/60 hover:text-white'}`}
                    >
                        Contact Submissions
                    </button>
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border ${activeTab === 'stock' ? 'border-[#b90c1b] text-white bg-[#b90c1b]/20' : 'border-[#ffffff]/15 text-white/60 hover:text-white'}`}
                    >
                        Product Stock Notify Requests
                    </button>
                    <button
                        onClick={onRefresh}
                        className="ml-auto px-4 py-2 font-headline text-[10px] uppercase tracking-widest border border-[#ffffff]/15 text-white/60 hover:text-white"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {activeTab === 'subscribers' ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                value={subscriberQuery}
                                onChange={(e) => setSubscriberQuery(e.target.value)}
                                placeholder="Search email"
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest w-full md:w-72 focus:outline-none focus:border-[#b90c1b]"
                            />
                            <select
                                value={subscriberStatusFilter}
                                onChange={(e) => setSubscriberStatusFilter(e.target.value as typeof subscriberStatusFilter)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={subscriberSort}
                                onChange={(e) => setSubscriberSort(e.target.value as typeof subscriberSort)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="recent">Recent</option>
                                <option value="email">Email</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        {loading ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading subscribers...</p>
                        ) : filteredSubscribers.length === 0 ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No subscribers match the current filters.</p>
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
                                        {filteredSubscribers.map((subscriber) => (
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
                    </div>
                ) : null}

                {activeTab === 'contacts' ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                value={contactQuery}
                                onChange={(e) => setContactQuery(e.target.value)}
                                placeholder="Search name or email"
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest w-full md:w-72 focus:outline-none focus:border-[#b90c1b]"
                            />
                            <select
                                value={contactStatusFilter}
                                onChange={(e) => setContactStatusFilter(e.target.value as typeof contactStatusFilter)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="solved">Solved</option>
                            </select>
                            <select
                                value={contactSort}
                                onChange={(e) => setContactSort(e.target.value as typeof contactSort)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="recent">Recent</option>
                                <option value="status">Status</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                        {loading ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading contact requests...</p>
                        ) : filteredContacts.length === 0 ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No contact submissions match the current filters.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredContacts.map((contact) => (
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
                    </div>
                ) : null}

                {activeTab === 'stock' ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                value={stockQuery}
                                onChange={(e) => setStockQuery(e.target.value)}
                                placeholder="Search product or email"
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest w-full md:w-72 focus:outline-none focus:border-[#b90c1b]"
                            />
                            <select
                                value={stockStatusFilter}
                                onChange={(e) => setStockStatusFilter(e.target.value as typeof stockStatusFilter)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="notified">Notified</option>
                            </select>
                            <select
                                value={stockActiveFilter}
                                onChange={(e) => setStockActiveFilter(e.target.value as typeof stockActiveFilter)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Activity</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={stockSort}
                                onChange={(e) => setStockSort(e.target.value as typeof stockSort)}
                                className="bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="recent">Recent</option>
                                <option value="status">Status</option>
                                <option value="product">Product</option>
                            </select>
                        </div>
                        {loading ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading stock alerts...</p>
                        ) : filteredStockRequests.length === 0 ? (
                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No stock notify requests match the current filters.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] border-collapse">
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
                                        {filteredStockRequests.map((item) => (
                                            <tr key={item.id} className="border-b border-[#ffffff]/5 text-sm">
                                                <td className="py-3 px-3 font-headline uppercase tracking-wide">{item.email}</td>
                                                <td className="py-3 px-3 font-headline uppercase tracking-wide">{item.product_name || `#${item.product_id}`}</td>
                                                <td className="py-3 px-3 font-headline uppercase tracking-wide opacity-70">{item.source}</td>
                                                <td className="py-3 px-3 font-headline uppercase tracking-wide">
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
                    </div>
                ) : null}
            </section>
        </div>
    );
}
