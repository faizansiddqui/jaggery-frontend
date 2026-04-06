'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Comp7 from '@/app/components/Comp7';
import { fetchOrders, fetchUserProfile, updateUserProfile } from '@/app/lib/apiClient';
import { clearUserSession, getUserEmail } from '@/app/lib/session';
import { useRequireUserSession } from '@/app/lib/guards';

const menuItems = [
  { name: 'My Profile', icon: 'person', href: '/user/profile', active: true },
  { name: 'My Orders', icon: 'shopping_bag', href: '/user/orders', active: false },
  { name: 'My Address', icon: 'home', href: '/user/address', active: false },
  { name: 'My Wishlist', icon: 'favorite', href: '/user/wishlist', active: false },
];

export default function UserProfile() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [recentOrder, setRecentOrder] = useState<Record<string, unknown> | null>(null);
  const { ready, authenticated } = useRequireUserSession('/user/auth');
  const email = getUserEmail();

  useEffect(() => {
    Promise.all([fetchUserProfile(), fetchOrders()])
      .then(([profileResponse, orders]) => {
        const profile = (profileResponse.profile || {}) as Record<string, unknown>;
        setName(String(profile.name || ''));
        setGender(String(profile.gender || ''));
        setRecentOrder(Array.isArray(orders) && orders.length > 0 ? (orders[0] as Record<string, unknown>) : null);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load profile from server'))
      .finally(() => setIsLoading(false));
  }, []);

  const onSaveProfile = async () => {
    try {
      await updateUserProfile({ name, gender });
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const onLogout = () => {
    clearUserSession();
    window.location.href = '/user/auth';
  };

  if (!ready || !authenticated) {
    return <main className="min-h-screen bg-[#fcf8f8]" />;
  }

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      {/* <Comp1 /> */}

      <div className="pt-8 pb-5 px-4 md:px-8 max-w-[1440px] mx-auto" data-scroll-section>
        <div id="user-profile-sticky-target" className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Sidebar Navigation */}
          <aside
            className="lg:col-span-4 lg:sticky lg:top-28 h-fit self-start flex flex-col gap-12"
            data-scroll
            data-scroll-sticky
            data-scroll-target="#user-profile-sticky-target"
          >
            <div className="flex flex-col gap-4 border-b border-[#1c1b1b]/10 pb-12">
              <div className="w-24 h-24 bg-[#b90c1b] flex items-center justify-center font-brand text-4xl text-white">MV</div>
              <div>
                <h2 className="font-brand text-4xl uppercase tracking-widest">{name || 'StreetRiot User'}</h2>
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] opacity-40 mt-1">{email || 'guest@streetriot.com'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between group p-5 border-b border-[#1c1b1b]/5 transition-all ${item.active
                    ? 'bg-[#b90c1b] text-white'
                    : 'hover:bg-[#1c1b1b] hover:text-[#fcf8f8]'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    <span className="font-headline text-xs font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm scale-0 group-hover:scale-100 transition-transform">arrow_forward</span>
                </Link>
              ))}
              <button onClick={onLogout} className="text-left flex items-center justify-between group p-5 border-b border-[#1c1b1b]/5 transition-all hover:bg-[#1c1b1b] hover:text-[#fcf8f8]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span className="font-headline text-xs font-black uppercase tracking-widest">Logout</span>
                </div>
              </button>
            </nav>
          </aside>

          {/* Dashboard Content */}
          <div className="lg:col-span-8 flex flex-col gap-16">

            {/* Loyalty / Rewards Card */}
            <section className="bg-[#f6f3f2] p-10 md:p-16 border-l-8 border-[#b90c1b]">
              <header className="mb-10">
                <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">Loyalty Segment</span>
                <h3 className="font-brand text-5xl uppercase tracking-tighter mt-2">Profile Controls</h3>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="bg-white border-2 border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]" />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="bg-white border-2 border-[#1c1b1b]/15 px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button onClick={onSaveProfile} className="mt-8 border-2 border-[#1c1b1b] px-8 py-4 font-brand text-xl uppercase hover:bg-[#1c1b1b] hover:text-[#fcf8f8] transition-all active:scale-95">
                Save Profile
              </button>
              {message && <p className="font-headline text-[10px] uppercase tracking-widest mt-4 text-[#b90c1b]">{message}</p>}
            </section>

            {/* Recent Orders */}
            <section className="flex flex-col gap-10">
              <header className="flex justify-between items-end border-b border-[#1c1b1b]/10 pb-6">
                <h3 className="font-brand text-4xl uppercase tracking-widest">Recent Activity</h3>
                <Link href="/user/orders" className="hidden font-headline text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#b90c1b] transition-all underline underline-offset-4 lg:block">
                  View All Orders
                </Link>
              </header>

              <div className="bg-white border border-[#1c1b1b]/10 p-10 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[#b90c1b] transition-all">
                <div className="flex flex-col gap-2">
                  <span className="font-headline text-[9px] uppercase tracking-wider opacity-40">{recentOrder ? `Order #${String(recentOrder.order_code || recentOrder._id || '')}` : 'No Orders Yet'}</span>
                  <h4 className="font-brand text-3xl uppercase">{recentOrder ? String(recentOrder.status || 'Processing') : 'Start Shopping'}</h4>
                  <span className="font-headline text-[10px] uppercase tracking-widest opacity-40">{recentOrder ? 'Live status synced from backend' : 'Place your first order to see activity'}</span>
                </div>
                <Link href="/user/orders" className="bg-[#b90c1b] text-white px-10 py-5 font-brand text-xl uppercase hover:scale-105 transition-transform active:scale-95">Track Orders</Link>
              </div>
            </section>

            {/* Info Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-[#1c1b1b]/10 bg-[#f6f3f2] p-10 flex flex-col gap-6">
                <h4 className="font-brand text-2xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4">Personal Profile</h4>
                <div className="flex flex-col gap-4 font-headline text-[10px] uppercase tracking-widest opacity-60">
                  <p>{name || 'StreetRiot User'}</p>
                  <p>{email || 'guest@streetriot.com'}</p>
                  <p>{gender || 'Not specified'}</p>
                </div>
                <Link href="/user/profile" className="mt-auto font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] font-black hover:underline underline-offset-4 text-left">
                  Edit Profile →
                </Link>
              </div>
              <div className="border border-[#1c1b1b]/10 bg-[#f6f3f2] p-10 flex flex-col gap-6">
                <h4 className="font-brand text-2xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4">Primary Address</h4>
                <div className="flex flex-col gap-4 font-headline text-[10px] uppercase tracking-widest opacity-60">
                  <p>{isLoading ? 'LOADING...' : 'Use checkout to add addresses'}</p>
                  <p>ADDRESS BOOK LINKED WITH PROFILE</p>
                  <p>REAL-TIME FROM BACKEND</p>
                </div>
                <Link href="/user/address" className="mt-auto font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] font-black hover:underline underline-offset-4 text-left">
                  Manage Addresses →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Comp7 />
    </main>
  );
}