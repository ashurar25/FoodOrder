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
    <div className="p-4 bg-gradient-to-b from-primary/10 to-transparent">
      <div className="relative max-w-md mx-auto md:max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="ค้นหาอาหาร เครื่องดื่ม หรือหมวดหมู่..." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-lg transition-all duration-200 hover:shadow-xl text-base md:text-sm"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
