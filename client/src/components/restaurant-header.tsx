
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
    <header className="bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 text-white relative overflow-hidden shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Mobile Layout */}
      <div className="relative z-10 p-2 md:hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
            {currentTime}
          </div>
          <div className="relative">
            <button 
              className="bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 transition-all duration-300 shadow-lg"
              onClick={onCartClick}
            >
              <ShoppingCart className="text-white w-4 h-4" />
            </button>
            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold shadow-lg">
                {cartItemCount}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 shadow-2xl overflow-hidden mb-1 ring-1 ring-white/10">
            <img 
              src={restaurant?.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"} 
              alt="Restaurant Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-bold mb-0.5 text-white drop-shadow-lg">
              {restaurant?.name || "ร้านอาหารไทยแท้"}
            </h1>
            <p className="text-xs text-white/80 font-medium">
              {restaurant?.description || "อาหารไทยต้นตำรับ"}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10">
        <div className="desktop-container py-6">
          <div className="flex items-center justify-between">
            <div className="text-base font-medium text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              {currentTime}
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg overflow-hidden">
                <img 
                  src={restaurant?.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"} 
                  alt="Restaurant Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-1">
                  {restaurant?.name || "ร้านอาหารไทยแท้"}
                </h1>
                <p className="text-base text-white/80 font-medium">
                  {restaurant?.description || "อาหารไทยต้นตำรับ"}
                </p>
              </div>
            </div>

            <div className="relative">
              <button 
                className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 shadow-lg"
                onClick={onCartClick}
              >
                <ShoppingCart className="text-white w-6 h-6" />
              </button>
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce shadow-lg">
                  {cartItemCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
