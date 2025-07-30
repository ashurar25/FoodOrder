
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, Image } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import type { Banner } from "@shared/schema";

export default function AdminBanners() {
  const { toast } = useToast();
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
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
          <Image className="w-6 h-6 mr-2" />
          จัดการแบนเนอร์โปรโมชั่น
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Add New Banner */}
        <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-t-lg">
            <CardTitle>เพิ่มแบนเนอร์ใหม่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="ชื่อแบนเนอร์"
              value={newBanner.title}
              onChange={(e) => setNewBanner(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="คำอธิบาย (ไม่บังคับ)"
              value={newBanner.subtitle}
              onChange={(e) => setNewBanner(prev => ({ ...prev, subtitle: e.target.value }))}
            />
            <ImageUpload
              label="รูปภาพแบนเนอร์"
              placeholder="เลือกหรือใส่ URL รูปภาพแบนเนอร์"
              value={newBanner.imageUrl}
              onChange={(url) => setNewBanner(prev => ({ ...prev, imageUrl: url }))}
            />
            <Button onClick={handleCreateBanner} disabled={createBannerMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มแบนเนอร์
            </Button>
          </CardContent>
        </Card>

        {/* Banner List */}
        <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle>แบนเนอร์ทั้งหมด ({banners.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <div key={banner.id} className="border rounded-lg p-4 bg-white">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-gray-600 text-sm">{banner.subtitle}</p>
                  )}
                  <div className="flex justify-end space-x-2 mt-3">
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
                <div className="col-span-full text-center py-8 text-gray-500">
                  ยังไม่มีแบนเนอร์
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
