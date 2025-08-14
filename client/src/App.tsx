import { Router, Route, Switch } from 'wouter';
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

function AppRouter() {
  return (
    <Router>
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
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
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