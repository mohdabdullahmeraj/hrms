import { useEffect, useState } from "react";
import { toast } from "sonner";

import { type Employee, getEmployees } from "@/api/employee.api";
import {
  type AttendanceRecord,
  type AttendanceStatus,
  getAttendance,
  markAttendance,
} from "@/api/attendance.api";
import { getAttendanceSummary } from "@/api/employee.api";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [presentDays, setPresentDays] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  /* ================= LOAD ATTENDANCE ================= */
  useEffect(() => {
    if (!selectedEmployee) return;

    setLoading(true);

    Promise.all([
      getAttendance(selectedEmployee.id, {
        date: filterDate ?? undefined,
        from_date: fromDate ?? undefined,
        to_date: toDate ?? undefined,
      }),
      getAttendanceSummary(selectedEmployee.id),
    ])
      .then(([attendance, summary]) => {
        setRecords(attendance);
        setPresentDays(summary.present_days);
      })
      .catch(() => toast.error("Failed to load attendance"))
      .finally(() => setLoading(false));
  }, [selectedEmployee, filterDate, fromDate, toDate]);

  /* ================= MARK ATTENDANCE ================= */
  const handleMarkAttendance = async (status: AttendanceStatus) => {
    if (!selectedEmployee) return;

    try {
      await markAttendance({
        employee_id: selectedEmployee.id,
        status,
      });

      toast.success(`Marked ${status}`);

      const updatedAttendance = await getAttendance(selectedEmployee.id);
      setRecords(updatedAttendance);

      const summary = await getAttendanceSummary(selectedEmployee.id);
      setPresentDays(summary.present_days);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to mark attendance");
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* ================= HEADER ================= */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage employee attendance
        </p>
      </header>

      {/* ================= EMPLOYEE & SUMMARY ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Select Employee</CardTitle>
          <CardDescription>
            Choose an employee to view and mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 text-white">
          <Select
            onValueChange={(id) =>
              setSelectedEmployee(
                employees.find((e) => e.id === Number(id)) || null
              )
            }
          >
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={String(emp.id)}>
                  {emp.full_name} ({emp.employee_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEmployee && (
            <div className="flex-1">
              <Card className="max-w-xs">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Present Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-semibold">{presentDays}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= MARK ATTENDANCE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Mark attendance for today
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            disabled={!selectedEmployee}
            onClick={() => handleMarkAttendance("Present")}
          >
            Mark Present
          </Button>
          <Button
            variant="destructive"
            disabled={!selectedEmployee}
            onClick={() => handleMarkAttendance("Absent")}
          >
            Mark Absent
          </Button>
        </CardContent>
      </Card>

      {/* ================= FILTERS ================= */}
      {selectedEmployee && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter attendance by date or date range
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm"
                value={filterDate ?? ""}
                onChange={(e) => {
                  setFilterDate(e.target.value || null);
                  setFromDate(null);
                  setToDate(null);
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">From</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm"
                value={fromDate ?? ""}
                onChange={(e) => {
                  setFromDate(e.target.value || null);
                  setFilterDate(null);
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">To</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm"
                value={toDate ?? ""}
                onChange={(e) => {
                  setToDate(e.target.value || null);
                  setFilterDate(null);
                }}
              />
            </div>

            <Button
            variant="outline"
            className="text-white"
            onClick={() => {
                setFilterDate(null);
                setFromDate(null);
                setToDate(null);
            }}
            >
            Clear filters
            </Button>

          </CardContent>
        </Card>
      )}

      {/* ================= TABLE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Historical attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedEmployee ? (
            <p className="text-muted-foreground">
              Select an employee to view attendance.
            </p>
          ) : loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground">
              No attendance records found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                    {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(new Date(rec.marked_at))}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          rec.status === "Present"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {rec.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
