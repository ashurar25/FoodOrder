import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AdminOrders from "@/pages/admin-orders";
import AdminBanners from "@/pages/admin-banners";
import AdminFood from "@/pages/admin-food";
import AdminDatabase from "@/pages/admin-database";
import Orders from "@/pages/orders";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip"; // เพิ่ม import ถ้ายังไม่ได้ใส่

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/orders" component={Orders} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/banners" component={AdminBanners} />
      <Route path="/admin/food" component={AdminFood} />
      <Route path="/admin/database" component={AdminDatabase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
