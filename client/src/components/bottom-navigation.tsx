import { Link, useLocation } from "wouter";
import { Home, Receipt, User, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BottomNavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function BottomNavigation({ cartItemCount = 0, onCartClick }: BottomNavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: "/", icon: Home, label: "หน้าหลัก" },
    { 
      href: "#cart", 
      icon: ShoppingCart, 
      label: "ตะกร้า", 
      onClick: onCartClick,
      badge: cartItemCount > 0 ? cartItemCount : undefined
    },
    { href: "/orders", icon: Receipt, label: "คำสั่งซื้อ" },
    ...(user ? [
      { href: "/profile", icon: User, label: "โปรไฟล์" }
    ] : [
      { href: "/login", icon: User, label: "เข้าสู่ระบบ" }
    ])
  ];

  return (
    <>
      <nav className="fixed top-4 right-4 z-40">
        {user && user.role === "admin" && (
          <Link href="/admin">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md hover:bg-blue-600 transition-all duration-300">
              Admin
            </button>
          </Link>
        )}
      </nav>
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full mx-4 z-50">
        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl px-6 py-3 shadow-2xl">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location === item.href && item.href !== "#cart";
              const Icon = item.icon;

              // Handle cart button differently (with onClick)
              if (item.href === "#cart") {
                return (
                  <button 
                    key={item.href}
                    onClick={item.onClick}
                    className={`relative flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-500 group text-gray-400 hover:text-white hover:scale-105`}
                  >
                    <div className="relative z-10">
                      <div className="relative">
                        <Icon className="w-6 h-6 mb-1 transition-all duration-300 group-hover:scale-110" />
                        {item.badge && item.badge > 0 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                            {item.badge > 99 ? '99+' : item.badge}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 nav-hover-bg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                );
              }

              // Handle regular navigation items
              return (
                <Link key={item.href} href={item.href}>
                  <button className={`relative flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-500 group ${
                    isActive
                      ? "text-white transform scale-110"
                      : "text-gray-400 hover:text-white hover:scale-105"
                  }`}>
                    {isActive && (
                      <div className="absolute inset-0 nav-active-bg rounded-2xl shadow-lg">
                        <div className="absolute inset-0 nav-active-pulse rounded-2xl animate-pulse opacity-75"></div>
                      </div>
                    )}
                    <div className="relative z-10">
                      <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${
                        isActive ? 'animate-pulse' : 'group-hover:scale-110'
                      }`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>

                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 nav-hover-bg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}