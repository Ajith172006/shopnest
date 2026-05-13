import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'BuyIt – Your Home for Everything',
  description: 'BuyIt - Your Home for Everything. Shop electronics, fashion, mobiles, groceries and more at unbeatable prices.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
