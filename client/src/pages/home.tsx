import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, Suspense, lazy } from "react";
import { Link } from "wouter";
import * as React from "react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PageContainer, ResponsiveGrid } from "@/components/layout/index";
import RestaurantHeader from "@/components/restaurant-header";
import SearchBar from "@/components/search-bar";
import PromotionalBanner from "@/components/promotional-banner";
import CategoryButtons from "@/components/category-buttons";
import FoodItemCard from "@/components/food-item-card";
import BottomNavigation from "@/components/bottom-navigation";
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
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Authentication
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const logout = useLogout();

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

  // Cart management functions with authentication check
  const addToCart = React.useCallback((foodItem: FoodItem) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

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
        price: foodItem.price,
        quantity: 1,
        foodItemId: foodItem.id
      };
      setCartItems(prev => [...prev, newItem]);
    }

    setAddedItemName(foodItem.name);
    setShowAddToCartToast(true);
    setTimeout(() => setShowAddToCartToast(false), 3000);
  }, [cartItems, isAuthenticated]);

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
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
      />

      <PageContainer className="space-y-6">
        {/* Authentication Status */}
        {!isAuthenticated && (
          <div className="sticky top-16 z-40 bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-medium">สมาชิกเท่านั้นที่สั่งอาหารได้</p>
                <p className="text-orange-600 text-sm">เข้าสู่ระบบหรือสมัครสมาชิกเพื่อสั่งอาหาร</p>
              </div>
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button size="sm" variant="outline" data-testid="button-login">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="button-register">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">สวัสดี {user.name}!</p>
                <p className="text-green-600 text-sm">พร้อมสั่งอาหารแล้ว</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => logout.mutate()} 
                disabled={logout.isPending}
                data-testid="button-logout"
              >
                {logout.isPending ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
              </Button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="sticky top-16 z-40 bg-gray-50 pt-4 pb-2">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
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
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Food Items Grid */}
        <div className="fade-in">
          

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

        {/* Add to Cart Toast */}
        {showAddToCartToast && (
          <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 scale-in">
            เพิ่ม "{addedItemName}" ลงตะกร้าแล้ว
          </div>
        )}

        {/* Authentication Prompt Toast */}
        {showAuthPrompt && (
          <div className="fixed top-20 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 scale-in">
            <div className="flex items-center space-x-2">
              <span>กรุณาเข้าสู่ระบบก่อนสั่งอาหาร</span>
              <Link href="/login">
                <button className="underline font-semibold">
                  เข้าสู่ระบบ
                </button>
              </Link>
            </div>
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
              items={cartItems}
              onRemoveItem={(foodItemId) => {
                const item = cartItems.find(item => item.foodItemId === foodItemId);
                if (item) removeFromCart(item.id);
              }}
              onUpdateQuantity={(foodItemId, quantity) => {
                const item = cartItems.find(item => item.foodItemId === foodItemId);
                if (item) updateCartItemQuantity(item.id, quantity);
              }}
              total={cartTotal}
            />
          )}

          {isBannerEditorOpen && (
            <BannerEditor
              isOpen={isBannerEditorOpen}
              onClose={() => setIsBannerEditorOpen(false)}
              banners={banners}
              restaurantId={restaurant?.id || ''}
            />
          )}
        </Suspense>
      </PageContainer>
    </div>
  );
}