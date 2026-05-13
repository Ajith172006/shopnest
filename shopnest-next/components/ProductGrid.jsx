'use client';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { state, dispatch, getFiltered } = useStore();
  const filtered = getFiltered();

  return (
    <div id="products">
      <div className="section-title">
        <span id="section-label">
          {state.activeCategory === 'all' ? 'All Products' : state.activeCategory}
        </span>
        <span
          className="see-all"
          onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}
        >
          See All
        </span>
      </div>

      <div className="sort-bar">
        <label>Sort by:</label>
        <select
          value={state.sortMode}
          onChange={e => dispatch({ type: 'SET_SORT', mode: e.target.value })}
        >
          <option value="default">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
          <option value="discount">Discount</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#777' }}>
          {filtered.length} products
        </span>
      </div>

      <div id="product-grid">
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#777', fontSize: '14px' }}>
            😕 No products found. Try different filters.
          </div>
        ) : (
          filtered.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}
