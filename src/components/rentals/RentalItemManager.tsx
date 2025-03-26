
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, Trash2, Percent } from "lucide-react";
import { Equipment, RentalItemDetail } from "@/types/customer";
import { formatCurrency } from "@/utils/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { equipmentCategories } from "@/data/rentalData";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || equipment.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Danh sách thiết bị đã chọn</h3>
        {selectedItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết bị</TableHead>
                <TableHead className="text-center">SL</TableHead>
                <TableHead className="text-center">KM</TableHead>
                <TableHead className="text-center">Thành tiền</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItems.map(item => {
                const equipment = equipments.find(eq => eq.id.toString() === item.equipmentId);
                const canApplyDiscount = equipment && (equipment.category === "1" || equipment.category === "2");
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.equipmentName}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {canApplyDiscount ? (
                        <div className="flex items-center justify-center">
                          <Input
                            type="number"
                            value={item.discount || 0}
                            onChange={(e) => onDiscountChange(item.id, Number(e.target.value))}
                            className="w-16 h-7 text-center"
                            min="0"
                            max="100"
                          />
                          <Percent className="h-3 w-3 ml-1" />
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatCurrency(item.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 bg-muted/50 rounded-md">
            Chưa có thiết bị nào được chọn
          </div>
        )}
      </div>

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Chọn thiết bị</h3>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thiết bị..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="flex mb-4 overflow-x-auto pb-1">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            {equipmentCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredEquipments.map(equipment => (
                  <Button
                    key={equipment.id}
                    variant="outline"
                    className="justify-between h-auto py-2 px-3 text-left font-normal"
                    onClick={() => onAddEquipment(equipment)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{equipment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(equipment.dailyRate)}/ngày
                      </span>
                    </div>
                    <Plus className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {equipmentCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredEquipments.map(equipment => (
                    <Button
                      key={equipment.id}
                      variant="outline"
                      className="justify-between h-auto py-2 px-3 text-left font-normal"
                      onClick={() => onAddEquipment(equipment)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{equipment.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(equipment.dailyRate)}/ngày
                        </span>
                      </div>
                      <Plus className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
