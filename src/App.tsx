
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
import { Navbar } from "./components/ui/navbar";

// Tạo component MainLayout để bọc tất cả các trang chính với thanh điều hướng
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

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
              <Route path="/dashboard" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/equipment" element={
                <MainLayout>
                  <Equipment />
                </MainLayout>
              } />
              <Route path="/rentals" element={
                <MainLayout>
                  <Rentals />
                </MainLayout>
              } />
              <Route path="/customers" element={
                <MainLayout>
                  <Customers />
                </MainLayout>
              } />
              <Route path="/backdrop" element={
                <MainLayout>
                  <Backdrop />
                </MainLayout>
              } />
              <Route path="/debts" element={
                <MainLayout>
                  <Debts />
                </MainLayout>
              } />
              <Route path="/quotes" element={
                <MainLayout>
                  <Quotes />
                </MainLayout>
              } />
              <Route path="/reconciliation" element={
                <MainLayout>
                  <Reconciliation />
                </MainLayout>
              } />
              <Route path="/settings" element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              } />
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
