
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Equipment } from "@/types/customer";
import { MaintenanceFormValues, maintenanceFormSchema } from "./RentalSchema";

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormValues) => void;
  equipment: Equipment;
}

export function MaintenanceForm({ onSubmit, equipment }: MaintenanceFormProps) {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      maintenanceNotes: equipment.maintenanceNotes || "",
      maintenanceLocation: equipment.maintenanceLocation || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Cập nhật thông tin bảo trì</h3>
          <p className="text-sm text-muted-foreground">Thiết bị: {equipment.name}</p>
        </div>

        <FormField
          control={form.control}
          name="maintenanceNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú bảo trì</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Nhập ghi chú về tình trạng bảo trì" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maintenanceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm bảo trì</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập địa điểm bảo trì" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">Cập nhật thông tin bảo trì</Button>
        </div>
      </form>
    </Form>
  );
}
