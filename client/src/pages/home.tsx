import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize restaurant and sample data
  const { data: initData, isLoading: initLoading } = useQuery({
    queryKey: ["/api/init"],
    queryFn: async () => {
      const response = await fetch("/api/init", { method: "POST" });
      if (!response.ok) throw new Error('Init failed');
      return response.json();
    },
    staleTime: Infinity,
    retry: 3,
  });

  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: ["/api/restaurant"],
    queryFn: async () => {
      const response = await fetch("/api/restaurant");
      if (!response.ok) throw new Error('Failed to fetch restaurant');
      return response.json();
    },
    enabled: !!initData,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    enabled: !!initData,
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const response = await fetch("/api/banners");
      if (!response.ok) throw new Error('Failed to fetch banners');
      return response.json();
    },
    enabled: !!initData,
  });

  const { data: foodItems = [], isLoading: foodItemsLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items", selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? `?categoryId=${selectedCategory}` : "";
      const response = await fetch(`/api/food-items${params}`);
      if (!response.ok) throw new Error('Failed to fetch food items');
      return response.json();
    },
    enabled: !!initData && !searchQuery.trim(),
  });

  const { data: searchResults = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/food-items/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search food items');
      return response.json();
    },
    enabled: searchQuery.trim().length > 0 && !!initData,
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

  if (initLoading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {searchQuery.trim() ? (
                <div>
                  <p className="text-lg mb-2">😔</p>
                  <p>ไม่พบอาหารที่ค้นหา</p>
                  <p className="text-sm">ลองค้นหาด้วยคำอื่น</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg mb-2">🍽️</p>
                  <p>ไม่มีอาหารในหมวดหมู่นี้</p>
                  <p className="text-sm">ลองเลือกหมวดหมู่อื่น หรือดูทั้งหมด</p>
                </div>
              )}
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