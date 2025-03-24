
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/ui/navbar";
import { useCompany } from "@/context/CompanyContext";
import { exportReconciliationToExcel } from "@/utils/exportExcel";
import { ReconciliationHeader, ReconciliationFormValues } from "@/components/reconciliation/ReconciliationHeader";
import { ReconciliationList } from "@/components/reconciliation/ReconciliationList";
import { ReconciliationDetails } from "@/components/reconciliation/ReconciliationDetails";
import { PartnerReconciliation, ReconciliationPeriod } from "@/types/reconciliation";
import { samplePartners } from "@/data/partners";
import { samplePartnerReconciliations } from "@/data/reconciliations";

const Reconciliation = () => {
  const [partnerReconciliations, setPartnerReconciliations] = useState(samplePartnerReconciliations);
  const [selectedPartner, setSelectedPartner] = useState<PartnerReconciliation | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ReconciliationPeriod | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();
  const { companyName } = useCompany();

  const handleCreateReconciliation = (data: ReconciliationFormValues) => {
    // Find the selected partner data
    const selectedPartnerData = samplePartners.find(p => p.id.toString() === data.partnerId);
    
    if (!selectedPartnerData) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy đối tác đã chọn",
        variant: "destructive"
      });
      return;
    }
    
    // Check if partner already exists in the list
    const existingPartnerIndex = partnerReconciliations.findIndex(p => p.partnerId === selectedPartnerData.id);
    
    if (existingPartnerIndex === -1) {
      // Partner doesn't exist, add new
      const newPartnerRecon = {
        partnerId: selectedPartnerData.id,
        name: selectedPartnerData.name,
        contact: selectedPartnerData.contact,
        totalTheyRent: 0,
        totalWeRent: 0,
        status: "Chờ xử lý",
        periods: [
          {
            id: Math.max(0, ...partnerReconciliations.flatMap(p => p.periods.map(period => period.id))) + 1,
            fromDate: data.fromDate,
            toDate: data.toDate,
            status: "Chờ xử lý",
            theyRentFromUs: [],
            weRentFromThem: []
          }
        ]
      };
      
      setPartnerReconciliations([...partnerReconciliations, newPartnerRecon]);
    } else {
      // Partner exists, add new period
      const updatedPartnerReconciliations = [...partnerReconciliations];
      updatedPartnerReconciliations[existingPartnerIndex].periods.push({
        id: Math.max(0, ...partnerReconciliations.flatMap(p => p.periods.map(period => period.id))) + 1,
        fromDate: data.fromDate,
        toDate: data.toDate,
        status: "Chờ xử lý",
        theyRentFromUs: [],
        weRentFromThem: []
      });
      
      setPartnerReconciliations(updatedPartnerReconciliations);
    }
    
    // Show success message
    toast({
      title: "Tạo đối soát thành công",
      description: `Đã tạo đối soát với đối tác ${selectedPartnerData.name} từ ${data.fromDate} đến ${data.toDate}`,
    });
  };

  const handleViewPeriodDetails = (partner: PartnerReconciliation, period: ReconciliationPeriod) => {
    setSelectedPartner(partner);
    setSelectedPeriod(period);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (status: string) => {
    if (!selectedPartner || !selectedPeriod) return;
    
    const updatedPartnerReconciliations = partnerReconciliations.map(partner => {
      if (partner.partnerId === selectedPartner.partnerId) {
        const updatedPeriods = partner.periods.map(period => 
          period.id === selectedPeriod.id ? { ...period, status } : period
        );
        
        // Update partner status based on periods status
        const allPeriodsResolved = updatedPeriods.every(p => p.status === "Đã đối soát");
        const anyPeriodPending = updatedPeriods.some(p => p.status === "Chờ xác nhận");
        
        const partnerStatus = allPeriodsResolved 
          ? "Đã đối soát" 
          : anyPeriodPending 
            ? "Chờ xác nhận" 
            : "Chờ xử lý";
        
        return { 
          ...partner, 
          periods: updatedPeriods,
          status: partnerStatus
        };
      }
      return partner;
    });
    
    setPartnerReconciliations(updatedPartnerReconciliations);
    setIsDetailDialogOpen(false);
    
    toast({
      title: `Đã cập nhật trạng thái đối soát`,
      description: `Đối soát với đối tác ${selectedPartner.name} từ ${selectedPeriod.fromDate} đến ${selectedPeriod.toDate} đã được cập nhật thành ${status}`,
    });
  };

  const handleExportExcel = (oldDebt: number) => {
    if (!selectedPartner || !selectedPeriod) return;
    
    try {
      const fileName = exportReconciliationToExcel(
        selectedPartner,
        selectedPeriod,
        companyName,
        oldDebt
      );
      
      toast({
        title: "Xuất file thành công",
        description: `Đã xuất file ${fileName}`,
      });
    } catch (error) {
      console.error("Lỗi khi xuất file:", error);
      toast({
        title: "Xuất file thất bại",
        description: "Có lỗi xảy ra khi xuất file Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <ReconciliationHeader 
          onCreateReconciliation={handleCreateReconciliation}
          partners={samplePartners}
        />
        
        <ReconciliationList
          partnerReconciliations={partnerReconciliations}
          onViewPeriodDetails={handleViewPeriodDetails}
        />
        
        <ReconciliationDetails
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          selectedPartner={selectedPartner}
          selectedPeriod={selectedPeriod}
          onStatusChange={handleStatusChange}
          onExportExcel={handleExportExcel}
        />
      </div>
    </div>
  );
};

export default Reconciliation;
