
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarIcon, FileEdit, PlusCircle, Search } from "lucide-react";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Định nghĩa schema Zod cho form
const rentalFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  equipmentIds: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất một thiết bị" }),
  startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
  totalAmount: z.number().min(0, { message: "Tổng tiền không hợp lệ" }),
  deposit: z.number().min(0, { message: "Tiền đặt cọc không hợp lệ" }),
  status: z.string().min(1, { message: "Vui lòng chọn trạng thái" }),
});

type RentalFormValues = z.infer<typeof rentalFormSchema>;

// Dữ liệu mẫu cho khách hàng
const sampleCustomers = [
  { id: "1", name: "Công ty Phim Việt" },
  { id: "2", name: "Đoàn phim ABC" },
  { id: "3", name: "Studio XYZ" },
  { id: "4", name: "Công ty quảng cáo Delta" },
  { id: "5", name: "Phim trường Future" },
];

// Dữ liệu mẫu cho thiết bị
const sampleEquipments = [
  { id: "1", name: "Máy quay Sony FS7" },
  { id: "2", name: "Đèn Aputure 300d" },
  { id: "3", name: "Gimbal DJI Ronin S" },
  { id: "4", name: "Ống kính Canon 24-70mm" },
  { id: "5", name: "Microphone Rode NTG4+" },
];

// Dữ liệu mẫu cho đơn hàng thuê
const sampleRentals = [
  {
    id: 1,
    customerName: "Công ty Phim Việt",
    equipments: "Máy quay Sony FS7, Đèn Aputure 300d",
    startDate: "10/05/2023",
    endDate: "15/05/2023",
    totalAmount: 5000000,
    deposit: 2000000,
    status: "Hoàn thành"
  },
  {
    id: 2,
    customerName: "Đoàn phim ABC",
    equipments: "Gimbal DJI Ronin S, Ống kính Canon 24-70mm",
    startDate: "20/05/2023",
    endDate: "25/05/2023",
    totalAmount: 3500000,
    deposit: 1500000,
    status: "Đang thuê"
  },
  {
    id: 3,
    customerName: "Studio XYZ",
    equipments: "Máy quay Sony FS7, Microphone Rode NTG4+",
    startDate: "01/06/2023",
    endDate: "05/06/2023",
    totalAmount: 4000000,
    deposit: 1800000,
    status: "Đặt trước"
  }
];

const Rentals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState(sampleRentals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      customerId: "",
      equipmentIds: [],
      startDate: undefined,
      endDate: undefined,
      totalAmount: 0,
      deposit: 0,
      status: "Đặt trước",
    },
  });

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredRentals = rentals.filter(rental => 
    rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.equipments.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: RentalFormValues) => {
    // Tìm thông tin khách hàng từ id
    const customer = sampleCustomers.find(c => c.id === data.customerId);
    
    // Tìm thông tin các thiết bị từ id
    const selectedEquipments = sampleEquipments.filter(e => data.equipmentIds.includes(e.id));
    const equipmentNames = selectedEquipments.map(e => e.name).join(", ");
    
    // Thêm đơn hàng mới vào danh sách
    const newRental = {
      id: rentals.length + 1,
      customerName: customer?.name || "",
      equipments: equipmentNames,
      startDate: format(data.startDate, "dd/MM/yyyy"),
      endDate: format(data.endDate, "dd/MM/yyyy"),
      totalAmount: data.totalAmount,
      deposit: data.deposit,
      status: data.status
    };
    
    setRentals([...rentals, newRental]);
    
    // Hiển thị thông báo
    toast({
      title: "Tạo đơn hàng thành công",
      description: `Đã thêm đơn hàng cho khách hàng ${customer?.name}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng thuê</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm đơn hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tạo đơn hàng thuê mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin đơn hàng thuê mới vào form bên dưới.
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khách hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleCustomers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="equipmentIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thiết bị thuê</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange([...field.value, value])}
                          value={field.value[0] || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thiết bị" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleEquipments.map((equipment) => (
                              <SelectItem key={equipment.id} value={equipment.id}>
                                {equipment.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map(id => {
                          const equipment = sampleEquipments.find(e => e.id === id);
                          return equipment ? (
                            <div key={id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center">
                              {equipment.name}
                              <button
                                type="button"
                                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                                onClick={() => field.onChange(field.value.filter(v => v !== id))}
                              >
                                &times;
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tổng tiền (VNĐ)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5,000,000" 
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiền đặt cọc (VNĐ)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2,000,000" 
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
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
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Đặt trước">Đặt trước</SelectItem>
                            <SelectItem value="Đang thuê">Đang thuê</SelectItem>
                            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
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
          <CardTitle>Danh sách đơn hàng thuê</CardTitle>
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
                <TableHead>ID</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Thiết bị</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Đặt cọc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id}</TableCell>
                  <TableCell className="font-medium">{rental.customerName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{rental.equipments}</TableCell>
                  <TableCell>{rental.startDate}</TableCell>
                  <TableCell>{rental.endDate}</TableCell>
                  <TableCell>{rental.totalAmount.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{rental.deposit.toLocaleString()} VNĐ</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-md text-xs font-medium",
                      rental.status === "Hoàn thành" && "bg-green-100 text-green-800",
                      rental.status === "Đang thuê" && "bg-blue-100 text-blue-800",
                      rental.status === "Đặt trước" && "bg-yellow-100 text-yellow-800",
                      rental.status === "Đã hủy" && "bg-red-100 text-red-800"
                    )}>
                      {rental.status}
                    </span>
                  </TableCell>
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
            Hiển thị {filteredRentals.length} trên tổng số {rentals.length} đơn hàng
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Rentals;
