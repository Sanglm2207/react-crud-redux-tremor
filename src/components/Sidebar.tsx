import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Monitor, 
  Wrench, 
  Info,
  Shield,
  Lock,
  Users,
  Folder
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Báo lỗi" },
    { to: "/devices", icon: Monitor, label: "Thiết bị" },
    { to: "/maintenance", icon: Wrench, label: "Bảo trì & Sửa chữa" },
    { to: "/about", icon: Info, label: "About" },
  ];

  const settingItems = [
    { to: "/settings/users", icon: Users, label: "Users" },
    { to: "/settings/roles", icon: Shield, label: "Roles" },
    { to: "/settings/permissions", icon: Lock, label: "Permissions" },
    { to: "/settings/files", icon: Folder, label: "Files & Media" },
  ];

  const renderNavLink = (to: string, Icon: React.ElementType, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        )
      }
    >
      <Icon size={20} />
      {label}
    </NavLink>
  );

  return (
    <div className="h-screen w-64 bg-[#1e293b] text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl">
      {/* Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-[#0f172a]">
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-wide">IT Support</span>
          <span className="text-xs text-slate-400">Management System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
        {navItems.map((item) => renderNavLink(item.to, item.icon, item.label))}

        {/* Group Settings */}
        <div className="pt-4 mt-4 border-t border-slate-700">
          <span className="px-3 text-xs font-semibold text-slate-500 uppercase">Cài đặt</span>
          <div className="mt-2 space-y-1">
             {settingItems.map((item) => renderNavLink(item.to, item.icon, item.label))}
          </div>
        </div>
      </nav>
    </div>
  );
}