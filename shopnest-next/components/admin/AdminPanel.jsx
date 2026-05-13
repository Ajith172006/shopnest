'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';

const tabs = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'products',  icon: '📦', label: 'Products' },
  { key: 'orders',    icon: '🛍', label: 'Orders' },
  { key: 'customers', icon: '👥', label: 'Customers' },
  { key: 'analytics', icon: '📈', label: 'Analytics' },
  { key: 'settings',  icon: '⚙', label: 'Settings' },
];

export default function AdminPanel() {
  const { state, dispatch, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!state.adminOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard onViewOrders={() => setActiveTab('orders')} />;
      case 'products':  return <AdminProducts />;
      case 'orders':    return <AdminOrders />;
      case 'customers': return <AdminCustomers />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings':  return (
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
      default: return null;
    }
  };

  return (
    <div id="admin-panel">
      <div className="admin-header">
        <div className="admin-header-title">
          <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>🛍 BuyIt Admin <span>DASHBOARD</span></h1>
        </div>
        <div className="admin-header-actions">
          <button className="admin-logout-btn" onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })}>🔓 Logout</button>
          <button className="close-admin" onClick={() => dispatch({ type: 'CLOSE_ADMIN' })}>✕ Close</button>
        </div>
      </div>
      <div className="admin-body">
        <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {tabs.map(t => (
            <div
              key={t.key}
              className={`admin-menu-item${activeTab === t.key ? ' active' : ''}`}
              onClick={() => {
                setActiveTab(t.key);
                setSidebarOpen(false);
              }}
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
