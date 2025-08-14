import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ProfilePage from '@/pages/profile';
import AdminPanel from '@/pages/admin';
import AdminBanners from '@/pages/admin-banners';
import AdminFood from '@/pages/admin-food';
import AdminOrders from '@/pages/admin-orders';
import AdminUsers from '@/pages/admin-users';
import AdminReports from '@/pages/admin-reports';
import AdminDatabase from '@/pages/admin-database';
import AdminRestaurant from '@/pages/admin-restaurant';
import OrdersPage from '@/pages/orders';
import NotFoundPage from '@/pages/not-found';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '/admin',
      element: <AdminPanel />,
    },
    {
      path: '/admin/banners',
      element: <AdminBanners />,
    },
    {
      path: '/admin/food',
      element: <AdminFood />,
    },
    {
      path: '/admin/orders',
      element: <AdminOrders />,
    },
    {
      path: '/admin/users',
      element: <AdminUsers />,
    },
    {
      path: '/admin/reports',
      element: <AdminReports />,
    },
    {
      path: '/admin/database',
      element: <AdminDatabase />,
    },
    {
      path: '/admin/restaurant',
      element: <AdminRestaurant />,
    },
    {
      path: '/orders',
      element: <OrdersPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;