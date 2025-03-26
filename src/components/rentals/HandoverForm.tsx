
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
import { Checkbox } from "@/components/ui/checkbox";
import { RentalOrder } from "@/types/customer";
import { HandoverFormValues, handoverFormSchema } from "./RentalSchema";

interface HandoverFormProps {
  onSubmit: (data: HandoverFormValues) => void;
  rental: RentalOrder;
}

export function HandoverForm({ onSubmit, rental }: HandoverFormProps) {
  const form = useForm<HandoverFormValues>({
    resolver: zodResolver(handoverFormSchema),
    defaultValues: {
      notes: "",
      signedByCustomer: false,
      signedByStaff: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Bàn giao đơn hàng #{rental.id}</h3>
          <p className="text-sm text-muted-foreground">Khách hàng: {rental.customerName}</p>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú bàn giao</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Nhập ghi chú bàn giao thiết bị" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signedByCustomer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Khách hàng đã xác nhận bàn giao</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signedByStaff"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Nhân viên đã xác nhận bàn giao</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">Xác nhận bàn giao</Button>
        </div>
      </form>
    </Form>
  );
}
