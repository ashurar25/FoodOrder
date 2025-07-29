import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import type { FoodItem } from "@shared/schema";

interface FoodItemCardProps {
  foodItem: FoodItem;
  onAddToCart: () => void;
}

export default function FoodItemCard({ foodItem, onAddToCart }: FoodItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="food-card bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex">
        <div className="relative">
          <img 
            src={foodItem.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=120"} 
            alt={foodItem.name}
            className="w-28 h-24 object-cover"
          />
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-2 right-2 transition-all duration-200 ${
              isFavorite ? "text-red-500 scale-110" : "text-white/80 hover:text-red-500 hover:scale-110"
            }`}
          >
            <Heart className="w-4 h-4 drop-shadow-sm" fill={isFavorite ? "currentColor" : "none"} />
          </button>
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
                onClick={onAddToCart}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
