import React from 'react';

export function FoodCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg overflow-hidden border border-white/20 animate-pulse">
      <div className="flex">
        <div className="w-32 h-28 bg-gradient-to-br from-gray-200 to-gray-300 loading-shimmer"></div>
        <div className="flex-1 p-4">
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full loading-shimmer"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 loading-shimmer"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full loading-shimmer"></div>
              <div className="h-4 w-12 bg-gradient-to-r from-green-200 to-teal-200 rounded loading-shimmer"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center pr-4">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full loading-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 text-center shadow-xl animate-pulse">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-3 loading-shimmer"></div>
      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full loading-shimmer"></div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="px-3 md:px-4 mb-4 md:mb-6">
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
        <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 loading-shimmer"></div>
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 space-y-1 md:space-y-2">
          <div className="h-4 md:h-5 w-24 md:w-32 bg-white/30 rounded loading-shimmer"></div>
          <div className="h-3 md:h-4 w-16 md:w-24 bg-white/20 rounded loading-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export function RestaurantHeaderSkeleton() {
  return (
    <header className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 relative overflow-hidden shadow-2xl animate-pulse">
      <div className="relative z-10 p-1.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white/30 loading-shimmer"></div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-white/30 rounded loading-shimmer"></div>
              <div className="h-3 w-16 bg-white/20 rounded loading-shimmer"></div>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/30 loading-shimmer"></div>
        </div>
      </div>
    </header>
  );
}