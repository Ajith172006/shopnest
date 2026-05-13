'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function ProductDetail() {
  const { state, dispatch, showToast } = useStore();
  const p = state.products.find(x => x.id === state.detailProductId);

  if (!p || state.detailProductId === null) return null;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', id: p.id });
    showToast('Added to cart! 🛒');
    dispatch({ type: 'HIDE_DETAIL' });
  };

  const handleBuyNow = () => {
    dispatch({ type: 'ADD_TO_CART', id: p.id });
    dispatch({ type: 'HIDE_DETAIL' });
    dispatch({ type: 'OPEN_CHECKOUT' });
  };

  return (
    <div id="detail-view">
      <div className="detail-top">
        <button className="back-btn" onClick={() => dispatch({ type: 'HIDE_DETAIL' })}>← Back</button>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>Product Details</span>
      </div>
      <div className="detail-body">
        <div className="detail-img-col">
          <div className="big-img" style={{ fontSize: 'unset', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width:'52px',height:'52px',border:'1px solid #ddd',borderRadius:'4px',
                display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer', overflow: 'hidden'
              }}>
                <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="detail-info-col">
          <div className="detail-brand">
            {p.brand} <span style={{ color: '#7c3aed', fontSize: '12px' }}>★ Verified Seller</span>
          </div>
          <h1>{p.name}</h1>
          <div className="detail-rating-bar">
            <span className="stars" style={{ background:'#388e3c',color:'#fff',padding:'4px 10px',borderRadius:'4px',fontWeight:700 }}>
              {p.rating} ★
            </span>
            <span style={{ fontSize:'13px',color:'#777' }}>{formatNumber(p.reviews)} Ratings &amp; Reviews</span>
          </div>
          <div className="detail-price-section">
            <span className="detail-price">₹{formatNumber(p.price)}</span>
            <span className="detail-mrp">₹{formatNumber(p.mrp)}</span>
            <span className="detail-disc">{p.discount}% off</span>
          </div>
          <div style={{ background:'#f1f8e9',padding:'12px',borderRadius:'4px',marginBottom:'16px',fontSize:'13px' }}>
            <b style={{ color:'#388e3c' }}>Available Offers</b><br />
            <div style={{ marginTop:'6px',color:'#555' }}>🏷 10% instant discount on HDFC Credit Card</div>
            <div style={{ marginTop:'4px',color:'#555' }}>🏷 Get ₹200 off on orders above ₹1999. Use: SAVE200</div>
            <div style={{ marginTop:'4px',color:'#555' }}>🏷 No Cost EMI on select Credit Cards</div>
          </div>
          <div className="detail-features">
            <h3>Highlights</h3>
            <ul>
              <li>{p.desc}</li>
              <li>Stock: {p.stock} units available</li>
              <li>Category: {p.category}</li>
            </ul>
          </div>
          <div className="detail-btns">
            <button className="btn-cart" style={{ background:'#ff9f00',color:'#fff' }} onClick={handleAddToCart}>ADD TO CART</button>
            <button className="btn-buy" onClick={handleBuyNow}>BUY NOW</button>
          </div>
          <div style={{ marginTop:'16px',fontSize:'12px',color:'#777',display:'flex',gap:'16px' }}>
            <span>🚚 Free Delivery</span>
            <span>↩ 7 Day Return</span>
            <span>✓ Top Brand</span>
            <span>🛡 1 Year Warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
