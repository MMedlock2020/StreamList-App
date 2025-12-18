// src/components/StreamItemSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function StreamItemSkeleton() {
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '.5rem',
        borderBottom: '1px solid #eee',
      }}
    >
      <Skeleton width="60%" /> {/* Text placeholder */}
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <Skeleton width={50} height={28} /> {/* Edit button */}
        <Skeleton width={60} height={28} /> {/* Delete button */}
      </div>
    </li>
  );
}
