
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
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, Search, Wrench, Camera, Lightbulb, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipment } from "@/types/customer";
import { MaintenanceRecord, sampleEquipment, sampleMaintenanceRecords } from "@/data/equipmentData";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import MaintenanceForm from "@/components/equipment/MaintenanceForm";
import EquipmentTable from "@/components/equipment/EquipmentTable";
import MaintenanceTable from "@/components/equipment/MaintenanceTable";
import DepreciationTable from "@/components/equipment/DepreciationTable";

const EquipmentPage = () => {
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
      ? Math.max(...equipment.map(e => e.id as number)) + 1 
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
      equipmentType: newEquipment.equipmentType || 'other',
      quantity: 1,
      isAvailable: true
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

  // Hàm xóa thiết bị
  const handleDeleteEquipment = (id: number) => {
    const equipToDelete = equipment.find(eq => eq.id === id);
    if (equipToDelete) {
      setEquipment(equipment.filter(eq => eq.id !== id));
      toast({
        title: "Đã xóa thiết bị",
        description: `Thiết bị ${equipToDelete.name} đã được xóa khỏi danh sách`,
        variant: "destructive"
      });
    }
  };

  // Hàm chuyển đổi trạng thái thiết bị
  const handleToggleStatus = (id: number) => {
    const equipToToggle = equipment.find(eq => eq.id === id);
    if (equipToToggle) {
      const newStatus = equipToToggle.status === "Sẵn sàng" ? "Đang thuê" : "Sẵn sàng";
      setEquipment(
        equipment.map(eq => 
          eq.id === id ? {...eq, status: newStatus} : eq
        )
      );
      toast({
        title: "Đã cập nhật trạng thái",
        description: `Thiết bị ${equipToToggle.name} đã được chuyển sang ${newStatus}`,
      });
    }
  };

  // Xử lý khi lưu form thiết bị
  const handleSaveEquipment = (equipmentData: Partial<Equipment>) => {
    if (selectedEquipment) {
      // Cập nhật thiết bị
      const updatedEquipment = {
        ...selectedEquipment,
        ...equipmentData
      };
      updateEquipment(updatedEquipment);
    } else {
      // Thêm mới
      addEquipment(equipmentData);
    }
    
    setSelectedEquipment(null);
    setIsEquipmentDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thiết bị</h2>
        
        <div className="flex space-x-2">
          <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
            <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(true)}>
              <Wrench className="mr-2 h-4 w-4" />
              Báo cáo bảo trì
            </Button>
            <MaintenanceForm 
              equipment={equipment}
              selectedEquipment={selectedEquipment}
              onSave={addMaintenanceRecord}
              onCancel={() => {
                setSelectedEquipment(null);
                setIsMaintenanceDialogOpen(false);
              }}
            />
          </Dialog>
          
          <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
            <Button onClick={() => setIsEquipmentDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm thiết bị
            </Button>
            <EquipmentForm 
              selectedEquipment={selectedEquipment}
              onSave={handleSaveEquipment}
              onCancel={() => {
                setSelectedEquipment(null);
                setIsEquipmentDialogOpen(false);
              }}
            />
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
                  <EquipmentTable 
                    items={filteredEquipment.filter(item => item.equipmentType === "camera")}
                    equipmentType="camera"
                    onEdit={handleEditEquipment}
                    onDelete={handleDeleteEquipment}
                    onToggleStatus={handleToggleStatus}
                    onMarkForMaintenance={handleMarkForMaintenance}
                  />
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
                  <EquipmentTable 
                    items={filteredEquipment.filter(item => item.equipmentType === "lighting")}
                    equipmentType="lighting"
                    onEdit={handleEditEquipment}
                    onDelete={handleDeleteEquipment}
                    onToggleStatus={handleToggleStatus}
                    onMarkForMaintenance={handleMarkForMaintenance}
                  />
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
                  <EquipmentTable 
                    items={filteredEquipment.filter(item => item.equipmentType === "personnel")}
                    equipmentType="personnel"
                    onEdit={handleEditEquipment}
                    onDelete={handleDeleteEquipment}
                    onToggleStatus={handleToggleStatus}
                    onMarkForMaintenance={handleMarkForMaintenance}
                  />
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
              <MaintenanceTable 
                records={filteredMaintenanceRecords}
                onResolve={resolveMaintenanceRecord}
              />
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
              <DepreciationTable equipment={filteredEquipment} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentPage;
