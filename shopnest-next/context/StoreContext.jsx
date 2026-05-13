'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { initialProducts, sampleOrders } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';

const StoreContext = createContext(null);

const initialState = {
  products: initialProducts,
  cart: [],
  orders: [],
  // UI state
  activeCategory: 'all',
  activeSearch: '',
  priceMin: 0,
  priceMax: 999999,
  minRating: 0,
  minDiscount: 0,
  sortMode: 'default',
  // Panels
  cartOpen: false,
  checkoutOpen: false,
  detailProductId: null,
  adminOpen: false,
  adminAuthenticated: false,
  adminLoginOpen: false,
  toast: '',
  userAuthenticated: false,
  userLoginOpen: false,
  userProfile: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(c => c.id === action.id);
      return {
        ...state,
        cart: existing
          ? state.cart.map(c => c.id === action.id ? { ...c, qty: c.qty + 1 } : c)
          : [...state.cart, { ...state.products.find(p => p.id === action.id), qty: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(c => c.id !== action.id) };
    case 'CHANGE_QTY': {
      const updated = state.cart.map(c =>
        c.id === action.id ? { ...c, qty: c.qty + action.delta } : c
      ).filter(c => c.qty > 0);
      return { ...state, cart: updated };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.order],
        cart: [],
        checkoutOpen: false,
        cartOpen: false,
      };
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };
    case 'SET_SEARCH':
      return { ...state, activeSearch: action.search };
    case 'SET_PRICE_FILTER':
      return { ...state, priceMin: action.min, priceMax: action.max };
    case 'SET_RATING_FILTER':
      return { ...state, minRating: action.rating };
    case 'SET_DISCOUNT_FILTER':
      return { ...state, minDiscount: action.discount };
    case 'SET_SORT':
      return { ...state, sortMode: action.mode };
    case 'TOGGLE_CART':
      return { ...state, cartOpen: !state.cartOpen };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'OPEN_CHECKOUT':
      return { ...state, checkoutOpen: true };
    case 'CLOSE_CHECKOUT':
      return { ...state, checkoutOpen: false };
    case 'SHOW_DETAIL':
      return { ...state, detailProductId: action.id };
    case 'HIDE_DETAIL':
      return { ...state, detailProductId: null };
    case 'SHOW_ADMIN':
      // Only open if already authenticated, otherwise open login modal
      return state.adminAuthenticated
        ? { ...state, adminOpen: true }
        : { ...state, adminLoginOpen: true };
    case 'CLOSE_ADMIN':
      return { ...state, adminOpen: false };
    case 'OPEN_ADMIN_LOGIN':
      return { ...state, adminLoginOpen: true };
    case 'CLOSE_ADMIN_LOGIN':
      return { ...state, adminLoginOpen: false };
    case 'ADMIN_AUTH_SUCCESS':
      return { ...state, adminAuthenticated: true, adminLoginOpen: false, adminOpen: true };
    case 'ADMIN_LOGOUT':
      return { ...state, adminAuthenticated: false, adminOpen: false };
    case 'SHOW_TOAST':
      return { ...state, toast: action.message };
    case 'HIDE_TOAST':
      return { ...state, toast: '' };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.product] };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o),
      };
    case 'OPEN_USER_LOGIN':
      return { ...state, userLoginOpen: true };
    case 'CLOSE_USER_LOGIN':
      return { ...state, userLoginOpen: false };
    case 'USER_LOGIN_SUCCESS':
      return { ...state, userAuthenticated: true, userLoginOpen: false };
    case 'USER_LOGOUT':
      return { ...state, userAuthenticated: false, userProfile: null };
    case 'UPDATE_USER_PROFILE':
      return { ...state, userProfile: action.profile };
    case 'HYDRATE_USER':
      return { ...state, userAuthenticated: true, userProfile: action.profile };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Supabase auth state listener — hydrates session on load & clears on sign-out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && session.user.email) {
        try {
          const res = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          
          if (!res.ok) {
            // API error (e.g. 404 user not found, or 500 db error), user needs to setup profile
            dispatch({ type: 'OPEN_USER_LOGIN' });
            return;
          }

          const data = await res.json();
          if (data.success && data.data) {
            const p = data.data;
            if (p.phone && p.address) {
              dispatch({ type: 'HYDRATE_USER', profile: p });
            } else {
              dispatch({ type: 'OPEN_USER_LOGIN' });
            }
          } else {
            dispatch({ type: 'OPEN_USER_LOGIN' });
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
          // Even if network fails or API crashes, force the profile setup modal to open
          // so the user isn't stuck having to click "Login" again.
          dispatch({ type: 'OPEN_USER_LOGIN' });
        }
      } else {
        dispatch({ type: 'USER_LOGOUT' });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const getFiltered = useCallback(() => {
    let arr = state.products.filter(p => {
      if (state.activeCategory !== 'all' && p.category !== state.activeCategory) return false;
      if (state.activeSearch) {
        const q = state.activeSearch.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      }
      if (p.price < state.priceMin || p.price > state.priceMax) return false;
      if (p.rating < state.minRating) return false;
      if (p.discount < state.minDiscount) return false;
      return true;
    });
    if (state.sortMode === 'price_asc') arr.sort((a, b) => a.price - b.price);
    else if (state.sortMode === 'price_desc') arr.sort((a, b) => b.price - a.price);
    else if (state.sortMode === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (state.sortMode === 'discount') arr.sort((a, b) => b.discount - a.discount);
    return arr;
  }, [state]);

  const showToast = useCallback((msg) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  }, []);

  const cartTotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  const allOrders = [...sampleOrders, ...state.orders];

  return (
    <StoreContext.Provider value={{ state, dispatch, getFiltered, showToast, cartTotal, cartCount, allOrders }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
