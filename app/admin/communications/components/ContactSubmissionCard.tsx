'use client';

import type { ContactSubmission } from '@/app/lib/apiClient';

type ContactSubmissionCardProps = {
    contact: ContactSubmission;
    draftValue: string;
    busy: boolean;
    onDraftChange: (value: string) => void;
    onMarkSolved: () => void;
};

export default function ContactSubmissionCard({
    contact,
    draftValue,
    busy,
    onDraftChange,
    onMarkSolved,
}: ContactSubmissionCardProps) {
    return (
        <div className="border border-primary p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-8 flex flex-col gap-2">
                <div className="flex flex-wrap gap-3 items-center">
                    <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20">{contact.ticketCode}</span>
                    <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20">{contact.department}</span>
                    <span className={`font-headline text-[9px] uppercase tracking-widest px-2 py-1 border ${contact.status === 'solved' ? 'border-green-400/30 text-green-300' : 'border-primary text-[#ff929d]'}`}>
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
                    value={draftValue}
                    onChange={(e) => onDraftChange(e.target.value)}
                    placeholder="Resolution note (optional)"
                    disabled={contact.status === 'solved'}
                    rows={4}
                    className="bg-[#ffffff] border border-primary px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b] disabled:opacity-50"
                />
                <button
                    onClick={onMarkSolved}
                    disabled={contact.status === 'solved' || busy}
                    className="bg-[#b90c1b] text-white py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#d21628] disabled:opacity-40"
                >
                    {contact.status === 'solved' ? 'Solved' : busy ? 'Updating...' : 'Mark Solved'}
                </button>
            </div>
        </div>
    );
}
