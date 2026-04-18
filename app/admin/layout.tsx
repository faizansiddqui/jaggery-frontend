'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, MessageSquare,
  MonitorPlay, Quote, Mail, BarChart3, Settings, LogOut, Menu, X
} from 'lucide-react';
import { clearAdminSession, getAdminUsername } from '@/app/lib/adminSession';
import { useRequireAdminSession } from '@/app/lib/guards';
import { adminLogout } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';
  const { ready } = useRequireAdminSession('/admin/login', !isLoginPage);
  const username = getAdminUsername() || 'Admin User';
  const { settings } = useSiteSettings();

  // Close mobile sidebar on route change
  useEffect(() => setIsMobileOpen(false), [pathname]);

  if (isLoginPage) return <>{children}</>;
  if (!ready) return <div className="min-h-screen bg-[#0a0a0b]" />;

  const handleLogout = async () => {
    try { await adminLogout(); } catch { }
    finally {
      clearAdminSession();
      window.location.href = '/admin/login';
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin' },
    { name: 'Products', icon: <Package size={18} />, href: '/admin/products' },
    { name: 'Orders', icon: <ShoppingCart size={18} />, href: '/admin/orders' },
    { name: 'Customers', icon: <Users size={18} />, href: '/admin/customers' },
    { name: 'Reviews', icon: <MessageSquare size={18} />, href: '/admin/reviews' },
    { name: 'Banners', icon: <MonitorPlay size={18} />, href: '/admin/banners' },
    { name: 'Testimonials', icon: <Quote size={18} />, href: '/admin/testimonials' },
    { name: 'Comms', icon: <Mail size={18} />, href: '/admin/communications' },
    { name: 'Analytics', icon: <BarChart3 size={18} />, href: '/admin/analytics' },
    { name: 'Settings', icon: <Settings size={18} />, href: '/admin/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f1115] text-white">
      <div className="p-8 border-b border-white/5">
        {/* {settings.logoUrl && (
          <Image src={settings.logoUrl} alt="Logo" width={140} height={40} unoptimized className="mb-4 h-8 w-auto object-contain brightness-0 invert" />
        )} */}
        <h1 className="text-xl font-black tracking-tighter italic uppercase text-white">
          {settings.siteName || 'AMILA'}<span className="text-primary">.</span>CORE
        </h1>
        <p className="text-[9px] tracking-[0.4em] uppercase text-slate-500 font-bold mt-1">Admin Uplink</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-200 group
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center font-bold text-xs">
            {username.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black truncate tracking-wider">{username}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Root Administrator</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-100 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed h-full z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-72 z-[70] lg:hidden shadow-2xl">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen w-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0f1115] text-white border-b border-white/5 sticky top-0 z-[40]">
          <h2 className="text-lg font-black tracking-tighter italic uppercase">{settings.siteName}</h2>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-white/5 rounded-lg text-red-500"><Menu size={24} /></button>
        </header>

        <main className="flex-1 p-6 md:p-12 max-w-[1600px] mx-auto w-full">
          {children}

          <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-40 text-[9px] font-bold tracking-[0.2em] uppercase">
            <span>© 2026 {settings.siteName} Management Protocol</span>
            <div className="flex gap-6">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Online</span>
              <span>v4.0.2-Stable</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}