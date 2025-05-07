
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { exportTableToExcel, exportMultipleTablesToExcel, getAllTables } from '@/utils/databaseExport';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const DatabaseExporter = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [fileName, setFileName] = useState('exported_data');
  const [loading, setLoading] = useState(false);
  const [loadingTables, setLoadingTables] = useState(true);

  // Lấy danh sách các bảng khi component được mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tableNames = await getAllTables();
        setTables(tableNames);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bảng:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy danh sách bảng từ database',
          variant: 'destructive',
        });
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  const handleExport = async () => {
    if (!selectedTable) {
      toast({
        title: 'Thông báo',
        description: 'Vui lòng chọn bảng cần xuất dữ liệu',
        variant: 'default',
      });
      return;
    }

    setLoading(true);

    try {
      await exportTableToExcel(selectedTable, fileName || 'exported_data');
      toast({
        title: 'Thành công',
        description: `Đã xuất dữ liệu từ bảng ${selectedTable} thành công`,
      });
    } catch (error) {
      console.error('Lỗi khi xuất dữ liệu:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu, vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setLoading(true);

    try {
      // Tạo một mảng các đối tượng bảng để xuất
      const tableConfigs = tables.map(table => ({
        tableName: table,
        sheetName: table.slice(0, 31), // Excel giới hạn tên sheet 31 ký tự
      }));

      await exportMultipleTablesToExcel(tableConfigs, fileName || 'all_data');
      toast({
        title: 'Thành công',
        description: 'Đã xuất toàn bộ dữ liệu thành công',
      });
    } catch (error) {
      console.error('Lỗi khi xuất dữ liệu:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu, vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Xuất dữ liệu từ Database</CardTitle>
        <CardDescription>Trích xuất dữ liệu từ database sang file Excel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium mb-1">Tên file</label>
          <Input
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Tên file xuất (không cần đuôi .xlsx)"
          />
        </div>

        <div>
          <label htmlFor="table" className="block text-sm font-medium mb-1">Chọn bảng</label>
          {loadingTables ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tải danh sách bảng...</span>
            </div>
          ) : (
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger id="table">
                <SelectValue placeholder="Chọn bảng cần xuất" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button onClick={handleExport} disabled={loading || !selectedTable} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              'Xuất bảng đã chọn'
            )}
          </Button>
          
          <Button onClick={handleExportAll} disabled={loading || tables.length === 0} variant="secondary" className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              'Xuất tất cả bảng'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseExporter;
