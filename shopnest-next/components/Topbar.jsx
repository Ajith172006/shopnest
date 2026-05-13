'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function Topbar() {
  const { state, dispatch, cartCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="topbar">
      <div className="logo" onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}>
        🛍 BuyIt <span>Pro ✦</span>
      </div>
      <div className="search-bar">
        <input
          type="text"
          id="search-input"
          placeholder="Search for products, brands and more..."
          value={state.activeSearch}
          onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
        />
        <button onClick={() => { }}>🔍</button>
      </div>
      
      <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`nav-actions ${menuOpen ? 'open' : ''}`}>
        {state.userAuthenticated ? (
          <button className="nav-btn" onClick={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('buyit_user_session');
            dispatch({ type: 'USER_LOGOUT' });
            setMenuOpen(false);
          }}>
            👤 {state.userProfile?.name?.split(' ')[0] || 'User'}
          </button>
        ) : (
          <button className="nav-btn" onClick={() => {
            dispatch({ type: 'OPEN_USER_LOGIN' });
            setMenuOpen(false);
          }}>
            👤 Login
          </button>
        )}
        <button className="nav-btn" onClick={() => {
          dispatch({ type: 'TOGGLE_CART' });
          setMenuOpen(false);
        }}>
          🛒 Cart <span id="cart-count">{cartCount}</span>
        </button>
      </div>
    </div>
  );
}
