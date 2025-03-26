
import { z } from "zod";

export const rentalFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn khách hàng" }),
  startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
  deposit: z.number().min(0, { message: "Tiền đặt cọc không hợp lệ" }),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Vui lòng chọn trạng thái" }),
  discount: z.number().min(0).max(100).optional(),
});

export const handoverFormSchema = z.object({
  notes: z.string().optional(),
  signedByCustomer: z.boolean().default(false),
  signedByStaff: z.boolean().default(false),
});

export const maintenanceFormSchema = z.object({
  maintenanceNotes: z.string().min(1, { message: "Vui lòng nhập ghi chú bảo trì" }),
  maintenanceLocation: z.string().min(1, { message: "Vui lòng nhập địa điểm bảo trì" }),
});

export type RentalFormValues = z.infer<typeof rentalFormSchema>;
export type HandoverFormValues = z.infer<typeof handoverFormSchema>;
export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;
