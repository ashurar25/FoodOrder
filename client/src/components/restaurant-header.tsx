
import { ShoppingCart, Settings } from "lucide-react";
// import logoPath from "@assets/HLogo_1753815594471.png";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface RestaurantHeaderProps {
  restaurant?: Restaurant;
  cartItemCount: number;
  onCartClick: () => void;
}

export default function RestaurantHeader({ restaurant, cartItemCount, onCartClick }: RestaurantHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");
  const { user } = useAuth();

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
    <header className="theme-header bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white relative overflow-hidden shadow-2xl z-40">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20l20 20-20 20-20-20z'/%3E%3Cpath d='M60 20l20 20-20 20-20-20z'/%3E%3Cpath d='M40 40l20 20-20 20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-6 left-1/2 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Admin Button - Small floating button */}
      <Link href="/admin">
        <button className="absolute top-2 right-2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group">
          <Settings className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-200" />
        </button>
      </Link>
      
      {/* Mobile Layout */}
      <div className="relative z-10 p-1.5 md:hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 shadow-2xl overflow-hidden ring-2 ring-white/20 bg-white hover:bg-white/90 transition-all duration-500 hover:scale-125 hover:rotate-12 cursor-pointer group flex items-center justify-center">
              <img src="/logo.jpg" alt="ซ้อมคอ" className="w-8 h-8 object-contain" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white drop-shadow-lg">
                {restaurant?.name || "ซ้อมคอ"}
              </h1>
              <div className="text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block">
                {currentTime}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Cart Button - Mobile */}
            <div className="relative">
              <button 
                className="cart-button bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all duration-500 shadow-2xl touch-target group hover:scale-110 hover:rotate-12 relative overflow-hidden"
                onClick={onCartClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <ShoppingCart className="text-white w-6 h-6 relative z-10 group-hover:animate-bounce" />
              </button>
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-2xl animate-bounce border-2 border-white">
                  {cartItemCount}
                  <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400/50"></div>
                </div>
              )}
            </div>
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
              <div className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg overflow-hidden bg-white hover:bg-white/90 transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center">
                <img src="/logo.jpg" alt="ซ้อมคอ" className="w-12 h-12 object-contain" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-1">
                  {restaurant?.name || "ซ้อมคอ"}
                </h1>
                <p className="text-base text-white/80 font-medium">
                  {restaurant?.description || "เกาหลี-ไทย ฟิวชัน"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="cart-button bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 shadow-lg"
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
      </div>
    </header>
  );
}
