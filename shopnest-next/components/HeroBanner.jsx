'use client';
import { useStore } from '@/context/StoreContext';

export default function HeroBanner() {
  const { state, dispatch } = useStore();
  const topDeals = [...state.products].sort((a, b) => b.discount - a.discount).slice(0, 4);

  const scrollToGrid = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="hero">
      <div className="hero-text">
        <h1>Discover Incredible<br />Deals Every Day 🚀</h1>
        <p>Up to 80% off on Electronics, Fashion &amp; More</p>
        <button onClick={scrollToGrid}>Shop Now →</button>
      </div>
      <div className="hero-deals">
        {topDeals.map(p => (
          <div
            key={p.id}
            className="deal-card"
            onClick={() => dispatch({ type: 'SHOW_DETAIL', id: p.id })}
          >
            <div className="d-img">
              <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>
            <div className="d-price">₹{p.price.toLocaleString()}</div>
            <div className="d-name">{p.brand}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
