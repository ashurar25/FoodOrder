import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
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
