
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileEdit, Search, UserPlus } from "lucide-react";
import { useState } from "react";

// Dữ liệu mẫu cho khách hàng
const sampleCustomers = [
  {
    id: 1,
    name: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    email: "contact@phimviet.com",
    phone: "0912345678",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    totalRentals: 5
  },
  {
    id: 2,
    name: "Đoàn phim ABC",
    contact: "Trần Thị B",
    email: "info@abcfilm.com",
    phone: "0923456789",
    address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    totalRentals: 3
  },
  {
    id: 3,
    name: "Studio XYZ",
    contact: "Lê Văn C",
    email: "studio@xyz.com",
    phone: "0934567890",
    address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
    totalRentals: 2
  },
  {
    id: 4,
    name: "Công ty quảng cáo Delta",
    contact: "Phạm Thị D",
    email: "info@deltaads.com",
    phone: "0945678901",
    address: "101 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    totalRentals: 4
  },
  {
    id: 5,
    name: "Phim trường Future",
    contact: "Hoàng Văn E",
    email: "contact@futurestudio.com",
    phone: "0956789012",
    address: "202 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
    totalRentals: 6
  }
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(sampleCustomers);

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả khách hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên công ty</TableHead>
                <TableHead>Người liên hệ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Số đơn hàng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                  <TableCell>{customer.totalRentals}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredCustomers.length} trên tổng số {customers.length} khách hàng
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Customers;
