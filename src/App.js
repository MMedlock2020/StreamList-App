import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StreamList from './components/StreamList';
import Movies from './components/Movies';
import Cart from './components/Cart';
import About from './components/About';
import Subscriptions from './components/Subscriptions';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<StreamList />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
