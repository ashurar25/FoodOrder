import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Utensils } from "lucide-react";
import type { Banner, Order, FoodItem, Category } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });

  const [newFoodItem, setNewFoodItem] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: foodItems = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });

  const createBannerMutation = useMutation({
    mutationFn: async (bannerData: typeof newBanner) => {
      const restaurant = await fetch("/api/restaurant").then(r => r.json());
      return apiRequest("POST", "/api/banners", {
        ...bannerData,
        restaurantId: restaurant.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setNewBanner({ title: "", subtitle: "", imageUrl: "" });
      toast({
        title: "สำเร็จ",
        description: "เพิ่มแบนเนอร์ใหม่แล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มแบนเนอร์ได้",
        variant: "destructive",
      });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (bannerId: string) => apiRequest("DELETE", `/api/banners/${bannerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({
        title: "สำเร็จ",
        description: "ลบแบนเนอร์แล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบแบนเนอร์ได้",
        variant: "destructive",
      });
    },
  });

  const createFoodItemMutation = useMutation({
    mutationFn: async (foodItemData: typeof newFoodItem) => {
      const restaurant = await fetch("/api/restaurant").then(r => r.json());
      return apiRequest("POST", "/api/food-items", {
        ...foodItemData,
        restaurantId: restaurant.id,
        price: foodItemData.price,
        rating: "4.0",
        isAvailable: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      setNewFoodItem({ name: "", description: "", price: "", imageUrl: "", categoryId: "" });
      toast({
        title: "สำเร็จ",
        description: "เพิ่มรายการอาหารใหม่แล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มรายการอาหารได้",
        variant: "destructive",
      });
    },
  });

  const deleteFoodItemMutation = useMutation({
    mutationFn: (foodItemId: string) => apiRequest("DELETE", `/api/food-items/${foodItemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      toast({
        title: "สำเร็จ",
        description: "ลบรายการอาหารแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบรายการอาหารได้",
        variant: "destructive",
      });
    },
  });

  const handleCreateBanner = () => {
    if (!newBanner.title || !newBanner.imageUrl) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อและรูปภาพแบนเนอร์",
        variant: "destructive",
      });
      return;
    }
    createBannerMutation.mutate(newBanner);
  };

  const handleCreateFoodItem = () => {
    if (!newFoodItem.name || !newFoodItem.price || !newFoodItem.categoryId) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }
    createFoodItemMutation.mutate(newFoodItem);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'ไม่ระบุหมวดหมู่';
  };

  const groupedFoodItems = categories.map(category => ({
    category,
    items: foodItems.filter(item => item.categoryId === category.id)
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-soft-mint">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">แผงควบคุมผู้ดูแลระบบ</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {/* Banner Management */}
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>จัดการแบนเนอร์โปรโมชั่น</span>
                </div></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {banners.map((banner) => (
                <div key={banner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{banner.title}</p>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600">{banner.subtitle}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteBannerMutation.mutate(banner.id)}
                      disabled={deleteBannerMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <p className="text-center text-gray-500 py-4">ยังไม่มีแบนเนอร์</p>
              )}
            </div>
          </CardContent>
        </Card>

          {/* Food Item Management */}
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>จัดการรายการอาหาร</span>
                </div></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {groupedFoodItems.map(({ category, items }) => (
                <div key={category.id}>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.name} ({items.length})
                  </h4>
                  <div className="space-y-2 ml-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">฿{parseFloat(item.price).toFixed(0)}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteFoodItemMutation.mutate(item.id)}
                          disabled={deleteFoodItemMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="text-xs text-gray-500 ml-2">ยังไม่มีรายการอาหารในหมวดนี้</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle>รายการสั่งซื้อล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">คำสั่งซื้อ #{order.id.slice(0, 8)}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {order.createdAt ? formatDateTime(order.createdAt.toString()) : 'ไม่ระบุเวลา'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">฿{order.total}</p>
                      <Badge 
                        variant={order.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.status === 'confirmed' ? 'สำเร็จ' : order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-500 py-4">ยังไม่มีคำสั่งซื้อ</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>สถิติด่วน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-sm text-gray-600">คำสั่งซื้อทั้งหมด</p>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  ฿{orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">ยอดขายรวม</p>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{banners.length}</p>
                <p className="text-sm text-gray-600">แบนเนอร์ทั้งหมด</p>
              </div>
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-600">คำสั่งซื้อสำเร็จ</p>
              </div>
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{foodItems.length}</p>
                <p className="text-sm text-gray-600">รายการอาหารทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}