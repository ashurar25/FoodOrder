import { Router, Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import LoadingSkeleton from '@/components/loading-skeleton';
import { Suspense, lazy } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const AdminPanel = lazy(() => import('@/pages/admin'));
const AdminBanners = lazy(() => import('@/pages/admin-banners'));
const AdminOrders = lazy(() => import('@/pages/admin-orders'));
const AdminDatabase = lazy(() => import('@/pages/admin-database'));
const AdminRestaurant = lazy(() => import('@/pages/admin-restaurant'));
const OrdersPage = lazy(() => import('@/pages/orders'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

// Protected route component
function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <NotFoundPage />;
  }
  
  return <Component />;
}

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
          <LoadingSkeleton type="card" count={6} />
        </div>
      }>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/orders">
            {() => <ProtectedRoute component={OrdersPage} />}
          </Route>
          <Route path="/admin/login" component={() => import('./pages/admin-login')} />
          <Route path="/admin">
            {() => <ProtectedRoute component={AdminPanel} adminOnly={true} />}
          </Route>
          <Route path="/admin/banners">
            {() => <ProtectedRoute component={AdminBanners} adminOnly={true} />}
          </Route>
          <Route path="/admin/orders">
            {() => <ProtectedRoute component={AdminOrders} adminOnly={true} />}
          </Route>
          <Route path="/admin/database">
            {() => <ProtectedRoute component={AdminDatabase} adminOnly={true} />}
          </Route>
          <Route path="/admin/restaurant">
            {() => <ProtectedRoute component={AdminRestaurant} adminOnly={true} />}
          </Route>
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
        <TooltipProvider>
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;