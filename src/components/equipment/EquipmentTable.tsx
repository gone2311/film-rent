
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Equipment } from "@/types/customer";
import { Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EquipmentTableProps {
  items: Equipment[];
  equipmentType: 'camera' | 'lighting' | 'personnel';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onMarkForMaintenance: (id: number) => void;
}

const EquipmentTable = ({ 
  items, 
  equipmentType, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onMarkForMaintenance 
}: EquipmentTableProps) => {
  const { toast } = useToast();
  
  const isPersonnel = equipmentType === 'personnel';
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên {isPersonnel ? '' : 'thiết bị'}</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>{isPersonnel ? 'Mã' : 'Số serial'}</TableHead>
            <TableHead>Giá thuê/ngày</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>{isPersonnel ? 'Ghi chú' : 'Tình trạng'}</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
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
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(item.id)}>
                        {item.status === "Sẵn sàng" 
                          ? `Đánh dấu ${isPersonnel ? 'đang hoạt động' : 'đang thuê'}` 
                          : "Đánh dấu sẵn sàng"}
                      </DropdownMenuItem>
                      
                      {!isPersonnel && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onMarkForMaintenance(item.id)}>
                            <Wrench className="h-4 w-4 mr-2" />
                            Đánh dấu cần bảo trì
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(item.id)} 
                        className="text-destructive"
                      >
                        Xóa {isPersonnel ? '' : 'thiết bị'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                Không có {isPersonnel ? 'nhân sự hoặc chi phí phát sinh' : `thiết bị ${equipmentType === 'camera' ? 'máy quay' : 'ánh sáng'}`} nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EquipmentTable;
