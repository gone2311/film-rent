
import { RentalItemDetail, Equipment } from "@/types/customer";

export const calculateDepreciation = (item: RentalItemDetail, equipments: Equipment[]) => {
  const equipment = equipments.find(eq => eq.id.toString() === item.equipmentId);
  if (!equipment || equipment.category === "3") return 0;
  
  return item.dailyRate * 0.6 * item.quantity * item.days;
};

export const calculateTotalDepreciation = (items: RentalItemDetail[], equipments: Equipment[]) => {
  return items.reduce((total, item) => total + calculateDepreciation(item, equipments), 0);
};

export const calculateDiscountedTotal = (items: RentalItemDetail[], equipments: Equipment[]) => {
  return items.reduce((total, item) => {
    const equipment = equipments.find(eq => eq.id.toString() === item.equipmentId);
    if (!equipment) return total;
    
    if (equipment.category === "1" || equipment.category === "2") {
      const discount = item.discount || 0;
      const discountAmount = (item.dailyRate * item.quantity * item.days) * (discount / 100);
      return total + (item.dailyRate * item.quantity * item.days) - discountAmount;
    } else {
      return total + (item.dailyRate * item.quantity * item.days);
    }
  }, 0);
};
