
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
import { FileText, Menu, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-bold text-2xl">FilmRent</Link>

        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">Trang chủ</Button>
            </Link>
            <Link to="/equipment">
              <Button variant="ghost">Thiết bị</Button>
            </Link>
            <Link to="/rentals">
              <Button variant="ghost">Đơn hàng</Button>
            </Link>
            <Link to="/customers">
              <Button variant="ghost">Khách hàng</Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <FileText className="mr-2 h-4 w-4" />
                  Tài chính
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/debts" className="w-full">Công nợ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/quotes" className="w-full">Báo giá</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/reconciliation" className="w-full">Đối soát</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className="w-full">Trang chủ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/equipment" className="w-full">Thiết bị</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/rentals" className="w-full">Đơn hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/customers" className="w-full">Khách hàng</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tài chính</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/debts" className="w-full">Công nợ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/quotes" className="w-full">Báo giá</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/reconciliation" className="w-full">Đối soát</Link>
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Thông tin cá nhân</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
