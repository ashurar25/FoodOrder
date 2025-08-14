
import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'banner' | 'profile';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 6 }: LoadingSkeletonProps) {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);

  if (type === 'banner') {
    return (
      <div className="w-full h-48 md:h-64 bg-gray-200 rounded-lg loading-shimmer"></div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto loading-shimmer"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded loading-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 loading-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 loading-shimmer"></div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {skeletonItems.map((i) => (
          <div key={i} className="flex items-center space-x-3 p-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg loading-shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded loading-shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 loading-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="food-grid">
      {skeletonItems.map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="w-full h-48 bg-gray-200 rounded-lg loading-shimmer mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded loading-shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 loading-shimmer"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 loading-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
