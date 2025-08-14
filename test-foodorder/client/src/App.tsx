import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';
import LoadingSkeleton from '@/components/loading-skeleton';
import { Suspense, lazy } from 'react';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const AdminPanel = lazy(() => import('@/pages/admin'));
const AdminBanners = lazy(() => import('@/pages/admin-banners'));
const AdminFood = lazy(() => import('@/pages/admin-food'));
const AdminOrders = lazy(() => import('@/pages/admin-orders'));
const AdminUsers = lazy(() => import('@/pages/admin-users'));
const AdminReports = lazy(() => import('@/pages/admin-reports'));
const AdminDatabase = lazy(() => import('@/pages/admin-database'));
const AdminRestaurant = lazy(() => import('@/pages/admin-restaurant'));
const OrdersPage = lazy(() => import('@/pages/orders'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

// Optimized QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4">
          <LoadingSkeleton type="card" count={6} />
        </div>
      }>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin/banners" component={AdminBanners} />
          <Route path="/admin/food" component={AdminFood} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/reports" component={AdminReports} />
          <Route path="/admin/database" component={AdminDatabase} />
          <Route path="/admin/restaurant" component={AdminRestaurant} />
          <Route path="/orders" component={OrdersPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <AppRouter />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;