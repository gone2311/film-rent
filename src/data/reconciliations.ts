
import { PartnerReconciliation } from "@/types/reconciliation";

export const samplePartnerReconciliations: PartnerReconciliation[] = [
  {
    partnerId: 1,
    name: "XYZ Film Studio",
    contact: "Đinh Văn E",
    totalTheyRent: 32000000,
    totalWeRent: 18500000,
    status: "Đã đối soát",
    periods: [
      {
        id: 1,
        fromDate: "2023-10-01",
        toDate: "2023-10-31",
        status: "Đã đối soát",
        theyRentFromUs: [
          { id: 1, description: "Thiết bị quay phim dự án A", date: "2023-10-05", returnDate: "2023-10-10", amount: 15000000, partnerAmount: 15000000, diff: 0 },
          { id: 2, description: "Dịch vụ hậu kỳ", date: "2023-10-15", returnDate: "2023-10-20", amount: 8000000, partnerAmount: 8000000, diff: 0 },
          { id: 3, description: "Thiết bị âm thanh", date: "2023-10-25", returnDate: "2023-10-30", amount: 9000000, partnerAmount: 9000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 1, description: "Phim trường ngoại cảnh", date: "2023-10-02", returnDate: "2023-10-04", amount: 10000000, partnerAmount: 10000000, diff: 0 },
          { id: 2, description: "Nhân sự diễn viên quần chúng", date: "2023-10-12", returnDate: "2023-10-15", amount: 5000000, partnerAmount: 5000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 2,
    name: "ABC Production",
    contact: "Trương Thị F",
    totalTheyRent: 45000000,
    totalWeRent: 28000000,
    status: "Chờ xác nhận",
    periods: [
      {
        id: 2,
        fromDate: "2023-11-01",
        toDate: "2023-11-30",
        status: "Chờ xác nhận",
        theyRentFromUs: [
          { id: 4, description: "Máy quay Sony FS7", date: "2023-11-05", returnDate: "2023-11-15", amount: 20000000, partnerAmount: 20000000, diff: 0 },
          { id: 5, description: "Ánh sáng và phụ kiện", date: "2023-11-10", returnDate: "2023-11-20", amount: 15000000, partnerAmount: 13500000, diff: 1500000 },
          { id: 6, description: "Drone DJI Mavic 3", date: "2023-11-25", returnDate: "2023-11-30", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 3, description: "Phim trường studio", date: "2023-11-08", returnDate: "2023-11-12", amount: 18000000, partnerAmount: 18000000, diff: 0 },
          { id: 4, description: "Diễn viên và makeup", date: "2023-11-18", returnDate: "2023-11-22", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 3,
    name: "Delta Media",
    contact: "Ngô Văn G",
    totalTheyRent: 27000000,
    totalWeRent: 15000000,
    status: "Chờ xử lý",
    periods: [
      {
        id: 3,
        fromDate: "2023-11-15",
        toDate: "2023-12-15",
        status: "Chờ xử lý",
        theyRentFromUs: [
          { id: 7, description: "Thiết bị quay TVC", date: "2023-11-20", returnDate: "2023-11-30", amount: 12000000, partnerAmount: 12000000, diff: 0 },
          { id: 8, description: "Bộ đèn studio", date: "2023-12-01", returnDate: "2023-12-10", amount: 8000000, partnerAmount: 6000000, diff: 2000000 },
          { id: 9, description: "Phí nhân sự", date: "2023-12-10", returnDate: "2023-12-15", amount: 7000000, partnerAmount: 7000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 5, description: "Thiết bị livestream", date: "2023-11-18", returnDate: "2023-11-25", amount: 8000000, partnerAmount: 8000000, diff: 0 },
          { id: 6, description: "Phim trường xanh", date: "2023-12-05", returnDate: "2023-12-12", amount: 7000000, partnerAmount: 7000000, diff: 0 }
        ]
      }
    ]
  },
  {
    partnerId: 4,
    name: "Omega Film",
    contact: "Lý Thị H",
    totalTheyRent: 36500000,
    totalWeRent: 22000000,
    status: "Đã đối soát",
    periods: [
      {
        id: 4,
        fromDate: "2023-12-01",
        toDate: "2023-12-31",
        status: "Đã đối soát",
        theyRentFromUs: [
          { id: 10, description: "Thiết bị quay phim ngắn", date: "2023-12-05", returnDate: "2023-12-15", amount: 18500000, partnerAmount: 18500000, diff: 0 },
          { id: 11, description: "Bộ ống kính cinema", date: "2023-12-10", returnDate: "2023-12-20", amount: 10000000, partnerAmount: 10000000, diff: 0 },
          { id: 12, description: "Thiết bị âm thanh và thu âm", date: "2023-12-15", returnDate: "2023-12-25", amount: 8000000, partnerAmount: 8000000, diff: 0 }
        ],
        weRentFromThem: [
          { id: 7, description: "Thiết bị làm mưa nhân tạo", date: "2023-12-08", returnDate: "2023-12-12", amount: 12000000, partnerAmount: 12000000, diff: 0 },
          { id: 8, description: "Trang phục và đạo cụ", date: "2023-12-15", returnDate: "2023-12-25", amount: 10000000, partnerAmount: 10000000, diff: 0 }
        ]
      }
    ]
  },
];
