'use client';
import { useStore } from '@/context/StoreContext';

export default function FilterSidebar() {
  const { dispatch } = useStore();

  return (
    <div id="filters">
      <h3>Filters</h3>
      <div className="filter-section">
        <h4>Price Range</h4>
        <label className="filter-check">
          <input type="radio" name="price" onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 0, max: 500 })} />
          Under ₹500
        </label>
        <label className="filter-check">
          <input type="radio" name="price" onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 500, max: 2000 })} />
          ₹500 – ₹2,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 2000, max: 10000 })} />
          ₹2,000 – ₹10,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 10000, max: 999999 })} />
          Above ₹10,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 0, max: 999999 })} />
          All Prices
        </label>
      </div>

      <div className="filter-section">
        <h4>Rating</h4>
        <label className="filter-check">
          <input type="radio" name="rating" onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 4 })} />
          ★ 4 &amp; above
        </label>
        <label className="filter-check">
          <input type="radio" name="rating" onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 3 })} />
          ★ 3 &amp; above
        </label>
        <label className="filter-check">
          <input type="radio" name="rating" onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 0 })} />
          All Ratings
        </label>
      </div>

      <div className="filter-section">
        <h4>Discount</h4>
        <label className="filter-check">
          <input type="radio" name="disc" onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 50 })} />
          50% or more
        </label>
        <label className="filter-check">
          <input type="radio" name="disc" onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 30 })} />
          30% or more
        </label>
        <label className="filter-check">
          <input type="radio" name="disc" onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 0 })} />
          All
        </label>
      </div>
    </div>
  );
}
