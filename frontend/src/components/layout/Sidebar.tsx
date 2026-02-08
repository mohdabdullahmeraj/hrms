import { NavLink } from "react-router-dom";
import { Separator } from "../ui/separator";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Employees", path: "/employees" },
  { label: "Attendance", path: "/attendance" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r min-h-screen p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">HRMS Lite</h2>

      <Separator className="mb-4" />

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
