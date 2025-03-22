
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
import { Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Định nghĩa schema Zod cho form
const rentalFormSchema = z.object({
  customerName: z.string().min(1, { message: "Khách hàng không được để trống" }),
  startDate: z.string().min(1, { message: "Ngày bắt đầu không được để trống" }),
  endDate: z.string().min(1, { message: "Ngày kết thúc không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
  items: z.string().transform(val => parseInt(val)),
  totalAmount: z.string().transform(val => parseInt(val)),
});

type RentalFormValues = z.infer<typeof rentalFormSchema>;

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

// Dữ liệu mẫu cho khách hàng
const sampleCustomers = [
  "Công ty Phim Việt",
  "Đoàn phim ABC",
  "Studio XYZ",
  "Công ty quảng cáo Delta",
  "Phim trường Future"
];

const Rentals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState(sampleRentals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      customerName: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Đặt trước",
      items: "1",
      totalAmount: "0",
    },
  });

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

  const onSubmit = (data: RentalFormValues) => {
    // Tạo ID đơn hàng mới
    const newId = `RNT-${String(rentals.length + 1).padStart(3, '0')}`;
    
    // Thêm đơn hàng mới vào danh sách
    const newRental = {
      id: newId,
      customerName: data.customerName,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      totalAmount: data.totalAmount,
      items: data.items
    };
    
    setRentals([...rentals, newRental]);
    
    // Hiển thị thông báo
    toast({
      title: "Tạo đơn hàng thành công",
      description: `Đã tạo đơn hàng ${newId}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo đơn hàng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo đơn hàng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin đơn hàng mới vào form bên dưới.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khách hàng</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khách hàng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sampleCustomers.map((customer) => (
                            <SelectItem key={customer} value={customer}>
                              {customer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số thiết bị</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tổng tiền (VNĐ)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="100000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Đặt trước">Đặt trước</SelectItem>
                          <SelectItem value="Đang thuê">Đang thuê</SelectItem>
                          <SelectItem value="Đã trả">Đã trả</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">Hủy</Button>
                  <Button type="submit">Tạo đơn hàng</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
