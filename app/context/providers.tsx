'use client';

import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { SiteSettingsProvider } from './SiteSettingsContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteSettingsProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </SiteSettingsProvider>
  );
}
