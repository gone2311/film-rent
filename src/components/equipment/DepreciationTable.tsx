
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Equipment } from "@/types/customer";
import { Camera, Lightbulb, Tag, Users } from "lucide-react";
import { calculateDepreciation, getCurrentValue, getEquipmentTypeName } from "@/utils/equipmentUtils";

interface DepreciationTableProps {
  equipment: Equipment[];
}

const DepreciationTable = ({ equipment }: DepreciationTableProps) => {
  // Function to render equipment type icon
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

  const filteredEquipment = equipment.filter(
    item => item.purchasePrice && (item.equipmentType === 'camera' || item.equipmentType === 'lighting')
  );

  return (
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
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => {
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
          })
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
              Không có dữ liệu khấu hao
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DepreciationTable;
