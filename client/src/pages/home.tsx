import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import RestaurantHeader from "@/components/restaurant-header";
import SearchBar from "@/components/search-bar";
import PromotionalBanner from "@/components/promotional-banner";
import CategoryButtons from "@/components/category-buttons";
import FoodItemCard from "@/components/food-item-card";
import CartModal from "@/components/cart-modal";
import BottomNavigation from "@/components/bottom-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Restaurant, Category, FoodItem, Banner } from "@shared/schema";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  foodItemId: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize restaurant data
  useQuery({
    queryKey: ["/api/init"],
    queryFn: async () => {
      const response = await fetch("/api/init", { method: "POST" });
      return response.json();
    },
  });

  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: ["/api/restaurant"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: foodItems = [], isLoading: foodItemsLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/food-items?categoryId=${selectedCategory}`
        : "/api/food-items";
      const response = await fetch(url);
      return response.json();
    },
  });

  const { data: searchResults = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/food-items/search?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const displayItems = searchQuery.trim() ? searchResults : foodItems;

  const addToCart = (foodItem: FoodItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.foodItemId === foodItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.foodItemId === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: foodItem.id,
        name: foodItem.name,
        price: parseFloat(foodItem.price),
        quantity: 1,
        foodItemId: foodItem.id,
      }];
    });
  };

  const removeFromCart = (foodItemId: string) => {
    setCartItems(prev => prev.filter(item => item.foodItemId !== foodItemId));
  };

  const updateCartItemQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.foodItemId === foodItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative">
      <RestaurantHeader 
        restaurant={restaurant}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      <PromotionalBanner banners={banners} />
      
      <CategoryButtons 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="px-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {searchQuery.trim() ? "ผลการค้นหา" : "อาหารยอดนิยม"}
          </h2>
          {!searchQuery.trim() && (
            <button className="text-primary text-sm font-medium">
              ดูทั้งหมด
            </button>
          )}
        </div>

        <div className="space-y-4">
          {foodItemsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex">
                  <Skeleton className="w-24 h-20" />
                  <div className="flex-1 p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : displayItems.length > 0 ? (
            displayItems.map((item) => (
              <FoodItemCard
                key={item.id}
                foodItem={item}
                onAddToCart={() => addToCart(item)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery.trim() ? "ไม่พบอาหารที่ค้นหา" : "ไม่มีอาหารในหมวดหมู่นี้"}
            </div>
          )}
        </div>
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
      />

      <BottomNavigation />
    </div>
  );
}
