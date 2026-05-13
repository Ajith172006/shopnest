'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function AdminDashboard({ onViewOrders }) {
  const { state, allOrders } = useStore();
  const topProducts = [...state.products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const recentOrders = allOrders.slice(-8);

  const statusClass = (s) =>
    s === 'delivered' ? 'delivered' : s === 'shipped' ? 'shipped' : s === 'pending' ? 'pending' : 'cancelled';

  return (
    <div className="admin-section active" id="sec-dashboard">
      <div className="admin-stats">
        <div className="stat-card blue">
          <div className="s-label">Total Revenue</div>
          <div className="s-value">₹12.4L</div>
          <div className="s-change">▲ 18% this month</div>
        </div>
        <div className="stat-card green">
          <div className="s-label">Total Orders</div>
          <div className="s-value" id="total-orders-stat">{allOrders.length}</div>
          <div className="s-change">▲ 12% this month</div>
        </div>
        <div className="stat-card orange">
          <div className="s-label">Products</div>
          <div className="s-value" id="total-products-stat">{state.products.length}</div>
          <div className="s-change">▲ 5 added today</div>
        </div>
        <div className="stat-card yellow">
          <div className="s-label">Customers</div>
          <div className="s-value">2,841</div>
          <div className="s-change">▲ 7% this month</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <h2>
          Recent Orders
          <button className="action-btn edit" onClick={onViewOrders}>View All</button>
        </h2>
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td>₹{formatNumber(o.total)}</td>
                <td>{o.date}</td>
                <td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-wrap">
        <h2>Top Products</h2>
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Reviews</th><th>Stock</th></tr>
          </thead>
          <tbody>
            {topProducts.map(p => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt="" style={{ width: 24, height: 24, objectFit: 'contain', verticalAlign: 'middle', marginRight: 8 }} />
                  {p.name.substring(0, 30)}...
                </td>
                <td>{p.category}</td>
                <td>₹{formatNumber(p.price)}</td>
                <td>{p.rating} ★</td>
                <td>{formatNumber(p.reviews)}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
