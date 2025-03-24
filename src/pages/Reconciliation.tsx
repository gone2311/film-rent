
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
import { Check, Clock, FileCheck, FileText, Search, UserPlus, X } from "lucide-react";
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
const reconciliationFormSchema = z.object({
  partnerId: z.string().min(1, { message: "Vui lòng chọn đối tác" }),
  fromDate: z.string().min(1, { message: "Ngày bắt đầu không được để trống" }),
  toDate: z.string().min(1, { message: "Ngày kết thúc không được để trống" }),
  notes: z.string().optional(),
});

type ReconciliationFormValues = z.infer<typeof reconciliationFormSchema>;

// Tạo dữ liệu mẫu đối soát
const sampleReconciliations = [
  {
    id: 1,
    partnerName: "XYZ Film Studio",
    contact: "Đinh Văn E",
    fromDate: "2023-10-01",
    toDate: "2023-10-31",
    totalAmount: 32000000,
    diffAmount: 0,
    status: "Đã đối soát",
    items: [
      { description: "Thiết bị quay phim dự án A", amount: 15000000, partnerAmount: 15000000, diff: 0 },
      { description: "Dịch vụ hậu kỳ", amount: 8000000, partnerAmount: 8000000, diff: 0 },
      { description: "Thiết bị âm thanh", amount: 9000000, partnerAmount: 9000000, diff: 0 }
    ]
  },
  {
    id: 2,
    partnerName: "ABC Production",
    contact: "Trương Thị F",
    fromDate: "2023-11-01",
    toDate: "2023-11-30",
    totalAmount: 45000000,
    diffAmount: 1500000,
    status: "Chờ xác nhận",
    items: [
      { description: "Máy quay Sony FS7", amount: 20000000, partnerAmount: 20000000, diff: 0 },
      { description: "Ánh sáng và phụ kiện", amount: 15000000, partnerAmount: 13500000, diff: 1500000 },
      { description: "Drone DJI Mavic 3", amount: 10000000, partnerAmount: 10000000, diff: 0 }
    ]
  },
  {
    id: 3,
    partnerName: "Delta Media",
    contact: "Ngô Văn G",
    fromDate: "2023-11-15",
    toDate: "2023-12-15",
    totalAmount: 27000000,
    diffAmount: 2000000,
    status: "Chờ xử lý",
    items: [
      { description: "Thiết bị quay TVC", amount: 12000000, partnerAmount: 12000000, diff: 0 },
      { description: "Bộ đèn studio", amount: 8000000, partnerAmount: 6000000, diff: 2000000 },
      { description: "Phí nhân sự", amount: 7000000, partnerAmount: 7000000, diff: 0 }
    ]
  },
  {
    id: 4,
    partnerName: "Omega Film",
    contact: "Lý Thị H",
    fromDate: "2023-12-01",
    toDate: "2023-12-31",
    totalAmount: 36500000,
    diffAmount: 0,
    status: "Đã đối soát",
    items: [
      { description: "Thiết bị quay phim ngắn", amount: 18500000, partnerAmount: 18500000, diff: 0 },
      { description: "Bộ ống kính cinema", amount: 10000000, partnerAmount: 10000000, diff: 0 },
      { description: "Thiết bị âm thanh và thu âm", amount: 8000000, partnerAmount: 8000000, diff: 0 }
    ]
  }
];

// Dữ liệu mẫu đối tác
const samplePartners = [
  { id: 1, name: "XYZ Film Studio" },
  { id: 2, name: "ABC Production" },
  { id: 3, name: "Delta Media" },
  { id: 4, name: "Omega Film" },
  { id: 5, name: "Gamma Video Production" }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Reconciliation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reconciliations, setReconciliations] = useState(sampleReconciliations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReconciliationFormValues>({
    resolver: zodResolver(reconciliationFormSchema),
    defaultValues: {
      partnerId: "",
      fromDate: "",
      toDate: "",
      notes: ""
    },
  });

  // Lọc danh sách đối soát theo từ khóa tìm kiếm
  const filteredReconciliations = reconciliations.filter(recon => 
    recon.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recon.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: ReconciliationFormValues) => {
    // Xử lý thêm mới đối soát
    const selectedPartner = samplePartners.find(p => p.id.toString() === data.partnerId);
    
    const newReconciliation = {
      id: reconciliations.length + 1,
      partnerName: selectedPartner?.name || "Không xác định",
      contact: "Liên hệ mới", // Giả định
      fromDate: data.fromDate,
      toDate: data.toDate,
      totalAmount: 0, // Sẽ được cập nhật khi thêm các mục đối soát
      diffAmount: 0, // Sẽ được cập nhật khi đối soát
      status: "Chờ xử lý",
      items: [] // Sẽ thêm sau
    };
    
    setReconciliations([...reconciliations, newReconciliation]);
    
    // Hiển thị thông báo
    toast({
      title: "Tạo đối soát thành công",
      description: `Đã tạo đối soát với đối tác ${newReconciliation.partnerName}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  const viewDetails = (reconciliation: any) => {
    setSelectedReconciliation(reconciliation);
    setIsDetailDialogOpen(true);
  };

  const handleStatus = (status: string) => {
    if (!selectedReconciliation) return;
    
    const updatedReconciliations = reconciliations.map(r => 
      r.id === selectedReconciliation.id ? { ...r, status } : r
    );
    
    setReconciliations(updatedReconciliations);
    setIsDetailDialogOpen(false);
    
    toast({
      title: `Đã cập nhật trạng thái đối soát`,
      description: `Đối soát với đối tác ${selectedReconciliation.partnerName} đã được cập nhật thành ${status}`,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Đối soát công nợ</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileCheck className="mr-2 h-4 w-4" />
                Tạo đối soát mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tạo đối soát mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin đối soát mới vào form bên dưới.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="partnerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đối tác</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="">Chọn đối tác</option>
                            {samplePartners.map(partner => (
                              <option key={partner.id} value={partner.id}>{partner.name}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Từ ngày</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đến ngày</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập ghi chú (nếu có)..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">Hủy</Button>
                    <Button type="submit">Tạo đối soát</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đối soát</CardTitle>
            <CardDescription>
              Quản lý tất cả đối soát công nợ với đối tác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đối soát..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Đối tác</TableHead>
                    <TableHead>Người liên hệ</TableHead>
                    <TableHead>Từ ngày</TableHead>
                    <TableHead>Đến ngày</TableHead>
                    <TableHead>Tổng cộng</TableHead>
                    <TableHead>Chênh lệch</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReconciliations.map((recon) => (
                    <TableRow key={recon.id}>
                      <TableCell className="font-medium">{recon.partnerName}</TableCell>
                      <TableCell>{recon.contact}</TableCell>
                      <TableCell>{recon.fromDate}</TableCell>
                      <TableCell>{recon.toDate}</TableCell>
                      <TableCell>{formatCurrency(recon.totalAmount)}</TableCell>
                      <TableCell>
                        <span className={recon.diffAmount > 0 ? "text-red-600" : ""}>
                          {formatCurrency(recon.diffAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          recon.status === "Đã đối soát" ? "bg-green-100 text-green-800" : 
                          recon.status === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {recon.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewDetails(recon)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredReconciliations.length} trên tổng số {reconciliations.length} đối soát
            </p>
          </CardFooter>
        </Card>
        
        {/* Dialog chi tiết đối soát */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đối soát</DialogTitle>
              <DialogDescription>
                {selectedReconciliation && (
                  <div className="text-sm">
                    Đối tác: <span className="font-medium">{selectedReconciliation.partnerName}</span> | 
                    Từ ngày: <span className="font-medium">{selectedReconciliation.fromDate}</span> - 
                    Đến ngày: <span className="font-medium">{selectedReconciliation.toDate}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {selectedReconciliation && (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Số tiền của bạn</TableHead>
                        <TableHead>Số tiền đối tác</TableHead>
                        <TableHead>Chênh lệch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReconciliation.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{formatCurrency(item.partnerAmount)}</TableCell>
                          <TableCell className={item.diff > 0 ? "text-red-600 font-medium" : ""}>
                            {formatCurrency(item.diff)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell>Tổng cộng</TableCell>
                        <TableCell>{formatCurrency(selectedReconciliation.totalAmount)}</TableCell>
                        <TableCell>
                          {formatCurrency(selectedReconciliation.totalAmount - selectedReconciliation.diffAmount)}
                        </TableCell>
                        <TableCell className={selectedReconciliation.diffAmount > 0 ? "text-red-600 font-medium" : ""}>
                          {formatCurrency(selectedReconciliation.diffAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {selectedReconciliation.status !== "Đã đối soát" && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatus("Đã đối soát")}
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Xác nhận đối soát
                      </Button>
                    )}
                    
                    {selectedReconciliation.status === "Chờ xử lý" && (
                      <Button 
                        variant="outline"
                        onClick={() => handleStatus("Chờ xác nhận")}
                        className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Gửi yêu cầu xác nhận
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reconciliation;
