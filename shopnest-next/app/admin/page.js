'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import Link from 'next/link';

const ADMIN_PASSWORD = 'admin@buyit';
const AUTH_KEY = 'buyit_admin_auth';

const tabs = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'products',  icon: '📦', label: 'Products' },
  { key: 'orders',    icon: '🛍', label: 'Orders' },
  { key: 'customers', icon: '👥', label: 'Customers' },
  { key: 'analytics', icon: '📈', label: 'Analytics' },
  { key: 'settings',  icon: '⚙', label: 'Settings' },
];

/* ─── Login Screen ─────────────────────────────────────────────── */
function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, '1');
        onSuccess();
      } else {
        setShake(true);
        setError('Incorrect password. Please try again.');
        setPassword('');
        setTimeout(() => setShake(false), 600);
      }
      setLoading(false);
    }, 350);
  };

  return (
    <div className="admin-route-login-bg">
      <div className={`admin-route-login-card${shake ? ' shake' : ''}`}>
        {/* Branding */}
        <div className="arl-brand">
          <span className="arl-logo">🛍</span>
          <span className="arl-logo-text">BuyIt <span>Pro ✦</span></span>
        </div>

        <div className="arl-lock">🔐</div>
        <h1 className="arl-title">Admin Portal</h1>
        <p className="arl-sub">Restricted access — authorised personnel only</p>

        <form onSubmit={handleSubmit} className="arl-form">
          <div className="arl-field">
            <label htmlFor="admin-pw">Password</label>
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && <p className="arl-error">⚠ {error}</p>}

          <button
            type="submit"
            className="arl-submit"
            disabled={!password || loading}
          >
            {loading ? 'Verifying…' : 'Access Dashboard →'}
          </button>
        </form>

        <Link href="/" className="arl-back">← Back to store</Link>
      </div>
    </div>
  );
}

/* ─── Settings Tab ─────────────────────────────────────────────── */
function AdminSettings() {
  const { showToast } = useStore();
  return (
    <div className="admin-section active" id="sec-settings">
      <div className="add-product-form">
        <h2>⚙ Store Settings</h2>
        <div className="form-grid">
          <div className="form-group"><label>Store Name</label><input type="text" defaultValue="BuyIt" /></div>
          <div className="form-group"><label>Currency</label><select><option>INR (₹)</option><option>USD ($)</option></select></div>
          <div className="form-group"><label>Free Delivery Above</label><input type="number" defaultValue="499" /></div>
          <div className="form-group"><label>GST Rate (%)</label><input type="number" defaultValue="18" /></div>
          <div className="form-group full"><label>Store Description</label><textarea rows={2} defaultValue="India's fastest growing online marketplace" /></div>
        </div>
        <button className="form-submit" onClick={() => showToast('Settings saved!')}>Save Settings</button>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard Page ─────────────────────────────────────── */
function AdminDashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard onViewOrders={() => setActiveTab('orders')} />;
      case 'products':  return <AdminProducts />;
      case 'orders':    return <AdminOrders />;
      case 'customers': return <AdminCustomers />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings':  return <AdminSettings />;
      default:          return null;
    }
  };

  return (
    <div id="admin-panel" style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            ← Store
          </Link>
          <h1>🛍 BuyIt Admin <span>DASHBOARD</span></h1>
        </div>
        <div className="admin-header-actions">
          <button className="admin-logout-btn" onClick={onLogout}>🔓 Logout</button>
        </div>
      </div>

      {/* Body */}
      <div className="admin-body">
        <div className="admin-sidebar">
          {tabs.map(t => (
            <div
              key={t.key}
              className={`admin-menu-item${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className="icon">{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* ─── Route Entry Point ────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = loading

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    setAuthed(saved === '1');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  // Loading state (prevents flash of login on refresh if already authed)
  if (authed === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0a28', color: '#a5b4fc', fontSize: 16 }}>
        Loading…
      </div>
    );
  }

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminDashboardPage onLogout={handleLogout} />;
}
