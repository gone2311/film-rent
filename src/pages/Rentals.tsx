
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Search, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { calculateDaysBetween } from "@/utils/formatters";
import { Equipment, RentalItemDetail, RentalOrder, Debt, HandoverReport } from "@/types/customer";

// Import our new components
import { RentalsList } from "@/components/rentals/RentalsList";
import { RentalItemManager } from "@/components/rentals/RentalItemManager";
import { RentalFormComponent } from "@/components/rentals/RentalFormComponent";
import { HandoverForm } from "@/components/rentals/HandoverForm";
import { MaintenanceForm } from "@/components/rentals/MaintenanceForm";
import { QuoteView } from "@/components/rentals/QuoteView";

// Import schema and sample data
import { RentalFormValues, HandoverFormValues, MaintenanceFormValues } from "@/components/rentals/RentalSchema";
import { sampleRentals, sampleDebts, sampleHandoverReports, sampleEquipments, sampleCustomers } from "@/data/rentalData";

// Import utility functions
import { calculateDiscountedTotal } from "@/utils/rentalUtils";

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
      const startDate = document.querySelector<HTMLInputElement>('input[name="startDate"]')?.value;
      const endDate = document.querySelector<HTMLInputElement>('input[name="endDate"]')?.value;
      
      const days = startDate && endDate 
        ? calculateDaysBetween(startDate, endDate)
        : 1;
        
      const newItem: RentalItemDetail = {
        id: `item-${Date.now()}`,
        equipmentId: equipment.id.toString(),
        equipmentName: equipment.name,
        quantity: 1,
        days,
        dailyRate: equipment.dailyRate,
        discount: 0,
        totalAmount: equipment.dailyRate * days
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
        const equipment = equipments.find(eq => eq.id.toString() === item.equipmentId);
        
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

  // Function to update the days for all selected items
  const updateItemsDays = (startDate: Date, endDate: Date) => {
    if (startDate && endDate) {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const days = calculateDaysBetween(formattedStartDate, formattedEndDate);
      
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
  };

  useEffect(() => {
    const startDateInput = document.querySelector<HTMLInputElement>('input[name="startDate"]');
    const endDateInput = document.querySelector<HTMLInputElement>('input[name="endDate"]');
    
    if (startDateInput?.value && endDateInput?.value) {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      updateItemsDays(startDate, endDate);
    }
  }, [isDialogOpen, isEditDialogOpen]);

  const handleEditRental = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setSelectedItems([...rental.items]);
    setIsEditDialogOpen(true);
  };

  const handleViewQuote = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setIsQuoteDialogOpen(true);
  };

  const handleCreateHandover = (rental: RentalOrder) => {
    setSelectedRental(rental);
    setIsHandoverDialogOpen(true);
  };

  const handleMaintenanceDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
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
    
    const totalAmount = calculateDiscountedTotal(selectedItems, equipments);
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
      createdAt: format(new Date(), "yyyy-MM-dd"),
      discount: data.discount,
      handoverCompleted: false
    };
    
    setRentals([...rentals, newRental]);
    setSelectedItems([]);
    setIsDialogOpen(false);
    
    toast({
      title: "Tạo đơn hàng mới",
      description: `Đã tạo đơn hàng mới cho ${customer.name}`,
    });
  };

  const onEditSubmit = (data: RentalFormValues) => {
    if (!selectedRental) return;
    
    const customer = sampleCustomers.find(c => c.id === data.customerId);
    if (!customer) return;
    
    const totalAmount = calculateDiscountedTotal(selectedItems, equipments);
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
    
    // Update related debt if exists
    const relatedDebt = debts.find(debt => debt.relatedOrderId === selectedRental.id);
    if (relatedDebt) {
      const updatedDebt: Debt = {
        ...relatedDebt,
        customerName: customer.name,
        contact: customer.contact,
        amount: balance
      };
      
      setDebts(prevDebts => 
        prevDebts.map(debt => 
          debt.id === relatedDebt.id ? updatedDebt : debt
        )
      );
    }
    
    setSelectedItems([]);
    setIsEditDialogOpen(false);
    setSelectedRental(null);
    
    toast({
      title: "Cập nhật đơn hàng",
      description: `Đã cập nhật đơn hàng #${selectedRental.id}`,
    });
  };

  const onHandoverSubmit = (data: HandoverFormValues) => {
    if (!selectedRental) return;
    
    const newHandoverReport: HandoverReport = {
      id: handoverReports.length + 1,
      rentalId: selectedRental.id,
      customerName: selectedRental.customerName,
      date: format(new Date(), "yyyy-MM-dd"),
      items: selectedRental.items,
      notes: data.notes || "",
      signedByCustomer: data.signedByCustomer,
      signedByStaff: data.signedByStaff
    };
    
    setHandoverReports([...handoverReports, newHandoverReport]);
    
    // Update rental handoverCompleted status
    setRentals(prevRentals => 
      prevRentals.map(rental => 
        rental.id === selectedRental.id 
          ? { ...rental, handoverCompleted: true } 
          : rental
      )
    );
    
    setIsHandoverDialogOpen(false);
    setSelectedRental(null);
    
    toast({
      title: "Tạo báo cáo bàn giao",
      description: `Đã tạo báo cáo bàn giao cho đơn hàng #${selectedRental.id}`,
    });
  };

  const onMaintenanceSubmit = (data: MaintenanceFormValues) => {
    if (!selectedEquipment) return;
    
    const updatedEquipment: Equipment = {
      ...selectedEquipment,
      maintenanceNotes: data.maintenanceNotes,
      maintenanceLocation: data.maintenanceLocation,
      status: "Bảo trì"
    };
    
    setEquipments(prevEquipments => 
      prevEquipments.map(equipment => 
        equipment.id === selectedEquipment.id ? updatedEquipment : equipment
      )
    );
    
    setIsMaintenanceDialogOpen(false);
    setSelectedEquipment(null);
    
    toast({
      title: "Cập nhật bảo trì",
      description: `Đã cập nhật thông tin bảo trì cho ${updatedEquipment.name}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý đơn thuê thiết bị</h1>
        <Button 
          onClick={() => {
            setSelectedItems([]);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo đơn mới
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên khách hàng, thiết bị, trạng thái..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Đơn thuê hiện tại</TabsTrigger>
          <TabsTrigger value="completed">Đơn đã hoàn thành</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn thuê hiện tại</CardTitle>
              <CardDescription>
                Quản lý các đơn thuê đang hoạt động và đã đặt trước
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RentalsList 
                rentals={rentals}
                activeFilter={true}
                searchTerm={searchTerm}
                onEdit={handleEditRental}
                onViewQuote={handleViewQuote}
                onStatusChange={handleStatusChange}
                onCreateHandover={handleCreateHandover}
                onDelete={handleDeleteRental}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn thuê đã hoàn thành</CardTitle>
              <CardDescription>
                Lịch sử các đơn thuê đã hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RentalsList 
                rentals={rentals}
                activeFilter={false}
                searchTerm={searchTerm}
                onEdit={handleEditRental}
                onViewQuote={handleViewQuote}
                onStatusChange={handleStatusChange}
                onCreateHandover={handleCreateHandover}
                onDelete={handleDeleteRental}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Rental Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo đơn thuê mới</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <RentalFormComponent
                onSubmit={onSubmit}
                selectedItems={selectedItems}
                totalAmount={calculateDiscountedTotal(selectedItems, equipments)}
                formType="create"
              />
            </div>
            <div>
              <RentalItemManager
                selectedItems={selectedItems}
                onQuantityChange={updateEquipmentQuantity}
                onDiscountChange={updateEquipmentDiscount}
                onRemoveItem={removeEquipment}
                equipments={equipments}
                onAddEquipment={addEquipment}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Rental Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đơn thuê #{selectedRental?.id}</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RentalFormComponent
                  onSubmit={onEditSubmit}
                  selectedItems={selectedItems}
                  totalAmount={calculateDiscountedTotal(selectedItems, equipments)}
                  defaultValues={selectedRental}
                  formType="edit"
                />
              </div>
              <div>
                <RentalItemManager
                  selectedItems={selectedItems}
                  onQuantityChange={updateEquipmentQuantity}
                  onDiscountChange={updateEquipmentDiscount}
                  onRemoveItem={removeEquipment}
                  equipments={equipments}
                  onAddEquipment={addEquipment}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote View Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Báo giá</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <QuoteView 
              rental={selectedRental} 
              onClose={() => setIsQuoteDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Handover Dialog */}
      <Dialog open={isHandoverDialogOpen} onOpenChange={setIsHandoverDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Bàn giao thiết bị</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <HandoverForm 
              onSubmit={onHandoverSubmit} 
              rental={selectedRental} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Bảo trì thiết bị</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <MaintenanceForm 
              onSubmit={onMaintenanceSubmit} 
              equipment={selectedEquipment} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rentals;
