import { api } from "./axios";

export type AttendanceStatus = "Present" | "Absent";

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  marked_at: string;
  status: AttendanceStatus;
}

export const markAttendance = async (payload: {
  employee_id: number;
  status: AttendanceStatus;
}) => {
  await api.post("/attendance", payload);
};

export const getAttendance = async (
  employeeId: number,
  params?: {
    date?: string;
    from_date?: string;
    to_date?: string;
  }
): Promise<AttendanceRecord[]> => {
  const res = await api.get(`/attendance/${employeeId}`, { params });
  return res.data;
};
