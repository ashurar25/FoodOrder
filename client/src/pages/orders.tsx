
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ShoppingBag } from "lucide-react";
import type { Order } from "@shared/schema";

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
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
        return <Badge className="bg-green-100 text-green-800">สำเร็จ</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">รอดำเนินการ</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ยกเลิก</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen bg-soft-mint">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
    <div className="max-w-md mx-auto p-4 min-h-screen bg-soft-mint">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">คำสั่งซื้อของฉน</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีคำสั่งซื้อ</h3>
          <p className="text-gray-500 mb-6">เมื่อคุณสั่งอาหาร จะแสดงในหน้านี้</p>
          <Link href="/">
            <Button className="bg-primary text-white">
              เริ่มสั่งอาหาร
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      คำสั่งซื้อ #{order.id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {order.createdAt ? formatDateTime(order.createdAt.toString()) : 'ไม่ระบุเวลา'}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.foodItem?.name || 'รายการอาหาร'} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ฿{(parseFloat(item.foodItem?.price || '0') * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">รวมทั้งสิ้น</span>
                      <span className="text-lg text-primary">฿{parseFloat(order.total).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
