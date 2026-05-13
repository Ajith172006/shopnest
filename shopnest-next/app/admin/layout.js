export const metadata = {
  title: 'Admin Portal – BuyIt',
  description: 'BuyIt Admin Dashboard – manage products, orders, customers and analytics.',
};

// Layout for /admin — no StoreProvider wrapper needed (it's inherited from root layout)
export default function AdminLayout({ children }) {
  return children;
}
