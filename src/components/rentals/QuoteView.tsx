
import { RentalOrder } from "@/types/customer";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface QuoteViewProps {
  rental: RentalOrder;
  onClose: () => void;
}

export function QuoteView({ rental, onClose }: QuoteViewProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4 border-b pb-4">
        <h3 className="text-lg font-semibold">Báo giá đơn hàng #{rental.id}</h3>
        <p className="text-sm text-muted-foreground">Ngày tạo: {formatDate(rental.createdAt)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div>
          <h4 className="font-medium">Thông tin khách hàng</h4>
          <p>{rental.customerName}</p>
          <p>Liên hệ: {rental.contact}</p>
        </div>
        <div>
          <h4 className="font-medium">Thời gian thuê</h4>
          <p>Từ: {formatDate(rental.startDate)}</p>
          <p>Đến: {formatDate(rental.endDate)}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Danh sách thiết bị</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Số ngày</TableHead>
              <TableHead>Đơn giá/ngày</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rental.items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.equipmentName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.days}</TableCell>
                <TableCell>{formatCurrency(item.dailyRate)}</TableCell>
                <TableCell>{item.discount ? `${item.discount}%` : "-"}</TableCell>
                <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border rounded-md p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right font-medium">Tổng tiền:</div>
          <div>{formatCurrency(rental.totalAmount)}</div>
          
          <div className="text-right font-medium">Tiền đặt cọc:</div>
          <div>{formatCurrency(rental.deposit)}</div>
          
          <div className="text-right font-medium">Còn lại:</div>
          <div className="font-bold">{formatCurrency(rental.balance)}</div>
        </div>
      </div>

      {rental.notes && (
        <div className="border rounded-md p-4">
          <h4 className="font-medium">Ghi chú</h4>
          <p>{rental.notes}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </div>
  );
}
