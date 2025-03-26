
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Equipment } from "@/types/customer";
import { MaintenanceRecord } from "@/data/equipmentData";
import { useToast } from "@/components/ui/use-toast";

interface MaintenanceFormProps {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  onSave: (record: Omit<MaintenanceRecord, "id">) => void;
  onCancel: () => void;
}

const MaintenanceForm = ({ 
  equipment, 
  selectedEquipment, 
  onSave, 
  onCancel 
}: MaintenanceFormProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    
    onSave({
      equipmentId: equipmentId || 0,
      equipmentName: equipmentName || "",
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      cost: Number(formData.get('cost')),
      location: formData.get('location') as string,
      resolved: false
    });
    
    toast({
      title: "Đã tạo yêu cầu bảo trì",
      description: "Thiết bị đã được đánh dấu cần bảo trì",
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Báo cáo bảo trì thiết bị</DialogTitle>
        <DialogDescription>
          Nhập thông tin về vấn đề của thiết bị cần bảo trì
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
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
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Tạo báo cáo</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default MaintenanceForm;
