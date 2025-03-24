
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
}
