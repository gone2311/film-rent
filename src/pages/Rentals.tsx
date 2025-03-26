
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
import React, { useEffect, useState, Fragment } from "react";
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

// Sample data for equipment categories
const equipmentCategories: EquipmentCategory[] = [
  { id: "1", name: "THIẾT BỊ MÁY QUAY" },
  { id: "2", name: "THIẾT BỊ ÁNH SÁNG" },
  { id: "3", name: "NHÂN SỰ & DI CHUYỂN & PHÁT SINH" },
];

// Sample data for equipment
const sampleEquipments: Equipment[] = [
  // Máy quay
  { id: "1", name: "SONY FX3 (Body)", category: "1", dailyRate: 1400000, quantity: 3, isAvailable: true },
  { id: "2", name: "SONY FE 70-200mm F2.8 GM", category: "1", dailyRate: 500000, quantity: 3, isAvailable: true },
  { id: "3", name: "SONY FE 85mm F1.4 GM", category: "1", dailyRate: 500000, quantity: 1, isAvailable: true },
  { id: "4", name: "Gimbal DJI Ronin S3 Pro", category: "1", dailyRate: 400000, quantity: 2, isAvailable: true },
  { id: "5", name: "Tripod Secced (100)", category: "1", dailyRate: 300000, quantity: 6, isAvailable: true },
  { id: "6", name: "NISI 82mm Variable ND Filter 1-5 STOP", category: "1", dailyRate: 200000, quantity: 3, isAvailable: true },
  { id: "7", name: 'Monitor Director 18" (4 input)', category: "1", dailyRate: 800000, quantity: 1, isAvailable: true },
  { id: "8", name: 'Monitor 5"', category: "1", dailyRate: 300000, quantity: 3, isAvailable: true },
  
  // Ánh sáng
  { id: "9", name: "AMARAN F22C", category: "2", dailyRate: 500000, quantity: 6, isAvailable: true },
  { id: "10", name: "AMARAN T4C Tube Light", category: "2", dailyRate: 300000, quantity: 6, isAvailable: true },
  { id: "11", name: "ALMC Kit 4", category: "2", dailyRate: 1000000, quantity: 1, isAvailable: true },
  { id: "12", name: "Grips & Lighting Accessories (Pro Package)", category: "2", dailyRate: 500000, quantity: 1, isAvailable: true },
  
  // Nhân sự
  { id: "13", name: "Kỹ thuật đèn", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true },
  { id: "14", name: "Kỹ thuật máy", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true },
  { id: "15", name: "Phát sinh khác", category: "3", dailyRate: 0, quantity: 999, isAvailable: true },
  { id: "16", name: "Xe thiết bị", category: "3", dailyRate: 0, quantity: 999, isAvailable: true },
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
    
    // Update or create debt entry if status is "Đang thuê"
    if (data.status === "Đang thuê") {
      const existingDebtIndex = debts.findIndex(debt => debt.relatedOrderId === selectedRental.id);
      
      if (existingDebtIndex !== -1) {
        // Update existing debt
        const updatedDebts = [...debts];
        updatedDebts[existingDebtIndex] = {
          ...updatedDebts[existingDebtIndex],
          amount: balance,
          customerName: customer.name,
          contact: customer.contact,
          dueDate: new Date(new Date(format(data.endDate, "yyyy-MM-dd")).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        setDebts(updatedDebts);
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
      title: "Cập nhật đơn hàng",
      description: `Đã cập nhật đơn hàng #${selectedRental.id}`,
    });
    
    editForm.reset();
    setSelectedItems([]);
    setIsEditDialogOpen(false);
    setSelectedRental(null);
  };

  const onHandoverSubmit = (data: HandoverFormValues) => {
    if (!selectedRental) return;
    
    // Create new handover report
    const newHandoverReport: HandoverReport = {
      id: handoverReports.length + 1,
      rentalId: selectedRental.id,
      customerName: selectedRental.customerName,
      date: new Date().toISOString().split('T')[0],
      items: selectedRental.items,
      notes: data.notes || "",
      signedByCustomer: data.signedByCustomer,
      signedByStaff: data.signedByStaff
    };
    
    setHandoverReports([...handoverReports, newHandoverReport]);
    
    // Update rental to mark handover as completed
    setRentals(prevRentals => 
      prevRentals.map(rental => 
        rental.id === selectedRental.id 
          ? { ...rental, handoverCompleted: true } 
          : rental
      )
    );
    
    toast({
      title: "Tạo biên bản bàn giao",
      description: `Đã tạo biên bản bàn giao cho đơn hàng #${selectedRental.id}`,
    });
    
    handoverForm.reset();
    setIsHandoverDialogOpen(false);
    setSelectedRental(null);
  };

  const onMaintenanceSubmit = (data: MaintenanceFormValues) => {
    if (!selectedEquipment) return;
    
    // Update equipment with maintenance info
    const updatedEquipments = equipments.map(equipment => 
      equipment.id === selectedEquipment.id 
        ? { 
            ...equipment, 
            maintenanceNotes: data.maintenanceNotes,
            maintenanceLocation: data.maintenanceLocation,
            isAvailable: false 
          } 
        : equipment
    );
    
    setEquipments(updatedEquipments);
    
    toast({
      title: "Cập nhật thông tin bảo trì",
      description: `Đã cập nhật thông tin bảo trì cho thiết bị ${selectedEquipment.name}`,
    });
    
    maintenanceForm.reset();
    setIsMaintenanceDialogOpen(false);
    setSelectedEquipment(null);
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
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo đơn hàng thuê mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin đơn hàng thuê mới vào form bên dưới.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
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
                                  className={cn("p-3 pointer-events-auto")}
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
                                  className={cn("p-3 pointer-events-auto")}
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
                      
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giảm giá (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
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
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Nhập ghi chú về đơn hàng (nếu có)..." 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Thiết bị thuê</h3>
                    
                    <div className="border rounded-md p-4">
                      <Tabs defaultValue="1" className="w-full">
                        <TabsList className="w-full">
                          {equipmentCategories.map(category => (
                            <TabsTrigger key={category.id} value={category.id} className="flex-1">
                              {category.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {equipmentCategories.map(category => (
                          <TabsContent key={category.id} value={category.id} className="mt-4 space-y-2">
                            {equipments
                              .filter(eq => eq.category === category.id && eq.isAvailable)
                              .map(equipment => (
                                <div key={equipment.id} className="flex justify-between items-center border-b pb-2">
                                  <div>
                                    <p className="font-medium">{equipment.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatCurrency(equipment.dailyRate)}/ngày
                                    </p>
                                    {equipment.maintenanceNotes && (
                                      <p className="text-xs text-red-500">
                                        <Wrench className="inline-block mr-1 h-3 w-3" />
                                        Đang bảo trì: {equipment.maintenanceLocation}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleMaintenanceDialog(equipment)}
                                    >
                                      <Wrench className="h-4 w-4 mr-1" /> Bảo trì
                                    </Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => addEquipment(equipment)}
                                      disabled={!equipment.isAvailable}
                                    >
                                      <PlusCircle className="h-4 w-4 mr-1" /> Thêm
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Danh sách thiết bị đã chọn</h4>
                      
                      {selectedItems.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Chưa có thiết bị nào được chọn</p>
                      ) : (
                        <div className="space-y-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Thiết bị</TableHead>
                                <TableHead className="text-center">Số lượng</TableHead>
                                <TableHead className="text-center">Số ngày</TableHead>
                                <TableHead className="text-right">Đơn giá/ngày</TableHead>
                                <TableHead className="text-center">Giảm giá (%)</TableHead>
                                <TableHead className="text-right">Thành tiền</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedItems.map(item => {
                                const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
                                const isDiscountable = equipment && (equipment.category === "1" || equipment.category === "2");
                                
                                return (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.equipmentName}</TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center">
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => updateEquipmentQuantity(item.id, item.quantity - 1)}
                                        >
                                          <MinusCircle className="h-3 w-3" />
                                        </Button>
                                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => updateEquipmentQuantity(item.id, item.quantity + 1)}
                                        >
                                          <PlusCircle className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">{item.days}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.dailyRate)}</TableCell>
                                    <TableCell className="text-center">
                                      {isDiscountable ? (
                                        <Input 
                                          type="number" 
                                          min="0" 
                                          max="100" 
                                          className="w-16 h-7 text-center mx-auto" 
                                          value={item.discount || 0}
                                          onChange={(e) => updateEquipmentDiscount(item.id, Number(e.target.value))}
                                        />
                                      ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                                    <TableCell>
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6"
                                        onClick={() => removeEquipment(item.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Tổng khấu hao (60% giá thiết bị):
                                </TableCell>
                                <TableCell colSpan={2} className="text-right font-bold">
                                  {formatCurrency(calculateTotalDepreciation(selectedItems))}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Tổng cộng:
                                </TableCell>
                                <TableCell colSpan={2} className="text-right font-bold">
                                  {formatCurrency(calculateDiscountedTotal(selectedItems))}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Đặt cọc:
                                </TableCell>
                                <TableCell colSpan={2} className="text-right font-bold">
                                  {form.watch("deposit") ? formatCurrency(form.watch("deposit")) : formatCurrency(0)}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Còn lại:
                                </TableCell>
                                <TableCell colSpan={2} className="text-right font-bold">
                                  {formatCurrency(calculateDiscountedTotal(selectedItems) - (form.watch("deposit") || 0))}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                    setSelectedItems([]);
                  }} type="button">Hủy</Button>
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
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Số ngày</TableHead>
                <TableHead>Thiết bị</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right">Đặt cọc</TableHead>
                <TableHead className="text-right">Còn lại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Bàn giao</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id}</TableCell>
                  <TableCell className="font-medium">{rental.customerName}</TableCell>
                  <TableCell>{formatDate(rental.startDate)}</TableCell>
                  <TableCell>{formatDate(rental.endDate)}</TableCell>
                  <TableCell>{calculateDaysBetween(rental.startDate, rental.endDate)} ngày</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {rental.items.map(item => item.equipmentName).join(", ")}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(rental.totalAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rental.deposit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rental.balance)}</TableCell>
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
                  <TableCell>
                    {rental.handoverCompleted ? (
                      <span className="inline-flex items-center text-green-600">
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Đã bàn giao
                      </span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCreateHandover(rental)}
                      >
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                        Bàn giao
                      </Button>
                    )}
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
                          <FileEdit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewQuote(rental)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Xem báo giá
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCreateHandover(rental)} disabled={rental.handoverCompleted}>
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          Tạo biên bản bàn giao
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Đặt trước")}>
                          Đặt trước
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Đang thuê")}>
                          Đang thuê
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Hoàn thành")}>
                          Hoàn thành
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "Đã hủy")}>
                          Đã hủy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteRental(rental.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Dialog chỉnh sửa đơn hàng */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đơn hàng thuê</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin đơn hàng thuê.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khách hàng</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
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
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
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
                                className={cn("p-3 pointer-events-auto")}
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
                      control={editForm.control}
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
                    
                    <FormField
                      control={editForm.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giảm giá (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
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
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                  
                  <FormField
                    control={editForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập ghi chú về đơn hàng (nếu có)..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thiết bị thuê</h3>
                  
                  <div className="border rounded-md p-4">
                    <Tabs defaultValue="1" className="w-full">
                      <TabsList className="w-full">
                        {equipmentCategories.map(category => (
                          <TabsTrigger key={category.id} value={category.id} className="flex-1">
                            {category.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {equipmentCategories.map(category => (
                        <TabsContent key={category.id} value={category.id} className="mt-4 space-y-2">
                          {equipments
                            .filter(eq => eq.category === category.id && eq.isAvailable)
                            .map(equipment => (
                              <div key={equipment.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                  <p className="font-medium">{equipment.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCurrency(equipment.dailyRate)}/ngày
                                  </p>
                                  {equipment.maintenanceNotes && (
                                    <p className="text-xs text-red-500">
                                      <Wrench className="inline-block mr-1 h-3 w-3" />
                                      Đang bảo trì: {equipment.maintenanceLocation}
                                    </p>
                                  )}
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addEquipment(equipment)}
                                  disabled={!equipment.isAvailable}
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" /> Thêm
                                </Button>
                              </div>
                            ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Danh sách thiết bị đã chọn</h4>
                    
                    {selectedItems.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Chưa có thiết bị nào được chọn</p>
                    ) : (
                      <div className="space-y-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Thiết bị</TableHead>
                              <TableHead className="text-center">Số lượng</TableHead>
                              <TableHead className="text-center">Số ngày</TableHead>
                              <TableHead className="text-right">Đơn giá/ngày</TableHead>
                              <TableHead className="text-center">Giảm giá (%)</TableHead>
                              <TableHead className="text-right">Thành tiền</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedItems.map(item => {
                              const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
                              const isDiscountable = equipment && (equipment.category === "1" || equipment.category === "2");
                              
                              return (
                                <TableRow key={item.id}>
                                  <TableCell>{item.equipmentName}</TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-6 w-6"
                                        onClick={() => updateEquipmentQuantity(item.id, item.quantity - 1)}
                                      >
                                        <MinusCircle className="h-3 w-3" />
                                      </Button>
                                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-6 w-6"
                                        onClick={() => updateEquipmentQuantity(item.id, item.quantity + 1)}
                                      >
                                        <PlusCircle className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">{item.days}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(item.dailyRate)}</TableCell>
                                  <TableCell className="text-center">
                                    {isDiscountable ? (
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        max="100" 
                                        className="w-16 h-7 text-center mx-auto" 
                                        value={item.discount || 0}
                                        onChange={(e) => updateEquipmentDiscount(item.id, Number(e.target.value))}
                                      />
                                    ) : (
                                      <span className="text-muted-foreground">N/A</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                                  <TableCell>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={() => removeEquipment(item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Tổng khấu hao (60% giá thiết bị):
                              </TableCell>
                              <TableCell colSpan={2} className="text-right font-bold">
                                {formatCurrency(calculateTotalDepreciation(selectedItems))}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Tổng cộng:
                              </TableCell>
                              <TableCell colSpan={2} className="text-right font-bold">
                                {formatCurrency(calculateDiscountedTotal(selectedItems))}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Đặt cọc:
                              </TableCell>
                              <TableCell colSpan={2} className="text-right font-bold">
                                {editForm.watch("deposit") ? formatCurrency(editForm.watch("deposit")) : formatCurrency(0)}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Còn lại:
                              </TableCell>
                              <TableCell colSpan={2} className="text-right font-bold">
                                {formatCurrency(calculateDiscountedTotal(selectedItems) - (editForm.watch("deposit") || 0))}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedItems([]);
                  setSelectedRental(null);
                }} type="button">Hủy</Button>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog biên bản bàn giao */}
      <Dialog open={isHandoverDialogOpen} onOpenChange={setIsHandoverDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Biên bản bàn giao thiết bị</DialogTitle>
            <DialogDescription>
              Tạo biên bản bàn giao thiết bị cho đơn hàng #{selectedRental?.id}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...handoverForm}>
            <form onSubmit={handoverForm.handleSubmit(onHandoverSubmit)} className="space-y-4">
              {selectedRental && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Thông tin khách hàng</h4>
                      <p>{selectedRental.customerName}</p>
                      <p className="text-sm text-muted-foreground">{selectedRental.contact}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Thời gian thuê</h4>
                      <p>Từ: {formatDate(selectedRental.startDate)}</p>
                      <p>Đến: {formatDate(selectedRental.endDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Danh sách thiết bị</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thiết bị</TableHead>
                          <TableHead className="text-center">Số lượng</TableHead>
                          <TableHead className="text-right">Đơn giá/ngày</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRental.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.equipmentName}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.dailyRate)}</TableCell>
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
                        <FormLabel>Ghi chú bàn giao</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập ghi chú về tình trạng thiết bị khi bàn giao..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={handoverForm.control}
                      name="signedByCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="form-checkbox h-5 w-5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Khách hàng đã ký</FormLabel>
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
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="form-checkbox h-5 w-5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Nhân viên đã ký</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsHandoverDialogOpen(false);
                  setSelectedRental(null);
                }} type="button">Hủy</Button>
                <Button type="submit">Xác nhận bàn giao</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog maintenance */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thông tin bảo trì thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bảo trì cho thiết bị {selectedEquipment?.name}
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
                      <Textarea 
                        placeholder="Mô tả tình trạng thiết bị, lý do bảo trì..." 
                        className="resize-none" 
                        {...field} 
                      />
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
                    <FormControl>
                      <Input 
                        placeholder="Nhập địa điểm thiết bị đang bảo trì" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsMaintenanceDialogOpen(false);
                  setSelectedEquipment(null);
                }} type="button">Hủy</Button>
                <Button type="submit">Lưu thông tin</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog hiển thị thông tin báo giá */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>BẢNG BÁO GIÁ</span>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <FileText className="mr-2 h-4 w-4" />
                In báo giá
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRental && (
            <div className="space-y-6 print:p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xl">
                      92
                    </div>
                    <div>
                      <h3 className="font-bold">92 STUDIO</h3>
                      <p className="text-sm">Số 4B Ngách 10 Ngõ 814 Đường Láng, Đống Đa, HN</p>
                      <p className="text-sm">SĐT: 0943655995 (TUẤN)</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <p><span className="font-medium">Người làm báo giá:</span> Mr Tuấn</p>
                  <p><span className="font-medium">Dịch vụ:</span> Cung cấp thiết bị quay & nhân sự</p>
                  <p><span className="font-medium">Ngày làm báo giá:</span> {format(new Date(), "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Khách hàng:</span> {selectedRental.customerName}</p>
                  <p><span className="font-medium">Ngày:</span> {format(new Date(), "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="text-center w-[60px]">STT</TableHead>
                      <TableHead>NỘI DUNG</TableHead>
                      <TableHead className="text-center w-[100px]">SỐ LƯỢNG</TableHead>
                      <TableHead className="text-center w-[100px]">SỐ NGÀY</TableHead>
                      <TableHead className="text-right w-[120px]">ĐƠN GIÁ / NGÀY (VNĐ)</TableHead>
                      <TableHead className="text-center w-[80px]">GIẢM GIÁ (%)</TableHead>
                      <TableHead className="text-right w-[150px]">THÀNH TIỀN (VNĐ)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentCategories.map(category => {
                      const categoryItems = selectedRental.items.filter(item => {
                        const equipment = sampleEquipments.find(eq => eq.id === item.equipmentId);
                        return equipment && equipment.category === category.id;
                      });
                      
                      if (categoryItems.length === 0) return null;
                      
                      return (
                        <Fragment key={category.id}>
                          <TableRow className="bg-amber-50">
                            <TableCell colSpan={7} className="font-bold text-center py-2">
                              {category.name}
                            </TableCell>
                          </TableRow>
                          
                          {categoryItems.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-center">{index + 1}</TableCell>
                              <TableCell>{item.equipmentName}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-center">{item.days}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.dailyRate)}</TableCell>
                              <TableCell className="text-center">
                                {item.discount ? `${item.discount}%` : "-"}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                            </TableRow>
                          ))}
                        </Fragment>
                      );
                    })}
                    
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={6} className="font-bold text-right">
                        TỔNG CHI PHÍ THIẾT BỊ
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(selectedRental.totalAmount)}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={6} className="font-bold text-right">
                        GIẢM GIÁ
                      </TableCell>
                      <TableCell className="text-right">
                        {selectedRental.discount ? `${selectedRental.discount}%` : "0%"}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow className="bg-amber-50">
                      <TableCell colSpan={6} className="font-bold text-right">
                        TỔNG CHI PHÍ CẦN THANH TOÁN
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(selectedRental.totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium italic">*Cách tính các chi phí phát sinh như sau:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Kỹ thuật làm OT từ sau 22h đến 24h sẽ tính 0.5 công.</li>
                    <li>Từ 00:00 đến 01:59 tính thêm 1.0 công.</li>
                    <li>Sau 02:00 đến 03:59 tính thêm 1.5 công.</li>
                    <li>Sau 04:00 cho tới hết ca tính thêm 2.0 công.</li>
                  </ul>
                  <p>Thời hạn thanh toán tối đa là 14 ngày kể từ khi kết thúc ngày quay trong báo giá.</p>
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium italic text-red-600">*Lưu ý:</p>
                  <ul className="list-disc pl-5 space-y-1 text-red-600">
                    <li>VUI LÒNG KIỂM TRA KỸ THÔNG TIN THIẾT BỊ TRONG BÁO GIÁ.</li>
                    <li>KHÔNG ĐƯỢC GIẢM GIÁ NẾU YÊU CẦU XUẤT HÓA ĐƠN GTGT.</li>
                    <li>CHỈ XUẤT HÓA ĐƠN GTGT (VAT) CHO CÁC BÁO GIÁ CÓ GIÁ TRỊ LỚN HƠN 10.000.000đ</li>
                  </ul>
                  <p className="font-medium mt-4">Phương thức thanh toán:</p>
                  <p>MB BANK - STK: 0913830013</p>
                  <p>Chủ TK: NGUYỄN TẤN SINH</p>
                  <p className="mt-2">Nội dung CK:</p>
                  <p>"TÊN KHÁCH HÀNG + NGÀY THUÊ THIẾT BỊ"</p>
                </div>
              </div>
              
              <div className="text-center font-bold text-lg border-t pt-4">
                LƯU Ý: BÁO GIÁ TRÊN CHƯA BAO GỒM THUẾ GTGT & <span className="text-red-600">KHÔNG ĐƯỢC GIẢM GIÁ NẾU YÊU CẦU XUẤT HÓA ĐƠN GTGT.</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rentals;

