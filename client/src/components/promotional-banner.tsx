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
      <div className="px-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden shadow-lg animate-float bg-gradient-to-r from-primary/20 to-primary/10 h-40 flex items-center justify-center">
          <p className="text-gray-500">ไม่มีแบนเนอร์โปรโมชั่น</p>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];

  return (
    <div className="px-4 mb-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-all duration-500">
        <img 
          src={banner.imageUrl} 
          alt={banner.title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Glowing border */}
        <div className="absolute inset-0 rounded-3xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-500"></div>
        
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-3xl font-bold drop-shadow-2xl mb-2 group-hover:animate-pulse">{banner.title}</h3>
          {banner.subtitle && (
            <p className="text-base opacity-90 drop-shadow-lg">{banner.subtitle}</p>
          )}
        </div>
        
        {/* Sparkle effect */}
        <div className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-300/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-6 right-12 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
