
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { PartnerAccordionItem } from "./PartnerAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerReconciliation } from "@/types/reconciliation";

interface ReconciliationListProps {
  partnerReconciliations: PartnerReconciliation[];
  onViewPeriodDetails: (partner: PartnerReconciliation, period: any) => void;
}

export const ReconciliationList = ({ 
  partnerReconciliations,
  onViewPeriodDetails
}: ReconciliationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter reconciliations by search term
  const filteredPartnerReconciliations = partnerReconciliations.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đối soát theo đối tác</CardTitle>
        <CardDescription>
          Quản lý tất cả đối soát công nợ theo từng đối tác
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đối tác..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredPartnerReconciliations.map((partner) => (
            <PartnerAccordionItem 
              key={partner.partnerId}
              partner={partner}
              onViewPeriodDetails={onViewPeriodDetails}
            />
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredPartnerReconciliations.length} trên tổng số {partnerReconciliations.length} đối tác
        </p>
      </CardFooter>
    </Card>
  );
};
