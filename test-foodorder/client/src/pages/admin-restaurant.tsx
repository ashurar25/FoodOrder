import { useState, useEffect } from "react";
import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Store } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import type { Restaurant } from "@shared/schema";

export default function AdminRestaurant() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    receiptImageUrl: ""
  });

  const { data: restaurant, isLoading } = useQuery<Restaurant>({
    queryKey: ["/api/restaurant"],
  });

  const updateRestaurantMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!restaurant?.id) {
        throw new Error("ไม่พบข้อมูลร้าน");
      }
      return apiRequest("PUT", `/api/restaurant/${restaurant.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ",
        description: "อัปเดตข้อมูลร้านแล้ว",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/restaurant"] });
    },
    onError: (error: any) => {
      console.error("Restaurant update error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปเดตข้อมูลได้",
        variant: "destructive",
      });
    },
  });

  // Update form data when restaurant data is loaded
  React.useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        description: restaurant.description || "",
        logoUrl: restaurant.logoUrl || "",
        receiptImageUrl: restaurant.receiptImageUrl || ""
      });
    }
  }, [restaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณากรอกชื่อร้าน",
        variant: "destructive",
      });
      return;
    }
    if (!restaurant?.id) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบข้อมูลร้าน",
        variant: "destructive",
      });
      return;
    }
    updateRestaurantMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 min-h-screen bg-soft-mint">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-soft-mint">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่แผงควบคุม
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">ข้อมูลร้าน</h1>
      </div>

      <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="w-5 h-5" />
            <span>แก้ไขข้อมูลร้าน</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">ชื่อร้าน *</Label>
              <Input
                id="name"
                type="text"
                placeholder="กรอกชื่อร้าน"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                id="description"
                placeholder="คำอธิบายเกี่ยวกับร้าน"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <ImageUpload
              label="โลโก้ร้าน"
              placeholder="เลือกหรือใส่ URL โลโก้ร้าน"
              value={formData.logoUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
            />

            <ImageUpload
              label="รูปภาพประกอบใบเสร็จ (JPG หรือ PNG)"
              placeholder="เลือกรูปภาพที่จะแสดงข้างโลโก้ในใบเสร็จ"
              value={formData.receiptImageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, receiptImageUrl: url }))}
            />

            <Button
              type="submit"
              disabled={updateRestaurantMutation.isPending || !restaurant?.id}
              className="w-full"
            >
              {updateRestaurantMutation.isPending && <Save className="w-4 h-4 mr-2 animate-spin" />}
              {!updateRestaurantMutation.isPending && <Save className="w-4 h-4 mr-2" />}
              {updateRestaurantMutation.isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}