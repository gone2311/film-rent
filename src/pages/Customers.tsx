
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

// Định nghĩa schema Zod cho form
const customerFormSchema = z.object({
  name: z.string().min(1, { message: "Tên công ty không được để trống" }),
  contact: z.string().min(1, { message: "Tên người liên hệ không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: CustomerFormValues) => {
    // Thêm khách hàng mới vào danh sách
    const newCustomer = {
      id: customers.length + 1,
      name: data.name,
      contact: data.contact,
      email: data.email,
      phone: data.phone,
      address: data.address,
      totalRentals: 0
    };
    
    setCustomers([...customers, newCustomer]);
    
    // Hiển thị thông báo
    toast({
      title: "Tạo khách hàng thành công",
      description: `Đã thêm khách hàng ${data.name}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm khách hàng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin khách hàng mới vào form bên dưới.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty</FormLabel>
                      <FormControl>
                        <Input placeholder="Công ty Phim Việt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người liên hệ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0912345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Đường Lê Lợi, Quận 1, TP.HCM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">Hủy</Button>
                  <Button type="submit">Lưu thông tin</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
