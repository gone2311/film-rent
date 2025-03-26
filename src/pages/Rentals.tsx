import React, { useEffect, useState, Fragment } from "react";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { CalendarIcon, FileEdit, MoreHorizontal, PlusCircle, MinusCircle, Search, Trash2, Calculator, FileText, CheckSquare, ClipboardCheck, Wrench, Percent } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, calculateDaysBetween, calculateTotal } from "@/utils/formatters";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Equipment, EquipmentCategory, RentalItemDetail, RentalOrder, Debt, HandoverReport } from "@/types/customer";
import { samplePartners } from "@/data/partners";

const rentalFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
  deposit: z.number().min(0, { message: "Tiền đặt cọc không hợp lệ" }),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Vui lòng chọn trạng thái" }),
  discount: z.number().min(0).max(100).optional(),
});

type RentalFormValues = z.infer<typeof rentalFormSchema>;

const handoverFormSchema = z.object({
  notes: z.string().optional(),
  signedByCustomer: z.boolean().default(false),
  signedByStaff: z.boolean().default(false),
});

type HandoverFormValues = z.infer<typeof handoverFormSchema>;

const maintenanceFormSchema = z.object({
  maintenanceNotes: z.string().min(1, { message: "Vui lòng nhập ghi chú bảo trì" }),
  maintenanceLocation: z.string().min(1, { message: "Vui lòng nhập địa điểm bảo trì" }),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

const equipmentCategories: EquipmentCategory[] = [
  { id: "1", name: "THIẾT BỊ MÁY QUAY", type: "camera" },
  { id: "2", name: "THIẾT BỊ ÁNH SÁNG", type: "lighting" },
  { id: "3", name: "NHÂN SỰ & DI CHUYỂN & PHÁT SINH", type: "personnel" },
];

const sampleEquipments: Equipment[] = [
  { id: 1, name: "SONY FX3 (Body)", category: "1", dailyRate: 1400000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN001", rentalCount: 10, equipmentType: "camera" },
  { id: 2, name: "SONY FE 70-200mm F2.8 GM", category: "1", dailyRate: 500000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN002", rentalCount: 15, equipmentType: "camera" },
  { id: 3, name: "SONY FE 85mm F1.4 GM", category: "1", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN003", rentalCount: 8, equipmentType: "camera" },
  { id: 4, name: "Gimbal DJI Ronin S3 Pro", category: "1", dailyRate: 400000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN004", rentalCount: 12, equipmentType: "camera" },
  { id: 5, name: "Tripod Secced (100)", category: "1", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN005", rentalCount: 20, equipmentType: "camera" },
  { id: 6, name: "NISI 82mm Variable ND Filter 1-5 STOP", category: "1", dailyRate: 200000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN006", rentalCount: 7, equipmentType: "camera" },
  { id: 7, name: 'Monitor Director 18" (4 input)', category: "1", dailyRate: 800000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN007", rentalCount: 5, equipmentType: "camera" },
  { id: 8, name: 'Monitor 5"', category: "1", dailyRate: 300000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN008", rentalCount: 9, equipmentType: "camera" },
  { id: 9, name: "AMARAN F22C", category: "2", dailyRate: 500000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN009", rentalCount: 11, equipmentType: "lighting" },
  { id: 10, name: "AMARAN T4C Tube Light", category: "2", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN010", rentalCount: 14, equipmentType: "lighting" },
  { id: 11, name: "ALMC Kit 4", category: "2", dailyRate: 1000000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN011", rentalCount: 6, equipmentType: "lighting" },
  { id: 12, name: "Grips & Lighting Accessories (Pro Package)", category: "2", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN012", rentalCount: 8, equipmentType: "lighting" },
  { id: 13, name: "Kỹ thuật đèn", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF001", rentalCount: 30, equipmentType: "personnel" },
  { id: 14, name: "Kỹ thuật máy", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF002", rentalCount: 25, equipmentType: "personnel" },
  { id: 15, name: "Phát sinh khác", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "MISC001", rentalCount: 10, equipmentType: "personnel" },
  { id: 16, name: "Xe thiết bị", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "VH001", rentalCount: 15, equipmentType: "personnel" },
];

const sampleCustomers = [
  { id: "1", name: "Công ty Phim Việt", contact: "Nguyễn Văn A", phone: "0912345678", email: "vanA@phimviet.com", address: "123 Điện Biên Phủ, Quận 1, TP.HCM" },
  { id: "2", name: "Đoàn phim ABC", contact: "Trần Thị B", phone: "0923456789", email: "thiB@abc.com", address: "456 Lê Lợi, Quận 1, TP.HCM" },
  { id: "3", name: "Studio XYZ", contact: "Lê Văn C", phone: "0934567890", email: "vanC@xyz.com", address: "789 Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: "4", name: "Công ty quảng cáo Delta", contact: "Phạm Thị D", phone: "0945678901", email: "thiD@delta.com", address: "101 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM" },
  { id: "5", name: "Phim trường Future", contact: "Trịnh Văn E", phone: "0956789012", email: "vanE@future.com", address: "202 Đồng Khởi, Quận 1, TP.HCM" },
];

const sampleRentals: RentalOrder[] = [
  {
    id: 1,
    customerId: "1",
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    startDate: "2023-05-10",
    endDate: "2023-05-15",
    items: [
      { id: "item1", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 5, dailyRate: 1400000, totalAmount: 7000000, discount: 0 },
      { id: "item2", equipmentId: "2", equipmentName: "SONY FE 70-200mm F2.8 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000, discount: 0 }
    ],
    totalAmount: 9500000,
    deposit: 4000000,
    balance: 5500000,
    status: "Hoàn thành",
    createdAt: "2023-05-09",
    handoverCompleted: true
  },
  {
    id: 2,
    customerId: "2",
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    startDate: "2023-05-20",
    endDate: "2023-05-25",
    items: [
      { id: "item3", equipmentId: "4", equipmentName: "Gimbal DJI Ronin S3 Pro", quantity: 1, days: 5, dailyRate: 400000, totalAmount: 2000000, discount: 0 },
      { id: "item4", equipmentId: "3", equipmentName: "SONY FE 85mm F1.4 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000, discount: 0 }
    ],
    totalAmount: 4500000,
    deposit: 2000000,
    balance: 2500000,
    status: "Đang thuê",
    createdAt: "2023-05-19",
    handoverCompleted: true
  },
  {
    id: 3,
    customerId: "3",
    customerName: "Studio XYZ",
    contact: "Lê Văn C",
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    items: [
      { id: "item5", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 4, dailyRate: 1400000, totalAmount: 5600000, discount: 0 },
      { id: "item6", equipmentId: "7", equipmentName: 'Monitor Director 18" (4 input)', quantity: 1, days: 4, dailyRate: 800000, totalAmount: 3200000, discount: 0 }
    ],
    totalAmount: 8800000,
    deposit: 4000000,
    balance: 4800000,
    status: "Đặt trước",
    createdAt: "2023-05-25",
    handoverCompleted: false
  }
];

const sampleDebts: Debt[] = [
  {
    id: 1,
    customerId: "1",
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    amount: 5500000,
    dueDate: "2023-05-25",
    issueDate: "2023-05-15",
    description: "Công nợ thuê thiết bị - Đơn hàng #1",
    status: "Đã thanh toán",
    relatedOrderId: 1
  },
  {
    id: 2,
    customerId: "2",
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    amount: 2500000,
    dueDate: "2023-06-05",
    issueDate: "2023-05-25",
    description: "Công nợ thuê thiết bị - Đơn hàng #2",
    status: "Chưa thanh toán",
    relatedOrderId: 2
  }
];

const sampleHandoverReports: HandoverReport[] = [
  {
    id: 1,
    rentalId: 1,
    customerName: "Công ty Phim Việt",
    date: "2023-05-10",
    items: [
      { id: "item1", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 5, dailyRate: 1400000, totalAmount: 7000000 },
      { id: "item2", equipmentId: "2", equipmentName: "SONY FE 70-200mm F2.8 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000 }
    ],
    notes: "Thiết bị đã được kiểm tra đầy đủ trước khi bàn giao.",
    signedByCustomer: true,
    signedByStaff: true
  },
  {
    id: 2,
    rentalId: 2,
    customerName: "Đoàn phim ABC",
    date: "2023-05-20",
    items: [
      { id: "item3", equipmentId: "4", equipmentName: "Gimbal DJI Ronin S3 Pro", quantity: 1, days: 5, dailyRate: 400000, totalAmount: 2000000 },
      { id: "item4", equipmentId: "3", equipmentName: "SONY FE 85mm F1.4 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000 }
    ],
    notes: "Khách hàng yêu cầu thêm pin dự phòng cho máy.",
    signedByCustomer: true,
    signedByStaff: true
  }
];

const calculateDepreciation = (item: RentalItemDetail) => {
  const equipment = sampleEquipments.find(eq => eq.id.toString() === item.equipmentId);
  if (!equipment || equipment.category === "3") return 0;
  
  return item.dailyRate * 0.6 * item.quantity * item.days;
};

const calculateTotalDepreciation = (items: RentalItemDetail[]) => {
  return items.reduce((total, item) => total + calculateDepreciation(item), 0);
};

const calculateDiscountedTotal = (items: RentalItemDetail[]) => {
  return items.reduce((total, item) => {
    const equipment = sampleEquipments.find(eq => eq.id.toString() === item.equipmentId);
    if (!equipment) return total;
    
    if (equipment.category === "1" || equipment.category === "2") {
      const discount = item.discount || 0;
      const discountAmount = (item.dailyRate * item.quantity * item.days) * (discount / 100);
      return total + (item.dailyRate * item.quantity * item.days) - discountAmount;
    } else {
      return total + (item.dailyRate * item.quantity * item.days);
    }
  }, 0);
};

const Rentals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rentals, setRentals] = useState(sampleRentals);
  const [debts, setDebts] = useState(sampleDebts);
  const [handoverReports, setHandoverReports] = useState(sampleHandoverReports);
  const [equipments, setEquipments] = useState(sampleEquipments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isHandoverDialogOpen, setIsHandoverDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedItems, setSelectedItems] = useState<RentalItemDetail[]>([]);
  const { toast } = useToast();

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      customerId: "",
      startDate: undefined,
      endDate: undefined,
      deposit: 0,
      notes: "",
      status: "Đặt trước",
      discount: 0,
    },
  });

  const editForm = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      customerId: "",
      startDate: undefined,
      endDate: undefined,
      deposit: 0,
      notes: "",
      status: "Đặt trước",
      discount: 0,
    },
  });

  const handoverForm = useForm<HandoverFormValues>({
    resolver: zodResolver(handoverFormSchema),
    defaultValues: {
      notes: "",
      signedByCustomer: false,
      signedByStaff: false,
    },
  });

  const maintenanceForm = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      maintenanceNotes: "",
      maintenanceLocation: "",
    },
  });

  const addEquipment = (equipment: Equipment) => {
    const existingItem = selectedItems.find(item => item.equipmentId === equipment.id.toString());
    
    if (existingItem) {
      const updatedItems = selectedItems.map(item => 
        item.equipmentId === equipment.id.toString()
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              totalAmount: (item.quantity + 1) * item.days * item.dailyRate * (1 - ((item.discount || 0) / 100))
            } 
          : item
      );
      setSelectedItems(updatedItems);
    } else {
      const newItem: RentalItemDetail = {
        id: `item-${Date.now()}`,
        equipmentId: equipment.id.toString(),
        equipmentName: equipment.name,
        quantity: 1,
        days: form.getValues("startDate") && form.getValues("endDate") 
          ? calculateDaysBetween(format(form.getValues("startDate")!, 'yyyy-MM-dd'), format(form.getValues("endDate")!, 'yyyy-MM-dd'))
          : 1,
        dailyRate: equipment.dailyRate,
        discount: 0,
        totalAmount: equipment.dailyRate
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const updateEquipmentQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeEquipment(itemId);
      return;
    }

    const updatedItems = selectedItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity,
            totalAmount: quantity * item.days * item.dailyRate * (1 - ((item.discount || 0) / 100))
          } 
        : item
    );
    setSelectedItems(updatedItems);
  };

  const removeEquipment = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateEquipmentDiscount = (itemId: string, discount: number) => {
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const equipment = sampleEquipments.find(eq => eq.id.toString() === item.equipmentId);
        
        if (equipment && (equipment.category === "1" || equipment.category === "2")) {
          const newDiscount = Math.min(Math.max(0, discount), 100);
          const newTotalAmount = item.quantity * item.days * item.dailyRate * (1 - (newDiscount / 100));
          return { ...item, discount: newDiscount, totalAmount: newTotalAmount };
        }
      }
      return item;
    });
    
    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    if (form.getValues("startDate") && form.getValues("endDate")) {
      const startDate = format(form.getValues("startDate")!, 'yyyy-MM-dd');
      const endDate = format(form.getValues("endDate")!, 'yyyy-MM-dd');
      const days = calculateDaysBetween(startDate, endDate);
      
      const updatedItems = selectedItems.map(item => {
        const discountPercent = item.discount || 0;
        const discountMultiplier = 1 - (discountPercent / 100);
        return {
          ...item,
          days,
          totalAmount: item.quantity * days * item.dailyRate * discountMultiplier
        };
      });
      
      setSelectedItems(updatedItems);
    }
  }, [form.watch("startDate"), form.watch("endDate")]);

  useEffect(() => {
    if (editForm.getValues("startDate") && editForm.getValues("endDate") && selectedItems.length > 0) {
      const startDate = format(editForm.getValues("startDate")!, 'yyyy-MM-dd');
      const endDate = format(editForm.getValues("endDate")!, 'yyyy-MM-dd');
      const days = calculateDaysBetween(startDate, endDate);
      
      const updatedItems = selectedItems.map(item => {
        const discountPercent = item.discount || 0;
        const discountMultiplier = 1 - (discountPercent / 100);
        return {
          ...item,
          days,
          totalAmount: item.quantity * days * item.dailyRate * discountMultiplier
        };
      });
      
      setSelectedItems(updatedItems);
    }
  }, [editForm.watch("startDate"), editForm.watch("endDate")]);

  const handleEditRental = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setSelectedItems([...rental.items]);
    
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.endDate);

    editForm.reset({
      customerId: rental.customerId,
      startDate,
      endDate,
      deposit: rental.deposit,
      notes: rental.notes || "",
      status: rental.status,
      discount: rental.discount || 0
    });
    
    setIsEditDialogOpen(true);
  };

  const handleViewQuote = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setIsQuoteDialogOpen(true);
  };

  const handleCreateHandover = (rental: RentalOrder) => {
    setSelectedRental(rental);
    
    handoverForm.reset({
      notes: "",
      signedByCustomer: false,
      signedByStaff: false,
    });
    
    setIsHandoverDialogOpen(true);
  };

  const handleMaintenanceDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    
    maintenanceForm.reset({
      maintenanceNotes: equipment.maintenanceNotes || "",
      maintenanceLocation: equipment.maintenanceLocation || "",
    });
    
    setIsMaintenanceDialogOpen(true);
  };

  const handleStatusChange = (rentalId: number, newStatus: string) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;
    
    setRentals(prevRentals => 
      prevRentals.map(rental => 
        rental.id === rentalId ? { ...rental, status: newStatus } : rental
      )
    );
    
    if (newStatus === "Đang thuê") {
      const existingDebt = debts.find(debt => debt.relatedOrderId === rentalId);
      
      if (!existingDebt) {
        const newDebt: Debt = {
          id: debts.length + 1,
          customerId: rental.customerId,
          customerName: rental.customerName,
          contact: rental.contact,
          amount: rental.balance,
          dueDate: new Date(new Date(rental.endDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          issueDate: new Date().toISOString().split('T')[0],
          description: `Công nợ thuê thiết bị - Đơn hàng #${rental.id}`,
          status: "Chưa thanh toán",
          relatedOrderId: rental.id
        };
        
        setDebts([...debts, newDebt]);
        
        toast({
          title: "Tạo công nợ tự động",
          description: `Đã tạo công nợ tự động cho đơn hàng #${rental.id}`,
        });
      }
    }
    
    toast({
      title: "Cập nhật trạng thái",
      description: `Đã chuyển đơn hàng #${rentalId} sang trạng thái "${newStatus}"`,
    });
  };

  const handleDeleteRental = (rentalId: number) => {
    setRentals(prevRentals => prevRentals.filter(rental => rental.id !== rentalId));
    
    const hasRelatedDebt = debts.some(debt => debt.relatedOrderId === rentalId);
    if (hasRelatedDebt) {
      setDebts(prevDebts => prevDebts.filter(debt => debt.relatedOrderId !== rentalId));
    }
    
    toast({
      title: "Xóa đơn hàng",
      description: `Đã xóa đơn hàng #${rentalId}${hasRelatedDebt ? ' và công nợ liên quan' : ''}`,
      variant: "destructive"
    });
  };

  const filteredRentals = rentals.filter(rental => 
    rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.items.some(item => item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    rental.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: RentalFormValues) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một thiết bị cho đơn hàng",
        variant: "destructive"
      });
      return;
    }
    
    const customer = sampleCustomers.find(c => c.id === data.customerId);
    if (!customer) return;
    
    const totalAmount = calculateDiscountedTotal(selectedItems);
    const balance = totalAmount - data.deposit;
    
    const newRental: RentalOrder = {
      id: rentals.length + 1,
      customerId: data.customerId,
      customerName: customer.name,
      contact: customer.contact,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      items: selectedItems,
