'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function ProductCard({ product: p }) {
  const { state, dispatch, showToast } = useStore();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!state.userAuthenticated) {
      showToast('Please login to add items to cart.');
      dispatch({ type: 'OPEN_USER_LOGIN' });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', id: p.id });
    showToast('Added to cart! 🛒');
  };

  return (
    <div
      className="product-card"
      onClick={() => dispatch({ type: 'SHOW_DETAIL', id: p.id })}
    >
      {p.discount >= 30 && <div className="badge">{p.discount}% OFF</div>}

      <div className="p-img">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="p-brand">{p.brand}</div>
      <div className="p-name">{p.name}</div>

      <div className="p-rating">
        <span className="stars">{p.rating} ★</span>
        <span className="count">({formatNumber(p.reviews)})</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span className="p-price">₹{formatNumber(p.price)}</span>
        <span className="p-mrp">₹{formatNumber(p.mrp)}</span>
        <span className="p-disc">{p.discount}% off</span>
      </div>

      <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
