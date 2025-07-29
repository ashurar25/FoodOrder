
import { MapPin, Phone, Clock, Facebook, Instagram, Twitter } from "lucide-react";

interface FooterProps {
  restaurant?: {
    name: string;
    description: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
}

export default function Footer({ restaurant }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white mt-16">
      <div className="desktop-container py-8 md:py-12">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{restaurant?.name || "ร้านอาหารไทยแท้"}</h3>
            <p className="text-gray-300">{restaurant?.description || "อาหารไทยต้นตำรับ"}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-300">
                {restaurant?.address || "123 ถนนสุขุมวิท กรุงเทพฯ 10110"}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-300">
                {restaurant?.phone || "02-123-4567"}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-300">
                {restaurant?.hours || "เปิดทุกวัน 08:00 - 22:00"}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{restaurant?.name || "ร้านอาหารไทยแท้"}</h3>
            <p className="text-gray-300 mb-4">{restaurant?.description || "อาหารไทยต้นตำรับ รสชาติดั้งเดิม"}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">ติดต่อเรา</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300">
                  {restaurant?.address || "123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300">
                  {restaurant?.phone || "02-123-4567"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">เวลาเปิด-ปิด</h4>
            <div className="text-gray-300">
              <p className="mb-2">จันทร์ - ศุกร์: 08:00 - 22:00</p>
              <p className="mb-2">เสาร์ - อาทิตย์: 07:00 - 23:00</p>
              <p className="text-sm text-indigo-400">เปิดทุกวัน ไม่มีวันหยุด</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {restaurant?.name || "ร้านอาหารไทยแท้"}. สงวนลิขสิทธิ์. | 
            <span className="ml-1">Powered by Replit</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
