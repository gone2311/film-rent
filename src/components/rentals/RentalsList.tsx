
import { RentalOrder, Debt } from "@/types/customer";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { FileEdit, MoreHorizontal, FileText, CheckSquare, ClipboardCheck, Trash2 } from "lucide-react";

interface RentalsListProps {
  rentals: RentalOrder[];
  activeFilter: boolean;
  searchTerm: string;
  onEdit: (rental: RentalOrder) => void;
  onViewQuote: (rental: RentalOrder) => void;
  onStatusChange: (rentalId: number, newStatus: string) => void;
  onCreateHandover: (rental: RentalOrder) => void;
  onDelete: (rentalId: number) => void;
}

export function RentalsList({ 
  rentals, 
  activeFilter, 
  searchTerm, 
  onEdit, 
  onViewQuote, 
  onStatusChange, 
  onCreateHandover, 
  onDelete 
}: RentalsListProps) {
  const filteredRentals = rentals.filter(rental => 
    (activeFilter 
      ? rental.status !== "Hoàn thành" 
      : rental.status === "Hoàn thành") &&
    (rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.items.some(item => item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    rental.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Thời gian thuê</TableHead>
          <TableHead>Tổng tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRentals.map(rental => (
          <TableRow key={rental.id}>
            <TableCell className="font-medium">#{rental.id}</TableCell>
            <TableCell>{rental.customerName}</TableCell>
            <TableCell>
              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
            </TableCell>
            <TableCell>{formatCurrency(rental.totalAmount)}</TableCell>
            <TableCell>
              <div className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                rental.status === "Đặt trước" ? "bg-blue-100 text-blue-800" :
                rental.status === "Đang thuê" ? "bg-green-100 text-green-800" :
                rental.status === "Hoàn thành" ? "bg-green-100 text-green-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {rental.status}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(rental)}>
                    <FileEdit className="mr-2 h-4 w-4" /> Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewQuote(rental)}>
                    <FileText className="mr-2 h-4 w-4" /> Xem báo giá
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {rental.status === "Đặt trước" && (
                    <DropdownMenuItem onClick={() => onStatusChange(rental.id, "Đang thuê")}>
                      <CheckSquare className="mr-2 h-4 w-4" /> Chuyển sang đang thuê
                    </DropdownMenuItem>
                  )}
                  {rental.status === "Đang thuê" && (
                    <DropdownMenuItem onClick={() => onStatusChange(rental.id, "Hoàn thành")}>
                      <CheckSquare className="mr-2 h-4 w-4" /> Đánh dấu hoàn thành
                    </DropdownMenuItem>
                  )}
                  {!rental.handoverCompleted && (
                    <DropdownMenuItem onClick={() => onCreateHandover(rental)}>
                      <ClipboardCheck className="mr-2 h-4 w-4" /> Tạo biên bản bàn giao
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(rental.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Xóa đơn hàng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
