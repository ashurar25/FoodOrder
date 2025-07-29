import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as React from "react";
import RestaurantHeader from "@/components/restaurant-header";
import SearchBar from "@/components/search-bar";
import PromotionalBanner from "@/components/promotional-banner";
import CategoryButtons from "@/components/category-buttons";
import FoodItemCard from "@/components/food-item-card";
import CartModal from "@/components/cart-modal";
import BottomNavigation from "@/components/bottom-navigation";
import BannerEditor from "@/components/banner-editor";
import Footer from "@/components/footer";
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
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");
  const [isBannerEditorOpen, setIsBannerEditorOpen] = useState(false);

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

  // Set default category to meatball when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const meatballCategory = categories.find(c => c.name === "ลูกชิ้น");
      if (meatballCategory) {
        setSelectedCategory(meatballCategory.id);
      }
    }
  }, [categories, selectedCategory]);

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
    staleTime: 0, // เพื่อให้ fetch ข้อมูลใหม่เสมอ
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

    // Show toast notification with item name
    setAddedItemName(foodItem.name);
    setShowAddToCartToast(true);
    setTimeout(() => {
      setShowAddToCartToast(false);
      setAddedItemName("");
    }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Mobile Layout */}
      <div className="md:hidden max-w-md mx-auto bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-2xl min-h-screen relative">
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50">
          <RestaurantHeader 
            restaurant={restaurant}
            cartItemCount={cartItemCount}
            onCartClick={() => setIsCartOpen(true)}
          />
        </div>

        <div className="pt-16">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="px-4">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-600">โปรโมชัน</h3>
          </div>
        </div>

        <PromotionalBanner banners={banners} />

        <CategoryButtons 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="px-4 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {searchQuery.trim() ? "ผลการค้นหา" : 
               selectedCategory ? 
                 `${categories.find(c => c.id === selectedCategory)?.name || 'หมวดหมู่ที่เลือก'}` : 
                 "อาหารยอดนิยม"}
            </h2>
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
                ) : selectedCategory ? (
                  <div>
                    <p className="text-lg mb-2">🍽️</p>
                    <p>ไม่มีอาหารในหมวดหมู่ "{categories.find(c => c.id === selectedCategory)?.name}"</p>
                    <p className="text-sm">ลองเลือกหมวดหมู่อื่น</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg mb-2">🍽️</p>
                    <p>ไม่มีอาหารในร้าน</p>
                    <p className="text-sm">กรุณาติดต่อร้านค้า</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <BottomNavigation />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <RestaurantHeader 
          restaurant={restaurant}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <div className="desktop-container py-8">
          <div className="mb-8">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <PromotionalBanner banners={banners} />

          <div className="mb-8">
            <CategoryButtons 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {searchQuery.trim() ? "ผลการค้นหา" : 
               selectedCategory ? 
                 `${categories.find(c => c.id === selectedCategory)?.name || 'หมวดหมู่ที่เลือก'}` : 
                 "อาหารยอดนิยม"}
            </h2>

            {foodItemsLoading ? (
              <div className="food-grid">
                {Array.from({ length: 6 }).map((_, i) => (
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
                ))}
              </div>
            ) : displayItems.length > 0 ? (
              <div className="food-grid">
                {displayItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    foodItem={item}
                    onAddToCart={() => addToCart(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {searchQuery.trim() ? (
                  <div>
                    <p className="text-2xl mb-4">😔</p>
                    <p className="text-lg">ไม่พบอาหารที่ค้นหา</p>
                    <p>ลองค้นหาด้วยคำอื่น</p>
                  </div>
                ) : selectedCategory ? (
                  <div>
                    <p className="text-2xl mb-4">🍽️</p>
                    <p className="text-lg">ไม่มีอาหารในหมวดหมู่ "{categories.find(c => c.id === selectedCategory)?.name}"</p>
                    <p>ลองเลือกหมวดหมู่อื่น</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl mb-4">🍽️</p>
                    <p className="text-lg">ไม่มีอาหารในร้าน</p>
                    <p>กรุณาติดต่อร้านค้า</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <Footer restaurant={restaurant ? {
          name: restaurant.name,
          description: restaurant.description || '',
          phone: '02-123-4567',
          address: 'กรุงเทพฯ 10110',
          hours: 'เปิดทุกวัน 08:00 - 22:00'
        } : undefined} />
      </div>

      {/* Add to Cart Toast */}
      {showAddToCartToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-bounce max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-green-500 rounded-full p-1">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <p className="font-medium">เพิ่มเข้าตะกร้าแล้ว!</p>
              <p className="text-sm text-green-100">{addedItemName}</p>
            </div>
          </div>
        </div>
      )}

      

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
      />

      <BannerEditor
        isOpen={isBannerEditorOpen}
        onClose={() => setIsBannerEditorOpen(false)}
        banners={banners}
        restaurantId={restaurant?.id || ""}
      />

      <BottomNavigation />
    </div>
  );
}