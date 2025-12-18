
// hooks/useCartCount.js
import useCart from './useCart';

export default function useCartCount() {
  const { count } = useCart();
  return count;
}
