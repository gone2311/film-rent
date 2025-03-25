
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CustomerSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const CustomerSearch = ({ searchTerm, onSearch }: CustomerSearchProps) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm khách hàng..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
