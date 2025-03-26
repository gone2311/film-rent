
import { Equipment, RentalItemDetail } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { PlusCircle, MinusCircle, Percent } from "lucide-react";

interface RentalItemManagerProps {
  selectedItems: RentalItemDetail[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onDiscountChange: (itemId: string, discount: number) => void;
  onRemoveItem: (itemId: string) => void;
  equipments: Equipment[];
  onAddEquipment: (equipment: Equipment) => void;
}

export function RentalItemManager({
  selectedItems,
  onQuantityChange,
  onDiscountChange,
  onRemoveItem,
  equipments,
  onAddEquipment
}: RentalItemManagerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Thiết bị đã chọn</h3>
      {selectedItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Số ngày</TableHead>
              <TableHead>Đơn giá/ngày</TableHead>
              <TableHead>Giảm giá (%)</TableHead>
              <TableHead>Thành tiền</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedItems.map(item => {
              const equipment = equipments.find(eq => eq.id.toString() === item.equipmentId);
              const canDiscount = equipment && (equipment.category === "1" || equipment.category === "2");
              
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.equipmentName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Input
                        className="w-16"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        min={1}
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.days}</TableCell>
                  <TableCell>{formatCurrency(item.dailyRate)}</TableCell>
                  <TableCell>
                    {canDiscount ? (
                      <div className="flex items-center">
                        <Input
                          className="w-16 mr-2"
                          type="number"
                          value={item.discount || 0}
                          onChange={(e) => onDiscountChange(item.id, parseInt(e.target.value) || 0)}
                          min={0}
                          max={100}
                        />
                        <Percent className="h-4 w-4" />
                      </div>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-4 border rounded-md bg-muted">
          <p>Chưa có thiết bị nào được chọn</p>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Danh sách thiết bị</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {equipments.map(equipment => (
            <Button
              key={equipment.id}
              variant="outline"
              className="justify-start h-auto py-2"
              onClick={() => onAddEquipment(equipment)}
            >
              <div className="text-left">
                <div className="font-medium">{equipment.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(equipment.dailyRate)}/ngày • Số lượng: {equipment.quantity}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
