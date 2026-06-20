'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function Topbar() {
  const { state, dispatch, cartCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const locationText = state.userProfile?.address
    ? `HOME ${state.userProfile.address}`
    : 'Select delivery location';

  return (
    <>
      {/* --- DESKTOP TOPBAR --- */}
      <div id="topbar" className="desktop-only">
        <div className="topbar-inner-container">
          <div className="logo" onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}>
            <span className="logo-brand">BuyIt</span>
            <span className="logo-sub">Explore <span className="plus-color">Plus ✦</span></span>
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
          
          <div className="nav-actions">
            {state.authLoading ? (
              <button className="nav-btn" disabled>
                ⏳ Loading...
              </button>
            ) : state.userAuthenticated ? (
              <button className="nav-btn" onClick={() => {
                dispatch({ type: 'OPEN_USER_PROFILE' });
                setMenuOpen(false);
              }}>
                👤 {state.userProfile?.name?.split(' ')[0] || 'User'} ▾
              </button>
            ) : (
              <button className="nav-btn-login" onClick={() => {
                dispatch({ type: 'OPEN_USER_LOGIN' });
                setMenuOpen(false);
              }}>
                Login
              </button>
            )}


            <button className="nav-btn-cart" onClick={() => {
              dispatch({ type: 'TOGGLE_CART' });
              setMenuOpen(false);
            }}>
              🛒 Cart <span id="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE TOPBAR --- */}
      <div id="mobile-topbar" className="mobile-only">
        <div className="mobile-header-top">
          <div className="mobile-logo" onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}>
            <div className="ml-icon">🛍</div>
            <div className="ml-text">BuyIt</div>
          </div>
        </div>
        
        <div className="mobile-location-bar">
          <div className="loc-icon">🏠</div>
          <div className="loc-text"><strong>HOME</strong> {state.userProfile?.address || 'Select delivery location'}</div>
          <div className="loc-arrow">⌄</div>
        </div>

        <div className="mobile-search-container">
          <div className="ms-box">
            <span className="ms-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={state.activeSearch}
              onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
            />
            <span className="ms-camera">📷</span>
            <span className="ms-scan">🔳</span>
          </div>
        </div>
      </div>
    </>
  );
}
