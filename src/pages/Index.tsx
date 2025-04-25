
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();
  const { companyName, companyLogo } = useCompany();

  // If user is already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {companyLogo && (
              <img src={companyLogo} alt={companyName} className="h-8 w-auto" />
            )}
            <span className="font-bold text-2xl">{companyName}</span>
          </div>
          <Button asChild>
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Hệ thống quản lý cho thuê thiết bị
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Quản lý thiết bị, đơn hàng, khách hàng và tài chính một cách đơn giản và hiệu quả.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link to="/login">Đăng nhập để tiếp tục</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
