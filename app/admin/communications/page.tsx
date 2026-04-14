'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchAdminContactSubmissions,
    fetchAdminNewsletterSubscribers,
    markAdminContactSolved,
    type ContactSubmission,
    type NewsletterSubscriber,
} from '@/app/lib/apiClient';
import { getAdminUsername } from '@/app/lib/adminSession';
import ContactSubmissionCard from '@/app/admin/communications/components/ContactSubmissionCard';
import SubscribersTable from '@/app/admin/communications/components/SubscribersTable';

export default function AdminCommunicationsPage() {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState('');
    const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'subscribers' | 'contacts'>('subscribers');

    const [subscriberQuery, setSubscriberQuery] = useState('');
    const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [subscriberSort, setSubscriberSort] = useState<'recent' | 'email' | 'status'>('recent');

    const [contactQuery, setContactQuery] = useState('');
    const [contactStatusFilter, setContactStatusFilter] = useState<'all' | 'open' | 'solved'>('all');
    const [contactSort, setContactSort] = useState<'recent' | 'status' | 'name'>('recent');

    const load = async (options?: { silent?: boolean }) => {
        const silent = options?.silent === true;
        try {
            if (!silent) setLoading(true);
            setError('');
            const [subscriberData, contactData] = await Promise.all([
                fetchAdminNewsletterSubscribers(),
                fetchAdminContactSubmissions(),
            ]);
            setSubscribers(subscriberData.subscribers);
            setContacts(contactData.contacts);
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
        return {
            totalSubs: subscribers.length,
            activeSubs,
            open,
            solved,
        };
    }, [contacts, subscribers]);

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

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">COMMUNICATION CONTROL</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Subscribers & Contact Desk</h2>
            </header>

            {error && (
                <div className="border border-primary bg-[#ffffff] px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-[#ff929d]">{error}</p>
                </div>
            )}

            {message && (
                <div className="border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-green-300">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#ffffff] border border-primary p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Total Subscribers</p>
                    <p className="font-brand text-4xl mt-4">{stats.totalSubs}</p>
                </div>
                <div className="bg-[#ffffff] border border-primary p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Active Subscribers</p>
                    <p className="font-brand text-4xl mt-4">{stats.activeSubs}</p>
                </div>
                <div className="bg-[#ffffff] border border-primary p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Open Queries</p>
                    <p className="font-brand text-4xl mt-4 text-[#ff929d]">{stats.open}</p>
                </div>
                <div className="bg-[#ffffff] border border-primary p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Solved Queries</p>
                    <p className="font-brand text-4xl mt-4 text-green-300">{stats.solved}</p>
                </div>
            </div>

            <section className="bg-[#ffffff] border border-primary p-6 md:p-8 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 border-b border-primary pb-4">
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border ${activeTab === 'subscribers' ? 'border-[#b90c1b] text-black bg-primary/40' : 'border-primary text-black/80 hover:text-white'}`}
                    >
                        Newsletter Subscribers
                    </button>
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border ${activeTab === 'contacts' ? 'border-[#b90c1b] text-black bg-primary/40' : 'border-primary text-black/80 hover:text-white'}`}
                    >
                        Contact Submissions
                    </button>
                    <button
                        onClick={onRefresh}
                        className="ml-auto px-4 py-2 font-headline text-[10px] uppercase tracking-widest border border-secondary text-black/80 hover:border-primary"
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
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest w-full md:w-72 focus:outline-none focus:border-[#b90c1b]"
                            />
                            <select
                                value={subscriberStatusFilter}
                                onChange={(e) => setSubscriberStatusFilter(e.target.value as typeof subscriberStatusFilter)}
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={subscriberSort}
                                onChange={(e) => setSubscriberSort(e.target.value as typeof subscriberSort)}
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
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
                        ) : <SubscribersTable subscribers={filteredSubscribers} />}
                    </div>
                ) : null}

                {activeTab === 'contacts' ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                value={contactQuery}
                                onChange={(e) => setContactQuery(e.target.value)}
                                placeholder="Search name or email"
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest w-full md:w-72 focus:outline-none focus:border-[#b90c1b]"
                            />
                            <select
                                value={contactStatusFilter}
                                onChange={(e) => setContactStatusFilter(e.target.value as typeof contactStatusFilter)}
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="solved">Solved</option>
                            </select>
                            <select
                                value={contactSort}
                                onChange={(e) => setContactSort(e.target.value as typeof contactSort)}
                                className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
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
                                    <ContactSubmissionCard
                                        key={contact.id}
                                        contact={contact}
                                        draftValue={resolutionDrafts[contact.id] || ''}
                                        busy={processingId === contact.id}
                                        onDraftChange={(value) =>
                                            setResolutionDrafts((prev) => ({ ...prev, [contact.id]: value }))
                                        }
                                        onMarkSolved={() => onMarkSolved(contact.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

            </section>
        </div>
    );
}
