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
                ? "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 text-white shadow-2xl ring-4 ring-teal-300/50 scale-105" 
                : "bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border-2 border-gradient-to-r from-teal-200 to-emerald-200 shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-teal-50 hover:to-emerald-50"
            }`}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>

            <div className="relative z-10">
              <div className={`text-3xl md:text-4xl mb-2 md:mb-3 transition-all duration-500 filter ${
                selectedCategory === category.id 
                  ? "scale-110 drop-shadow-lg animate-pulse" 
                  : "group-hover:scale-125 group-hover:drop-shadow-lg"
              }`}>
                {category.icon || '🍽️'}
              </div>
              <span className={`text-xs md:text-sm font-bold transition-all duration-300 ${
                selectedCategory === category.id 
                  ? "text-white drop-shadow-md" 
                  : "text-gray-700 group-hover:text-teal-600"
              }`}>
                {category.name}
              </span>
            </div>

            {/* Selected Indicator */}
            {selectedCategory === category.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
            )}

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              selectedCategory === category.id 
                ? "shadow-lg shadow-teal-500/50" 
                : "group-hover:shadow-lg group-hover:shadow-teal-300/30"
            }`}></div>
          </button>
        ))}
      </div>
    </div>
  );
}