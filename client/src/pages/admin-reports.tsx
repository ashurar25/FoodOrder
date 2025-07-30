
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock, FileText, Download } from "lucide-react";
import { useState, useMemo } from "react";
import type { Order, FoodItem } from "@shared/schema";

interface OrderWithItems extends Order {
  orderItems?: Array<{
    id: string;
    foodItemId: string;
    quantity: number;
    price: string;
    foodItem?: {
      name: string;
      categoryId: string;
    };
  }>;
}

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7days");

  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const { data: foodItems = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });

  // Calculate date ranges
  const getDateRange = (period: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return { startDate, endDate: now };
  };

  // Filter orders by selected period
  const filteredOrders = useMemo(() => {
    const { startDate, endDate } = getDateRange(selectedPeriod);
    return orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders, selectedPeriod]);

  // Calculate statistics
  const stats = useMemo(() => {
    const confirmedOrders = filteredOrders.filter(o => o.status === 'confirmed');
    const totalRevenue = confirmedOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const avgOrderValue = confirmedOrders.length > 0 ? totalRevenue / confirmedOrders.length : 0;
    
    // Calculate previous period for comparison
    const { startDate: prevStart, endDate: prevEnd } = getDateRange(selectedPeriod);
    const periodDays = Math.ceil((prevEnd.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(prevStart);
    prevStartDate.setDate(prevStartDate.getDate() - periodDays);
    
    const prevOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= prevStartDate && orderDate < prevStart && order.status === 'confirmed';
    });
    
    const prevRevenue = prevOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const orderChange = prevOrders.length > 0 ? ((confirmedOrders.length - prevOrders.length) / prevOrders.length) * 100 : 0;

    return {
      totalOrders: filteredOrders.length,
      confirmedOrders: confirmedOrders.length,
      pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
      cancelledOrders: filteredOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      avgOrderValue,
      revenueChange,
      orderChange,
      conversionRate: filteredOrders.length > 0 ? (confirmedOrders.length / filteredOrders.length) * 100 : 0
    };
  }, [filteredOrders, orders, selectedPeriod]);

  // Top selling items
  const topSellingItems = useMemo(() => {
    const itemStats: Record<string, { name: string; quantity: number; revenue: number; orders: number }> = {};
    
    filteredOrders
      .filter(order => order.status === 'confirmed' && order.orderItems)
      .forEach(order => {
        order.orderItems!.forEach(item => {
          const foodItem = foodItems.find(f => f.id === item.foodItemId);
          const itemName = foodItem?.name || 'Unknown Item';
          
          if (!itemStats[item.foodItemId]) {
            itemStats[item.foodItemId] = {
              name: itemName,
              quantity: 0,
              revenue: 0,
              orders: 0
            };
          }
          
          itemStats[item.foodItemId].quantity += item.quantity;
          itemStats[item.foodItemId].revenue += parseFloat(item.price) * item.quantity;
          itemStats[item.foodItemId].orders += 1;
        });
      });

    return Object.entries(itemStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [filteredOrders, foodItems]);

  // Daily sales data
  const dailySales = useMemo(() => {
    const salesByDay: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    filteredOrders
      .filter(order => order.status === 'confirmed')
      .forEach(order => {
        if (!order.createdAt) return;
        const date = new Date(order.createdAt).toLocaleDateString('th-TH');
        
        if (!salesByDay[date]) {
          salesByDay[date] = { date, revenue: 0, orders: 0 };
        }
        
        salesByDay[date].revenue += parseFloat(order.total);
        salesByDay[date].orders += 1;
      });

    return Object.values(salesByDay).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredOrders]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExportReport = () => {
    const reportData = {
      period: selectedPeriod,
      dateRange: getDateRange(selectedPeriod),
      stats,
      topSellingItems,
      dailySales,
      orders: filteredOrders
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (ordersLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <div className="animate-pulse space-y-4">
          <div className="bg-white rounded-lg p-4 h-32"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4 mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mb-3 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่แอดมิน
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">รายงานและสถิติ</h1>
              <p className="text-gray-600">วิเคราะห์ยอดขายและประสิทธิภาพ</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleExportReport}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="เลือกช่วงเวลา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">วันนี้</SelectItem>
                <SelectItem value="7days">7 วันที่ผ่านมา</SelectItem>
                <SelectItem value="30days">30 วันที่ผ่านมา</SelectItem>
                <SelectItem value="3months">3 เดือนที่ผ่านมา</SelectItem>
                <SelectItem value="year">1 ปีที่ผ่านมา</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ยอดขายรวม</p>
                  <p className="text-2xl font-bold text-green-600">฿{stats.totalRevenue.toFixed(0)}</p>
                  <div className="flex items-center mt-1">
                    {stats.revenueChange >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.revenueChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">คำสั่งซื้อสำเร็จ</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.confirmedOrders}</p>
                  <div className="flex items-center mt-1">
                    {stats.orderChange >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${stats.orderChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.orderChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ยอดเฉลี่ยต่อออเดอร์</p>
                  <p className="text-2xl font-bold text-purple-600">฿{stats.avgOrderValue.toFixed(0)}</p>
                  <p className="text-xs text-gray-500 mt-1">จากคำสั่งซื้อที่สำเร็จ</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">อัตราความสำเร็จ</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">คำสั่งซื้อที่สำเร็จ</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Overview */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>สถานะคำสั่งซื้อ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.confirmedOrders}</p>
                <p className="text-sm text-gray-600">สำเร็จ</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                <p className="text-sm text-gray-600">รอดำเนินการ</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
                <p className="text-sm text-gray-600">ยกเลิก</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>สินค้าขายดี (Top 10)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSellingItems.length > 0 ? (
                topSellingItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.orders} ออเดอร์</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">x{item.quantity}</p>
                      <p className="text-sm text-green-600">฿{item.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">ไม่มีข้อมูลสินค้าขายดี</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Sales Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>ยอดขายรายวัน</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailySales.length > 0 ? (
                dailySales.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-sm text-gray-500">{day.orders} ออเดอร์</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">฿{day.revenue.toFixed(0)}</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((day.revenue / Math.max(...dailySales.map(d => d.revenue))) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">ไม่มีข้อมูลยอดขายรายวัน</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">สรุปผลประกอบการ</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-2xl font-bold">฿{stats.totalRevenue.toFixed(0)}</p>
                  <p className="text-sm opacity-90">รายได้รวม</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmedOrders}</p>
                  <p className="text-sm opacity-90">คำสั่งซื้อสำเร็จ</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                  <p className="text-sm opacity-90">อัตราความสำเร็จ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
