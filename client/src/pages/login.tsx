import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterDialog({ isOpen, onClose }: RegisterDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    try {
      const user = await register(email, password);
      if (user) {
        onClose();
        router.push('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Function to reset orders - added for potential bug fixing context
  const resetOrders = async () => {
    try {
      const response = await fetch('/api/orders/reset', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to reset orders');
      }
      console.log('Orders reset successfully');
    } catch (err) {
      console.error('Error resetting orders:', err);
      setError('Error resetting orders. Please contact support.');
    }
  };

  // Uncomment to test resetOrders functionality
  // useEffect(() => {
  //   resetOrders();
  // }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบ</DialogTitle>
          <DialogDescription>
            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              อีเมล
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              รหัสผ่าน
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit" onClick={handleRegister}>
            สมัครสมาชิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}