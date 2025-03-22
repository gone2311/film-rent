
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
import { FileEdit, PlusCircle, Search, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Định nghĩa schema Zod cho form thêm phông nền
const backdropFormSchema = z.object({
  name: z.string().min(1, { message: "Tên phông nền không được để trống" }),
  code: z.string().min(1, { message: "Mã phông nền không được để trống" }),
  category: z.string().min(1, { message: "Danh mục không được để trống" }),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Giá thuê không hợp lệ" }),
  size: z.string().min(1, { message: "Kích thước không được để trống" }),
  material: z.string().min(1, { message: "Chất liệu không được để trống" }),
  image: z.string().optional(),
});

type BackdropFormValues = z.infer<typeof backdropFormSchema>;

// Dữ liệu mẫu cho danh mục phông nền
const backdropCategories = [
  "Phông chụp ảnh",
  "Phông studio",
  "Phông cưới",
  "Phông sự kiện",
  "Phông quảng cáo",
  "Phông hoa",
  "Phông abstract",
  "Phông trơn"
];

// Dữ liệu mẫu cho kích thước phông
const backdropSizes = [
  "2m x 3m",
  "3m x 5m",
  "4m x 6m",
  "5m x 7m",
  "6m x 10m",
  "Tùy chỉnh"
];

// Dữ liệu mẫu cho chất liệu phông
const backdropMaterials = [
  "Vải muslin",
  "Vải không dệt",
  "Vải canvas",
  "Vải lụa",
  "Giấy",
  "Vinyl",
  "Vải nhung"
];

// Dữ liệu mẫu cho phông nền
const sampleBackdrops = [
  {
    id: 1,
    name: "Phông nền hoa hồng",
    code: "BG-001",
    category: "Phông hoa",
    description: "Phông nền với họa tiết hoa hồng sang trọng, phù hợp cho chụp ảnh thời trang, cưới",
    price: 500000,
    size: "3m x 5m",
    material: "Vải muslin",
    image: "https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: true
  },
  {
    id: 2,
    name: "Phông nền trơn xanh dương",
    code: "BG-002",
    category: "Phông trơn",
    description: "Phông nền màu xanh dương trơn, dễ dàng chỉnh sửa hậu kỳ",
    price: 300000,
    size: "4m x 6m",
    material: "Vải canvas",
    image: "https://images.pexels.com/photos/2909077/pexels-photo-2909077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: true
  },
  {
    id: 3,
    name: "Phông nền đám cưới",
    code: "BG-003",
    category: "Phông cưới",
    description: "Phông nền trang trí đám cưới với hoa và đèn LED",
    price: 800000,
    size: "5m x 7m",
    material: "Vải nhung",
    image: "https://images.pexels.com/photos/3585798/pexels-photo-3585798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: false
  },
  {
    id: 4,
    name: "Phông nền gradient",
    code: "BG-004",
    category: "Phông studio",
    description: "Phông nền gradient từ xanh sang tím, phù hợp cho chụp thời trang, sản phẩm",
    price: 400000,
    size: "3m x 5m",
    material: "Vải canvas",
    image: "https://images.pexels.com/photos/3800117/pexels-photo-3800117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: true
  },
  {
    id: 5,
    name: "Phông nền ngày lễ",
    code: "BG-005",
    category: "Phông sự kiện",
    description: "Phông nền cho các sự kiện lễ hội, sinh nhật với tông màu rực rỡ",
    price: 600000,
    size: "4m x 6m",
    material: "Vải không dệt",
    image: "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: true
  },
  {
    id: 6,
    name: "Phông nền texture đá cẩm thạch",
    code: "BG-006",
    category: "Phông abstract",
    description: "Phông nền với họa tiết vân đá cẩm thạch, phù hợp chụp sản phẩm cao cấp",
    price: 550000,
    size: "2m x 3m",
    material: "Vinyl",
    image: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAvailable: true
  }
];

const Backdrop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [backdrops, setBackdrops] = useState(sampleBackdrops);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 6;

  const form = useForm<BackdropFormValues>({
    resolver: zodResolver(backdropFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      description: "",
      price: 0,
      size: "",
      material: "",
      image: "",
    },
  });

  // Lọc phông nền theo tab và từ khóa tìm kiếm
  const filteredBackdrops = backdrops.filter(backdrop => {
    // Lọc theo tab
    if (activeTab !== "all" && backdrop.category !== activeTab) {
      return false;
    }
    
    // Lọc theo từ khóa tìm kiếm
    return (
      backdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backdrop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backdrop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backdrop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Phân trang
  const totalPages = Math.ceil(filteredBackdrops.length / itemsPerPage);
  const currentBackdrops = filteredBackdrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onSubmit = (data: BackdropFormValues) => {
    // Thêm phông nền mới vào danh sách
    const newBackdrop = {
      id: backdrops.length + 1,
      name: data.name,
      code: data.code,
      category: data.category,
      description: data.description || "",
      price: data.price,
      size: data.size,
      material: data.material,
      image: data.image || "https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isAvailable: true
    };
    
    setBackdrops([...backdrops, newBackdrop]);
    
    // Hiển thị thông báo
    toast({
      title: "Thêm phông nền thành công",
      description: `Đã thêm phông nền ${data.name}`,
    });
    
    // Reset form và đóng dialog
    form.reset();
    setIsDialogOpen(false);
  };

  const handleDeleteBackdrop = (id: number) => {
    setBackdrops(backdrops.filter(backdrop => backdrop.id !== id));
    toast({
      title: "Xóa phông nền thành công",
      description: "Phông nền đã được xóa khỏi hệ thống",
    });
  };

  const handleToggleAvailability = (id: number) => {
    setBackdrops(backdrops.map(backdrop => 
      backdrop.id === id 
        ? { ...backdrop, isAvailable: !backdrop.isAvailable } 
        : backdrop
    ));
    
    const backdrop = backdrops.find(b => b.id === id);
    toast({
      title: backdrop?.isAvailable ? "Đã đánh dấu không có sẵn" : "Đã đánh dấu có sẵn",
      description: `Phông nền ${backdrop?.name} đã được cập nhật trạng thái`,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý phông nền</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm phông nền
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm phông nền mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin phông nền mới vào form bên dưới.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên phông nền</FormLabel>
                        <FormControl>
                          <Input placeholder="Phông nền hoa hồng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã phông nền</FormLabel>
                        <FormControl>
                          <Input placeholder="BG-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Chọn danh mục</option>
                            {backdropCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá thuê (VNĐ)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="500000" 
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kích thước</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Chọn kích thước</option>
                            {backdropSizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chất liệu</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Chọn chất liệu</option>
                            {backdropMaterials.map((material) => (
                              <option key={material} value={material}>
                                {material}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Mô tả chi tiết về phông nền..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="URL hình ảnh" 
                            {...field} 
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">Hủy</Button>
                  <Button type="submit">Thêm phông nền</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full max-w-md grid grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="Phông hoa">Phông hoa</TabsTrigger>
              <TabsTrigger value="Phông trơn">Phông trơn</TabsTrigger>
              <TabsTrigger value="Phông studio">Phông studio</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phông nền..."
              className="w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentBackdrops.map((backdrop) => (
            <Card key={backdrop.id} className={backdrop.isAvailable ? "" : "opacity-70"}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                <img 
                  src={backdrop.image} 
                  alt={backdrop.name}
                  className="object-cover w-full h-full"
                />
                {!backdrop.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Đang cho thuê
                    </span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{backdrop.name}</CardTitle>
                    <CardDescription className="text-xs">Mã: {backdrop.code}</CardDescription>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    {backdrop.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm py-1">
                      Thông tin chi tiết
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <div className="space-y-2">
                        <p><span className="font-medium">Kích thước:</span> {backdrop.size}</p>
                        <p><span className="font-medium">Chất liệu:</span> {backdrop.material}</p>
                        <p><span className="font-medium">Mô tả:</span> {backdrop.description}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-2 font-bold text-lg">
                  {backdrop.price.toLocaleString()} VNĐ/ngày
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleToggleAvailability(backdrop.id)}
                >
                  {backdrop.isAvailable ? "Đánh dấu đã thuê" : "Đánh dấu có sẵn"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteBackdrop(backdrop.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <FileEdit className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Backdrop;
