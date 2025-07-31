import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Utensils, Image, ShoppingCart, BarChart3, Settings } from "lucide-react";
import ThemeSwitcher from "@/components/theme-switcher";
import AnimatedBackground from "@/components/animated-background";
import type { Banner, Order, FoodItem } from "@shared/schema";

export default function Admin() {
  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: foodItems = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });

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
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-soft-mint">
      <AnimatedBackground />
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">แผงควบคุมผู้ดูแลระบบ</h1>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-2 mb-8">
        <Link href="/admin/banners">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <Image className="w-6 h-6 text-pink-600" />
                  <span>จัดการแบนเนอร์โปรโมชั่น</span>
                </div>
                <div className="text-2xl font-bold text-pink-600">{banners.length}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">จัดการแบนเนอร์และโปรโมชั่นต่างๆ</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/food">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <Utensils className="w-6 h-6 text-emerald-600" />
                  <span>จัดการรายการอาหาร</span>
                </div>
                <div className="text-2xl font-bold text-emerald-600">{foodItems.length}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">เพิ่ม แก้ไข และลบรายการอาหาร</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <span>จัดการคำสั่งซื้อ</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">ดูและจัดการคำสั่งซื้อทั้งหมด</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reports">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <span>รายงานและสถิติ</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ฿{orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(0)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">ดูสถิติการขายและรายงานต่างๆ</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-1">

        {/* Database Configuration Card */}
        <Link href="/admin/restaurant">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-green-600" />
                  <span>ข้อมูลร้าน</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">แก้ไขชื่อร้าน คำอธิบาย และโลโก้</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/database">
          <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-amber-600" />
                  <span>การตั้งค่าฐานข้อมูล</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600">กำหนดค่าฐานข้อมูลภายนอกและจัดการข้อมูล</p>
              <div className="mt-3 text-sm text-gray-500 group-hover:text-primary transition-colors">
                คลิกเพื่อจัดการ →
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats */}
      <Card className="bg-white/70 backdrop-blur-md border-white/30 shadow-xl mt-6">
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
                ฿{orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600">ยอดขายรวม</p>
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
  );
}