
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
import { Eye, Search } from "lucide-react";
import { useState } from "react";

// Dữ liệu mẫu cho đơn hàng
const sampleRentals = [
  {
    id: "RNT-001",
    customerName: "Công ty Phim Việt",
    startDate: "2023-08-01",
    endDate: "2023-08-10",
    status: "Đang thuê",
    totalAmount: 25000000,
    items: 3
  },
  {
    id: "RNT-002",
    customerName: "Đoàn phim ABC",
    startDate: "2023-08-05",
    endDate: "2023-08-15",
    status: "Đang thuê",
    totalAmount: 18500000,
    items: 5
  },
  {
    id: "RNT-003",
    customerName: "Studio XYZ",
    startDate: "2023-07-25",
    endDate: "2023-08-05",
    status: "Đã trả",
    totalAmount: 12000000,
    items: 2
  },
  {
    id: "RNT-004",
    customerName: "Công ty quảng cáo Delta",
    startDate: "2023-08-10",
    endDate: "2023-08-12",
    status: "Đặt trước",
    totalAmount: 5000000,
    items: 4
  },
  {
    id: "RNT-005",
    customerName: "Phim trường Future",
    startDate: "2023-07-20",
    endDate: "2023-07-30",
    status: "Đã trả",
    totalAmount: 15000000,
    items: 6
  }
];

const Rentals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState(sampleRentals);

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredRentals = rentals.filter(rental => 
    rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
        <Button>
          Tạo đơn hàng mới
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả đơn hàng cho thuê thiết bị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Số thiết bị</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.id}</TableCell>
                  <TableCell>{rental.customerName}</TableCell>
                  <TableCell>{formatDate(rental.startDate)}</TableCell>
                  <TableCell>{formatDate(rental.endDate)}</TableCell>
                  <TableCell>{rental.items}</TableCell>
                  <TableCell>{rental.totalAmount.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      rental.status === "Đã trả" 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : rental.status === "Đang thuê"
                        ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                        : "bg-blue-50 text-blue-700 ring-blue-600/20"
                    }`}>
                      {rental.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredRentals.length} trên tổng số {rentals.length} đơn hàng
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Rentals;
