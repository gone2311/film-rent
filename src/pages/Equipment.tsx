
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileEdit, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dữ liệu mẫu cho thiết bị
const sampleEquipment = [
  {
    id: 1,
    name: "Máy quay Canon C300",
    category: "Máy quay",
    dailyRate: 2500000,
    status: "Sẵn sàng",
    condition: "Tốt"
  },
  {
    id: 2,
    name: "Bộ đèn LED Aputure 120D II",
    category: "Ánh sáng",
    dailyRate: 800000,
    status: "Sẵn sàng",
    condition: "Tốt"
  },
  {
    id: 3,
    name: "Gimbal DJI Ronin-S",
    category: "Phụ kiện",
    dailyRate: 500000,
    status: "Đang thuê",
    condition: "Tốt"
  },
  {
    id: 4,
    name: "Ống kính Sony G Master 24-70mm",
    category: "Ống kính",
    dailyRate: 700000,
    status: "Sẵn sàng",
    condition: "Tốt"
  },
  {
    id: 5,
    name: "Microphone Rode NTG4+",
    category: "Âm thanh",
    dailyRate: 350000,
    status: "Đang thuê",
    condition: "Tốt"
  }
];

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipment, setEquipment] = useState(sampleEquipment);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Lọc thiết bị theo từ khóa tìm kiếm
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm thêm thiết bị mới
  const addEquipment = (newEquipment: any) => {
    setEquipment([...equipment, { 
      id: equipment.length + 1, 
      ...newEquipment, 
      status: "Sẵn sàng" 
    }]);
  };

  const handleEditEquipment = (id: number) => {
    // Implement edit logic here
    toast({
      title: "Chức năng đang phát triển",
      description: "Chức năng chỉnh sửa thiết bị sẽ sớm được cập nhật",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thiết bị</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm thiết bị
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm thiết bị mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin thiết bị mới vào form bên dưới
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addEquipment({
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                dailyRate: Number(formData.get('dailyRate')),
                condition: formData.get('condition') as string
              });
              e.currentTarget.reset();
              setIsDialogOpen(false);
              toast({
                title: "Thiết bị đã được thêm",
                description: "Thiết bị mới đã được thêm vào danh sách",
              });
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên thiết bị
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Danh mục
                  </Label>
                  <Input id="category" name="category" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dailyRate" className="text-right">
                    Giá thuê/ngày
                  </Label>
                  <Input 
                    id="dailyRate" 
                    name="dailyRate" 
                    type="number" 
                    className="col-span-3" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Tình trạng
                  </Label>
                  <Input id="condition" name="condition" className="col-span-3" defaultValue="Tốt" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Lưu thiết bị</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiết bị</CardTitle>
          <CardDescription>
            Quản lý tất cả thiết bị cho thuê của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thiết bị..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết bị</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá thuê/ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.dailyRate.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      item.status === "Sẵn sàng" 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.condition}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEquipment(item.id)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          // Toggle status
                          const newStatus = item.status === "Sẵn sàng" ? "Đang thuê" : "Sẵn sàng";
                          setEquipment(
                            equipment.map(eq => 
                              eq.id === item.id ? {...eq, status: newStatus} : eq
                            )
                          );
                          toast({
                            title: "Đã cập nhật trạng thái",
                            description: `Thiết bị ${item.name} đã được chuyển sang ${newStatus}`,
                          });
                        }}>
                          {item.status === "Sẵn sàng" ? "Đánh dấu đang thuê" : "Đánh dấu sẵn sàng"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEquipment(equipment.filter(eq => eq.id !== item.id));
                          toast({
                            title: "Đã xóa thiết bị",
                            description: `Thiết bị ${item.name} đã được xóa khỏi danh sách`,
                            variant: "destructive"
                          });
                        }} className="text-destructive">
                          Xóa thiết bị
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredEquipment.length} trên tổng số {equipment.length} thiết bị
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Equipment;
