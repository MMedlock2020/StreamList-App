import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MovieCardSkeleton() {
  return (
    <li style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <Skeleton height={240} /> {/* Poster placeholder */}
      <div style={{ padding: '.5rem .75rem' }}>
        <Skeleton width="60%" /> {/* Title placeholder */}
        <Skeleton width="40%" /> {/* Rating/date placeholder */}
      </div>
    </li>
  );
}
