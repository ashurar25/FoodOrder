
import { useState } from 'react';
import { Link } from 'wouter';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login.mutateAsync({ email, password });
      
      // Check if user is admin
      if (result?.user?.role !== 'admin') {
        toast({
          title: "ไม่มีสิทธิ์เข้าถึง",
          description: "บัญชีนี้ไม่ใช่บัญชีผู้ดูแลระบบ",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับสู่แผงควบคุมผู้ดูแลระบบ",
      });
      
      window.location.href = '/admin';
    } catch (error: any) {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/10 backdrop-blur-md text-white">
        <CardHeader className="text-center space-y-4">
          <Link href="/admin">
            <Button 
              variant="ghost" 
              className="absolute top-4 left-4 hover:bg-white/10 text-white"
              data-testid="button-back-admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            เข้าสู่ระบบแอดมิน
          </CardTitle>
          <p className="text-gray-300">เข้าสู่ระบบเพื่อจัดการร้านอาหาร</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-gray-300">อีเมลแอดมิน</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลแอดมิน"
                  required
                  className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                  data-testid="input-admin-email"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="admin-password" className="text-gray-300">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านแอดมิน"
                  required
                  className="pl-10 pr-10 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                  data-testid="input-admin-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 hover:bg-transparent text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-admin-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              data-testid="button-admin-login"
            >
              {login.isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบแอดมิน'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-400">
                เป็นลูกค้าทั่วไป?{' '}
                <Link href="/login">
                  <button 
                    className="text-purple-400 hover:text-purple-300 font-semibold hover:underline"
                    data-testid="link-customer-login"
                  >
                    เข้าสู่ระบบลูกค้า
                  </button>
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
