import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createEmployee } from "@/api/employee.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const employeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email"),
  department: z.string().min(1, "Department is required"),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

interface Props {
  onSuccess: () => void;
}

export default function AddEmployeeDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeForm) => {
    try {
      await createEmployee(data);
      toast.success("Employee added");
      reset();
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to add employee");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="eg. EMP001" {...register("employee_id")} />
            {errors.employee_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.employee_id.message}
              </p>
            )}
          </div>

          <div>
            <Input placeholder="eg. Joe Norris" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <Input placeholder="eg. joenorris@example.com" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input placeholder="eg. engineering" {...register("department")} />
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
