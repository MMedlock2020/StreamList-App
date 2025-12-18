// src/components/Cart.js
import React, { useCallback, useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import './Cart.css';
import CartItemSkeleton from './CartItemSkeleton';

// Memoized row component
const CartItem = React.memo(function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <li
      role="listitem"
      aria-label={`${item.service}, quantity ${item.quantity}, price $${item.price}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto',
        alignItems: 'center',
        gap: '.75rem',
        padding: '.5rem',
        borderBottom: '1px solid #eee',
      }}
    >
      <img
        src={item.img}
        alt={item.service}
        style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }}
      />

      <div>
        <div style={{ fontWeight: 600 }}>{item.service}</div>
        {item.serviceInfo && (
          <div style={{ fontSize: 12, color: '#555' }}>{item.serviceInfo}</div>
        )}
        <div style={{ fontSize: 12, color: '#555' }}>${item.price.toFixed(2)}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label={`Decrease quantity of ${item.service}`}
        >
          -
        </button>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          style={{ width: 60 }}
          aria-label={`Quantity for ${item.service}`}
        />
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label={`Increase quantity of ${item.service}`}
        >
          +
        </button>
      </div>

      <div style={{ fontWeight: 600 }}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        onClick={() => removeItem(item.id)}
        style={{ color: '#b91c1c' }}
        aria-label={`Remove ${item.service} from cart`}
      >
        Remove
      </button>
    </li>
  );
});

export default function Cart() {
  const { cart, removeItem, updateQuantity, clearCart, count, total } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const memoizedUpdateQuantity = useCallback(updateQuantity, [updateQuantity]);
  const memoizedRemoveItem = useCallback(removeItem, [removeItem]);

  return (
    <div
      style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}
      aria-busy={loading}
    >
      <h2 id="cart-heading">Cart</h2>

      {loading ? (
        <ul role="list" aria-labelledby="cart-heading">
          {Array(3).fill().map((_, i) => <CartItemSkeleton key={i} />)}
        </ul>
      ) : cart.length === 0 ? (
        <p role="status">Your cart is empty.</p>
      ) : (
        <>
          <ul role="list" aria-labelledby="cart-heading">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={memoizedUpdateQuantity}
                removeItem={memoizedRemoveItem}
              />
            ))}
          </ul>

          <div
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}
            aria-live="polite"
          >
            <div>
              <div><strong>Items:</strong> {count}</div>
              <div><strong>Total:</strong> ${total.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={clearCart} aria-label="Clear all items from cart">
                Clear Cart
              </button>
              <button disabled={cart.length === 0} aria-label="Proceed to checkout">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}

      <hr style={{ margin: '2rem 0' }} />
    </div>
  );
}

