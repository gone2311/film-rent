
import { Equipment } from "@/types/customer";

// Calculate depreciation for equipment
export const calculateDepreciation = (equipment: Equipment) => {
  if (!equipment.purchasePrice) return 0;
  
  // Khấu hao máy là 60% giá cho thuê máy trên 1 ngày
  if (equipment.equipmentType === 'camera' || equipment.equipmentType === 'lighting') {
    return equipment.dailyRate * 0.6;
  }
  
  // Cách tính khấu hao cũ dựa trên thời gian
  const purchaseDate = new Date(equipment.purchaseDate || new Date());
  const currentDate = new Date();
  const monthsDiff = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                     (currentDate.getMonth() - purchaseDate.getMonth());
  
  // Giả sử thời gian khấu hao là 36 tháng (3 năm)
  const depreciationRate = 1 / 36;
  const totalDepreciation = Math.min(monthsDiff * depreciationRate, 1) * equipment.purchasePrice;
  
  return totalDepreciation;
};

// Calculate current value of equipment
export const getCurrentValue = (equipment: Equipment) => {
  if (!equipment.purchasePrice) return 0;
  return equipment.purchasePrice - calculateDepreciation(equipment);
};

// Get readable equipment type name
export const getEquipmentTypeName = (type: string): string => {
  switch (type) {
    case 'camera':
      return 'Thiết bị máy quay';
    case 'lighting':
      return 'Thiết bị ánh sáng';
    case 'personnel':
      return 'Nhân sự - Di chuyển - Phát sinh';
    default:
      return 'Khác';
  }
};
