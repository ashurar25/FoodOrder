import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Banner, Order } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { toast } = useToast();
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    enabled: isOpen,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isOpen,
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
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-x-4 top-8 bottom-8 bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-primary text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">แผงควบคุมผู้ดูแลระบบ</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Banner Management */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>จัดการแบนเนอร์โปรโมชั่น</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                <Input
                  placeholder="ชื่อแบนเนอร์"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                />
                <Input
                  placeholder="คำอธิบาย"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                />
                <Input
                  placeholder="URL รูปภาพ"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                />
                <Button 
                  onClick={() => createBannerMutation.mutate(newBanner)}
                  className="w-full"
                  disabled={createBannerMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มแบนเนอร์
                </Button>
              </div>

              <div className="space-y-3">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{banner.title}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteBannerMutation.mutate(banner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>รายการสั่งซื้อล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">คำสั่งซื้อ #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH') : 'ไม่ระบุเวลา'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">฿{order.total}</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {order.status === 'confirmed' ? 'สำเร็จ' : order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
