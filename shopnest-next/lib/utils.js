// Utility functions for ShopNest

/**
 * Format a number in Indian style (e.g. 134900 → "1,34,900").
 * Uses a deterministic algorithm — no Intl/toLocaleString — so the
 * output is identical on the Node.js server and in every browser,
 * preventing Next.js hydration mismatches.
 */
export function formatNumber(num) {
  const s = String(Math.round(num));
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const groups = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return groups.join(',') + ',' + last3;
}

export function formatPrice(price) {
  return '₹' + formatNumber(price);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN');
}

export function getDiscount(price, mrp) {
  return Math.round((mrp - price) / mrp * 100);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
