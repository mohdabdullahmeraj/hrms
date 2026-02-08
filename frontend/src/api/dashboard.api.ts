import { api } from "./axios";

export type DashboardSummary = {
  total_employees: number;
  present_today: number;
  absent_today: number;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};
