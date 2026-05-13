'use client';
import { analyticsData } from '@/lib/data';

export default function AdminAnalytics() {
  const maxRev = Math.max(...analyticsData.revenue);

  return (
    <div className="admin-section active" id="sec-analytics">
      <div className="admin-stats">
        <div className="stat-card blue"><div className="s-label">Avg Order Value</div><div className="s-value">₹3,240</div><div className="s-change">▲ 5%</div></div>
        <div className="stat-card green"><div className="s-label">Conversion Rate</div><div className="s-value">3.8%</div><div className="s-change">▲ 0.4%</div></div>
        <div className="stat-card orange"><div className="s-label">Return Rate</div><div className="s-value">2.1%</div><div className="s-change">▼ 0.3%</div></div>
        <div className="stat-card yellow"><div className="s-label">Cart Abandon</div><div className="s-value">67%</div><div className="s-change">▼ 2%</div></div>
      </div>

      <div className="admin-table-wrap">
        <h2>Category Performance</h2>
        <div style={{ padding: '12px 0' }}>
          {analyticsData.categories.map((c, i) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ width: '90px', fontSize: '12px', color: '#555', textAlign: 'right' }}>{c}</span>
              <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '4px', height: '22px', position: 'relative' }}>
                <div style={{
                  width: `${analyticsData.categoryValues[i]}%`,
                  background: analyticsData.categoryColors[i],
                  height: '100%', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', padding: '0 8px',
                }}>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>{analyticsData.categoryValues[i]}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <h2>Monthly Revenue Trend</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '150px', padding: '0 16px', borderBottom: '1px solid #eee' }}>
          {analyticsData.months.map((m, i) => (
            <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>₹{analyticsData.revenue[i]}L</span>
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                borderRadius: '3px 3px 0 0',
                height: `${(analyticsData.revenue[i] / maxRev * 100)}px`,
              }} />
              <span style={{ fontSize: '11px', color: '#777' }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
