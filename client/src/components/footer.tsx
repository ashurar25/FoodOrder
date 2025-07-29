
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
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white mt-8">
      <div className="desktop-container py-4 md:py-6">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">{restaurant?.name || "ร้านอาหารไทยแท้"}</h3>
            <p className="text-gray-300 text-sm">{restaurant?.description || "อาหารไทยต้นตำรับ"}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-300">
                {restaurant?.phone || "02-123-4567"}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-300">
                {restaurant?.hours || "เปิดทุกวัน 08:00 - 22:00"}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">{restaurant?.name || "ร้านอาหารไทยแท้"}</h3>
            <p className="text-gray-300 mb-3 text-sm">{restaurant?.description || "อาหารไทยต้นตำรับ รสชาติดั้งเดิม"}</p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2 text-indigo-400">ติดต่อเรา</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {restaurant?.phone || "02-123-4567"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {restaurant?.address || "กรุงเทพฯ 10110"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2 text-indigo-400">เวลาเปิด-ปิด</h4>
            <div className="text-gray-300 text-sm">
              <p className="mb-1">จันทร์ - ศุกร์: 08:00 - 22:00</p>
              <p className="mb-1">เสาร์ - อาทิตย์: 07:00 - 23:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-3 text-center">
          <p className="text-gray-400 text-xs">
            © 2024 {restaurant?.name || "ร้านอาหารไทยแท้"}. สงวนลิขสิทธิ์. | 
            <span className="ml-1">Powered by Replit</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
