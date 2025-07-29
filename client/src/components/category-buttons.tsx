import type { Category } from "@shared/schema";

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryButtons({ categories, selectedCategory, onCategoryChange }: CategoryButtonsProps) {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">หมวดหมู่อาหาร</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory === category.id ? "" : category.id)}
            className={`category-btn glass-category rounded-2xl p-4 text-center hover:shadow-lg transition-all ${
              selectedCategory === category.id ? "ring-2 ring-primary ring-opacity-50" : ""
            }`}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium text-primary">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
