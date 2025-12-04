import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.link}>
<span className={styles.asimovian}>StreamList</span></Link>
      <Link to="/movies" className={styles.link}>
<span className={styles.asimovian}>Movies</span></Link>
      <Link to="/cart" className={styles.link}>
<span className={styles.asimovian}>Cart</span></Link>
      <Link to="/about" className={styles.link}>
<span className={styles.asimovian}>About</span></Link>
    </nav>
  );
}

export default Navbar;
