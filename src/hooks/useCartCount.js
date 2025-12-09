
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cart.items';

function getCountFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

export default function useCartCount() {
  const [count, setCount] = useState(() => getCountFromStorage());

  useEffect(() => {
    const update = () => setCount(getCountFromStorage());

    // Custom event
    window.addEventListener('cart:update', update);

    // Native 'storage' event when another tab updates localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) update();
    });

    
    update();

    return () => {
      window.removeEventListener('cart:update', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return count;
}
