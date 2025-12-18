// src/components/SubscriptionCardSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SubscriptionCardSkeleton() {
  return (
    <div className="item-card">
      <Skeleton height={120} /> {/* Image placeholder */}
      <h3><Skeleton width="60%" /></h3>
      <p><Skeleton width="80%" /></p>
      <p className="price"><Skeleton width="40%" /></p>
      <p className="stock"><Skeleton width="30%" /></p>
      <Skeleton width="100%" height={32} /> {/* Button placeholder */}
    </div>
  );
}
