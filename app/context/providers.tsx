'use client';

import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { SiteSettingsProvider } from './SiteSettingsContext';
import { AuthProvider } from './AuthContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}
