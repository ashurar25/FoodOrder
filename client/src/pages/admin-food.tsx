
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Utensils } from "lucide-react";
import type { FoodItem, Category } from "@shared/schema";

export default function AdminFood() {
  const { toast } = useToast();
  const [newFoodItem, setNewFoodItem] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: foodItems = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
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
        <Link href="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่แผงควบคุม
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Utensils className="w-6 h-6 mr-2" />
          จัดการรายการอาหาร
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Add New Food Item */}
        <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-t-lg">
            <CardTitle>เพิ่มรายการอาหารใหม่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="ชื่อรายการอาหาร"
              value={newFoodItem.name}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="คำอธิบาย"
              value={newFoodItem.description}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              placeholder="ราคา"
              type="number"
              value={newFoodItem.price}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, price: e.target.value }))}
            />
            <Input
              placeholder="URL รูปภาพ"
              value={newFoodItem.imageUrl}
              onChange={(e) => setNewFoodItem(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
            <Select
              value={newFoodItem.categoryId}
              onValueChange={(value) => setNewFoodItem(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreateFoodItem} disabled={createFoodItemMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มรายการอาหาร
            </Button>
          </CardContent>
        </Card>

        {/* Food Items by Category */}
        <div className="grid gap-6">
          {groupedFoodItems.map(({ category, items }) => (
            <Card key={category.id} className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.name} ({items.length} รายการ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-white">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      )}
                      <p className="font-bold text-primary">฿{parseFloat(item.price).toFixed(0)}</p>
                      <div className="flex justify-end mt-3">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteFoodItemMutation.mutate(item.id)}
                          disabled={deleteFoodItemMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      ยังไม่มีรายการอาหารในหมวดนี้
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
