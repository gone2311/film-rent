
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Equipment } from "@/types/customer";
import { useToast } from "@/components/ui/use-toast";

interface EquipmentFormProps {
  selectedEquipment: Equipment | null;
  onSave: (equipmentData: Partial<Equipment>) => void;
  onCancel: () => void;
}

const EquipmentForm = ({ selectedEquipment, onSave, onCancel }: EquipmentFormProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    
    onSave(equipmentData);
    
    toast({
      title: selectedEquipment ? "Đã cập nhật thiết bị" : "Thiết bị đã được thêm",
      description: selectedEquipment 
        ? `Thiết bị ${equipmentData.name} đã được cập nhật` 
        : "Thiết bị mới đã được thêm vào danh sách",
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{selectedEquipment ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}</DialogTitle>
        <DialogDescription>
          {selectedEquipment ? "Chỉnh sửa thông tin thiết bị" : "Nhập thông tin thiết bị mới vào form bên dưới"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
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
          <Button variant="outline" onClick={onCancel} type="button">
            Hủy
          </Button>
          <Button type="submit">
            {selectedEquipment ? "Cập nhật" : "Lưu thiết bị"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default EquipmentForm;
