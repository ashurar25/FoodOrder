import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileFriendlyHeader } from '@/components/layout/mobile-friendly-header';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { 
  BarChart3, 
  Image, 
  ShoppingBag, 
  Users, 
  Settings, 
  Database,
  ChevronRight,
  Lock,
  LogIn
} from 'lucide-react';

const adminMenuItems = [
  {
    title: 'จัดการแบนเนอร์',
    description: 'จัดการแบนเนอร์โฆษณาและโปรโมชั่น',
    icon: Image,
    path: '/admin/banners',
    color: 'bg-blue-500'
  },
  {
    title: 'จัดการอาหาร',
    description: 'เพิ่ม แก้ไข และลบรายการอาหาร',
    icon: ShoppingBag,
    path: '/admin/food',
    color: 'bg-green-500'
  },
  {
    title: 'จัดการคำสั่งซื้อ',
    description: 'ดูและจัดการคำสั่งซื้อของลูกค้า',
    icon: BarChart3,
    path: '/admin/orders',
    color: 'bg-orange-500'
  },
  {
    title: 'จัดการผู้ใช้',
    description: 'จัดการบัญชีผู้ใช้และสิทธิ์',
    icon: Users,
    path: '/admin/users',
    color: 'bg-purple-500'
  },
  {
    title: 'รายงาน',
    description: 'ดูรายงานยอดขายและสถิติ',
    icon: BarChart3,
    path: '/admin/reports',
    color: 'bg-red-500'
  },
  {
    title: 'ฐานข้อมูล',
    description: 'จัดการฐานข้อมูลและการสำรองข้อมูล',
    icon: Database,
    path: '/admin/database',
    color: 'bg-gray-500'
  },
  {
    title: 'ตั้งค่าร้าน',
    description: 'จัดการข้อมูลร้านและการตั้งค่า',
    icon: Settings,
    path: '/admin/restaurant',
    color: 'bg-teal-500'
  }
];

function AdminPanel() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSkeleton type="banner" />
        <div className="container-responsive space-y-6 py-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  // Not authenticated - show admin login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/10 backdrop-blur-md text-white">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">เข้าสู่ระบบแอดมิน</CardTitle>
            <CardDescription className="text-gray-300">
              กรุณาเข้าสู่ระบบเพื่อเข้าถึงแผงควบคุมผู้ดูแลระบบ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate('/admin/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-medium"
            >
              <LogIn className="w-4 h-4 mr-2" />
              เข้าสู่ระบบแอดมิน
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileFriendlyHeader 
        title="แผงควบคุมผู้ดูแลระบบ"
        subtitle="จัดการระบบร้านอาหาร"
        showBackButton={true}
        backTo="/"
      />

      <div className="container-responsive space-y-6 py-6">
        {/* Welcome Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-xl">ยินดีต้อนรับสู่แผงควบคุม</CardTitle>
            <CardDescription className="text-blue-100">
              จัดการร้านอาหารของคุณอย่างมีประสิทธิภาพ
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminMenuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${item.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">คำสั่งซื้อวันนี้</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">เมนูอาหาร</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">ลูกค้าทั้งหมด</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">฿0</div>
              <div className="text-sm text-gray-600">ยอดขายวันนี้</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">การดำเนินการด่วน</CardTitle>
            <CardDescription>
              เครื่องมือที่ใช้บ่อยสำหรับการจัดการร้าน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/food')}
                className="h-20 flex flex-col space-y-2"
              >
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xs">เพิ่มเมนู</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/orders')}
                className="h-20 flex flex-col space-y-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">ดูคำสั่งซื้อ</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/banners')}
                className="h-20 flex flex-col space-y-2"
              >
                <Image className="h-6 w-6" />
                <span className="text-xs">จัดการแบนเนอร์</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/restaurant')}
                className="h-20 flex flex-col space-y-2"
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs">ตั้งค่าร้าน</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { AdminPanel };
export default AdminPanel;