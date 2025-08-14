import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, Suspense, lazy } from "react";
import * as React from "react";
import { PageContainer, ResponsiveGrid } from "@/components/layout/index";
import RestaurantHeader from "@/components/restaurant-header";
import SearchBar from "@/components/search-bar";
import PromotionalBanner from "@/components/promotional-banner";
import CategoryButtons from "@/components/category-buttons";
import FoodItemCard from "@/components/food-item-card";
import BottomNavigation from "@/components/bottom-navigation";
import Footer from "@/components/footer";
import LoadingSkeleton from "@/components/loading-skeleton";
import type { Restaurant, Category, FoodItem, Banner } from "@shared/schema";

// Lazy load heavy components
const CartModal = lazy(() => import("@/components/cart-modal"));
const BannerEditor = lazy(() => import("@/components/banner-editor"));

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

  // Optimize data fetching with proper caching
  const { data: initData, isLoading: initLoading } = useQuery({
    queryKey: ["/api/init"],
    queryFn: async () => {
      const response = await fetch("/api/init", { method: "POST" });
      if (!response.ok) throw new Error('Init failed');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const { data: restaurant, isLoading: restaurantLoading } = useQuery<Restaurant>({
    queryKey: ["/api/restaurant"],
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!initData,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!initData,
  });

  const { data: banners = [], isLoading: bannersLoading } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!initData,
  });

  const { data: allFoodItems = [], isLoading: foodItemsLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!initData,
  });

  // Set default category when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const meatballCategory = categories.find(c => c.name === "ลูกชิ้น");
      if (meatballCategory) {
        setSelectedCategory(meatballCategory.id);
      } else {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories, selectedCategory]);

  // Memoize filtered food items for better performance
  const filteredFoodItems = useMemo(() => {
    return allFoodItems.filter(item => {
      const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.isAvailable;
    });
  }, [allFoodItems, selectedCategory, searchQuery]);

  // Calculate cart totals
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Cart management functions
  const addToCart = React.useCallback((foodItem: FoodItem) => {
    const existingItem = cartItems.find(item => item.foodItemId === foodItem.id);
    
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.foodItemId === foodItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `${foodItem.id}-${Date.now()}`,
        name: foodItem.name,
        price: parseFloat(foodItem.price),
        quantity: 1,
        foodItemId: foodItem.id
      };
      setCartItems(prev => [...prev, newItem]);
    }

    setAddedItemName(foodItem.name);
    setShowAddToCartToast(true);
    setTimeout(() => setShowAddToCartToast(false), 3000);
  }, [cartItems]);

  const removeFromCart = React.useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateCartItemQuantity = React.useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  }, [removeFromCart]);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  // Loading states
  const isLoading = initLoading || restaurantLoading || categoriesLoading || foodItemsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSkeleton type="banner" />
        <PageContainer className="space-y-6">
          <LoadingSkeleton type="list" count={3} />
          <LoadingSkeleton type="card" count={8} />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RestaurantHeader
        restaurant={restaurant}
        cartItemsCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onBannerEditorClick={() => setIsBannerEditorOpen(true)}
      />

      <PageContainer className="space-y-6">
        {/* Search Bar */}
        <div className="sticky top-16 z-40 bg-gray-50 pt-4 pb-2">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="ค้นหาเมนูอาหาร..."
          />
        </div>

        {/* Promotional Banner */}
        {banners.length > 0 && (
          <div className="fade-in">
            <PromotionalBanner banners={banners} />
          </div>
        )}

        {/* Category Navigation */}
        <div className="fade-in">
          <CategoryButtons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Food Items Grid */}
        <div className="fade-in">
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                Debug: Categories: {categories.length}, All Food Items: {allFoodItems.length}, 
                Filtered: {filteredFoodItems.length}, Selected Category: {selectedCategory}
              </p>
            </div>
          )}
          
          {filteredFoodItems.length > 0 ? (
            <ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
              {filteredFoodItems.map((item) => (
                <div key={item.id} className="will-change-transform">
                  <FoodItemCard
                    foodItem={item}
                    onAddToCart={() => addToCart(item)}
                  />
                </div>
              ))}
            </ResponsiveGrid>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg mb-2">ไม่พบรายการอาหาร</p>
                {searchQuery && (
                  <p className="text-sm">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
                )}
                {allFoodItems.length === 0 && !foodItemsLoading && (
                  <p className="text-sm mt-2">ยังไม่มีข้อมูลเมนูอาหาร</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </PageContainer>

      {/* Add to Cart Toast */}
      {showAddToCartToast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 scale-in">
          เพิ่ม "{addedItemName}" ลงตะกร้าแล้ว
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Lazy loaded modals */}
      <Suspense fallback={null}>
        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateCartItemQuantity}
            onClearCart={clearCart}
            total={cartTotal}
          />
        )}

        {isBannerEditorOpen && (
          <BannerEditor
            isOpen={isBannerEditorOpen}
            onClose={() => setIsBannerEditorOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}