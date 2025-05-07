
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
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
import Account from "./pages/Account";
import Login from "./pages/Login";
import DatabaseExport from "./pages/DatabaseExport";
import { useState } from "react";
import { Navbar } from "./components/ui/navbar";
import { ActionMenubar } from "./components/ui/action-menubar";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main layout with navigation
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <ActionMenubar />
      {children}
    </>
  );
};

const App = () => {
  // Move QueryClient initialization inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CompanyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/equipment" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Equipment />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/rentals" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Rentals />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Customers />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/backdrop" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Backdrop />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/debts" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Debts />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/quotes" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Quotes />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reconciliation" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Reconciliation />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Account />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/database-export" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DatabaseExport />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CompanyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
