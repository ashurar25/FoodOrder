import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AdminOrders from "@/pages/admin-orders";
import AdminReports from "@/pages/admin-reports";
import AdminBanners from "@/pages/admin-banners";
import AdminFood from "@/pages/admin-food";
import AdminDatabase from "@/pages/admin-database";
import AdminRestaurant from "@/pages/admin-restaurant";
import Orders from "@/pages/orders";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect } from 'react';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/orders" component={Orders} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/food" component={AdminFood} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/banners" component={AdminBanners} />
      <Route path="/admin/database" component={AdminDatabase} />
      <Route path="/admin/restaurant" component={AdminRestaurant} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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