
export interface Customer {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalRentals: number;
}

export interface Equipment {
  id: number;
  name: string;
  category: string;
  serialNumber: string;
  dailyRate: number;
  quantity: number;
  status: "Sẵn sàng" | "Đang thuê" | "Bảo trì";
  condition: string;
  purchasePrice?: number;
  purchaseDate?: string;
  rentalCount: number;
  isAvailable: boolean;
  maintenanceNotes?: string;
  maintenanceLocation?: string;
  equipmentType: 'camera' | 'lighting' | 'personnel' | 'other';
}

export interface EquipmentCategory {
  id: string;
  name: string;
  type: 'camera' | 'lighting' | 'personnel' | 'other';
}

export interface RentalItemDetail {
  id: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  days: number;
  dailyRate: number;
  discount?: number;
  totalAmount: number;
}

export interface RentalOrder {
  id: number;
  customerId: string;
  customerName: string;
  contact: string;
  startDate: string;
  endDate: string;
  items: RentalItemDetail[];
  totalAmount: number;
  deposit: number;
  balance: number;
  status: string;
  notes?: string;
  createdAt: string;
  discount?: number;
  handoverCompleted?: boolean;
}

export interface Debt {
  id: number;
  customerId: string;
  customerName: string;
  contact: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  description: string;
  status: string;
  relatedOrderId: number;
}

export interface HandoverReport {
  id: number;
  rentalId: number;
  customerName: string;
  date: string;
  items: RentalItemDetail[];
  notes: string;
  signedByCustomer: boolean;
  signedByStaff: boolean;
}
