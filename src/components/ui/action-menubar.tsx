
import { Link, useLocation } from "react-router-dom";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator, 
  MenubarSub, 
  MenubarSubContent, 
  MenubarSubTrigger, 
  MenubarTrigger 
} from "@/components/ui/menubar";
import { 
  Calculator,
  FileText, 
  Home, 
  Package, 
  Settings, 
  Users,
  CreditCard,
  FileSpreadsheet,
  TableProperties
} from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";

export const ActionMenubar = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div className="sticky top-16 z-10 bg-background border-b">
      <div className="flex items-center px-4 h-12 container mx-auto">
        <Menubar className="border-none shadow-none p-0">
          <MenubarMenu>
            <MenubarTrigger className={currentPath === "/dashboard" ? "bg-accent text-accent-foreground" : ""}>
              <Home className="w-4 h-4 mr-2" />
              Trang chủ
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/dashboard" className="flex items-center w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className={currentPath === "/equipment" ? "bg-accent text-accent-foreground" : ""}>
              <Package className="w-4 h-4 mr-2" />
              Thiết bị
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/equipment" className="flex items-center w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Quản lý thiết bị
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className={currentPath === "/rentals" ? "bg-accent text-accent-foreground" : ""}>
              <CreditCard className="w-4 h-4 mr-2" />
              Đơn hàng
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/rentals" className="flex items-center w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Quản lý đơn hàng
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className={currentPath === "/customers" ? "bg-accent text-accent-foreground" : ""}>
              <Users className="w-4 h-4 mr-2" />
              Khách hàng
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/customers" className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Quản lý khách hàng
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className={["/debts", "/quotes", "/reconciliation"].includes(currentPath) ? "bg-accent text-accent-foreground" : ""}>
              <Calculator className="w-4 h-4 mr-2" />
              Tài chính
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/debts" className="flex items-center w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Công nợ
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Link to="/quotes" className="flex items-center w-full">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Báo giá
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Link to="/reconciliation" className="flex items-center w-full">
                  <TableProperties className="w-4 h-4 mr-2" />
                  Đối soát
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className={currentPath === "/settings" ? "bg-accent text-accent-foreground" : ""}>
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link to="/settings" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt tài khoản
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="ml-auto">
          {currentPath === "/equipment" && (
            <Button size="sm">
              <Package className="w-4 h-4 mr-2" />
              Thêm thiết bị mới
            </Button>
          )}
          {currentPath === "/rentals" && (
            <Button size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Thêm đơn hàng
            </Button>
          )}
          {currentPath === "/customers" && (
            <Button size="sm">
              <Users className="w-4 h-4 mr-2" />
              Thêm khách hàng
            </Button>
          )}
          {currentPath === "/debts" && (
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Thêm công nợ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
