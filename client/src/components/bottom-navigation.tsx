import { Link, useLocation } from "wouter";
import { Home, UtensilsCrossed, Receipt, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "หน้าหลัก" },
    { href: "/orders", icon: Receipt, label: "คำสั่งซื้อ" },
    { href: "/admin", icon: User, label: "แอดมิน" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center py-2 ${
                isActive ? "text-primary" : "text-gray-400"
              }`}>
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
