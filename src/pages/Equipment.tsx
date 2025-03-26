
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileEdit, 
  PlusCircle, 
  Search, 
  Wrench, 
  TrendingDown,
  Archive,
  Tag,
  Camera,
  Lightbulb,
  Users 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Định nghĩa interfaces
interface Equipment {
  id: number;
  name: string;
  category: string;
  serialNumber: string;
  dailyRate: number;
  status: "Sẵn sàng" | "Đang thuê" | "Bảo trì";
  condition: string;
  purchasePrice?: number;
  purchaseDate?: string;
  rentalCount: number;
  equipmentType: 'camera' | 'lighting' | 'personnel' | 'other';
  maintenanceLocation?: string;
}

interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  date: string;
  description: string;
  cost: number;
  resolved: boolean;
  location?: string;
}

// Dữ liệu mẫu cho thiết bị
const sampleEquipment: Equipment[] = [
  {
    id: 1,
    name: "Máy quay Canon C300",
    category: "Máy quay",
    serialNumber: "CN12345678",
    dailyRate: 2500000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 150000000,
    purchaseDate: "2022-05-15",
    rentalCount: 25,
    equipmentType: 'camera'
  },
  {
    id: 2,
    name: "Bộ đèn LED Aputure 120D II",
    category: "Ánh sáng",
    serialNumber: "AP98765432",
    dailyRate: 800000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 25000000,
    purchaseDate: "2022-08-20",
    rentalCount: 18,
    equipmentType: 'lighting'
  },
  {
    id: 3,
    name: "Gimbal DJI Ronin-S",
    category: "Phụ kiện",
    serialNumber: "DJI56781234",
    dailyRate: 500000,
    status: "Đang thuê",
    condition: "Tốt",
    purchasePrice: 15000000,
    purchaseDate: "2022-03-10",
    rentalCount: 30,
    equipmentType: 'camera'
  },
  {
    id: 4,
    name: "Ống kính Sony G Master 24-70mm",
    category: "Ống kính",
    serialNumber: "SNY45678912",
    dailyRate: 700000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 45000000,
    purchaseDate: "2022-07-05",
    rentalCount: 15,
    equipmentType: 'camera'
  },
  {
    id: 5,
    name: "Microphone Rode NTG4+",
    category: "Âm thanh",
    serialNumber: "RD87654321",
    dailyRate: 350000,
    status: "Bảo trì",
    condition: "Cần sửa chữa",
    purchasePrice: 8000000,
    purchaseDate: "2022-01-30",
    rentalCount: 22,
    equipmentType: 'camera'
  },
  {
    id: 6,
    name: "Kỹ thuật viên máy quay",
    category: "Nhân sự",
    serialNumber: "STAFF001",
    dailyRate: 1000000,
    status: "Sẵn sàng",
    condition: "N/A",
    rentalCount: 40,
    equipmentType: 'personnel'
  },
  {
    id: 7,
    name: "Kỹ thuật viên ánh sáng",
    category: "Nhân sự",
    serialNumber: "STAFF002",
    dailyRate: 800000,
    status: "Sẵn sàng",
    condition: "N/A",
    rentalCount: 35,
    equipmentType: 'personnel'
  },
  {
    id: 8,
    name: "Xe vận chuyển thiết bị",
    category: "Di chuyển",
    serialNumber: "VH001",
    dailyRate: 1500000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 500000000,
    purchaseDate: "2021-10-15",
    rentalCount: 60,
    equipmentType: 'personnel'
  }
];

// Dữ liệu mẫu cho lịch sử bảo trì
const sampleMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 1,
    equipmentId: 5,
    equipmentName: "Microphone Rode NTG4+",
    date: "2023-08-15",
    description: "Mic không hoạt động, cần thay cáp kết nối",
    cost: 500000,
    resolved: false,
    location: "Xưởng sửa chữa Minh Phát"
  },
  {
    id: 2,
    equipmentId: 1,
    equipmentName: "Máy quay Canon C300",
    date: "2023-06-20",
    description: "Bảo trì định kỳ, vệ sinh cảm biến",
    cost: 1200000,
    resolved: true,
    location: "Trung tâm bảo hành Canon"
  },
  {
    id: 3,
    equipmentId: 3,
    equipmentName: "Gimbal DJI Ronin-S",
    date: "2023-07-05",
    description: "Cân chỉnh lại motor, thay pin",
    cost: 800000,
    resolved: true,
    location: "Trung tâm bảo hành DJI"
  }
];

// Hàm tính khấu hao
const calculateDepreciation = (equipment: Equipment) => {
  if (!equipment.purchasePrice) return 0;
  
  // Khấu hao máy là 60% giá cho thuê máy trên 1 ngày
  if (equipment.equipmentType === 'camera' || equipment.equipmentType === 'lighting') {
    return equipment.dailyRate * 0.6;
  }
  
  // Cách tính khấu hao cũ dựa trên thời gian
  const purchaseDate = new Date(equipment.purchaseDate || new Date());
  const currentDate = new Date();
  const monthsDiff = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                     (currentDate.getMonth() - purchaseDate.getMonth());
  
  // Giả sử thời gian khấu hao là 36 tháng (3 năm)
  const depreciationRate = 1 / 36;
  const totalDepreciation = Math.min(monthsDiff * depreciationRate, 1) * equipment.purchasePrice;
  
  return totalDepreciation;
};

// Hàm tính giá trị hiện tại của thiết bị
const getCurrentValue = (equipment: Equipment) => {
  if (!equipment.purchasePrice) return 0;
  return equipment.purchasePrice - calculateDepreciation(equipment);
};

const Equipment = () => {
  const [activeTab, setActiveTab] = useState("equipment");
  const [searchTerm, setSearchTerm] = useState("");
  const [equipment, setEquipment] = useState<Equipment[]>(sampleEquipment);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(sampleMaintenanceRecords);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  // Lọc thiết bị theo từ khóa tìm kiếm và loại thiết bị
  const filteredEquipment = equipment.filter(item => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo loại thiết bị
    const matchesType = 
      equipmentTypeFilter === "all" || 
      (equipmentTypeFilter === "camera" && item.equipmentType === "camera") ||
      (equipmentTypeFilter === "lighting" && item.equipmentType === "lighting") ||
      (equipmentTypeFilter === "personnel" && item.equipmentType === "personnel");
    
    return matchesSearch && matchesType;
  });

  // Lọc thiết bị đang bảo trì
  const maintenanceEquipment = equipment.filter(item => item.status === "Bảo trì");

  // Lọc lịch sử bảo trì theo từ khóa tìm kiếm
  const filteredMaintenanceRecords = maintenanceRecords.filter(record => 
    record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.location && record.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hàm thêm thiết bị mới
  const addEquipment = (newEquipment: Partial<Equipment>) => {
    const newId = equipment.length > 0 
      ? Math.max(...equipment.map(e => e.id)) + 1 
      : 1;
    
    setEquipment([...equipment, { 
      id: newId, 
      name: newEquipment.name || "",
      category: newEquipment.category || "",
      serialNumber: newEquipment.serialNumber || "",
      dailyRate: newEquipment.dailyRate || 0,
      status: "Sẵn sàng",
      condition: newEquipment.condition || "Tốt",
      purchasePrice: newEquipment.purchasePrice,
      purchaseDate: newEquipment.purchaseDate,
      rentalCount: 0,
      equipmentType: newEquipment.equipmentType || 'other'
    }]);
  };

  // Hàm cập nhật thiết bị
  const updateEquipment = (updatedEquipment: Equipment) => {
    setEquipment(
      equipment.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq)
    );
  };

  // Hàm thêm bản ghi bảo trì
  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, "id">) => {
    const newId = maintenanceRecords.length > 0 
      ? Math.max(...maintenanceRecords.map(r => r.id)) + 1 
      : 1;
    
    const newRecord = { ...record, id: newId };
    setMaintenanceRecords([...maintenanceRecords, newRecord]);
    
    // Cập nhật trạng thái thiết bị thành "Bảo trì"
    if (record.equipmentId) {
      setEquipment(
        equipment.map(eq => 
          eq.id === record.equipmentId 
            ? { ...eq, status: "Bảo trì", condition: "Cần sửa chữa", maintenanceLocation: record.location } 
            : eq
        )
      );
    }
  };

  // Hàm cập nhật bản ghi bảo trì
  const resolveMaintenanceRecord = (recordId: number) => {
    const updatedRecords = maintenanceRecords.map(record => 
      record.id === recordId ? { ...record, resolved: true } : record
    );
    setMaintenanceRecords(updatedRecords);
    
    // Tìm thiết bị tương ứng và cập nhật trạng thái
    const record = maintenanceRecords.find(r => r.id === recordId);
    if (record) {
      setEquipment(
        equipment.map(eq => 
          eq.id === record.equipmentId 
            ? { ...eq, status: "Sẵn sàng", condition: "Tốt", maintenanceLocation: undefined } 
            : eq
        )
      );
    }
    
    toast({
      title: "Đã hoàn thành bảo trì",
      description: "Thiết bị đã được cập nhật về trạng thái sẵn sàng",
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa thiết bị
  const handleEditEquipment = (id: number) => {
    const equipToEdit = equipment.find(eq => eq.id === id);
    if (equipToEdit) {
      setSelectedEquipment(equipToEdit);
      setIsEquipmentDialogOpen(true);
    }
  };

  // Hàm xử lý đánh dấu thiết bị cần bảo trì
  const handleMarkForMaintenance = (id: number) => {
    const equipToMaintain = equipment.find(eq => eq.id === id);
    if (equipToMaintain) {
      setSelectedEquipment(equipToMaintain);
      setIsMaintenanceDialogOpen(true);
    }
  };

  // Hàm render icon dựa vào loại thiết bị
  const renderEquipmentTypeIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <Camera className="h-4 w-4 mr-2" />;
      case 'lighting':
        return <Lightbulb className="h-4 w-4 mr-2" />;
      case 'personnel':
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return <Tag className="h-4 w-4 mr-2" />;
    }
  };

  // Function to get human-readable equipment type name
  const getEquipmentTypeName = (type: string): string => {
    switch (type) {
      case 'camera':
        return 'Thiết bị máy quay';
      case 'lighting':
        return 'Thiết bị ánh sáng';
      case 'personnel':
        return 'Nhân sự - Di chuyển - Phát sinh';
      default:
        return 'Khác';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thiết bị</h2>
        
        <div className="flex space-x-2">
          <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Báo cáo bảo trì
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Báo cáo bảo trì thiết bị</DialogTitle>
                <DialogDescription>
                  Nhập thông tin về vấn đề của thiết bị cần bảo trì
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                // Nếu người dùng chọn thiết bị trước đó
                let equipmentId = selectedEquipment?.id;
                let equipmentName = selectedEquipment?.name;
                
                // Nếu người dùng chọn thiết bị từ dropdown
                const selectedId = formData.get('equipmentId');
                if (selectedId) {
                  const equip = equipment.find(e => e.id === Number(selectedId));
                  if (equip) {
                    equipmentId = equip.id;
                    equipmentName = equip.name;
                  }
                }
                
                addMaintenanceRecord({
                  equipmentId: equipmentId || 0,
                  equipmentName: equipmentName || "",
                  date: formData.get('date') as string,
                  description: formData.get('description') as string,
                  cost: Number(formData.get('cost')),
                  location: formData.get('location') as string,
                  resolved: false
                });
                
                setSelectedEquipment(null);
                setIsMaintenanceDialogOpen(false);
                
                toast({
                  title: "Đã tạo yêu cầu bảo trì",
                  description: "Thiết bị đã được đánh dấu cần bảo trì",
                });
              }}>
                <div className="grid gap-4 py-4">
                  {!selectedEquipment && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="equipmentId" className="text-right">
                        Thiết bị
                      </Label>
                      <select 
                        id="equipmentId" 
                        name="equipmentId" 
                        className="col-span-3 w-full border border-input bg-background px-3 py-2 rounded-md"
                        required
                      >
                        <option value="">Chọn thiết bị</option>
                        {equipment.map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} (SN: {eq.serialNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {selectedEquipment && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Thiết bị</Label>
                      <div className="col-span-3">
                        <span className="font-medium">{selectedEquipment.name}</span>
                        <span className="text-sm text-muted-foreground block">
                          SN: {selectedEquipment.serialNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Ngày bảo trì
                    </Label>
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      className="col-span-3" 
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Mô tả vấn đề
                    </Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      className="col-span-3" 
                      required
                      placeholder="Mô tả chi tiết vấn đề của thiết bị"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Vị trí bảo trì
                    </Label>
                    <Input 
                      id="location" 
                      name="location" 
                      className="col-span-3" 
                      required
                      placeholder="Địa điểm đang sửa chữa thiết bị"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Chi phí dự kiến
                    </Label>
                    <Input 
                      id="cost" 
                      name="cost" 
                      type="number" 
                      className="col-span-3" 
                      required
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => {
                    setSelectedEquipment(null);
                    setIsMaintenanceDialogOpen(false);
                  }}>
                    Hủy
                  </Button>
                  <Button type="submit">Tạo báo cáo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm thiết bị
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedEquipment ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}</DialogTitle>
                <DialogDescription>
                  {selectedEquipment ? "Chỉnh sửa thông tin thiết bị" : "Nhập thông tin thiết bị mới vào form bên dưới"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const equipmentData = {
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  serialNumber: formData.get('serialNumber') as string,
                  dailyRate: Number(formData.get('dailyRate')),
                  condition: formData.get('condition') as string,
                  purchasePrice: Number(formData.get('purchasePrice')) || undefined,
                  purchaseDate: (formData.get('purchaseDate') as string) || undefined,
                  equipmentType: formData.get('equipmentType') as 'camera' | 'lighting' | 'personnel' | 'other'
                };
                
                if (selectedEquipment) {
                  // Cập nhật thiết bị
                  const updatedEquipment = {
                    ...selectedEquipment,
                    ...equipmentData
                  };
                  updateEquipment(updatedEquipment);
                  toast({
                    title: "Đã cập nhật thiết bị",
                    description: `Thiết bị ${equipmentData.name} đã được cập nhật`,
                  });
                } else {
                  // Thêm mới
                  addEquipment(equipmentData);
                  toast({
                    title: "Thiết bị đã được thêm",
                    description: "Thiết bị mới đã được thêm vào danh sách",
                  });
                }
                
                setSelectedEquipment(null);
                setIsEquipmentDialogOpen(false);
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên thiết bị
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      className="col-span-3" 
                      required 
                      defaultValue={selectedEquipment?.name || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="equipmentType" className="text-right">
                      Phân loại
                    </Label>
                    <select 
                      id="equipmentType" 
                      name="equipmentType" 
                      className="col-span-3 w-full border border-input bg-background px-3 py-2 rounded-md"
                      required 
                      defaultValue={selectedEquipment?.equipmentType || "camera"}
                    >
                      <option value="camera">Thiết bị máy quay</option>
                      <option value="lighting">Thiết bị ánh sáng</option>
                      <option value="personnel">Nhân sự - Di chuyển - Phát sinh</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Danh mục
                    </Label>
                    <Input 
                      id="category" 
                      name="category" 
                      className="col-span-3" 
                      required 
                      defaultValue={selectedEquipment?.category || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="serialNumber" className="text-right">
                      Số serial
                    </Label>
                    <Input 
                      id="serialNumber" 
                      name="serialNumber" 
                      className="col-span-3" 
                      required 
                      defaultValue={selectedEquipment?.serialNumber || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dailyRate" className="text-right">
                      Giá thuê/ngày
                    </Label>
                    <Input 
                      id="dailyRate" 
                      name="dailyRate" 
                      type="number" 
                      className="col-span-3" 
                      required 
                      defaultValue={selectedEquipment?.dailyRate || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right">
                      Tình trạng
                    </Label>
                    <Input 
                      id="condition" 
                      name="condition" 
                      className="col-span-3" 
                      defaultValue={selectedEquipment?.condition || "Tốt"} 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purchasePrice" className="text-right">
                      Giá mua
                    </Label>
                    <Input 
                      id="purchasePrice" 
                      name="purchasePrice" 
                      type="number" 
                      className="col-span-3"
                      defaultValue={selectedEquipment?.purchasePrice || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purchaseDate" className="text-right">
                      Ngày mua
                    </Label>
                    <Input 
                      id="purchaseDate" 
                      name="purchaseDate" 
                      type="date" 
                      className="col-span-3"
                      defaultValue={selectedEquipment?.purchaseDate || ""}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setSelectedEquipment(null);
                    setIsEquipmentDialogOpen(false);
                  }} type="button">
                    Hủy
                  </Button>
                  <Button type="submit">
                    {selectedEquipment ? "Cập nhật" : "Lưu thiết bị"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-auto">
          <TabsTrigger value="equipment">Danh sách thiết bị</TabsTrigger>
          <TabsTrigger value="maintenance">
            Bảo trì
            {maintenanceEquipment.length > 0 && (
              <span className="ml-2 rounded-full bg-destructive w-5 h-5 text-xs flex items-center justify-center text-destructive-foreground">
                {maintenanceEquipment.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="depreciation">Khấu hao</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thiết bị</CardTitle>
              <CardDescription>
                Quản lý tất cả thiết bị cho thuê của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm thiết bị..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={equipmentTypeFilter} onValueChange={setEquipmentTypeFilter}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Lọc theo loại thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thiết bị</SelectItem>
                    <SelectItem value="camera">Thiết bị máy quay</SelectItem>
                    <SelectItem value="lighting">Thiết bị ánh sáng</SelectItem>
                    <SelectItem value="personnel">Nhân sự - Di chuyển - Phát sinh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Camera Equipment */}
              {(equipmentTypeFilter === "all" || equipmentTypeFilter === "camera") && 
                filteredEquipment.some(item => item.equipmentType === "camera") && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Camera className="mr-2 h-5 w-5" />
                    Thiết bị máy quay
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên thiết bị</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Số serial</TableHead>
                          <TableHead>Giá thuê/ngày</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Tình trạng</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipment
                          .filter(item => item.equipmentType === "camera")
                          .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                item.status === "Sẵn sàng" 
                                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                                  : item.status === "Đang thuê"
                                    ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                    : "bg-red-50 text-red-700 ring-red-600/20"
                              }`}>
                                {item.status}
                                {item.status === "Bảo trì" && item.maintenanceLocation && 
                                  ` - ${item.maintenanceLocation}`}
                              </span>
                            </TableCell>
                            <TableCell>{item.condition}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <FileEdit className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditEquipment(item.id)}>
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // Toggle status
                                    const newStatus = item.status === "Sẵn sàng" ? "Đang thuê" : "Sẵn sàng";
                                    setEquipment(
                                      equipment.map(eq => 
                                        eq.id === item.id ? {...eq, status: newStatus} : eq
                                      )
                                    );
                                    toast({
                                      title: "Đã cập nhật trạng thái",
                                      description: `Thiết bị ${item.name} đã được chuyển sang ${newStatus}`,
                                    });
                                  }}>
                                    {item.status === "Sẵn sàng" ? "Đánh dấu đang thuê" : "Đánh dấu sẵn sàng"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleMarkForMaintenance(item.id)}>
                                    <Wrench className="h-4 w-4 mr-2" />
                                    Đánh dấu cần bảo trì
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setEquipment(equipment.filter(eq => eq.id !== item.id));
                                    toast({
                                      title: "Đã xóa thiết bị",
                                      description: `Thiết bị ${item.name} đã được xóa khỏi danh sách`,
                                      variant: "destructive"
                                    });
                                  }} className="text-destructive">
                                    Xóa thiết bị
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredEquipment.filter(item => item.equipmentType === "camera").length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                              Không có thiết bị máy quay nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* Lighting Equipment */}
              {(equipmentTypeFilter === "all" || equipmentTypeFilter === "lighting") && 
                filteredEquipment.some(item => item.equipmentType === "lighting") && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Thiết bị ánh sáng
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên thiết bị</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Số serial</TableHead>
                          <TableHead>Giá thuê/ngày</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Tình trạng</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipment
                          .filter(item => item.equipmentType === "lighting")
                          .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                item.status === "Sẵn sàng" 
                                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                                  : item.status === "Đang thuê"
                                    ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                    : "bg-red-50 text-red-700 ring-red-600/20"
                              }`}>
                                {item.status}
                                {item.status === "Bảo trì" && item.maintenanceLocation && 
                                  ` - ${item.maintenanceLocation}`}
                              </span>
                            </TableCell>
                            <TableCell>{item.condition}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <FileEdit className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditEquipment(item.id)}>
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // Toggle status
                                    const newStatus = item.status === "Sẵn sàng" ? "Đang thuê" : "Sẵn sàng";
                                    setEquipment(
                                      equipment.map(eq => 
                                        eq.id === item.id ? {...eq, status: newStatus} : eq
                                      )
                                    );
                                    toast({
                                      title: "Đã cập nhật trạng thái",
                                      description: `Thiết bị ${item.name} đã được chuyển sang ${newStatus}`,
                                    });
                                  }}>
                                    {item.status === "Sẵn sàng" ? "Đánh dấu đang thuê" : "Đánh dấu sẵn sàng"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleMarkForMaintenance(item.id)}>
                                    <Wrench className="h-4 w-4 mr-2" />
                                    Đánh dấu cần bảo trì
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setEquipment(equipment.filter(eq => eq.id !== item.id));
                                    toast({
                                      title: "Đã xóa thiết bị",
                                      description: `Thiết bị ${item.name} đã được xóa khỏi danh sách`,
                                      variant: "destructive"
                                    });
                                  }} className="text-destructive">
                                    Xóa thiết bị
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredEquipment.filter(item => item.equipmentType === "lighting").length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                              Không có thiết bị ánh sáng nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* Personnel & Others */}
              {(equipmentTypeFilter === "all" || equipmentTypeFilter === "personnel") && 
                filteredEquipment.some(item => item.equipmentType === "personnel") && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Nhân sự - Di chuyển - Phát sinh
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Mã</TableHead>
                          <TableHead>Giá thuê/ngày</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Ghi chú</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipment
                          .filter(item => item.equipmentType === "personnel")
                          .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.serialNumber}</TableCell>
                            <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                item.status === "Sẵn sàng" 
                                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                                  : item.status === "Đang thuê"
                                    ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                    : "bg-red-50 text-red-700 ring-red-600/20"
                              }`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell>{item.condition}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <FileEdit className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditEquipment(item.id)}>
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    // Toggle status
                                    const newStatus = item.status === "Sẵn sàng" ? "Đang thuê" : "Sẵn sàng";
                                    setEquipment(
                                      equipment.map(eq => 
                                        eq.id === item.id ? {...eq, status: newStatus} : eq
                                      )
                                    );
                                    toast({
                                      title: "Đã cập nhật trạng thái",
                                      description: `${item.name} đã được chuyển sang ${newStatus}`,
                                    });
                                  }}>
                                    {item.status === "Sẵn sàng" ? "Đánh dấu đang hoạt động" : "Đánh dấu sẵn sàng"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setEquipment(equipment.filter(eq => eq.id !== item.id));
                                    toast({
                                      title: "Đã xóa",
                                      description: `${item.name} đã được xóa khỏi danh sách`,
                                      variant: "destructive"
                                    });
                                  }} className="text-destructive">
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredEquipment.filter(item => item.equipmentType === "personnel").length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                              Không có nhân sự hoặc chi phí phát sinh nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredEquipment.length} trên tổng số {equipment.length} thiết bị
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Thiết bị đang bảo trì</CardTitle>
              <CardDescription>
                Quản lý thiết bị cần bảo trì, sửa chữa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm báo cáo bảo trì..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Ngày báo cáo</TableHead>
                    <TableHead>Mô tả vấn đề</TableHead>
                    <TableHead>Vị trí bảo trì</TableHead>
                    <TableHead>Chi phí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.equipmentName}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.location || "Chưa xác định"}</TableCell>
                      <TableCell>{record.cost.toLocaleString()}đ</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          record.resolved 
                            ? "bg-green-50 text-green-700 ring-green-600/20" 
                            : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}>
                          {record.resolved ? "Đã hoàn thành" : "Đang xử lý"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {!record.resolved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => resolveMaintenanceRecord(record.id)}
                          >
                            Đánh dấu hoàn thành
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMaintenanceRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Không có bản ghi bảo trì nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="depreciation">
          <Card>
            <CardHeader>
              <CardTitle>Theo dõi khấu hao thiết bị</CardTitle>
              <CardDescription>
                Quản lý khấu hao và giá trị hiện tại của thiết bị
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thiết bị..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số serial</TableHead>
                    <TableHead>Ngày mua</TableHead>
                    <TableHead>Giá mua</TableHead>
                    <TableHead>Giá thuê/ngày</TableHead>
                    <TableHead>Khấu hao/ngày</TableHead>
                    <TableHead>Giá trị hiện tại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment
                    .filter(item => item.purchasePrice && (item.equipmentType === 'camera' || item.equipmentType === 'lighting'))
                    .map((item) => {
                      const depreciation = calculateDepreciation(item);
                      const currentValue = getCurrentValue(item);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {renderEquipmentTypeIcon(item.equipmentType)}
                              {getEquipmentTypeName(item.equipmentType)}
                            </div>
                          </TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.purchaseDate}</TableCell>
                          <TableCell>{item.purchasePrice?.toLocaleString()}đ</TableCell>
                          <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                          <TableCell>{depreciation.toLocaleString()}đ</TableCell>
                          <TableCell>{currentValue.toLocaleString()}đ</TableCell>
                        </TableRow>
                      );
                    })}
                  {filteredEquipment.filter(item => item.purchasePrice && (item.equipmentType === 'camera' || item.equipmentType === 'lighting')).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Không có dữ liệu khấu hao
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Equipment;
