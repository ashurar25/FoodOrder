import { useMutation } from "@tanstack/react-query";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  foodItemId: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (foodItemId: string, quantity: number) => void;
  onRemoveItem: (foodItemId: string) => void;
}

export default function CartModal({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartModalProps) {
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const orderItems = items.map(item => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price,
      }));

      return apiRequest("POST", "/api/orders", {
        items: orderItems,
        total,
      });
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ!",
        description: "สั่งซื้อเรียบร้อยแล้ว",
      });
      onClose();
      // Clear cart (this would typically be handled by parent component)
      items.forEach(item => onRemoveItem(item.foodItemId));
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">ตะกร้าสินค้า</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ตะกร้าของคุณว่างเปล่า</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.foodItemId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">฿{item.price.toFixed(0)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={() => onUpdateQuantity(item.foodItemId, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                      onClick={() => onUpdateQuantity(item.foodItemId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">รวมทั้งสิ้น</span>
                <span className="font-bold text-xl text-primary">฿{total.toFixed(0)}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              className="w-full bg-primary text-white py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
            >
              {checkoutMutation.isPending ? "กำลังสั่งซื้อ..." : "สั่งซื้อ"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
