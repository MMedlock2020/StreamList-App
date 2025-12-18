// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import useCartCount from '../hooks/useCartCount';

function Navbar() {
  const cartCount = useCartCount();

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <Link to="/" className={styles.link}>
        <span className={styles.asimovian}>EZTech</span>
      </Link>

      <Link to="/movies" className={styles.link}>
        <span className={styles.asimovian}>Movies</span>
      </Link>

      <Link to="/cart" className={styles.link}>
        <span className={styles.asimovian}>Cart</span>
        {/* Badge */}
        <span
          className={styles.badge}
          aria-label={`Cart items: ${cartCount}`}
          title={`Cart items: ${cartCount}`}
          aria-live="polite"
        >
          {cartCount}
        </span>
      </Link>

      <Link to="/about" className={styles.link}>
        <span className={styles.asimovian}>About</span>
      </Link>

      <Link to="/subscriptions" className={styles.link}>
        <span className={styles.asimovian}>Subscriptions</span>
      </Link>
    </nav>
  );
}

export default Navbar;
