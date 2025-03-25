
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileEdit } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
}

export const CustomerTable = ({ customers, onEditCustomer }: CustomerTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên công ty</TableHead>
          <TableHead>Người liên hệ</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Địa chỉ</TableHead>
          <TableHead>Số đơn hàng</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.contact}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
            <TableCell>{customer.totalRentals}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEditCustomer(customer)}
              >
                <FileEdit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
