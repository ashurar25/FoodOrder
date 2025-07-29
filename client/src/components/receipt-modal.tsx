import { X, Calendar, Clock, MapPin, Phone, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/HLogo_1753815594471.png";

interface OrderItem {
  id: string;
  foodItemId: string;
  quantity: number;
  price: string;
  name?: string;
}

interface Order {
  id: string;
  customerName?: string;
  tableNumber?: string;
  total: string;
  status: string;
  createdAt: Date | null;
  notes?: string;
  items?: OrderItem[];
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

function formatDateTime(date: Date | string | null): string {
  if (!date) return "ไม่ระบุเวลา";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "ไม่ระบุเวลา";
    
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(dateObj);
  } catch (error) {
    return "ไม่ระบุเวลา";
  }
}

export default function ReceiptModal({ isOpen, onClose, order }: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-green-500" />
            ใบเสร็จรับเงิน
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 receipt-content">
          {/* Restaurant Info */}
          <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
              <img 
                src={logoPath} 
                alt="ซ้อมคอ" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">ซ้อมคอ</h3>
            <p className="text-sm text-gray-600 mb-2">เกาหลี-ไทย ฟิวชัน</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-1" />
                123 ถนนสุขุมวิท กรุงเทพฯ 10110
              </div>
              <div className="flex items-center justify-center">
                <Phone className="w-3 h-3 mr-1" />
                02-123-4567
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">เลขที่:</span>
                <span className="font-mono ml-1">#{order.id.slice(-8)}</span>
              </div>
              <div>
                <span className="text-gray-600">โต๊ะ:</span>
                <span className="font-semibold ml-1">{order.tableNumber || "ไม่ระบุ"}</span>
              </div>
              <div>
                <span className="text-gray-600">ลูกค้า:</span>
                <span className="ml-1">{order.customerName || "ลูกค้าทั่วไป"}</span>
              </div>
              <div>
                <span className="text-gray-600">สถานะ:</span>
                <span className="ml-1 text-green-600 font-semibold">{order.status}</span>
              </div>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDateTime(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">รายการอาหาร</h4>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.name || `รายการ ${index + 1}`}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">฿{(parseFloat(item.price) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">หมายเหตุ</h4>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">ยอดรวมทั้งสิ้น</span>
              <span className="text-2xl font-bold text-green-600">฿{parseFloat(order.total).toFixed(0)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t border-dashed border-gray-300 pt-4">
            <p className="mb-1">ขอบคุณที่ใช้บริการ</p>
            <p>*** ใบเสร็จนี้ไม่ใช่ใบกำกับภาษี ***</p>
            <p className="mt-2">www.somkoh.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button 
            onClick={printReceipt}
            className="w-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-semibold"
          >
            พิมพ์ใบเสร็จ
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            ปิด
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .receipt-content {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}