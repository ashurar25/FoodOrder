import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from "lucide-react";
import type { Banner, Order } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
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

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-soft-mint">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">แผงควบคุมผู้ดูแลระบบ</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Banner Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              จัดการแบนเนอร์โปรโมชั่น
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มแบนเนอร์
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>เพิ่มแบนเนอร์ใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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
                      onClick={handleCreateBanner} 
                      className="w-full"
                      disabled={createBannerMutation.isPending}
                    >
                      {createBannerMutation.isPending ? "กำลังเพิ่ม..." : "เพิ่มแบนเนอร์"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle>รายการสั่งซื้อล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>สถิติด่วน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
