
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
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
import { Clock, Check, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import { PartnerReconciliation, ReconciliationPeriod } from "@/types/reconciliation";

interface ReconciliationDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPartner: PartnerReconciliation | null;
  selectedPeriod: ReconciliationPeriod | null;
  onStatusChange: (status: string) => void;
  onExportExcel: (oldDebt: number) => void;
}

export const ReconciliationDetails = ({
  isOpen,
  onOpenChange,
  selectedPartner,
  selectedPeriod,
  onStatusChange,
  onExportExcel
}: ReconciliationDetailsProps) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [oldDebt, setOldDebt] = useState<number>(0);
  const { toast } = useToast();

  const handleExportClick = () => {
    setIsExportDialogOpen(true);
  };

  const handleExportConfirm = () => {
    onExportExcel(oldDebt);
    setIsExportDialogOpen(false);
  };

  if (!selectedPartner || !selectedPeriod) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đối soát</DialogTitle>
            <DialogDescription>
              <div className="text-sm flex flex-col gap-1 mt-2">
                <div>
                  Đối tác: <span className="font-medium">{selectedPartner.name}</span> | 
                  Liên hệ: <span className="font-medium">{selectedPartner.contact}</span>
                </div>
                <div>
                  Từ ngày: <span className="font-medium">{selectedPeriod.fromDate}</span> - 
                  Đến ngày: <span className="font-medium">{selectedPeriod.toDate}</span>
                </div>
                <div>
                  Trạng thái: <span className={`font-medium ${
                    selectedPeriod.status === "Đã đối soát" ? "text-green-600" : 
                    selectedPeriod.status === "Chờ xác nhận" ? "text-yellow-600" : 
                    "text-blue-600"
                  }`}>
                    {selectedPeriod.status}
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Button 
                  variant={selectedPeriod.status === "Chờ xác nhận" ? "outline" : "default"} 
                  onClick={() => onStatusChange("Chờ xác nhận")} 
                  disabled={selectedPeriod.status === "Chờ xác nhận"}
                  size="sm"
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Chờ xác nhận
                </Button>
                <Button 
                  variant={selectedPeriod.status === "Đã đối soát" ? "outline" : "default"} 
                  onClick={() => onStatusChange("Đã đối soát")} 
                  disabled={selectedPeriod.status === "Đã đối soát"}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Đã đối soát
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportClick}
              >
                <FileSpreadsheet className="mr-1 h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
            
            <Tabs defaultValue="they-rent" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="they-rent" className="flex-1">Đối tác thuê của bạn</TabsTrigger>
                <TabsTrigger value="we-rent" className="flex-1">Bạn thuê của đối tác</TabsTrigger>
              </TabsList>
              
              <TabsContent value="they-rent" className="space-y-4 pt-2">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Ngày thuê</TableHead>
                        <TableHead>Ngày trả</TableHead>
                        <TableHead>Số tiền của bạn</TableHead>
                        <TableHead>Số tiền đối tác</TableHead>
                        <TableHead>Chênh lệch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPeriod.theyRentFromUs.length > 0 ? (
                        selectedPeriod.theyRentFromUs.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.returnDate}</TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell>{formatCurrency(item.partnerAmount)}</TableCell>
                            <TableCell className={item.diff > 0 ? "text-red-600 font-medium" : ""}>
                              {formatCurrency(item.diff)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                            Không có dữ liệu cho kỳ đối soát này
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {selectedPeriod.theyRentFromUs.length > 0 && (
                        <TableRow className="font-medium bg-muted/30">
                          <TableCell colSpan={3}>Tổng cộng</TableCell>
                          <TableCell>
                            {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.amount, 0))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.partnerAmount, 0))}
                          </TableCell>
                          <TableCell className={selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.diff, 0) > 0 ? "text-red-600 font-medium" : ""}>
                            {formatCurrency(selectedPeriod.theyRentFromUs.reduce((sum: number, item: any) => sum + item.diff, 0))}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="we-rent" className="space-y-4 pt-2">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Ngày thuê</TableHead>
                        <TableHead>Ngày trả</TableHead>
                        <TableHead>Số tiền của bạn</TableHead>
                        <TableHead>Số tiền đối tác</TableHead>
                        <TableHead>Chênh lệch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPeriod.weRentFromThem.length > 0 ? (
                        selectedPeriod.weRentFromThem.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.returnDate}</TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell>{formatCurrency(item.partnerAmount)}</TableCell>
                            <TableCell className={item.diff > 0 ? "text-red-600 font-medium" : ""}>
                              {formatCurrency(item.diff)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                            Không có dữ liệu cho kỳ đối soát này
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {selectedPeriod.weRentFromThem.length > 0 && (
                        <TableRow className="font-medium bg-muted/30">
                          <TableCell colSpan={3}>Tổng cộng</TableCell>
                          <TableCell>
                            {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.amount, 0))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.partnerAmount, 0))}
                          </TableCell>
                          <TableCell className={selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.diff, 0) > 0 ? "text-red-600 font-medium" : ""}>
                            {formatCurrency(selectedPeriod.weRentFromThem.reduce((sum: number, item: any) => sum + item.diff, 0))}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Xuất file Excel</DialogTitle>
            <DialogDescription>
              Nhập thông tin cần thiết để xuất file Excel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="oldDebt">Công nợ cũ (nếu có)</FormLabel>
                <Input
                  id="oldDebt"
                  type="number"
                  value={oldDebt}
                  onChange={(e) => setOldDebt(Number(e.target.value))}
                  placeholder="Nhập công nợ cũ..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleExportConfirm}>Xuất file</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
