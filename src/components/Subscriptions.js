
// src/components/Subscriptions.js
import React, { useEffect, useState } from 'react';
import list from './data';
import './Subscriptions.css';

const STORAGE_KEY = 'cart.items';

function Subscriptions() {
  // Initialize from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      
      return [];
    }
  });

  // Persist to localStorage when cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart:update'));
    } catch {
      console.warn('Failed to save cart to localStorage');
    }
  }, [cart]);

  // UI state
  const [warning, setWarning] = useState('');

  const addToCart = (item) => {
    setWarning('');

    // Treat items with id <= 4 as "subscriptions" (limit one at a time)
    const isSubscription = item.id <= 4;
    const existingItem = cart.find((c) => c.id === item.id);

    // Limit one subscription at a time
    if (isSubscription && existingItem) {
      setWarning(`Warning: Only one ${item.service} subscription is allowed at a time.`);
      return;
    }

    // Stock checks
    if (item.amount <= 0) {
      setWarning(`Warning: ${item.service} is out of stock.`);
      return;
    }

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > item.amount) {
        setWarning(`Warning: Only ${item.amount} ${item.service} available.`);
        return;
      }
      setCart((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, quantity: newQuantity } : c
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="subscriptions-container">
      <h1>Subscriptions &amp; Accessories</h1>

      {warning && <div className="warning">{warning}</div>}

      <div className="grid">
        {list.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.img} alt={item.service} />
            <h3>{item.service}</h3>
            <p>{item.serviceInfo}</p>
            <p className="price">${item.price.toFixed(2)}</p>
            <p className="stock">In Stock: {item.amount}</p>

            <button
              onClick={() => addToCart(item)}
              className="add-button"
              disabled={item.amount <= 0}
            >
              {item.amount <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
