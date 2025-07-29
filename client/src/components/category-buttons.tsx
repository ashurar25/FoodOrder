import type { Category } from "@shared/schema";

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryButtons({ categories, selectedCategory, onCategoryChange }: CategoryButtonsProps) {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">หมวดหมู่อาหาร</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory === category.id ? "" : category.id)}
            className={`category-btn relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              selectedCategory === category.id 
                ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl ring-4 ring-primary/30 scale-105" 
                : "bg-white/80 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/90"
            }`}
          >
            <div className="relative z-10">
              <div className={`text-4xl mb-3 transition-transform duration-300 ${
                selectedCategory === category.id ? "scale-110" : ""
              }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-semibold transition-colors duration-300 ${
                selectedCategory === category.id ? "text-white" : "text-primary"
              }`}>
                {category.name}
              </span>
            </div>
            {selectedCategory === category.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
