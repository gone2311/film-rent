
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";

export function Navbar() {
  const { companyName, companyLogo } = useCompany();
  
  return (
    <nav className="border-b sticky top-0 z-20 bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="flex items-center gap-2">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} className="h-8 w-auto" />
          ) : null}
          <span className="font-bold text-2xl">{companyName}</span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Menu chính</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="w-full cursor-pointer">Trang chủ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/equipment" className="w-full cursor-pointer">Thiết bị</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/rentals" className="w-full cursor-pointer">Đơn hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/customers" className="w-full cursor-pointer">Khách hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tài chính</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/debts" className="w-full cursor-pointer">Công nợ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/quotes" className="w-full cursor-pointer">Báo giá</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/reconciliation" className="w-full cursor-pointer">Đối soát</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer">Cài đặt công ty</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Thông tin cá nhân</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
