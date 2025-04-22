
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
import { FileEdit, FilePlus, Search, Users, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Navbar } from "@/components/ui/navbar";

// Định nghĩa schema Zod cho form
const debtFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  amount: z.string().min(1, { message: "Số tiền không được để trống" }),
  dueDate: z.string().min(1, { message: "Hạn thanh toán không được để trống" }),
  description: z.string().min(1, { message: "Mô tả không được để trống" }),
  status: z.string().min(1, { message: "Trạng thái không được để trống" }),
});

type DebtFormValues = z.infer<typeof debtFormSchema>;

// Schema cho form thanh toán
const paymentFormSchema = z.object({
  amount: z.string().min(1, { message: "Số tiền không được để trống" }),
  paymentMethod: z.string().min(1, { message: "Vui lòng chọn phương thức thanh toán" }),
  paymentDate: z.string().min(1, { message: "Ngày thanh toán không được để trống" }),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Dữ liệu mẫu về công nợ
const sampleDebts = [
  {
    id: 1,
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    amount: 15000000,
    dueDate: "2023-12-30",
    issueDate: "2023-11-30",
    description: "Thiết bị cho dự án phim A",
    status: "Chưa thanh toán"
  },
  {
    id: 2,
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    amount: 8500000,
    dueDate: "2023-12-15",
    issueDate: "2023-11-15",
    description: "Thuê thiết bị cho buổi quay quảng cáo",
    status: "Đã thanh toán một phần"
  },
  {
    id: 3,
    customerName: "Studio XYZ",
    contact: "Lê Văn C",
    amount: 7200000,
    dueDate: "2024-01-10",
    issueDate: "2023-12-10",
    description: "Trang thiết bị chiếu sáng",
    status: "Chưa thanh toán"
  },
  {
    id: 4,
    customerName: "Công ty quảng cáo Delta",
    contact: "Phạm Thị D",
    amount: 12000000,
    dueDate: "2023-12-25",
    issueDate: "2023-11-25",
    description: "Thiết bị quay dự án TVC",
    status: "Đã thanh toán"
  }
];

// Dữ liệu mẫu khách hàng
const sampleCustomers = [
  { id: 1, name: "Công ty Phim Việt" },
  { id: 2, name: "Đoàn phim ABC" },
  { id: 3, name: "Studio XYZ" },
  { id: 4, name: "Công ty quảng cáo Delta" },
  { id: 5, name: "Phim trường Future" }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Debts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debts, setDebts] = useState(sampleDebts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      customerId: "",
      amount: "",
      dueDate: "",
      description: "",
      status: "Chưa thanh toán"
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "Chuyển khoản",
      paymentDate: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  // Lọc danh sách công nợ theo từ khóa tìm kiếm
  const filteredDebts = debts.filter(debt => 
    debt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: DebtFormValues) => {
    // Xử lý thêm mới công nợ
    const selectedCustomer = sampleCustomers.find(c => c.id.toString() === data.customerId);
    
    const newDebt = {
      id: debts.length + 1,
      customerName: selectedCustomer?.name || "Không xác định",
      contact: "Liên hệ mới", // Giả định
      amount: parseInt(data.amount),
      dueDate: data.dueDate,
      issueDate: new Date().toISOString().split('T')[0],
      description: data.description,
      status: data.status
    };
    
    setDebts([...debts, newDebt]);
    
    // Hiển thị thông báo
    toast({
      title: "Thêm công nợ thành công",
      description: `Đã thêm công nợ cho khách hàng ${newDebt.customerName}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  const handleOpenPayment = (debt: any) => {
    setSelectedDebt(debt);
    paymentForm.setValue("amount", debt.amount.toString());
    setIsPaymentDialogOpen(true);
  };

  const onPaymentSubmit = (data: PaymentFormValues) => {
    if (!selectedDebt) return;

    const paymentAmount = parseFloat(data.amount);
    const remainingAmount = selectedDebt.amount - paymentAmount;
    
    let newStatus = "Đã thanh toán";
    if (remainingAmount > 0) {
      newStatus = "Đã thanh toán một phần";
    }

    // Cập nhật trạng thái công nợ
    const updatedDebts = debts.map(debt => {
      if (debt.id === selectedDebt.id) {
        return {
          ...debt,
          amount: remainingAmount,
          status: newStatus
        };
      }
      return debt;
    });

    setDebts(updatedDebts);
    setIsPaymentDialogOpen(false);
    
    toast({
      title: "Thanh toán thành công",
      description: `Đã thanh toán ${formatCurrency(paymentAmount)} cho công nợ của ${selectedDebt.customerName}`,
    });
  };

  const handleEditDebt = (debt: any) => {
    toast({
      title: "Chức năng đang phát triển",
      description: "Chức năng chỉnh sửa công nợ đang được phát triển",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý công nợ</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                Thêm công nợ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm công nợ mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin công nợ mới vào form bên dưới.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khách hàng</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="">Chọn khách hàng</option>
                            {sampleCustomers.map(customer => (
                              <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tiền (VNĐ)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="15,000,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hạn thanh toán</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Input placeholder="Thiết bị cho dự án phim A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                            <option value="Đã thanh toán một phần">Đã thanh toán một phần</option>
                            <option value="Đã thanh toán">Đã thanh toán</option>
                          </select>
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
            <CardTitle>Danh sách công nợ</CardTitle>
            <CardDescription>
              Quản lý tất cả công nợ của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm công nợ..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Người liên hệ</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hạn thanh toán</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">{debt.customerName}</TableCell>
                      <TableCell>{debt.contact}</TableCell>
                      <TableCell>{formatCurrency(debt.amount)}</TableCell>
                      <TableCell>{debt.issueDate}</TableCell>
                      <TableCell>{debt.dueDate}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{debt.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          debt.status === "Đã thanh toán" ? "bg-green-100 text-green-800" : 
                          debt.status === "Đã thanh toán một phần" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {debt.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditDebt(debt)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          {debt.status !== "Đã thanh toán" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenPayment(debt)}
                              className="flex items-center gap-1"
                            >
                              <CreditCard className="h-3 w-3" />
                              Thanh toán
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredDebts.length} trên tổng số {debts.length} công nợ
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thanh toán công nợ</DialogTitle>
            <DialogDescription>
              {selectedDebt && (
                <div className="mt-2 text-sm">
                  <p>Khách hàng: <span className="font-medium">{selectedDebt.customerName}</span></p>
                  <p>Công nợ hiện tại: <span className="font-medium">{formatCurrency(selectedDebt.amount)}</span></p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền thanh toán (VNĐ)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15,000,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={paymentForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phương thức thanh toán</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="Chuyển khoản">Chuyển khoản</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={paymentForm.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày thanh toán</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={paymentForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input placeholder="Ghi chú cho thanh toán này" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} type="button">Hủy</Button>
                <Button type="submit">Xác nhận thanh toán</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Debts;
