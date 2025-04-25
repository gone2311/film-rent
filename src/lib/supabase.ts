
import { createClient } from '@supabase/supabase-js';

// Default to empty strings to prevent initialization errors, 
// but the app won't connect to Supabase until proper values are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export type DbCustomer = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  total_rentals: number;
  created_at: string;
}

export type DbEquipment = {
  id: number;
  name: string;
  category: string;
  serial_number: string;
  daily_rate: number;
  quantity: number;
  status: "Sẵn sàng" | "Đang thuê" | "Bảo trì";
  condition: string;
  purchase_price?: number;
  purchase_date?: string;
  rental_count: number;
  is_available: boolean;
  maintenance_notes?: string;
  maintenance_location?: string;
  equipment_type: 'camera' | 'lighting' | 'personnel' | 'other';
  created_at: string;
}

export type DbEquipmentCategory = {
  id: number;
  name: string;
  type: 'camera' | 'lighting' | 'personnel' | 'other';
}

export type DbRentalItem = {
  id: number;
  rental_id: number;
  equipment_id: number;
  quantity: number;
  days: number;
  daily_rate: number;
  discount?: number;
  total_amount: number;
}

export type DbRental = {
  id: number;
  customer_id: number;
  start_date: string;
  end_date: string;
  total_amount: number;
  deposit: number;
  balance: number;
  status: string;
  notes?: string;
  created_at: string;
  discount?: number;
  handover_completed?: boolean;
}

export type DbDebt = {
  id: number;
  customer_id: number;
  amount: number;
  due_date: string;
  issue_date: string;
  description: string;
  status: string;
  related_order_id: number;
}

export type DbHandoverReport = {
  id: number;
  rental_id: number;
  date: string;
  notes: string;
  signed_by_customer: boolean;
  signed_by_staff: boolean;
}

export type DbPartner = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  type: string;
}

export type DbReconciliationPeriod = {
  id: number;
  partner_id: number;
  from_date: string;
  to_date: string;
  status: string;
  they_rent_items: any[];
  we_rent_items: any[];
}
