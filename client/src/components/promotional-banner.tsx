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
    <div className="px-4 mb-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg animate-float">
        <img 
          src={banner.imageUrl} 
          alt={banner.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{banner.title}</h3>
            {banner.subtitle && (
              <p className="text-sm opacity-90">{banner.subtitle}</p>
            )}
          </div>
        </div>
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
