// src/components/Cart.js
import React, { useEffect, useState } from 'react';
import './Cart.css';

const STORAGE_KEY = 'cart.items';

export default function Cart() {
  // Initialize from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      console.warn('Failed to save cart to localStorage');
    }
  }, [cart]);

  
  const addItem = (item) => {
    // item is expected to include { id, service, price, quantity } from Subscriptions
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        );
      }
      return [{ ...item, quantity: item.quantity ?? 1 }, ...prev];
    });
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  
  const totalItems = cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // --- UI ---
  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item) => (
              <li
                key={item.id}
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

                {/* Service name + info */}
                <div>
                  <div style={{ fontWeight: 600 }}>{item.service}</div>
                  {item.serviceInfo && (
                    <div style={{ fontSize: 12, color: '#555' }}>{item.serviceInfo}</div>
                  )}
                  <div style={{ fontSize: 12, color: '#555' }}>${item.price.toFixed(2)}</div>
                </div>

                {/* Quantity controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    style={{ width: 60 }}
                    aria-label={`Quantity for ${item.service}`}
                  />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                {/* Line total */}
                <div style={{ fontWeight: 600 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button onClick={() => removeItem(item.id)} style={{ color: '#b91c1c' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              <div><strong>Items:</strong> {totalItems}</div>
              <div><strong>Total:</strong> ${totalPrice.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={clearCart}>Clear Cart</button>
              <button disabled={cart.length === 0}>Checkout</button>
            </div>
          </div>
        </>
      )}

      <hr style={{ margin: '2rem 0' }} />
    </div>
  );
}

