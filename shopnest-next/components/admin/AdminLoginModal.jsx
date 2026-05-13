'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

const ADMIN_PASSWORD = 'admin@buyit';

export default function AdminLoginModal() {
  const { state, dispatch, showToast } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!state.adminLoginOpen) return null;

  const handleClose = () => {
    setPassword('');
    setError('');
    dispatch({ type: 'CLOSE_ADMIN_LOGIN' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a brief check delay for UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        dispatch({ type: 'ADMIN_AUTH_SUCCESS' });
        showToast('✅ Welcome, Admin!');
        setPassword('');
        setError('');
      } else {
        setShake(true);
        setError('Incorrect password. Please try again.');
        setPassword('');
        setTimeout(() => setShake(false), 600);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div
      id="admin-login-overlay"
      onClick={(e) => e.target.id === 'admin-login-overlay' && handleClose()}
    >
      <div className={`admin-login-modal${shake ? ' shake' : ''}`}>
        <div className="admin-login-icon">🔐</div>
        <h2>Admin Access</h2>
        <p className="admin-login-subtitle">Enter your admin password to continue</p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && <p className="admin-login-error">⚠ {error}</p>}

          <div className="admin-login-actions">
            <button type="button" className="admin-login-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="admin-login-submit" disabled={!password || loading}>
              {loading ? 'Verifying...' : 'Login →'}
            </button>
          </div>
        </form>

        <p className="admin-login-hint">
          🛡 Admin area is restricted. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
