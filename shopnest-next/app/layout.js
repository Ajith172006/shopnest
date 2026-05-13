import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import SmoothScroll from '@/components/SmoothScroll';

import Script from 'next/script';

export const metadata = {
  title: 'BuyIt – Your Home for Everything',
  description: 'BuyIt - Your Home for Everything. Shop electronics, fashion, mobiles, groceries and more at unbeatable prices.',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </head>
      <body>
        <SmoothScroll>
          <StoreProvider>
            {children}
          </StoreProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
