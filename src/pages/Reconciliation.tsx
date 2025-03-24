
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, FileCheck, Search, ChevronDown, Check, X } from "lucide-react";
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

// Dữ liệu mẫu đối tác
const samplePartners = [
  { 
    id: 1, 
    name: "XYZ Film Studio",
    contact: "Đinh Văn E",
    email: "dinh.van.e@xyz.com",
    phone: "0987654321",
    address: "123 Đường Phim, Quận 1, TP.HCM",
  },
  { 
    id: 2, 
    name: "ABC Production",
    contact: "Trương Thị F",
    email: "truong.thi.f@abc.com",
    phone: "0987654322",
    address: "456 Đường Sản Xuất, Quận 2, TP.HCM",
  },
  { 
    id: 3, 
    name: "Delta Media",
    contact: "Ngô Văn G",
    email: "ngo.van.g@delta.com",
    phone: "0987654323",
    address: "789 Đường Truyền Thông, Quận 3, TP.HCM",
  },
  { 
    id: 4, 
    name: "Omega Film",
    contact: "Lý Thị H",
    email: "ly.thi.h@omega.com",
    phone: "0987654324",
    address: "147 Đường Phim, Quận 4, TP.HCM",
  },
  { 
    id: 5, 
    name: "Gamma Video Production",
    contact: "Phạm Minh I",
    email: "pham.minh.i@gamma.com",
    phone: "0987654325",
    address: "258 Đường Video, Quận 5, TP.HCM",
  }
];

// Tạo dữ liệu mẫu đối soát theo đối tác
const samplePartnerReconciliations = [
  {
    partnerId: 1,
    name: "XYZ Film Studio",
    contact: "Đinh Văn E",
    totalTheyRent: 32000000,
    totalWeRent: 18500000,
    status: "Đã đối soát",
    periods: [
      {
        id: 1,
        fromDate: "2023-10-01",
        toDate: "2023-10-31",
        status: "Đã đối soát",
        theyRentFromUs: [
          { id: 1, description: "Thiết bị quay phim dự án A", date: "2023-10-05", returnDate: "2023-10-10", amount: 15000000, partnerAmount: 15000000, diff: 0 },
          { id: 2, description: "Dịch vụ hậu kỳ", date: "2023-10-15", returnDate: "2023-10-20", amount: 8000000, partnerAmount: 8000000, diff: 0 },
          { id: 3, description: "Thiết bị âm thanh", date: "2023-10-25", returnDate: "2023-10-30", amount: 9000000, partnerAmount: 9000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 1, description: "Phim trường ngoại cảnh", date: "2023-10-02", returnDate: "2023-10-04", amount: 10000000, partnerAmount: 10000000, diff: 0 },
          { id: 2, description: "Nhân sự diễn viên quần chúng", date: "2023-10-12", returnDate: "2023-10-15", amount: 5000000, partnerAmount: 5000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 2,
    name: "ABC Production",
    contact: "Trương Thị F",
    totalTheyRent: 45000000,
    totalWeRent: 28000000,
    status: "Chờ xác nhận",
    periods: [
      {
        id: 2,
        fromDate: "2023-11-01",
        toDate: "2023-11-30",
        status: "Chờ xác nhận",
        theyRentFromUs: [
          { id: 4, description: "Máy quay Sony FS7", date: "2023-11-05", returnDate: "2023-11-15", amount: 20000000, partnerAmount: 20000000, diff: 0 },
          { id: 5, description: "Ánh sáng và phụ kiện", date: "2023-11-10", returnDate: "2023-11-20", amount: 15000000, partnerAmount: 13500000, diff: 1500000 },
          { id: 6, description: "Drone DJI Mavic 3", date: "2023-11-25", returnDate: "2023-11-30", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 3, description: "Phim trường studio", date: "2023-11-08", returnDate: "2023-11-12", amount: 18000000, partnerAmount: 18000000, diff: 0 },
          { id: 4, description: "Diễn viên và makeup", date: "2023-11-18", returnDate: "2023-11-22", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 3,
    name: "Delta Media",
    contact: "Ngô Văn G",
    totalTheyRent: 27000000,
    totalWeRent: 15000000,
    status: "Chờ xử lý",
    periods: [
      {
        id: 3,
        fromDate: "2023-11-15",
        toDate: "2023-12-15",
        status: "Chờ xử lý",
        theyRentFromUs: [
          { id: 7, description: "Thiết bị quay TVC", date: "2023-11-20", returnDate: "2023-11-30", amount: 12000000, partnerAmount: 12000000, diff: 0 },
          { id: 8, description: "Bộ đèn studio", date: "2023-12-01", returnDate: "2023-12-10", amount: 8000000, partnerAmount: 6000000, diff: 2000000 },
          { id: 9, description: "Phí nhân sự", date: "2023-12-10", returnDate: "2023-12-15", amount: 7000000, partnerAmount: 7000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 5, description: "Thiết bị livestream", date: "2023-11-18", returnDate: "2023-11-25", amount: 8000000, partnerAmount: 8000000, diff: 0 },
          { id: 6, description: "Phim trường xanh", date: "2023-12-05", returnDate: "2023-12-12", amount: 7000000, partnerAmount: 7000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 4,
    name: "Omega Film",
    contact: "Lý Thị H",
    totalTheyRent: 36500000,
    totalWeRent: 22000000,
    status: "Đã đối soát",
    periods: [
      {
        id: 4,
        fromDate: "2023-12-01",
        toDate: "2023-12-31",
        status: "Đã đối soát",
        theyRentFromUs: [
          { id: 10, description: "Thiết bị quay phim ngắn", date: "2023-12-05", returnDate: "2023-12-15", amount: 18500000, partnerAmount: 18500000, diff: 0 },
          { id: 11, description: "Bộ ống kính cinema", date: "2023-12-10", returnDate: "2023-12-20", amount: 10000000, partnerAmount: 10000000, diff: 0 },
          { id: 12, description: "Thiết bị âm thanh và thu âm", date: "2023-12-15", returnDate: "2023-12-25", amount: 8000000, partnerAmount: 8000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 7, description: "Thiết bị làm mưa nhân tạo", date: "2023-12-08", returnDate: "2023-12-12", amount: 12000000, partnerAmount: 12000000, diff: 0 },
          { id: 8, description: "Trang phục và đạo cụ", date: "2023-12-15", returnDate: "2023-12-25", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ]
      }
    ]
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Reconciliation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerReconciliations, setPartnerReconciliations] = useState(samplePartnerReconciliations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
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
  const filteredPartnerReconciliations = partnerReconciliations.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: ReconciliationFormValues) => {
    // Xử lý thêm mới đối soát
    const selectedPartnerData = samplePartners.find(p => p.id.toString() === data.partnerId);
    
    if (!selectedPartnerData) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy đối tác đã chọn",
        variant: "destructive"
      });
      return;
    }
    
    // Kiểm tra xem đối tác đã có trong danh sách chưa
    const existingPartnerIndex = partnerReconciliations.findIndex(p => p.partnerId === selectedPartnerData.id);
    
    if (existingPartnerIndex === -1) {
      // Đối tác chưa có, thêm mới
      const newPartnerRecon = {
        partnerId: selectedPartnerData.id,
        name: selectedPartnerData.name,
        contact: selectedPartnerData.contact,
        totalTheyRent: 0,
        totalWeRent: 0,
        status: "Chờ xử lý",
        periods: [
          {
            id: Math.max(0, ...partnerReconciliations.flatMap(p => p.periods.map(period => period.id))) + 1,
            fromDate: data.fromDate,
            toDate: data.toDate,
            status: "Chờ xử lý",
            theyRentFromUs: [],
            weRentFromThem: []
          }
        ]
      };
      
      setPartnerReconciliations([...partnerReconciliations, newPartnerRecon]);
    } else {
      // Đối tác đã có, thêm thời kỳ đối soát mới
      const updatedPartnerReconciliations = [...partnerReconciliations];
      updatedPartnerReconciliations[existingPartnerIndex].periods.push({
        id: Math.max(0, ...partnerReconciliations.flatMap(p => p.periods.map(period => period.id))) + 1,
        fromDate: data.fromDate,
        toDate: data.toDate,
        status: "Chờ xử lý",
        theyRentFromUs: [],
        weRentFromThem: []
      });
      
      setPartnerReconciliations(updatedPartnerReconciliations);
    }
    
    // Hiển thị thông báo
    toast({
      title: "Tạo đối soát thành công",
      description: `Đã tạo đối soát với đối tác ${selectedPartnerData.name} từ ${data.fromDate} đến ${data.toDate}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  const viewPeriodDetails = (partner: any, period: any) => {
    setSelectedPartner(partner);
    setSelectedPeriod(period);
    setIsDetailDialogOpen(true);
  };

  const handleStatus = (status: string) => {
    if (!selectedPartner || !selectedPeriod) return;
    
    const updatedPartnerReconciliations = partnerReconciliations.map(partner => {
      if (partner.partnerId === selectedPartner.partnerId) {
        const updatedPeriods = partner.periods.map(period => 
          period.id === selectedPeriod.id ? { ...period, status } : period
        );
        
        // Cập nhật trạng thái tổng quan của đối tác dựa trên trạng thái các kỳ
        const allPeriodsResolved = updatedPeriods.every(p => p.status === "Đã đối soát");
        const anyPeriodPending = updatedPeriods.some(p => p.status === "Chờ xác nhận");
        
        const partnerStatus = allPeriodsResolved 
          ? "Đã đối soát" 
          : anyPeriodPending 
            ? "Chờ xác nhận" 
            : "Chờ xử lý";
        
        return { 
          ...partner, 
          periods: updatedPeriods,
          status: partnerStatus
        };
      }
      return partner;
    });
    
    setPartnerReconciliations(updatedPartnerReconciliations);
    setIsDetailDialogOpen(false);
    
    toast({
      title: `Đã cập nhật trạng thái đối soát`,
      description: `Đối soát với đối tác ${selectedPartner.name} từ ${selectedPeriod.fromDate} đến ${selectedPeriod.toDate} đã được cập nhật thành ${status}`,
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
            <CardTitle>Đối soát theo đối tác</CardTitle>
            <CardDescription>
              Quản lý tất cả đối soát công nợ theo từng đối tác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đối tác..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredPartnerReconciliations.map((partner) => (
                <AccordionItem 
                  key={partner.partnerId} 
                  value={`partner-${partner.partnerId}`}
                  className="border rounded-lg shadow-sm p-2"
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <div className="flex flex-col items-start text-left">
                        <div className="font-semibold text-lg">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">Liên hệ: {partner.contact}</div>
                      </div>
                    </AccordionTrigger>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      partner.status === "Đã đối soát" ? "bg-green-100 text-green-800" : 
                      partner.status === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {partner.status}
                    </span>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4 bg-green-50">
                          <h4 className="font-medium mb-2">Đối tác thuê của bạn</h4>
                          <p className="text-lg font-semibold">{formatCurrency(partner.totalTheyRent)}</p>
                        </div>
                        <div className="border rounded-md p-4 bg-blue-50">
                          <h4 className="font-medium mb-2">Bạn thuê của đối tác</h4>
                          <p className="text-lg font-semibold">{formatCurrency(partner.totalWeRent)}</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">Các kỳ đối soát</h4>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Từ ngày</TableHead>
                              <TableHead>Đến ngày</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {partner.periods.map((period) => (
                              <TableRow key={period.id}>
                                <TableCell>{period.fromDate}</TableCell>
                                <TableCell>{period.toDate}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    period.status === "Đã đối soát" ? "bg-green-100 text-green-800" : 
                                    period.status === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" : 
                                    "bg-blue-100 text-blue-800"
                                  }`}>
                                    {period.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => viewPeriodDetails(partner, period)}
                                  >
                                    Xem chi tiết
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredPartnerReconciliations.length} trên tổng số {partnerReconciliations.length} đối tác
            </p>
          </CardFooter>
        </Card>
        
        {/* Dialog chi tiết đối soát */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết đối soát</DialogTitle>
              <DialogDescription>
                {selectedPartner && selectedPeriod && (
                  <div className="text-sm flex flex-col gap-1 mt-2">
                    <div>
                      Đối tác: <span className="font-medium">{selectedPartner.name}</span> | 
                      Liên hệ: <span className="font-medium">{selectedPartner.contact}</span>
                    </div>
                    <div>
                      Từ ngày: <span className="font-medium">{selectedPeriod.fromDate}</span> - 
                      Đến ngày: <span className="font-medium">{selectedPeriod.toDate}</span>
                    </div>
                    <div>
                      Trạng thái: <span className={`font-medium ${
                        selectedPeriod.status === "Đã đối soát" ? "text-green-600" : 
                        selectedPeriod.status === "Chờ xác nhận" ? "text-yellow-600" : 
                        "text-blue-600"
                      }`}>
                        {selectedPeriod.status}
                      </span>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPartner && selectedPeriod && (
              <div className="space-y-4">
                <Tabs defaultValue="they-rent" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="they-rent" className="flex-1">Đối tác thuê của bạn</TabsTrigger>
                    <TabsTrigger value="we-rent" className="flex-1">Bạn thuê của đối tác</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="they-rent" className="space-y-4 pt-2">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Ngày thuê</TableHead>
                            <TableHead>Ngày trả</TableHead>
                            <TableHead>Số tiền của bạn</TableHead>
                            <TableHead>Số tiền đối tác</TableHead>
                            <TableHead>Chênh lệch</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPeriod.theyRentFromUs.length > 0 ? (
                            selectedPeriod.theyRentFromUs.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.returnDate}</TableCell>
                                <TableCell>{formatCurrency(item.amount)}</TableCell>
                                <TableCell>{formatCurrency(item.partnerAmount)}</TableCell>
                                <TableCell className={item.diff > 0 ? "text-red-600 font-medium" : ""}>
                                  {formatCurrency(item.diff)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                                Không có dữ liệu cho kỳ đối soát này
                              </TableCell>
                            </TableRow>
                          )}
                          
                          {selectedPeriod.theyRentFromUs.length > 0 && (
                            <TableRow className="font-medium bg-muted/30">
                              <TableCell colSpan={3}>Tổng cộng</TableCell>
                              <TableCell>
                                {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.amount, 0))}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.partnerAmount, 0))}
                              </TableCell>
                              <TableCell className={selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.diff, 0) > 0 ? "text-red-600 font-medium" : ""}>
                                {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.diff, 0))}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="we-rent" className="space-y-4 pt-2">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Ngày thuê</TableHead>
                            <TableHead>Ngày trả</TableHead>
                            <TableHead>Số tiền của bạn</TableHead>
                            <TableHead>Số tiền đối tác</TableHead>
                            <TableHead>Chênh lệch</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPeriod.weRentFromThem.length > 0 ? (
                            selectedPeriod.weRentFromThem.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.returnDate}</TableCell>
                                <TableCell>{formatCurrency(item.amount)}</TableCell>
                                <TableCell>{formatCurrency(item.partnerAmount)}</TableCell>
                                <TableCell className={item.diff > 0 ? "text-red-600 font-medium" : ""}>
                                  {formatCurrency(item.diff)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                                Không có dữ liệu cho kỳ đối soát này
                              </TableCell>
                            </TableRow>
                          )}
                          
                          {selectedPeriod.weRentFromThem.length > 0 && (
                            <TableRow className="font-medium bg-muted/30">
                              <TableCell colSpan={3}>Tổng cộng</TableCell>
                              <TableCell>
                                {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.amount, 0))}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.partnerAmount, 0))}
                              </TableCell>
                              <TableCell className={selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.diff, 0) > 0 ? "text-red-600 font-medium" : ""}>
                                {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.diff, 0))}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {selectedPeriod.status !== "Đã đối soát" && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatus("Đã đối soát")}
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Xác nhận đối soát
                      </Button>
                    )}
                    
                    {selectedPeriod.status === "Chờ xử lý" && (
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
