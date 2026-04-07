'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clearAdminSession, getAdminUsername } from '@/app/lib/adminSession';
import { useRequireAdminSession } from '@/app/lib/guards';
import { adminLogout } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { ready } = useRequireAdminSession('/admin/login', !isLoginPage);
  const username = getAdminUsername() || 'Admin User';
  const { settings } = useSiteSettings();

  if (isLoginPage) return <>{children}</>;
  if (!ready) return <div className="min-h-screen bg-[#1c1b1b]" />;

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // local session clear should still happen even if backend logout call fails
    } finally {
      clearAdminSession();
      window.location.href = '/admin/login';
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { name: 'Products', icon: 'inventory_2', href: '/admin/products' },
    { name: 'Orders', icon: 'shopping_cart', href: '/admin/orders' },
    { name: 'Customers', icon: 'group', href: '/admin/customers' },
    { name: 'Reviews', icon: 'rate_review', href: '/admin/reviews' },
    { name: 'Communications', icon: 'mark_email_read', href: '/admin/communications' },
    { name: 'Promos', icon: 'sell', href: '/admin/promos' },
    { name: 'Analytics', icon: 'analytics', href: '/admin/analytics' },
    { name: 'Settings', icon: 'settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#1c1b1b] text-[#fcf8f8]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#ffffff]/10 flex flex-col fixed h-full bg-[#1c1b1b] z-50">
        <div className="p-8 border-b border-[#ffffff]/10">
          {/* {settings.logoUrl ? (
            <div className="mb-4 flex items-center">
              <Image
                src={settings.logoUrl}
                alt={settings.siteName || 'brand logo'}
                width={180}
                height={60}
                unoptimized
                className="h-10 w-auto object-contain"
              />
            </div>
          ) : null} */}
          <h1 className="font-brand text-3xl uppercase tracking-tighter text-[#b90c1b]">{(settings.siteName || 'STREETRIOT').toUpperCase()}</h1>
          <p className="font-headline text-[9px] uppercase tracking-[0.3em] opacity-40 mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 py-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 font-headline text-[10px] uppercase tracking-widest transition-all ${pathname === item.href ? 'bg-[#b90c1b] text-white' : 'hover:bg-[#ffffff]/5 opacity-60 hover:opacity-100'
                }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-[#ffffff]/10 flex items-center gap-4 bg-[#ffffff]/2">
          <div className="w-10 h-10 bg-[#b90c1b] flex items-center justify-center font-brand text-xs">SA</div>
          <div className="flex flex-col">
            <span className="font-headline text-[10px] uppercase tracking-[0.1em] font-black">{username}</span>
            <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">Admin</span>
          </div>
          <button onClick={handleLogout} className="ml-auto material-symbols-outlined text-sm opacity-60 hover:opacity-100" aria-label="Admin logout">logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="admin-scroll-root" className="flex-1 ml-64 h-screen p-8 md:p-12 overflow-y-auto">
        {children}

        {/* Footer info for admin */}
        <div className="mt-20 pt-8 border-t border-[#ffffff]/10 flex justify-between items-center opacity-30 font-headline text-[9px] uppercase tracking-widest">
          <span> {settings.navbarTitle || settings.siteName || 'STREETRIOT'} // 2026</span>
        </div>
      </main>
    </div>
  );
}
