import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Define the schema for registration form
const registerSchema = z.object({
  name: z.string().min(2, { message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' }),
  email: z.string().email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Function to call registration API
const registerUser = async (userData: RegisterFormData) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
  }

  return response.json();
};

function MemberRegistration() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      const result = await registerUser(values);
      toast({
        title: "สำเร็จ",
        description: result.message || "สมัครสมาชิกสำเร็จแล้ว",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>ระบบสมัครสมาชิก</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>สมัครสมาชิก</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>สมัครสมาชิกใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลเพื่อสมัครสมาชิกใหม่
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกชื่อของคุณ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อีเมล</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          อีเมลสำหรับเข้าสู่ระบบ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสผ่าน</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="กรอกรหัสผ่าน"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        ยกเลิก
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>✅ ระบบสมัครสมาชิกพร้อมใช้งาน</p>
            <p>✅ รองรับการตรวจสอบข้อมูล</p>
            <p>✅ เชื่อมต่อกับ API ของเซิร์ฟเวอร์</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberRegistration;