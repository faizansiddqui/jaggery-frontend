"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

type TabItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: (pathname: string) => boolean;
};

const tabs: TabItem[] = [
    {
        href: "/",
        label: "Home",
        icon: Home,
        isActive: (pathname) => pathname === "/",
    },
    {
        href: "/search",
        label: "Search",
        icon: Search,
        isActive: (pathname) => pathname.startsWith("/search"),
    },
    {
        href: "/user/profile",
        label: "Profile",
        icon: User,
        isActive: (pathname) => pathname.startsWith("/user/profile"),
    },
    {
        href: "/user/wishlist",
        label: "Wishlist",
        icon: Heart,
        isActive: (pathname) => pathname.startsWith("/user/wishlist"),
    },
    {
        href: "/cart",
        label: "Cart",
        icon: ShoppingCart,
        isActive: (pathname) => pathname.startsWith("/cart") || pathname.startsWith("/checkout"),
    },
];

export default function MobileBottomTabs() {
    const pathname = usePathname();
    const { itemCount } = useCart();

    if (!pathname) return null;
    if (pathname.startsWith("/user/auth")) return null;

    const cartCountLabel = itemCount > 99 ? "99+" : String(itemCount);

    return (
        <nav
            aria-label="Mobile bottom navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[115] border-t border-[#1c1b1b]/10 bg-[#fcf8f8]/95 backdrop-blur-xl px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2"
        >
            <ul className="grid grid-cols-5 gap-1">
                {tabs.map((tab) => {
                    const active = tab.isActive(pathname);
                    const Icon = tab.icon;

                    return (
                        <li key={tab.href}>
                            <Link
                                href={tab.href}
                                className={`relative flex flex-col items-center justify-center rounded-[5px] py-2 transition-all duration-300 ${active
                                        ? "bg-[#1c1b1b] text-white shadow-[0_8px_24px_rgba(28,27,27,0.22)]"
                                        : "text-[#1c1b1b]/70 hover:text-[#b90c1b] active:scale-95"
                                    }`}
                            >
                                <span className={`relative transition-transform duration-300 ${active ? "scale-110" : "scale-100"}`}>
                                    <Icon className="h-4 w-4" />
                                    {tab.href === "/cart" && itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#b90c1b] text-white text-[9px] font-bold leading-none flex items-center justify-center">
                                            {cartCountLabel}
                                        </span>
                                    )}
                                </span>
                                <span className="mt-1 text-[10px] font-headline uppercase tracking-widest leading-none">
                                    {tab.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
