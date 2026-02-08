import { api } from "./axios";

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export type CreateEmployeePayload = {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get("/employees");
  return res.data;
};

export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<Employee> => {
  const res = await api.post("/employees", payload);
  return res.data;
};

export const deleteEmployee = async (id: number) => {
  await api.delete(`/employees/${id}`);
};

export const getAttendanceSummary = async (employeeId: number) => {
  const res = await api.get(`/employees/${employeeId}/attendance-summary`);
  return res.data;
};
