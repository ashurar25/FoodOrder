import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';

// Define the schema for the form
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

// Function to simulate registration
const registerUser = async (userData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Registering user:', userData);
  // Simulate success or failure
  if (userData.email === 'error@example.com') {
    throw new Error('Registration failed');
  }
  return { success: true, userId: Math.random().toString(36).substring(7) };
};

// Function to simulate fetching orders
const fetchOrders = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Fetching orders...');
  return [
    { id: 1, item: 'Product A', quantity: 2, price: 10 },
    { id: 2, item: 'Product B', quantity: 1, price: 25 },
  ];
};

// Function to simulate resetting orders
const resetOrders = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Resetting orders...');
  // Simulate an error condition
  if (Math.random() > 0.5) {
    throw new Error('Failed to reset orders');
  }
  return { success: true };
};

function MemberRegistration() {
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isResettingOrders, setIsResettingOrders] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      alert('Registration successful!');
      form.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true);
      setError(null);
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Failed to load orders.');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  const handleResetOrders = async () => {
    setIsResettingOrders(true);
    setError(null);
    try {
      await resetOrders();
      alert('Orders reset successfully!');
      setOrders([]); // Clear orders on successful reset
    } catch (err) {
      setError('Failed to reset orders.');
      console.error('Error resetting orders:', err);
    } finally {
      setIsResettingOrders(false);
    }
  };

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>สมัครสมาชิก</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>สมัครสมาชิก</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลเพื่อสมัครสมาชิกใหม่
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display email.
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ensure your password is secure.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
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

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Orders</h2>
        {isLoadingOrders ? (
          <p>Loading orders...</p>
        ) : error && orders.length === 0 ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {orders.map((order) => (
                <li key={order.id} className="border p-2 rounded flex justify-between items-center">
                  <span>{order.item} - Quantity: {order.quantity} - Price: ${order.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                onClick={handleResetOrders}
                disabled={isResettingOrders}
              >
                {isResettingOrders ? 'Resetting...' : 'Reset Orders'}
                <Trash className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        {error && !isLoadingOrders && orders.length > 0 && (
          <p className="text-red-500 mt-4">Error: {error}</p>
        )}
      </div>
    </div>
  );
}

export default MemberRegistration;