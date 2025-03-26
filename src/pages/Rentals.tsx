
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

// Sample data for equipment categories - adding the required 'type' property
const equipmentCategories: EquipmentCategory[] = [
  { id: "1", name: "THIẾT BỊ MÁY QUAY", type: "camera" },
  { id: "2", name: "THIẾT BỊ ÁNH SÁNG", type: "lighting" },
  { id: "3", name: "NHÂN SỰ & DI CHUYỂN & PHÁT SINH", type: "personnel" },
];

// Sample data for equipment - adding the required 'equipmentType' property
const sampleEquipments: Equipment[] = [
  // Máy quay
  { id: 1, name: "SONY FX3 (Body)", category: "1", dailyRate: 1400000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN001", rentalCount: 10, equipmentType: "camera" },
  { id: 2, name: "SONY FE 70-200mm F2.8 GM", category: "1", dailyRate: 500000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN002", rentalCount: 15, equipmentType: "camera" },
  { id: 3, name: "SONY FE 85mm F1.4 GM", category: "1", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN003", rentalCount: 8, equipmentType: "camera" },
  { id: 4, name: "Gimbal DJI Ronin S3 Pro", category: "1", dailyRate: 400000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN004", rentalCount: 12, equipmentType: "camera" },
  { id: 5, name: "Tripod Secced (100)", category: "1", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN005", rentalCount: 20, equipmentType: "camera" },
  { id: 6, name: "NISI 82mm Variable ND Filter 1-5 STOP", category: "1", dailyRate: 200000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN006", rentalCount: 7, equipmentType: "camera" },
  { id: 7, name: 'Monitor Director 18" (4 input)', category: "1", dailyRate: 800000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN007", rentalCount: 5, equipmentType: "camera" },
  { id: 8, name: 'Monitor 5"', category: "1", dailyRate: 300000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN008", rentalCount: 9, equipmentType: "camera" },
  
  // Ánh sáng
  { id: 9, name: "AMARAN F22C", category: "2", dailyRate: 500000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN009", rentalCount: 11, equipmentType: "lighting" },
  { id: 10, name: "AMARAN T4C Tube Light", category: "2", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN010", rentalCount: 14, equipmentType: "lighting" },
  { id: 11, name: "ALMC Kit 4", category: "2", dailyRate: 1000000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN011", rentalCount: 6, equipmentType: "lighting" },
  { id: 12, name: "Grips & Lighting Accessories (Pro Package)", category: "2", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN012", rentalCount: 8, equipmentType: "lighting" },
  
  // Nhân sự
  { id: 13, name: "Kỹ thuật đèn", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF001", rentalCount: 30, equipmentType: "personnel" },
  { id: 14, name: "Kỹ thuật máy", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF002", rentalCount: 25, equipmentType: "personnel" },
  { id: 15, name: "Phát sinh khác", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "MISC001", rentalCount: 10, equipmentType: "personnel" },
  { id: 16, name: "Xe thiết bị", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "VH001", rentalCount: 15, equipmentType: "personnel" },
];

// Now also fix the sample rental data that uses these items
const sampleCustomers = [
  { id: "1", name: "Công ty Phim Việt", contact: "Nguyễn Văn A", phone: "0912345678", email: "vanA@phimviet.com", address: "123 Điện Biên Phủ, Quận 1, TP.HCM" },
  { id: "2", name: "Đoàn phim ABC", contact: "Trần Thị B", phone: "0923456789", email: "thiB@abc.com", address: "456 Lê Lợi, Quận 1, TP.HCM" },
  { id: "3", name: "Studio XYZ", contact: "Lê Văn C", phone: "0934567890", email: "vanC@xyz.com", address: "789 Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: "4", name: "Công ty quảng cáo Delta", contact: "Phạm Thị D", phone: "0945678901", email: "thiD@delta.com", address: "101 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM" },
  { id: "5", name: "Phim trường Future", contact: "Trịnh Văn E", phone: "0956789012", email: "vanE@future.com", address: "202 Đồng Khởi, Quận 1, TP.HCM" },
];

// Mẫu dữ liệu đơn thuê
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

// Sample debts
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

// Sample handover reports
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

// Hàm tính khấu hao (60% giá cho thuê trên 1 ngày)
const calculateDepreciation = (item: RentalItemDetail) => {
  // Chỉ tính khấu hao cho thiết bị thuộc category 1 và 2 (máy quay và ánh sáng)
  const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
  if (!equipment || equipment.category === "3") return 0;
  
  return item.dailyRate * 0.6 * item.quantity * item.days;
};

// Hàm tính tổng khấu hao cho tất cả thiết bị trong đơn hàng
const calculateTotalDepreciation = (items: RentalItemDetail[]) => {
  return items.reduce((total, item) => total + calculateDepreciation(item), 0);
};

// Hàm tính giá sau khi giảm giá
const calculateDiscountedTotal = (items: RentalItemDetail[]) => {
  return items.reduce((total, item) => {
    const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
    if (!equipment) return total;
    
    // Chỉ áp dụng giảm giá cho thiết bị category 1 và 2 (máy quay và ánh sáng)
    if (equipment.category === "1" || equipment.category === "2") {
      const discount = item.discount || 0;
      const discountAmount = (item.dailyRate * item.quantity * item.days) * (discount / 100);
      return total + (item.dailyRate * item.quantity * item.days) - discountAmount;
    } else {
      // Không áp dụng giảm giá cho nhân sự và dịch vụ khác
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

  // Add equipment to order
  const addEquipment = (equipment: Equipment) => {
    const existingItem = selectedItems.find(item => item.equipmentId === equipment.id);
    
    if (existingItem) {
      // Increment quantity if already in list
      const updatedItems = selectedItems.map(item => 
        item.equipmentId === equipment.id 
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              totalAmount: (item.quantity + 1) * item.days * item.dailyRate * (1 - ((item.discount || 0) / 100))
            } 
          : item
      );
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      const newItem: RentalItemDetail = {
        id: `item-${Date.now()}`,
        equipmentId: equipment.id,
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

  // Update equipment quantity
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

  // Remove equipment from order
  const removeEquipment = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  // Update equipment discount
  const updateEquipmentDiscount = (itemId: string, discount: number) => {
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
        
        // Chỉ áp dụng giảm giá cho thiết bị category 1 và 2 (máy quay và ánh sáng)
        if (equipment && (equipment.category === "1" || equipment.category === "2")) {
          const newDiscount = Math.min(Math.max(0, discount), 100); // Ensure discount is between 0-100
          const newTotalAmount = item.quantity * item.days * item.dailyRate * (1 - (newDiscount / 100));
          return { ...item, discount: newDiscount, totalAmount: newTotalAmount };
        }
      }
      return item;
    });
    
    setSelectedItems(updatedItems);
  };

  // Calculate total when items or dates change
  useEffect(() => {
    if (form.getValues("startDate") && form.getValues("endDate")) {
      const startDate = format(form.getValues("startDate")!, 'yyyy-MM-dd');
      const endDate = format(form.getValues("endDate")!, 'yyyy-MM-dd');
      const days = calculateDaysBetween(startDate, endDate);
      
      // Update days for all items
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

  // Same effect for edit form
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
    
    // If status changes to "Đang thuê", create debt entry
    if (newStatus === "Đang thuê") {
      // Check if debt already exists for this order
      const existingDebt = debts.find(debt => debt.relatedOrderId === rentalId);
      
      if (!existingDebt) {
        const newDebt: Debt = {
          id: debts.length + 1,
          customerId: rental.customerId,
          customerName: rental.customerName,
          contact: rental.contact,
          amount: rental.balance,
          dueDate: new Date(new Date(rental.endDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due date 10 days after end date
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
    
    // Remove related debt if exists
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
      totalAmount,
      deposit: data.deposit,
      balance,
      status: data.status,
      notes: data.notes,
      discount: data.discount,
      createdAt: new Date().toISOString().split('T')[0],
      handoverCompleted: false
    };
    
    setRentals([...rentals, newRental]);
    
    // If status is "Đang thuê", create debt entry
    if (data.status === "Đang thuê") {
      const newDebt: Debt = {
        id: debts.length + 1,
        customerId: data.customerId,
        customerName: customer.name,
        contact: customer.contact,
        amount: balance,
        dueDate: new Date(new Date(format(data.endDate, "yyyy-MM-dd")).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        description: `Công nợ thuê thiết bị - Đơn hàng #${newRental.id}`,
        status: "Chưa thanh toán",
        relatedOrderId: newRental.id
      };
      
      setDebts([...debts, newDebt]);
    }
    
    toast({
      title: "Tạo đơn hàng thành công",
      description: `Đã thêm đơn hàng cho khách hàng ${customer.name}`,
    });
    
    form.reset();
    setSelectedItems([]);
    setIsDialogOpen(false);
  };

  const onEditSubmit = (data: RentalFormValues) => {
    if (!selectedRental) return;
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
    
    const updatedRental: RentalOrder = {
      ...selectedRental,
      customerId: data.customerId,
      customerName: customer.name,
      contact: customer.contact,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      items: selectedItems,
      totalAmount,
      deposit: data.deposit,
      balance,
      status: data.status,
      notes: data.notes,
      discount: data.discount
    };
    
    setRentals(prevRentals => 
      prevRentals.map(rental => 
        rental.id === selectedRental.id ? updatedRental : rental
      )
    );
    
    // If status changes to "Đang thuê", update or create debt entry
    if (data.status === "Đang thuê") {
      const existingDebt = debts.find(debt => debt.relatedOrderId === selectedRental.id);
      
      if (existingDebt) {
        // Update existing debt
        setDebts(prevDebts => 
          prevDebts.map(debt => 
            debt.relatedOrderId === selectedRental.id 
              ? {
                  ...debt,
                  amount: balance,
                  dueDate: new Date(new Date(format(data.endDate, "yyyy-MM-dd")).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                } 
              : debt
          )
        );
      } else {
        // Create new debt
        const newDebt: Debt = {
          id: debts.length + 1,
          customerId: data.customerId,
          customerName: customer.name,
          contact: customer.contact,
          amount: balance,
          dueDate: new Date(new Date(format(data.endDate, "yyyy-MM-dd")).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          issueDate: new Date().toISOString().split('T')[0],
          description: `Công nợ thuê thiết bị - Đơn hàng #${selectedRental.id}`,
          status: "Chưa thanh toán",
          relatedOrderId: selectedRental.id
        };
        
        setDebts([...debts, newDebt]);
      }
    }
    
    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật đơn hàng cho khách hàng ${customer.name}`,
    });
    
    editForm.reset();
    setSelectedItems([]);
    setSelectedRental(null);
    setIsEditDialogOpen(false);
  };

  const onHandoverSubmit = (data: HandoverFormValues) => {
    if (!selectedRental) return;
    
    const newHandoverReport: HandoverReport = {
      id: handoverReports.length + 1,
      rentalId: selectedRental.id,
      customerName: selectedRental.customerName,
      date: new Date().toISOString().split('T')[0],
      items: selectedRental.items,
      notes: data.notes || "Thiết bị đã được kiểm tra đầy đủ trước khi bàn giao.",
      signedByCustomer: data.signedByCustomer,
      signedByStaff: data.signedByStaff
    };
    
    setHandoverReports([...handoverReports, newHandoverReport]);
    
    // Mark the rental as handover completed
    setRentals(prevRentals => 
      prevRentals.map(rental => 
        rental.id === selectedRental.id ? { ...rental, handoverCompleted: true } : rental
      )
    );
    
    toast({
      title: "Tạo biên bản thành công",
      description: `Đã tạo biên bản bàn giao cho đơn hàng #${selectedRental.id}`,
    });
    
    handoverForm.reset();
    setSelectedRental(null);
    setIsHandoverDialogOpen(false);
  };

  const onMaintenanceSubmit = (data: MaintenanceFormValues) => {
    if (!selectedEquipment) return;
    
    // Update equipment status
    setEquipments(prevEquipments => 
      prevEquipments.map(eq => 
        eq.id === selectedEquipment.id 
          ? { 
              ...eq, 
              status: "Bảo trì", 
              maintenanceNotes: data.maintenanceNotes,
              maintenanceLocation: data.maintenanceLocation
            } 
          : eq
      )
    );
    
    toast({
      title: "Đánh dấu cần bảo trì",
      description: `Đã đánh dấu ${selectedEquipment.name} cần bảo trì`,
    });
    
    maintenanceForm.reset();
    setSelectedEquipment(null);
    setIsMaintenanceDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý đơn thuê thiết bị</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo đơn hàng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Tạo đơn hàng mới</DialogTitle>
              <DialogDescription>
                Điền thông tin đơn hàng và chọn thiết bị
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerId"
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
                            {sampleCustomers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} ({customer.contact})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                            <SelectItem value="Hủy">Hủy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
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
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
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
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiền cọc (VNĐ)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
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
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giảm giá (%) - Chỉ áp dụng cho thiết bị</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Danh sách thiết bị thuê</h3>
                  
                  <Tabs defaultValue="camera">
                    <TabsList className="mb-4">
                      <TabsTrigger value="camera">Thiết bị máy quay</TabsTrigger>
                      <TabsTrigger value="lighting">Thiết bị ánh sáng</TabsTrigger>
                      <TabsTrigger value="personnel">Nhân sự & Khác</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="camera">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sampleEquipments
                          .filter(item => item.equipmentType === "camera")
                          .map(item => (
                            <Button 
                              key={item.id} 
                              variant="outline" 
                              className="justify-start h-auto py-3 px-4"
                              onClick={() => addEquipment(item)}
                            >
                              <div className="text-left">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.dailyRate.toLocaleString()}đ / ngày</div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lighting">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sampleEquipments
                          .filter(item => item.equipmentType === "lighting")
                          .map(item => (
                            <Button 
                              key={item.id} 
                              variant="outline" 
                              className="justify-start h-auto py-3 px-4"
                              onClick={() => addEquipment(item)}
                            >
                              <div className="text-left">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.dailyRate.toLocaleString()}đ / ngày</div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="personnel">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sampleEquipments
                          .filter(item => item.equipmentType === "personnel")
                          .map(item => (
                            <Button 
                              key={item.id} 
                              variant="outline" 
                              className="justify-start h-auto py-3 px-4"
                              onClick={() => addEquipment(item)}
                            >
                              <div className="text-left">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.dailyRate.toLocaleString()}đ / ngày</div>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thiết bị</TableHead>
                          <TableHead>SL</TableHead>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Đơn giá</TableHead>
                          <TableHead>Giảm giá</TableHead>
                          <TableHead>Thành tiền</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItems.length > 0 ? (
                          selectedItems.map(item => {
                            const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
                            const isDiscountable = equipment && (equipment.category === "1" || equipment.category === "2");
                            
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.equipmentName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateEquipmentQuantity(item.id, item.quantity - 1)}
                                    >
                                      <MinusCircle className="h-4 w-4" />
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateEquipmentQuantity(item.id, item.quantity + 1)}
                                    >
                                      <PlusCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>{item.days}</TableCell>
                                <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                                <TableCell>
                                  {isDiscountable ? (
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        type="number"
                                        value={item.discount || 0}
                                        onChange={(e) => updateEquipmentDiscount(item.id, Number(e.target.value))}
                                        className="w-16 h-8"
                                        min="0"
                                        max="100"
                                      />
                                      <span>%</span>
                                    </div>
                                  ) : (
                                    <span>N/A</span>
                                  )}
                                </TableCell>
                                <TableCell>{item.totalAmount.toLocaleString()}đ</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEquipment(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                              Chưa có thiết bị nào được chọn
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:justify-end">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">Tổng tiền thuê:</div>
                      <div className="font-bold text-lg">{calculateDiscountedTotal(selectedItems).toLocaleString()}đ</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">Tiền cọc:</div>
                      <div className="font-bold text-lg">{form.getValues("deposit").toLocaleString()}đ</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">Còn lại:</div>
                      <div className="font-bold text-lg">{(calculateDiscountedTotal(selectedItems) - form.getValues("deposit")).toLocaleString()}đ</div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Tạo đơn hàng</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4">
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              prefix={<Search className="h-4 w-4 mr-2" />}
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Thời gian thuê</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length > 0 ? (
                  filteredRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">#{rental.id}</TableCell>
                      <TableCell>{rental.customerName}</TableCell>
                      <TableCell>
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        <div className="text-xs text-muted-foreground">
                          {calculateDaysBetween(rental.startDate, rental.endDate)} ngày
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {rental.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.quantity}x {item.equipmentName}
                            </div>
                          ))}
                          {rental.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{rental.items.length - 2} thiết bị khác
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          rental.status === "Hoàn thành" 
                            ? "bg-green-50 text-green-700 ring-green-600/20" 
                            : rental.status === "Đang thuê"
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                              : rental.status === "Đặt trước"
                                ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                                : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}>
                          {rental.status}
                        </span>
                        {rental.handoverCompleted && (
                          <span className="ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                            <CheckSquare className="h-3 w-3 mr-1" />
                            Đã bàn giao
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(rental.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRental(rental)}>
                              <FileEdit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewQuote(rental)}>
                              <Calculator className="h-4 w-4 mr-2" />
                              Xem báo giá
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Đặt trước")}>
                              Đánh dấu: Đặt trước
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Đang thuê")}>
                              Đánh dấu: Đang thuê
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Hoàn thành")}>
                              Đánh dấu: Hoàn thành
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Hủy")}>
                              Đánh dấu: Hủy
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {!rental.handoverCompleted && rental.status === "Đang thuê" && (
                              <DropdownMenuItem onClick={() => handleCreateHandover(rental)}>
                                <ClipboardCheck className="h-4 w-4 mr-2" />
                                Tạo biên bản bàn giao
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRental(rental.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa đơn hàng
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
            <DialogDescription>
              {selectedRental && `Đơn hàng #${selectedRental.id} - ${selectedRental.customerName}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              {/* Same form fields as in the new rental dialog */}
              {/* ... */}
              <DialogFooter>
                <Button type="submit">Cập nhật đơn hàng</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Báo giá cho khách hàng</DialogTitle>
            <DialogDescription>
              {selectedRental && `${selectedRental.customerName} - ${formatDate(selectedRental.startDate)} đến ${formatDate(selectedRental.endDate)}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRental && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead className="text-right">SL</TableHead>
                      <TableHead className="text-right">Ngày</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRental.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.equipmentName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.days}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.dailyRate)}</TableCell>
                        <TableCell className="text-right">{item.discount ? `${item.discount}%` : "-"}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú:</p>
                  <p>{selectedRental.notes || "Không có ghi chú"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-muted-foreground">Tổng tiền thuê:</div>
                  <div className="font-bold text-lg">{formatCurrency(selectedRental.totalAmount)}</div>
                  <div className="text-sm text-muted-foreground">Tiền cọc:</div>
                  <div className="font-bold">{formatCurrency(selectedRental.deposit)}</div>
                  <div className="text-sm text-muted-foreground">Còn lại:</div>
                  <div className="font-bold">{formatCurrency(selectedRental.balance)}</div>
                </div>
              </div>
              
              <DialogFooter>
                <Button>In báo giá</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Handover Dialog */}
      <Dialog open={isHandoverDialogOpen} onOpenChange={setIsHandoverDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Biên bản bàn giao thiết bị</DialogTitle>
            <DialogDescription>
              {selectedRental && `Đơn hàng #${selectedRental.id} - ${selectedRental.customerName}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...handoverForm}>
            <form onSubmit={handoverForm.handleSubmit(onHandoverSubmit)} className="space-y-4">
              {selectedRental && (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thiết bị</TableHead>
                          <TableHead className="text-right">SL</TableHead>
                          <TableHead>Tình trạng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRental.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.equipmentName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell>Tốt</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <FormField
                    control={handoverForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú khi bàn giao</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FormField
                      control={handoverForm.control}
                      name="signedByCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Xác nhận khách hàng đã ký
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={handoverForm.control}
                      name="signedByStaff"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Xác nhận nhân viên đã ký
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="submit">Tạo biên bản bàn giao</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Maintenance Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đánh dấu thiết bị cần bảo trì</DialogTitle>
            <DialogDescription>
              {selectedEquipment && `${selectedEquipment.name} - ${selectedEquipment.serialNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...maintenanceForm}>
            <form onSubmit={maintenanceForm.handleSubmit(onMaintenanceSubmit)} className="space-y-4">
              <FormField
                control={maintenanceForm.control}
                name="maintenanceNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú bảo trì</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Mô tả vấn đề cần bảo trì" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={maintenanceForm.control}
                name="maintenanceLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm bảo trì</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn địa điểm bảo trì" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {samplePartners
                          .filter(partner => partner.type === "maintenance")
                          .map(partner => (
                            <SelectItem key={partner.id} value={partner.name}>
                              {partner.name}
                            </SelectItem>
                          ))}
                        <SelectItem value="Nội bộ">Sửa chữa nội bộ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Xác nhận</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rentals;
