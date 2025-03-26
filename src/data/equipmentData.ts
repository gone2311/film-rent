
import { Equipment } from "@/types/customer";

// Maintenance record interface
export interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  date: string;
  description: string;
  cost: number;
  resolved: boolean;
  location?: string;
}

// Sample equipment data
export const sampleEquipment: Equipment[] = [
  {
    id: 1,
    name: "Máy quay Canon C300",
    category: "Máy quay",
    serialNumber: "CN12345678",
    dailyRate: 2500000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 150000000,
    purchaseDate: "2022-05-15",
    rentalCount: 25,
    equipmentType: 'camera'
  },
  {
    id: 2,
    name: "Bộ đèn LED Aputure 120D II",
    category: "Ánh sáng",
    serialNumber: "AP98765432",
    dailyRate: 800000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 25000000,
    purchaseDate: "2022-08-20",
    rentalCount: 18,
    equipmentType: 'lighting'
  },
  {
    id: 3,
    name: "Gimbal DJI Ronin-S",
    category: "Phụ kiện",
    serialNumber: "DJI56781234",
    dailyRate: 500000,
    status: "Đang thuê",
    condition: "Tốt",
    purchasePrice: 15000000,
    purchaseDate: "2022-03-10",
    rentalCount: 30,
    equipmentType: 'camera'
  },
  {
    id: 4,
    name: "Ống kính Sony G Master 24-70mm",
    category: "Ống kính",
    serialNumber: "SNY45678912",
    dailyRate: 700000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 45000000,
    purchaseDate: "2022-07-05",
    rentalCount: 15,
    equipmentType: 'camera'
  },
  {
    id: 5,
    name: "Microphone Rode NTG4+",
    category: "Âm thanh",
    serialNumber: "RD87654321",
    dailyRate: 350000,
    status: "Bảo trì",
    condition: "Cần sửa chữa",
    purchasePrice: 8000000,
    purchaseDate: "2022-01-30",
    rentalCount: 22,
    equipmentType: 'camera'
  },
  {
    id: 6,
    name: "Kỹ thuật viên máy quay",
    category: "Nhân sự",
    serialNumber: "STAFF001",
    dailyRate: 1000000,
    status: "Sẵn sàng",
    condition: "N/A",
    rentalCount: 40,
    equipmentType: 'personnel'
  },
  {
    id: 7,
    name: "Kỹ thuật viên ánh sáng",
    category: "Nhân sự",
    serialNumber: "STAFF002",
    dailyRate: 800000,
    status: "Sẵn sàng",
    condition: "N/A",
    rentalCount: 35,
    equipmentType: 'personnel'
  },
  {
    id: 8,
    name: "Xe vận chuyển thiết bị",
    category: "Di chuyển",
    serialNumber: "VH001",
    dailyRate: 1500000,
    status: "Sẵn sàng",
    condition: "Tốt",
    purchasePrice: 500000000,
    purchaseDate: "2021-10-15",
    rentalCount: 60,
    equipmentType: 'personnel'
  }
];

// Sample maintenance records
export const sampleMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 1,
    equipmentId: 5,
    equipmentName: "Microphone Rode NTG4+",
    date: "2023-08-15",
    description: "Mic không hoạt động, cần thay cáp kết nối",
    cost: 500000,
    resolved: false,
    location: "Xưởng sửa chữa Minh Phát"
  },
  {
    id: 2,
    equipmentId: 1,
    equipmentName: "Máy quay Canon C300",
    date: "2023-06-20",
    description: "Bảo trì định kỳ, vệ sinh cảm biến",
    cost: 1200000,
    resolved: true,
    location: "Trung tâm bảo hành Canon"
  },
  {
    id: 3,
    equipmentId: 3,
    equipmentName: "Gimbal DJI Ronin-S",
    date: "2023-07-05",
    description: "Cân chỉnh lại motor, thay pin",
    cost: 800000,
    resolved: true,
    location: "Trung tâm bảo hành DJI"
  }
];
