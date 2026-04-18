'use client';

import type { NewsletterSubscriber } from '@/app/lib/apiClient';

type SubscribersTableProps = {
    subscribers: NewsletterSubscriber[];
};

export default function SubscribersTable({ subscribers }: SubscribersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
                <thead>
                    <tr className="border-b border-red-700 font-headline text-[9px] tracking-widest opacity-60">
                        <th className="text-left py-3">Email</th>
                        <th className="text-left py-3">Source</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Last Campaign</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-red-700 text-sm">
                            <td className="py-3 font-headline tracking-wide">{subscriber.email}</td>
                            <td className="py-3 font-headline tracking-wide opacity-70">{subscriber.source}</td>
                            <td className="py-3 font-headline tracking-wide">{subscriber.isActive ? 'Active' : 'Inactive'}</td>
                            <td className="py-3 font-headline tracking-wide opacity-70">{subscriber.lastNotifiedType || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
