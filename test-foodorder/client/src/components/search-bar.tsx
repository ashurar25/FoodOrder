import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const clearSearch = () => {
    onChange("");
  };

  return (
    <div className="px-4 mb-6 sticky top-0 z-40 bg-gradient-to-b from-purple-100/80 to-transparent backdrop-blur-lg">
      <div className="relative max-w-md mx-auto md:max-w-lg">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="ค้นหาอาหาร เครื่องดื่ม หรือหมวดหมู่..." 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 border-2 border-purple-200/50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-300/30 focus:border-purple-400 bg-white/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 text-base touch-target placeholder-gray-400"
          />
          {value && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 hover:rotate-90 touch-target p-1 rounded-full hover:bg-red-50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
        </div>
      </div>
    </div>
  );
}
