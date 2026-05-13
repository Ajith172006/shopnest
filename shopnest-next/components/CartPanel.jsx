'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function CartPanel() {
  const { state, dispatch, cartTotal } = useStore();
  const { cart, cartOpen } = state;

  const closeAll = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  return (
    <>
      {cartOpen && <div id="overlay" className="show" onClick={closeAll} />}
      <div id="cart-panel" className={cartOpen ? 'open' : ''}>
        <div className="cart-header">
          <h2>My Cart</h2>
          <button className="cart-close" onClick={closeAll}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="ec-icon">🛒</div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>Your cart is empty!</div>
              <div style={{ fontSize: '13px' }}>Add items to get started</div>
            </div>
          ) : (
            cart.map(c => (
              <div className="cart-item" key={c.id}>
                <div className="ci-img">
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="ci-info">
                  <div className="ci-name">{c.name}</div>
                  <div className="ci-price">₹{formatNumber(c.price * c.qty)}</div>
                  <div className="ci-qty">
                    <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: c.id, delta: -1 })}>−</button>
                    <span>{c.qty}</span>
                    <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: c.id, delta: 1 })}>+</button>
                  </div>
                  <div className="ci-remove" onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: c.id })}>
                    Remove
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{formatNumber(cartTotal)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#26a541', marginBottom: '12px' }}>✓ Free Delivery</div>
            <button
              className="checkout-btn"
              onClick={() => { dispatch({ type: 'CLOSE_CART' }); dispatch({ type: 'OPEN_CHECKOUT' }); }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
