
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ShoppingBag, Receipt } from "lucide-react";
import { useState } from "react";
import ReceiptModal from "@/components/receipt-modal";
import type { Order } from "@shared/schema";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const handleShowReceipt = (order: Order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
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
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4 mb-4">
        <Link href="/">
          <Button variant="ghost" className="mb-3 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 p-2 rounded-full">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">คำสั่งซื้อของฉัน</h1>
        </div>
      </div>
      
      <div className="px-4">

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">ยังไม่มีคำสั่งซื้อ</h3>
            <p className="text-gray-500 mb-8 px-4">เมื่อคุณสั่งอาหาร ประวัติการสั่งซื้อจะแสดงที่นี่</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-200 hover:scale-105">
                เริ่มสั่งอาหาร
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      คำสั่งซื้อ #{order.id.slice(-8)}
                    </CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDateTime(order.createdAt!.toString())}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">ยอดรวม</span>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      ฿{parseFloat(order.total).toFixed(0)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleShowReceipt(order)}
                    className="w-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>ดูใบเสร็จ</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ReceiptModal 
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        order={selectedOrder}
      />
    </div>
  );
}
