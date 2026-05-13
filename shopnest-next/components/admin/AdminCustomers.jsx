'use client';
import { customers } from '@/lib/data';

export default function AdminCustomers() {
  return (
    <div className="admin-section active" id="sec-customers">
      <div className="admin-table-wrap">
        <h2>Customers (2841)</h2>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>City</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td style={{ color: '#7c3aed' }}>{c.email}</td>
                <td>{c.city}</td>
                <td>{c.orders}</td>
                <td style={{ fontWeight: 600 }}>{c.spent}</td>
                <td>{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
