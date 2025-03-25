
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DialogTrigger } from "@/components/ui/dialog";
import { Customer } from "@/types/customer";
import { CustomerForm, CustomerFormValues } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { sampleCustomers } from "@/data/customers";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFormSubmit = (data: CustomerFormValues) => {
    if (editingCustomer) {
      // Cập nhật khách hàng hiện có
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...data } 
          : customer
      );
      setCustomers(updatedCustomers);
      
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật thông tin khách hàng ${data.name}`,
      });
    } else {
      // Thêm khách hàng mới vào danh sách
      const newCustomer = {
        id: customers.length + 1,
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        address: data.address,
        totalRentals: 0
      };
      
      setCustomers([...customers, newCustomer]);
      
      toast({
        title: "Tạo khách hàng thành công",
        description: `Đã thêm khách hàng ${data.name}`,
      });
    }
    
    // Reset form và đóng dialog
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <DialogTrigger asChild onClick={() => {
          setEditingCustomer(null);
          setIsDialogOpen(true);
        }}>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        </DialogTrigger>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả khách hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerSearch 
            searchTerm={searchTerm} 
            onSearch={handleSearch} 
          />
          <CustomerTable 
            customers={filteredCustomers} 
            onEditCustomer={handleEdit} 
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredCustomers.length} trên tổng số {customers.length} khách hàng
          </p>
        </CardFooter>
      </Card>

      <CustomerForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        editingCustomer={editingCustomer}
      />
    </div>
  );
};

export default Customers;
