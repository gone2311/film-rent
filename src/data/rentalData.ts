
import { EquipmentCategory, Equipment, RentalOrder, Debt, HandoverReport } from "@/types/customer";

export const equipmentCategories: EquipmentCategory[] = [
  { id: "1", name: "THIẾT BỊ MÁY QUAY", type: "camera" },
  { id: "2", name: "THIẾT BỊ ÁNH SÁNG", type: "lighting" },
  { id: "3", name: "NHÂN SỰ & DI CHUYỂN & PHÁT SINH", type: "personnel" },
];

export const sampleEquipments: Equipment[] = [
  { id: 1, name: "SONY FX3 (Body)", category: "1", dailyRate: 1400000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN001", rentalCount: 10, equipmentType: "camera" },
  { id: 2, name: "SONY FE 70-200mm F2.8 GM", category: "1", dailyRate: 500000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN002", rentalCount: 15, equipmentType: "camera" },
  { id: 3, name: "SONY FE 85mm F1.4 GM", category: "1", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN003", rentalCount: 8, equipmentType: "camera" },
  { id: 4, name: "Gimbal DJI Ronin S3 Pro", category: "1", dailyRate: 400000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN004", rentalCount: 12, equipmentType: "camera" },
  { id: 5, name: "Tripod Secced (100)", category: "1", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN005", rentalCount: 20, equipmentType: "camera" },
  { id: 6, name: "NISI 82mm Variable ND Filter 1-5 STOP", category: "1", dailyRate: 200000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN006", rentalCount: 7, equipmentType: "camera" },
  { id: 7, name: 'Monitor Director 18" (4 input)', category: "1", dailyRate: 800000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN007", rentalCount: 5, equipmentType: "camera" },
  { id: 8, name: 'Monitor 5"', category: "1", dailyRate: 300000, quantity: 3, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN008", rentalCount: 9, equipmentType: "camera" },
  { id: 9, name: "AMARAN F22C", category: "2", dailyRate: 500000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN009", rentalCount: 11, equipmentType: "lighting" },
  { id: 10, name: "AMARAN T4C Tube Light", category: "2", dailyRate: 300000, quantity: 6, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN010", rentalCount: 14, equipmentType: "lighting" },
  { id: 11, name: "ALMC Kit 4", category: "2", dailyRate: 1000000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN011", rentalCount: 6, equipmentType: "lighting" },
  { id: 12, name: "Grips & Lighting Accessories (Pro Package)", category: "2", dailyRate: 500000, quantity: 1, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "SN012", rentalCount: 8, equipmentType: "lighting" },
  { id: 13, name: "Kỹ thuật đèn", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF001", rentalCount: 30, equipmentType: "personnel" },
  { id: 14, name: "Kỹ thuật máy", category: "3", dailyRate: 700000, quantity: 2, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "STAFF002", rentalCount: 25, equipmentType: "personnel" },
  { id: 15, name: "Phát sinh khác", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "N/A", serialNumber: "MISC001", rentalCount: 10, equipmentType: "personnel" },
  { id: 16, name: "Xe thiết bị", category: "3", dailyRate: 0, quantity: 999, isAvailable: true, status: "Sẵn sàng", condition: "Tốt", serialNumber: "VH001", rentalCount: 15, equipmentType: "personnel" },
];

export const sampleCustomers = [
  { id: "1", name: "Công ty Phim Việt", contact: "Nguyễn Văn A", phone: "0912345678", email: "vanA@phimviet.com", address: "123 Điện Biên Phủ, Quận 1, TP.HCM" },
  { id: "2", name: "Đoàn phim ABC", contact: "Trần Thị B", phone: "0923456789", email: "thiB@abc.com", address: "456 Lê Lợi, Quận 1, TP.HCM" },
  { id: "3", name: "Studio XYZ", contact: "Lê Văn C", phone: "0934567890", email: "vanC@xyz.com", address: "789 Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: "4", name: "Công ty quảng cáo Delta", contact: "Phạm Thị D", phone: "0945678901", email: "thiD@delta.com", address: "101 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM" },
  { id: "5", name: "Phim trường Future", contact: "Trịnh Văn E", phone: "0956789012", email: "vanE@future.com", address: "202 Đồng Khởi, Quận 1, TP.HCM" },
];

export const sampleRentals: RentalOrder[] = [
  {
    id: 1,
    customerId: "1",
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    startDate: "2023-05-10",
    endDate: "2023-05-15",
    items: [
      { id: "item1", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 5, dailyRate: 1400000, totalAmount: 7000000, discount: 0 },
      { id: "item2", equipmentId: "2", equipmentName: "SONY FE 70-200mm F2.8 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000, discount: 0 }
    ],
    totalAmount: 9500000,
    deposit: 4000000,
    balance: 5500000,
    status: "Hoàn thành",
    createdAt: "2023-05-09",
    handoverCompleted: true
  },
  {
    id: 2,
    customerId: "2",
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    startDate: "2023-05-20",
    endDate: "2023-05-25",
    items: [
      { id: "item3", equipmentId: "4", equipmentName: "Gimbal DJI Ronin S3 Pro", quantity: 1, days: 5, dailyRate: 400000, totalAmount: 2000000, discount: 0 },
      { id: "item4", equipmentId: "3", equipmentName: "SONY FE 85mm F1.4 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000, discount: 0 }
    ],
    totalAmount: 4500000,
    deposit: 2000000,
    balance: 2500000,
    status: "Đang thuê",
    createdAt: "2023-05-19",
    handoverCompleted: true
  },
  {
    id: 3,
    customerId: "3",
    customerName: "Studio XYZ",
    contact: "Lê Văn C",
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    items: [
      { id: "item5", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 4, dailyRate: 1400000, totalAmount: 5600000, discount: 0 },
      { id: "item6", equipmentId: "7", equipmentName: 'Monitor Director 18" (4 input)', quantity: 1, days: 4, dailyRate: 800000, totalAmount: 3200000, discount: 0 }
    ],
    totalAmount: 8800000,
    deposit: 4000000,
    balance: 4800000,
    status: "Đặt trước",
    createdAt: "2023-05-25",
    handoverCompleted: false
  }
];

export const sampleDebts: Debt[] = [
  {
    id: 1,
    customerId: "1",
    customerName: "Công ty Phim Việt",
    contact: "Nguyễn Văn A",
    amount: 5500000,
    dueDate: "2023-05-25",
    issueDate: "2023-05-15",
    description: "Công nợ thuê thiết bị - Đơn hàng #1",
    status: "Đã thanh toán",
    relatedOrderId: 1
  },
  {
    id: 2,
    customerId: "2",
    customerName: "Đoàn phim ABC",
    contact: "Trần Thị B",
    amount: 2500000,
    dueDate: "2023-06-05",
    issueDate: "2023-05-25",
    description: "Công nợ thuê thiết bị - Đơn hàng #2",
    status: "Chưa thanh toán",
    relatedOrderId: 2
  }
];

export const sampleHandoverReports: HandoverReport[] = [
  {
    id: 1,
    rentalId: 1,
    customerName: "Công ty Phim Việt",
    date: "2023-05-10",
    items: [
      { id: "item1", equipmentId: "1", equipmentName: "SONY FX3 (Body)", quantity: 1, days: 5, dailyRate: 1400000, totalAmount: 7000000 },
      { id: "item2", equipmentId: "2", equipmentName: "SONY FE 70-200mm F2.8 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000 }
    ],
    notes: "Thiết bị đã được kiểm tra đầy đủ trước khi bàn giao.",
    signedByCustomer: true,
    signedByStaff: true
  },
  {
    id: 2,
    rentalId: 2,
    customerName: "Đoàn phim ABC",
    date: "2023-05-20",
    items: [
      { id: "item3", equipmentId: "4", equipmentName: "Gimbal DJI Ronin S3 Pro", quantity: 1, days: 5, dailyRate: 400000, totalAmount: 2000000 },
      { id: "item4", equipmentId: "3", equipmentName: "SONY FE 85mm F1.4 GM", quantity: 1, days: 5, dailyRate: 500000, totalAmount: 2500000 }
    ],
    notes: "Khách hàng yêu cầu thêm pin dự phòng cho máy.",
    signedByCustomer: true,
    signedByStaff: true
  }
];
