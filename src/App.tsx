
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Rentals from "./pages/Rentals";
import Customers from "./pages/Customers";
import Backdrop from "./pages/Backdrop";
import Debts from "./pages/Debts";
import Quotes from "./pages/Quotes";
import Reconciliation from "./pages/Reconciliation";
import Settings from "./pages/Settings";
import { useState } from "react";

const App = () => {
  // Move QueryClient initialization inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/backdrop" element={<Backdrop />} />
              <Route path="/debts" element={<Debts />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/reconciliation" element={<Reconciliation />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CompanyProvider>
    </QueryClientProvider>
  );
};

export default App;
