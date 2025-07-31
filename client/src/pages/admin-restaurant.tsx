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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าแอดมิน
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Store className="w-6 h-6 mr-2 text-blue-500" />
          จัดการข้อมูลร้าน
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลร้าน</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Name */}
            <div>
              <Label htmlFor="name">ชื่อร้าน</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ชื่อร้านอาหาร"
                className="mt-1"
              />
            </div>

            {/* Restaurant Description */}
            <div>
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="คำอธิบายร้าน"
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <ImageUpload
                label="โลโก้ร้าน"
                value={formData.logoUrl}
                onChange={(url) => handleInputChange('logoUrl', url)}
                placeholder="เลือกโลโก้ร้าน..."
              />
            </div>

            {/* Receipt Image Upload */}
            <div>
              <ImageUpload
                label="รูปภาพประกอบใบเสร็จ (JPG หรือ PNG)"
                value={formData.receiptImageUrl}
                onChange={(url) => handleInputChange('receiptImageUrl', url)}
                placeholder="เลือกรูปภาพประกอบใบเสร็จ..."
              />
              <p className="text-sm text-gray-500 mt-1">
                รูปภาพนี้จะปรากฏในใบเสร็จร่วมกับโลโก้ร้าน
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={updateRestaurantMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateRestaurantMutation.isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

  const { data: restaurant, isLoading } = useQuery<Restaurant>({
    queryKey: ["/api/restaurant"],
  });

  const updateRestaurantMutation = useMutation({
    mutationFn: async (data: Partial<Restaurant>) => {
      if (!restaurant?.id) throw new Error('Restaurant ID not found');
      
      const response = await fetch(`/api/restaurant/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurant"] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดตข้อมูลร้านแล้ว",
      });
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอัพเดตข้อมูลร้านได้",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateRestaurantMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!restaurant?.id) {
        throw new Error("ไม่พบข้อมูลร้าน");
      }
      return apiRequest(`/api/restaurant/${restaurant.id}`, "PUT", data);
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