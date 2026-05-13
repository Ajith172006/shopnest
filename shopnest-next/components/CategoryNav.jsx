'use client';
import { useStore } from '@/context/StoreContext';
import { categories } from '@/lib/data';

export default function CategoryNav() {
  const { state, dispatch } = useStore();

  return (
    <div id="catnav">
      <div
        className={`cat-tab${state.activeCategory === 'all' ? ' active' : ''}`}
        onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}
      >
        All
      </div>
      {categories.map(cat => (
        <div
          key={cat}
          className={`cat-tab${state.activeCategory === cat ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
