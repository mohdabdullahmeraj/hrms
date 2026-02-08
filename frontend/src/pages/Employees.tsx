import { useEffect, useState } from "react";
import { type Employee, getEmployees, deleteEmployee } from "@/api/employee.api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import AddEmployeeDialog from "@/components/employees/AddEmployeeDialog";


export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = () => {
    setLoading(true);
    getEmployees()
      .then(setEmployees)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
        </div>

        <AddEmployeeDialog onSuccess={fetchEmployees} />
      </header>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-muted-foreground">No employees found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.employee_id}</TableCell>
                <TableCell>{emp.full_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell className="text-right">
                  <Button
                    className="bg-red-600! text-white! hover:bg-red-700! border-4 border-black"
                    size="sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
