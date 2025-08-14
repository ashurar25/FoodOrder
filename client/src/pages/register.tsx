import { useState } from 'react';
import { Link } from 'wouter';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    try {
      await register.mutateAsync({ name, email, password });
      toast({
        title: "สมัครสมาชิกสำเร็จ",
        description: "ยินดีต้อนรับเข้าสู่ร้านอาหาร!",
      });
      // Redirect will happen automatically via useAuth
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "สมัครสมาชิกไม่สำเร็จ",
        description: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="absolute top-4 left-4 hover:bg-gray-50"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            สมัครสมาชิก
          </CardTitle>
          <p className="text-gray-600">สร้างบัญชีเพื่อสั่งอาหาร</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">ชื่อ</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  required
                  className="pl-10"
                  data-testid="input-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  required
                  className="pl-10"
                  data-testid="input-email"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">ยืนยันรหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                  data-testid="input-confirm-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              data-testid="button-register"
            >
              {register.isPending ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                มีบัญชีแล้ว?{' '}
                <Link href="/login">
                  <button 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                    data-testid="link-login"
                  >
                    เข้าสู่ระบบ
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