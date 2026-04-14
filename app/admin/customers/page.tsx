'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    fetchAdminCustomerActivity,
    fetchAdminCustomersOverview,
    updateAdminCustomerStatus,
    type AdminCustomer,
    type AdminCustomerActivity,
    type AdminCustomerOverview,
} from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import CustomerRow from './components/CustomerRow';

type SegmentFilter = 'ALL' | 'VIP' | 'ACTIVE' | 'NEW' | 'DORMANT' | 'BLOCKED';

const formatMoney = (value: number, currency: string) => {
    return `${currency}${Number(value || 0).toFixed(2)}`;
};

const formatRate = (value: number) => `${Number(value || 0).toFixed(2)}%`;

const statusTone = (status: string) => {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'VIP') return 'bg-[#b90c1b] text-white';
    if (normalized === 'ACTIVE') return 'bg-green-700/30 text-green-200';
    if (normalized === 'DORMANT') return 'bg-yellow-700/30 text-yellow-200';
    if (normalized === 'BLOCKED') return 'bg-red-700/40 text-red-200';
    return 'bg-[#ffffff]/10 opacity-70';
};

export default function CustomersManagement() {
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';

    const [overview, setOverview] = useState<AdminCustomerOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [segment, setSegment] = useState<SegmentFilter>('ALL');
    const [busyEmail, setBusyEmail] = useState('');

    const [activity, setActivity] = useState<AdminCustomerActivity | null>(null);
    const [activityEmail, setActivityEmail] = useState('');
    const [loadingActivity, setLoadingActivity] = useState(false);

    const loadCustomers = async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await fetchAdminCustomersOverview();
            setOverview(data);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Could not load customers.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const customers = useMemo(() => overview?.customers || [], [overview]);

    const filteredCustomers = useMemo(() => {
        const term = query.trim().toLowerCase();
        return customers.filter((customer: AdminCustomer) => {
            const status = String(customer.status || 'NEW').toUpperCase() as SegmentFilter;
            const matchesSegment = segment === 'ALL' || status === segment;
            if (!matchesSegment) return false;
            if (!term) return true;

            return (
                String(customer.name || '').toLowerCase().includes(term) ||
                String(customer.email || '').toLowerCase().includes(term)
            );
        });
    }, [customers, query, segment]);

    const stats = useMemo(() => {
        const base = overview?.stats || {
            totalCustomers: 0,
            activeSessions: 0,
            conversionRate: 0,
            churnRate: 0,
        };

        return [
            { label: 'TOTAL CUSTOMERS', value: String(base.totalCustomers), trend: 'LIVE' },
            { label: 'ACTIVE SESSIONS', value: String(base.activeSessions), trend: 'LIVE' },
            { label: 'CONVERSION RATE', value: formatRate(base.conversionRate), trend: base.conversionRate >= 3 ? 'GOOD' : 'LOW' },
            { label: 'CHURN RATE', value: formatRate(base.churnRate), trend: base.churnRate <= 5 ? 'STABLE' : 'RISK' },
        ];
    }, [overview]);

    const toggleCustomerStatus = async (email: string, currentlyBlocked: boolean) => {
        try {
            setBusyEmail(email);
            setError('');
            await updateAdminCustomerStatus(email, !currentlyBlocked, !currentlyBlocked ? 'Blocked by admin' : '');
            await loadCustomers();
            if (activityEmail === email) {
                await openActivity(email);
            }
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : 'Could not update customer status.');
        } finally {
            setBusyEmail('');
        }
    };

    const openActivity = async (email: string) => {
        try {
            setLoadingActivity(true);
            setActivityEmail(email);
            const details = await fetchAdminCustomerActivity(email);
            setActivity(details);
        } catch (activityError) {
            setError(activityError instanceof Error ? activityError.message : 'Could not load customer activity.');
        } finally {
            setLoadingActivity(false);
        }
    };

    const closeActivity = () => {
        setActivity(null);
        setActivityEmail('');
    };

    return (
        <div className="flex flex-col gap-12">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">USER SEGMENTS</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Customer Analytics</h2>
            </header>

            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="flex gap-2 overflow-x-auto">
                    {(['ALL', 'VIP', 'ACTIVE', 'NEW', 'DORMANT', 'BLOCKED'] as SegmentFilter[]).map((entry) => (
                        <button
                            key={entry}
                            onClick={() => setSegment(entry)}
                            className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest border transition-colors whitespace-nowrap ${segment === entry
                                    ? 'border-primary text-primary'
                                    : 'border-primary/40 opacity-50 hover:opacity-100'
                                }`}
                        >
                            {entry}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search customer name or email"
                        className="w-full md:w-80 bg-[#ffffff] border border-primary/50 px-4 py-3 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                    />
                    <button onClick={loadCustomers} className="px-5 bg-[#ffffff] border border-primary/50 font-headline text-[10px] uppercase tracking-widest border-secondary">Refresh</button>
                </div>
            </div>

            {error && (
                <div className="border border-primary/30 bg-primary/10 px-4 py-3 flex items-center justify-between gap-4">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-primary">{error}</p>
                    <button onClick={loadCustomers} className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4">Retry</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#ffffff] border border-primary p-8 flex flex-col justify-between group border-secondary transition-all">
                        <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-40">{stat.label}</span>
                        <div className="mt-8 flex justify-between items-end">
                            <span className="font-brand text-4xl block leading-none">{stat.value}</span>
                            <span className="font-headline text-[8px] uppercase tracking-widest text-[#b90c1b]">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading && (
                <div className="bg-[#ffffff] border border-primary p-10 flex items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-[#b90c1b]">progress_activity</span>
                    <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading customers...</span>
                </div>
            )}

            <div className="bg-[#ffffff] border border-primary overflow-hidden">
                <div className="grid grid-cols-12 gap-8 p-6 bg-[#ffffff]/5 font-headline text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                    <div className="col-span-1">RANK</div>
                    <div className="col-span-4">CUSTOMER_PROFILE</div>
                    <div className="col-span-2">ORDERS</div>
                    <div className="col-span-2">LIFETIME_VAL</div>
                    <div className="col-span-1 text-right">STATUS</div>
                    <div className="col-span-2 text-right">ACTION</div>
                </div>

                <div className="flex flex-col">
                    {!isLoading && filteredCustomers.length === 0 && (
                        <div className="p-12 text-center border-b border-[#ffffff]/5">
                            <p className="font-brand text-3xl uppercase tracking-widest opacity-30">No customers found</p>
                        </div>
                    )}

                    {filteredCustomers.map((c, i) => (
                        <CustomerRow
                            key={`${c.email}-${i}`}
                            customer={c}
                            index={i}
                            busy={busyEmail === c.email}
                            lifetimeValue={formatMoney(c.totalSpent, currency)}
                            statusClass={statusTone(String(c.status || '').toUpperCase())}
                            onOpenActivity={openActivity}
                            onToggleStatus={toggleCustomerStatus}
                        />
                    ))}
                </div>
            </div>

            {(loadingActivity || activity) && (
                <div className="fixed inset-0 z-[120] bg-black/70 p-4 md:p-10 overflow-y-auto">
                    <div className="max-w-5xl mx-auto bg-[#ffffff] border border-[#ffffff]/15 p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4 border-b border-primary pb-4 mb-6">
                            <div>
                                <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-[#b90c1b]">Customer Activity</p>
                                <h3 className="font-brand text-4xl uppercase tracking-widest">{activity?.customer.name || activityEmail}</h3>
                                {activity?.customer.isBlocked && (
                                    <p className="font-headline text-[10px] uppercase tracking-widest text-red-300 mt-1">Blocked: {activity.customer.blockedReason || 'No reason'}</p>
                                )}
                            </div>
                            <button onClick={closeActivity} className="material-symbols-outlined text-2xl opacity-60 hover:opacity-100">close</button>
                        </div>

                        {loadingActivity && (
                            <div className="py-10 flex items-center gap-3">
                                <span className="material-symbols-outlined animate-spin text-[#b90c1b]">progress_activity</span>
                                <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading timeline...</span>
                            </div>
                        )}

                        {activity && !loadingActivity && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4 space-y-4">
                                    <div className="border border-primary p-4">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Active Sessions</p>
                                        <p className="font-brand text-3xl mt-2">{activity.summary.activeSessions}</p>
                                    </div>
                                    <div className="border border-primary p-4">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Orders</p>
                                        <p className="font-brand text-3xl mt-2">{activity.summary.ordersCount}</p>
                                    </div>
                                    <div className="border border-primary p-4">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Wishlist Items</p>
                                        <p className="font-brand text-3xl mt-2">{activity.summary.wishlistCount}</p>
                                    </div>
                                    <div className="border border-primary p-4">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Lifetime Value</p>
                                        <p className="font-brand text-3xl mt-2 text-[#b90c1b]">{formatMoney(activity.summary.totalSpent, currency)}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-8">
                                    <h4 className="font-brand text-3xl uppercase tracking-widest border-b border-primary pb-3 mb-4">Timeline</h4>
                                    <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
                                        {activity.timeline.length === 0 && (
                                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-40">No timeline events yet.</p>
                                        )}
                                        {activity.timeline.map((entry, index) => (
                                            <div key={`${entry.type}-${entry.occurredAt || index}`} className="border border-primary p-4">
                                                <div className="flex justify-between gap-4">
                                                    <p className="font-headline text-[10px] uppercase tracking-widest">{entry.title}</p>
                                                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-40 whitespace-nowrap">{entry.occurredAt ? new Date(entry.occurredAt).toLocaleString() : 'N/A'}</p>
                                                </div>
                                                <p className="font-headline text-[9px] uppercase tracking-widest opacity-50 mt-2">TYPE: {entry.type}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
