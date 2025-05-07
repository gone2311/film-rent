
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Hàm trích xuất dữ liệu từ một bảng trong Supabase và xuất ra file Excel
 * 
 * @param tableName - Tên bảng cần trích xuất dữ liệu
 * @param fileName - Tên file Excel sau khi xuất (không cần đuôi .xlsx)
 * @param columns - Các cột cần lấy dữ liệu, để trống nếu muốn lấy tất cả
 * @param filter - Điều kiện lọc dữ liệu trước khi xuất (tùy chọn)
 */
export const exportTableToExcel = async (
  tableName: string,
  fileName: string,
  columns?: string[],
  filter?: { column: string; operator: string; value: any }[]
) => {
  try {
    // Bắt đầu truy vấn
    let query = supabase.from(tableName).select(columns ? columns.join(',') : '*');

    // Áp dụng bộ lọc nếu có
    if (filter && filter.length > 0) {
      filter.forEach(condition => {
        query = query.filter(condition.column, condition.operator, condition.value);
      });
    }

    // Thực hiện truy vấn
    const { data, error } = await query;

    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
      throw new Error(`Không thể lấy dữ liệu từ bảng ${tableName}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('Không có dữ liệu để xuất');
      return;
    }

    // Chuyển đổi dữ liệu thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Tạo workbook và thêm worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
    
    // Xuất ra file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    // Tải file về máy
    saveAs(blob, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất dữ liệu:', error);
    throw error;
  }
};

/**
 * Hàm trích xuất dữ liệu từ nhiều bảng trong Supabase và xuất ra các sheet khác nhau trong một file Excel
 * 
 * @param tables - Mảng các đối tượng chứa thông tin về bảng cần xuất
 * @param fileName - Tên file Excel sau khi xuất (không cần đuôi .xlsx)
 */
export const exportMultipleTablesToExcel = async (
  tables: {
    tableName: string;
    sheetName: string;
    columns?: string[];
    filter?: { column: string; operator: string; value: any }[];
  }[],
  fileName: string
) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Xử lý từng bảng và thêm vào workbook
    for (const table of tables) {
      // Bắt đầu truy vấn
      let query = supabase
        .from(table.tableName)
        .select(table.columns ? table.columns.join(',') : '*');

      // Áp dụng bộ lọc nếu có
      if (table.filter && table.filter.length > 0) {
        table.filter.forEach(condition => {
          query = query.filter(condition.column, condition.operator, condition.value);
        });
      }

      // Thực hiện truy vấn
      const { data, error } = await query;

      if (error) {
        console.error(`Lỗi khi truy vấn dữ liệu từ bảng ${table.tableName}:`, error);
        continue;
      }

      if (!data || data.length === 0) {
        console.warn(`Không có dữ liệu để xuất từ bảng ${table.tableName}`);
        continue;
      }

      // Chuyển đổi dữ liệu thành worksheet và thêm vào workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, table.sheetName);
    }

    // Kiểm tra xem có sheet nào được thêm vào hay không
    if (workbook.SheetNames.length === 0) {
      throw new Error('Không có dữ liệu để xuất từ bất kỳ bảng nào');
    }
    
    // Xuất ra file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    // Tải file về máy
    saveAs(blob, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất dữ liệu:', error);
    throw error;
  }
};

/**
 * Hàm lấy danh sách tất cả các bảng trong database
 * 
 * @returns Danh sách tên các bảng
 */
export const getAllTables = async () => {
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('Lỗi khi lấy danh sách bảng:', error);
      throw error;
    }

    return data.map(item => item.tablename);
  } catch (error) {
    console.error('Lỗi khi truy vấn danh sách bảng:', error);
    throw error;
  }
};

<lov-add-dependency>file-saver@^2.0.5</lov-add-dependency>
