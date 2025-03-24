
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
import { FileEdit, FileText, FilePlus, Search, Trash } from "lucide-react";
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
import { Navbar } from "@/components/ui/navbar";

// Định nghĩa schema Zod cho form
const quoteFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  validUntil: z.string().min(1, { message: "Ngày hiệu lực không được để trống" }),
  description: z.string().min(1, { message: "Mô tả không được để trống" }),
  items: z.array(z.object({
    name: z.string().min(1, { message: "Tên thiết bị không được để trống" }),
    quantity: z.string().min(1, { message: "Số lượng không được để trống" }),
    unitPrice: z.string().min(1, { message: "Đơn giá không được để trống" })
  })).min(1, { message: "Phải có ít nhất một thiết bị" })
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

// Tạo dữ liệu mẫu
const sampleQuotes = [
  {
    id: 1,
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    issueDate: "2023-11-25",
    validUntil: "2024-01-25",
    total: 25000000,
    description: "Báo giá thiết bị cho dự án phim A",
    status: "Đã duyệt"
  },
  {
    id: 2,
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    issueDate: "2023-12-01",
    validUntil: "2024-01-01",
    total: 15000000,
    description: "Báo giá thiết bị âm thanh cho quay quảng cáo",
    status: "Đang chờ duyệt"
  },
  {
    id: 3,
    customerName: "Studio XYZ",
    contact: "Lê Văn C",
    issueDate: "2023-12-10",
    validUntil: "2024-02-10",
    total: 8500000,
    description: "Báo giá thiết bị chiếu sáng cho phim trường",
    status: "Đã từ chối"
  },
  {
    id: 4,
    customerName: "Công ty quảng cáo Delta",
    contact: "Phạm Thị D",
    issueDate: "2023-12-15",
    validUntil: "2024-02-15", 
    total: 18000000,
    description: "Báo giá thiết bị quay phim cho dự án TVC",
    status: "Đã duyệt"
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

// Dữ liệu mẫu thiết bị cho báo giá
const sampleEquipments = [
  { id: 1, name: "Máy quay Sony FS7", price: 2500000 },
  { id: 2, name: "Đèn LED Aputure 300d", price: 1200000 },
  { id: 3, name: "Lens Canon 24-70mm", price: 1500000 },
  { id: 4, name: "Gimbal DJI Ronin", price: 1800000 },
  { id: 5, name: "Micro không dây Sennheiser", price: 900000 }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState(sampleQuotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<{name: string, quantity: string, unitPrice: string}[]>([]);
  const { toast } = useToast();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      customerId: "",
      validUntil: "",
      description: "",
      items: []
    },
  });

  // Lọc báo giá theo từ khóa tìm kiếm
  const filteredQuotes = quotes.filter(quote => 
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    setQuoteItems([...quoteItems, { name: "", quantity: "1", unitPrice: "" }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...quoteItems];
    updatedItems.splice(index, 1);
    setQuoteItems(updatedItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...quoteItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setQuoteItems(updatedItems);
    form.setValue('items', updatedItems);
  };

  const calculateTotal = () => {
    return quoteItems.reduce((total, item) => {
      return total + (parseInt(item.quantity) * parseInt(item.unitPrice) || 0);
    }, 0);
  };

  const onSubmit = (data: QuoteFormValues) => {
    // Xử lý thêm mới báo giá
    const selectedCustomer = sampleCustomers.find(c => c.id.toString() === data.customerId);
    
    const newQuote = {
      id: quotes.length + 1,
      customerName: selectedCustomer?.name || "Không xác định",
      contact: "Liên hệ mới", // Giả định
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: data.validUntil,
      total: calculateTotal(),
      description: data.description,
      status: "Đang chờ duyệt"
    };
    
    setQuotes([...quotes, newQuote]);
    
    // Hiển thị thông báo
    toast({
      title: "Tạo báo giá thành công",
      description: `Đã tạo báo giá cho khách hàng ${newQuote.customerName}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setQuoteItems([]);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý báo giá</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                Tạo báo giá
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Tạo báo giá mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin báo giá mới vào form bên dưới.
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
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Có hiệu lực đến</FormLabel>
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
                          <Input placeholder="Báo giá thiết bị cho dự án..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Danh sách thiết bị</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        Thêm thiết bị
                      </Button>
                    </div>
                    
                    {quoteItems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Chưa có thiết bị nào được thêm vào báo giá.</p>
                    )}
                    
                    {quoteItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <FormLabel className="text-xs">Thiết bị</FormLabel>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                          >
                            <option value="">Chọn thiết bị</option>
                            {sampleEquipments.map(equipment => (
                              <option 
                                key={equipment.id} 
                                value={equipment.name}
                                data-price={equipment.price}
                                onSelect={() => updateItem(index, 'unitPrice', equipment.price.toString())}
                              >
                                {equipment.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-20">
                          <FormLabel className="text-xs">Số lượng</FormLabel>
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <FormLabel className="text-xs">Đơn giá (VNĐ)</FormLabel>
                          <Input 
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} 
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {quoteItems.length > 0 && (
                      <div className="text-right font-semibold">
                        Tổng cộng: {formatCurrency(calculateTotal())}
                      </div>
                    )}
                    
                    {form.formState.errors.items && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.items.message}
                      </p>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsDialogOpen(false);
                      form.reset();
                      setQuoteItems([]);
                    }} type="button">Hủy</Button>
                    <Button 
                      type="submit"
                      onClick={() => {
                        form.setValue('items', quoteItems);
                      }}
                    >
                      Tạo báo giá
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo giá</CardTitle>
            <CardDescription>
              Quản lý tất cả báo giá cho khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm báo giá..."
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
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hiệu lực đến</TableHead>
                    <TableHead>Tổng giá trị</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.customerName}</TableCell>
                      <TableCell>{quote.contact}</TableCell>
                      <TableCell>{quote.issueDate}</TableCell>
                      <TableCell>{quote.validUntil}</TableCell>
                      <TableCell>{formatCurrency(quote.total)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{quote.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          quote.status === "Đã duyệt" ? "bg-green-100 text-green-800" : 
                          quote.status === "Đã từ chối" ? "bg-red-100 text-red-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {quote.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
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
              Hiển thị {filteredQuotes.length} trên tổng số {quotes.length} báo giá
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Quotes;
