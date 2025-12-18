// src/components/Subscriptions.js
import React, { useState, useCallback, useEffect } from 'react';
import useCart from '../hooks/useCart';
import list from './data';
import './Subscriptions.css';
import SubscriptionCardSkeleton from './SubscriptionCardSkeleton';

// Memoized card component
const SubscriptionCard = React.memo(function SubscriptionCard({ item, onAdd }) {
  return (
    <div
      className="item-card"
      role="listitem"
      aria-label={`${item.service}, ${item.serviceInfo}, price $${item.price}, stock ${item.amount}`}
    >
      <img src={item.img} alt={item.service} />
      <h3>{item.service}</h3>
      <p>{item.serviceInfo}</p>
      <p className="price">${item.price.toFixed(2)}</p>
      <p className="stock">In Stock: {item.amount}</p>

      <button
        onClick={() => onAdd(item)}
        className="add-button"
        disabled={item.amount <= 0}
        aria-label={item.amount <= 0
          ? `${item.service} is out of stock`
          : `Add ${item.service} to cart`}
      >
        {item.amount <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
});

function Subscriptions() {
  const { cart, addItem } = useCart();
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate loading state (replace with real fetch if needed)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const addToCartWithRules = useCallback(
    (item) => {
      setWarning('');

      const isSubscription = item.id <= 4;
      const existingItem = cart.find((c) => c.id === item.id);

      if (isSubscription && existingItem) {
        setWarning(`Warning: Only one ${item.service} subscription is allowed at a time.`);
        return;
      }

      if (item.amount <= 0) {
        setWarning(`Warning: ${item.service} is out of stock.`);
        return;
      }

      if (existingItem && existingItem.quantity + 1 > item.amount) {
        setWarning(`Warning: Only ${item.amount} ${item.service} available.`);
        return;
      }

      addItem({ ...item, quantity: 1 });
    },
    [cart, addItem]
  );

  return (
    <div className="subscriptions-container" aria-busy={loading}>
      <h1 id="subscriptions-heading">Subscriptions &amp; Accessories</h1>

      {warning && (
        <div role="alert" className="warning">
          {warning}
        </div>
      )}

      <div className="grid" role="list" aria-labelledby="subscriptions-heading">
        {loading
          ? Array(6).fill().map((_, i) => <SubscriptionCardSkeleton key={i} />)
          : list.map((item) => (
              <SubscriptionCard key={item.id} item={item} onAdd={addToCartWithRules} />
            ))}
      </div>
    </div>
  );
}

export default Subscriptions;
