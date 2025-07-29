import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Restaurant } from "@shared/schema";

interface RestaurantHeaderProps {
  restaurant?: Restaurant;
  cartItemCount: number;
  onCartClick: () => void;
}

export default function RestaurantHeader({ restaurant, cartItemCount, onCartClick }: RestaurantHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="gradient-bg p-4 text-white relative overflow-hidden bg-white shadow-sm">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium opacity-90">
            {currentTime}
          </div>
          <div className="relative">
            <button 
              className="glass-morphism rounded-full p-3 hover:bg-white/30 transition-all"
              onClick={onCartClick}
            >
              <ShoppingCart className="text-white text-lg w-5 h-5" />
            </button>
            {cartItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                {cartItemCount}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden">
            <img 
              src={restaurant?.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
              alt="Restaurant Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">{restaurant?.name || "ร้านอาหารไทยแท้"}</h1>
            <p className="text-xs opacity-90">{restaurant?.description || "อาหารไทยต้นตำรับ"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
