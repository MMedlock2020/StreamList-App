// src/components/CartItemSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CartItemSkeleton() {
  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto',
        alignItems: 'center',
        gap: '.75rem',
        padding: '.5rem',
        borderBottom: '1px solid #eee',
      }}
    >
      <Skeleton width={56} height={56} /> {/* Image */}
      <div>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
      <Skeleton width={100} height={32} /> {/* Quantity controls */}
      <Skeleton width="50%" /> {/* Line total */}
      <Skeleton width={70} height={32} /> {/* Remove button */}
    </li>
  );
}
