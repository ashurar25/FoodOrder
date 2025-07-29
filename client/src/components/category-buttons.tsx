import type { Category } from "@shared/schema";

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryButtons({ categories, selectedCategory, onCategoryChange }: CategoryButtonsProps) {
  return (
    <div className="px-4 mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">หมวดหมู่อาหาร</h2>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory === category.id ? "" : category.id)}
            className={`category-btn group relative overflow-hidden rounded-3xl p-4 md:p-6 text-center transition-all duration-500 transform hover:scale-110 hover:rotate-1 ${
              selectedCategory === category.id 
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl ring-4 ring-purple-300/50 scale-105 animate-pulse" 
                : "bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
            }`}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            
            <div className="relative z-10">
              <div className={`text-3xl md:text-4xl mb-2 md:mb-3 transition-all duration-500 filter ${
                selectedCategory === category.id 
                  ? "scale-110 drop-shadow-lg animate-bounce" 
                  : "group-hover:scale-125 group-hover:drop-shadow-lg"
              }`}>
                {category.icon}
              </div>
              <span className={`text-xs md:text-sm font-bold transition-all duration-300 ${
                selectedCategory === category.id 
                  ? "text-white drop-shadow-md" 
                  : "text-gray-700 group-hover:text-purple-600"
              }`}>
                {category.name}
              </span>
            </div>
            
            {/* Selected Indicator */}
            {selectedCategory === category.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-ping"></div>
            )}
            
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              selectedCategory === category.id 
                ? "shadow-lg shadow-purple-500/50" 
                : "group-hover:shadow-lg group-hover:shadow-purple-300/30"
            }`}></div>
          </button>
        ))}
      </div>
    </div>
  );
}
