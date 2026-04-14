"use client";
import React, { useState } from 'react';
import { submitContactForm } from '@/app/lib/apiClient';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await submitContactForm({
        name: trimmedName,
        email: trimmedEmail,
        department: 'GENERAL INQUIRY',
        message: trimmedMessage,
      });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {sent ? (
        <div className="p-4 bg-surface-container-highest rounded-md">
          <p className="font-headline text-sm">Thanks - your query has been submitted successfully.</p>
        </div>
      ) : (
        <>
          {error ? (
            <div className="p-3 bg-error/10 border border-error/30 rounded-md">
              <p className="font-headline text-xs text-error">{error}</p>
            </div>
          ) : null}
          <div>
            <label className="text-sm font-label uppercase text-on-surface-variant">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-transparent border border-outline-variant/40 focus:border-primary outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-label uppercase text-on-surface-variant">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-transparent border border-outline-variant/40 focus:border-primary outline-none"
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="text-sm font-label uppercase text-on-surface-variant">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 p-3 rounded-md bg-transparent border border-outline-variant/40 focus:border-primary outline-none min-h-[140px]"
              placeholder="How can we help?"
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:opacity-90 disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Send Message'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
