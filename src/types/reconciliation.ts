
export interface RentalItem {
  id: number;
  description: string;
  date: string;
  returnDate: string;
  amount: number;
  partnerAmount: number;
  diff: number;
}

export interface ReconciliationPeriod {
  id: number;
  fromDate: string;
  toDate: string;
  status: string;
  theyRentFromUs: RentalItem[];
  weRentFromThem: RentalItem[];
}

export interface PartnerReconciliation {
  partnerId: number;
  name: string;
  contact: string;
  totalTheyRent: number;
  totalWeRent: number;
  status: string;
  periods: ReconciliationPeriod[];
}

export interface Partner {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  type: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  type: string;
}

export interface Equipment {
  id: string | number;
  name: string;
  category: string;
  dailyRate: number;
  description?: string;
  quantity: number;
  isAvailable: boolean;
  equipmentType: string;
  status?: string;
  condition?: string;
  serialNumber?: string;
  rentalCount?: number;
  maintenanceNotes?: string;
  maintenanceLocation?: string;
}

export interface RentalItemDetail {
  id: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  days: number;
  dailyRate: number;
  totalAmount: number;
  discount?: number;
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
  relatedOrderId?: number;
}

