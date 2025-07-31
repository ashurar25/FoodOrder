import { useState } from "react";
import { Heart, Plus, Star, Sparkles } from "lucide-react";
import type { FoodItem } from "@shared/schema";

interface FoodItemCardProps {
  foodItem: FoodItem;
  onAddToCart: () => void;
}

export default function FoodItemCard({ foodItem, onAddToCart }: FoodItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="food-card bg-white/90 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 group">
      <div className="flex">
        <div className="relative overflow-hidden">
          <img 
            src={foodItem.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=120"} 
            alt={foodItem.name}
            className="w-32 h-28 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-2 right-2 transition-all duration-300 transform ${
              isFavorite 
                ? "text-red-500 scale-110 drop-shadow-lg" 
                : "text-white/90 hover:text-red-500 hover:scale-125 drop-shadow-md"
            }`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite && <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />}
          </button>
          {parseFloat(foodItem.rating || "4.5") >= 4.5 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              HOT
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start h-full">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-base mb-1">{foodItem.name}</h3>
              {foodItem.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{foodItem.description}</p>
              )}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-2.5 py-1 rounded-full border border-yellow-200">
                  <Star className="text-yellow-500 w-3.5 h-3.5" fill="currentColor" />
                  <span className="text-xs ml-1 font-semibold text-yellow-700">
                    {foodItem.rating ? parseFloat(foodItem.rating).toFixed(1) : "4.5"}
                  </span>
                </div>
                <span className="text-primary font-bold text-lg">
                  ฿{parseFloat(foodItem.price).toFixed(0)}
                </span>
              </div>
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 touch-target group ${
                  isAdding ? "animate-pulse scale-110" : ""
                }`}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isAdding ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Plus className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
                )}
                {isAdding && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-white/30"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
