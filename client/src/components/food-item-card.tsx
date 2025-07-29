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
    <div className="food-card bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex">
        <img 
          src={foodItem.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=120"} 
          alt={foodItem.name}
          className="w-24 h-20 object-cover"
        />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{foodItem.name}</h3>
              {foodItem.description && (
                <p className="text-sm text-gray-600 mt-1">{foodItem.description}</p>
              )}
              <div className="flex items-center mt-2">
                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                  <Star className="text-yellow-500 w-3 h-3" fill="currentColor" />
                  <span className="text-xs ml-1 font-medium">
                    {foodItem.rating ? parseFloat(foodItem.rating).toFixed(1) : "4.5"}
                  </span>
                </div>
                <span className="text-primary font-bold ml-3">
                  ฿{parseFloat(foodItem.price).toFixed(0)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`transition-colors ${
                  isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={onAddToCart}
                className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
