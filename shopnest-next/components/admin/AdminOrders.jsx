'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function AdminOrders() {
  const { allOrders, dispatch, showToast } = useStore();

  const statusClass = (s) =>
    s === 'delivered' ? 'delivered' : s === 'shipped' ? 'shipped' : s === 'pending' ? 'pending' : 'cancelled';

  const updateStatus = (id, status) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', id, status });
    showToast(`Order ${id} → ${status}`);
  };

  return (
    <div className="admin-section active" id="sec-orders">
      <div className="admin-table-wrap">
        <h2>All Orders (<span id="order-count-admin">{allOrders.length}</span>)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Phone</th><th>Items</th>
              <th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.phone || '—'}</td>
                <td>{o.items}</td>
                <td>₹{formatNumber(o.total)}</td>
                <td>{o.payment || 'Online'}</td>
                <td>{o.date}</td>
                <td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td>
                <td>
                  <select
                    defaultValue={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    style={{ fontSize: '11px', padding: '3px 6px', border: '1px solid #ddd', borderRadius: '3px' }}
                  >
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
