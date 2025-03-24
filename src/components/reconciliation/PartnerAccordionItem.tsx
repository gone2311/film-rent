
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { PartnerReconciliation } from "@/types/reconciliation";

interface PartnerAccordionItemProps {
  partner: PartnerReconciliation;
  onViewPeriodDetails: (partner: PartnerReconciliation, period: any) => void;
}

export const PartnerAccordionItem = ({ 
  partner,
  onViewPeriodDetails 
}: PartnerAccordionItemProps) => {
  return (
    <AccordionItem 
      value={`partner-${partner.partnerId}`}
      className="border rounded-lg shadow-sm p-2"
    >
      <div className="flex items-center justify-between w-full pr-4">
        <AccordionTrigger className="hover:no-underline py-2">
          <div className="flex flex-col items-start text-left">
            <div className="font-semibold text-lg">{partner.name}</div>
            <div className="text-sm text-muted-foreground">Liên hệ: {partner.contact}</div>
          </div>
        </AccordionTrigger>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          partner.status === "Đã đối soát" ? "bg-green-100 text-green-800" : 
          partner.status === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" : 
          "bg-blue-100 text-blue-800"
        }`}>
          {partner.status}
        </span>
      </div>
      
      <AccordionContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-green-50">
              <h4 className="font-medium mb-2">Đối tác thuê của bạn</h4>
              <p className="text-lg font-semibold">{formatCurrency(partner.totalTheyRent)}</p>
            </div>
            <div className="border rounded-md p-4 bg-blue-50">
              <h4 className="font-medium mb-2">Bạn thuê của đối tác</h4>
              <p className="text-lg font-semibold">{formatCurrency(partner.totalWeRent)}</p>
            </div>
          </div>
          
          <h4 className="font-medium mb-2">Các kỳ đối soát</h4>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Từ ngày</TableHead>
                  <TableHead>Đến ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partner.periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>{period.fromDate}</TableCell>
                    <TableCell>{period.toDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        period.status === "Đã đối soát" ? "bg-green-100 text-green-800" : 
                        period.status === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {period.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewPeriodDetails(partner, period)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
