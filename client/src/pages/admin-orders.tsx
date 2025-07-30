
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, ShoppingBag, Eye, Check, X, Clock } from "lucide-react";
import { useState } from "react";
import type { Order } from "@shared/schema";

interface OrderWithItems extends Order {
  items?: Array<{
    id: string;
    foodItemId: string;
    quantity: number;
    price: string;
    name?: string;
  }>;
}

export default function AdminOrders() {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: orders = [], isLoading, refetch } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "สำเร็จ",
        description: "อัปเดตสถานะคำสั่งซื้อแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive",
      });
    },
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />สำเร็จ</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />รอดำเนินการ</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />ยกเลิก</Badge>;
      case 'preparing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />กำลังเตรียม</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600" />;
      case 'preparing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    selectedStatus === "all" || order.status === selectedStatus
  );

  const orderStats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'confirmed').reduce((sum, order) => sum + parseFloat(order.total), 0)
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <div className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">จัดการคำสั่งซื้อ</h1>
              <p className="text-gray-600">ดูและจัดการคำสั่งซื้อทั้งหมด</p>
            </div>
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="กรองตามสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด ({orders.length})</SelectItem>
              <SelectItem value="pending">รอดำเนินการ ({orderStats.pending})</SelectItem>
              <SelectItem value="preparing">กำลังเตรียม ({orderStats.preparing})</SelectItem>
              <SelectItem value="confirmed">สำเร็จ ({orderStats.confirmed})</SelectItem>
              <SelectItem value="cancelled">ยกเลิก ({orderStats.cancelled})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
              <div className="text-sm text-gray-600">คำสั่งซื้อทั้งหมด</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
              <div className="text-sm text-gray-600">รอดำเนินการ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.preparing}</div>
              <div className="text-sm text-gray-600">กำลังเตรียม</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{orderStats.confirmed}</div>
              <div className="text-sm text-gray-600">สำเร็จ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">฿{orderStats.totalRevenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">ยอดขายรวม</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">ไม่มีคำสั่งซื้อ</h3>
            <p className="text-gray-500">ไม่มีคำสั่งซื้อในสถานะที่เลือก</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">
                          คำสั่งซื้อ #{order.id.slice(-8)}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDateTime(order.createdAt!.toString())}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">ลูกค้า:</span>
                        <p className="font-medium text-gray-800">{order.customerName || "ไม่ระบุชื่อ"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">โต๊ะ:</span>
                        <p className="font-medium text-gray-800">{order.tableNumber || "ไม่ระบุ"}</p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="text-sm">
                        <span className="text-gray-500">หมายเหตุ:</span>
                        <p className="font-medium text-gray-800 bg-gray-50 p-2 rounded mt-1">{order.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">ยอดรวม</span>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        ฿{parseFloat(order.total).toFixed(0)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                            onClick={() => updateOrderStatusMutation.mutate({ orderId: order.id, status: 'preparing' })}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            เริ่มเตรียม
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => updateOrderStatusMutation.mutate({ orderId: order.id, status: 'cancelled' })}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            ยกเลิก
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          onClick={() => updateOrderStatusMutation.mutate({ orderId: order.id, status: 'confirmed' })}
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          เสร็จสิ้น
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(`/api/orders/${order.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
