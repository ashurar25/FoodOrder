import { useState, useEffect } from "react";
import type { Banner } from "@shared/schema";

interface PromotionalBannerProps {
  banners: Banner[];
}

export default function PromotionalBanner({ banners }: PromotionalBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="px-4 mb-4">
        <div className="relative rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-primary/20 to-primary/10 h-32 md:h-40 flex items-center justify-center">
          <p className="text-gray-500 text-sm">ไม่มีแบนเนอร์โปรโมชั่น</p>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];

  return (
    <div className="px-3 md:px-4 mb-4 md:mb-6">
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl group hover:scale-[1.02] transition-all duration-300">
        <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
          <img 
            src={banner.imageUrl} 
            alt={banner.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 text-white max-w-[70%]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg mb-1 line-clamp-2">
              {banner.title}
            </h3>
            {banner.subtitle && (
              <p className="text-xs md:text-sm opacity-90 drop-shadow-md line-clamp-1">
                {banner.subtitle}
              </p>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white/40 rounded-full animate-pulse"></div>
          </div>
          
          {/* Pagination dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex space-x-1">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                    index === currentBanner ? "bg-white scale-110" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
