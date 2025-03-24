
import { utils, writeFile } from 'xlsx';

export type ReconciliationPartner = {
  partnerId: number;
  name: string;
  contact: string;
  totalTheyRent: number;
  totalWeRent: number;
  status: string;
  periods: ReconciliationPeriod[];
};

export type ReconciliationPeriod = {
  id: number;
  fromDate: string;
  toDate: string;
  status: string;
  theyRentFromUs: ReconciliationItem[];
  weRentFromThem: ReconciliationItem[];
};

export type ReconciliationItem = {
  id: number;
  description: string;
  date: string;
  returnDate: string;
  amount: number;
  partnerAmount: number;
  diff: number;
};

export const exportReconciliationToExcel = (
  partnerData: ReconciliationPartner,
  period: ReconciliationPeriod,
  companyName: string,
  oldDebt: number = 0
) => {
  // Tạo workbook mới
  const wb = utils.book_new();
  
  // Dữ liệu tiêu đề
  const headerData = [
    [`BÁO CÁO ĐỐI SOÁT CÔNG NỢ - ${companyName}`, '', '', '', '', '', ''],
    [`Đối tác: ${partnerData.name}`, '', '', '', '', '', ''],
    [`Liên hệ: ${partnerData.contact}`, '', '', '', '', '', ''],
    [`Kỳ đối soát: ${period.fromDate} đến ${period.toDate}`, '', '', '', '', '', ''],
    [`Trạng thái: ${period.status}`, '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
  ];
  
  // Dữ liệu công nợ cũ
  const oldDebtData = [
    ['CÔNG NỢ CŨ', '', '', '', '', '', ''],
    ['Công nợ đầu kỳ', oldDebt.toLocaleString('vi-VN') + ' VNĐ', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
  ];
  
  // Dữ liệu đối tác thuê của mình
  const theyRentHeader = [
    ['ĐỐI TÁC THUÊ CỦA CHÚNG TÔI', '', '', '', '', '', ''],
    ['Mô tả', 'Ngày thuê', 'Ngày trả', 'Số tiền của chúng tôi', 'Số tiền đối tác', 'Chênh lệch', 'Ghi chú'],
  ];
  
  const theyRentData = period.theyRentFromUs.map(item => [
    item.description,
    item.date,
    item.returnDate,
    item.amount.toLocaleString('vi-VN') + ' VNĐ',
    item.partnerAmount.toLocaleString('vi-VN') + ' VNĐ',
    item.diff.toLocaleString('vi-VN') + ' VNĐ',
    ''
  ]);
  
  const theyRentTotal = [
    [
      'Tổng cộng',
      '',
      '',
      period.theyRentFromUs.reduce((sum, item) => sum + item.amount, 0).toLocaleString('vi-VN') + ' VNĐ',
      period.theyRentFromUs.reduce((sum, item) => sum + item.partnerAmount, 0).toLocaleString('vi-VN') + ' VNĐ',
      period.theyRentFromUs.reduce((sum, item) => sum + item.diff, 0).toLocaleString('vi-VN') + ' VNĐ',
      ''
    ],
    ['', '', '', '', '', '', ''],
  ];
  
  // Dữ liệu mình thuê của đối tác
  const weRentHeader = [
    ['CHÚNG TÔI THUÊ CỦA ĐỐI TÁC', '', '', '', '', '', ''],
    ['Mô tả', 'Ngày thuê', 'Ngày trả', 'Số tiền của chúng tôi', 'Số tiền đối tác', 'Chênh lệch', 'Ghi chú'],
  ];
  
  const weRentData = period.weRentFromThem.map(item => [
    item.description,
    item.date,
    item.returnDate,
    item.amount.toLocaleString('vi-VN') + ' VNĐ',
    item.partnerAmount.toLocaleString('vi-VN') + ' VNĐ',
    item.diff.toLocaleString('vi-VN') + ' VNĐ',
    ''
  ]);
  
  const weRentTotal = [
    [
      'Tổng cộng',
      '',
      '',
      period.weRentFromThem.reduce((sum, item) => sum + item.amount, 0).toLocaleString('vi-VN') + ' VNĐ',
      period.weRentFromThem.reduce((sum, item) => sum + item.partnerAmount, 0).toLocaleString('vi-VN') + ' VNĐ',
      period.weRentFromThem.reduce((sum, item) => sum + item.diff, 0).toLocaleString('vi-VN') + ' VNĐ',
      ''
    ],
    ['', '', '', '', '', '', ''],
  ];
  
  // Dữ liệu tổng kết
  const totalTheyRent = period.theyRentFromUs.reduce((sum, item) => sum + item.amount, 0);
  const totalWeRent = period.weRentFromThem.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalTheyRent - totalWeRent + oldDebt;
  
  const summaryData = [
    ['TỔNG KẾT CÔNG NỢ', '', '', '', '', '', ''],
    ['Công nợ đầu kỳ', oldDebt.toLocaleString('vi-VN') + ' VNĐ', '', '', '', '', ''],
    ['Đối tác thuê của chúng tôi', totalTheyRent.toLocaleString('vi-VN') + ' VNĐ', '', '', '', '', ''],
    ['Chúng tôi thuê của đối tác', totalWeRent.toLocaleString('vi-VN') + ' VNĐ', '', '', '', '', ''],
    ['Công nợ cuối kỳ', balance.toLocaleString('vi-VN') + ' VNĐ', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Ngày đối soát: ' + new Date().toLocaleDateString('vi-VN'), '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['Đại diện bên A', '', '', 'Đại diện bên B', '', '', ''],
    ['(Ký, ghi rõ họ tên)', '', '', '(Ký, ghi rõ họ tên)', '', '', ''],
  ];
  
  // Kết hợp tất cả dữ liệu
  const allData = [
    ...headerData,
    ...oldDebtData,
    ...theyRentHeader,
    ...theyRentData,
    ...theyRentTotal,
    ...weRentHeader,
    ...weRentData,
    ...weRentTotal,
    ...summaryData
  ];
  
  // Tạo worksheet từ dữ liệu
  const ws = utils.aoa_to_sheet(allData);
  
  // Thiết lập định dạng cột
  const wscols = [
    { wch: 30 }, // Mô tả
    { wch: 15 }, // Ngày thuê
    { wch: 15 }, // Ngày trả
    { wch: 20 }, // Số tiền của chúng tôi
    { wch: 20 }, // Số tiền đối tác
    { wch: 20 }, // Chênh lệch
    { wch: 20 }, // Ghi chú
  ];
  
  ws['!cols'] = wscols;
  
  // Thêm worksheet vào workbook
  utils.book_append_sheet(wb, ws, "Đối soát công nợ");
  
  // Xuất file
  const fileName = `Doi_soat_cong_no_${partnerData.name.replace(/\s+/g, '_')}_${period.fromDate}_${period.toDate}.xlsx`;
  writeFile(wb, fileName);
  
  return fileName;
};
