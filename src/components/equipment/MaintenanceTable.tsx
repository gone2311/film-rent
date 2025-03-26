
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MaintenanceRecord } from "@/data/equipmentData";

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onResolve: (id: number) => void;
}

const MaintenanceTable = ({ records, onResolve }: MaintenanceTableProps) => {
  return (
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
        {records.length > 0 ? (
          records.map((record) => (
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
                    onClick={() => onResolve(record.id)}
                  >
                    Đánh dấu hoàn thành
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              Không có bản ghi bảo trì nào
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTable;
