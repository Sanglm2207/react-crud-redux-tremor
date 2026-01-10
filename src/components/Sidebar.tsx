import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Monitor, 
  Wrench, 
  Info,
  Shield,
  Lock,
  Users,
  Folder,
  Mail,
  Trophy
} from "lucide-react";
import clsx from "clsx";
import { selectAuth } from "../store/auth";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const roleName = user?.role?.name || "STAFF"; 
  const isAdmin = roleName === "ADMIN";

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Báo lỗi" },
    { to: "/leaderboard", icon: Trophy, label: "Bảng xếp hạng" },
    { to: "/devices", icon: Monitor, label: "Thiết bị" },
    { to: "/maintenance", icon: Wrench, label: "Bảo trì" },
    { to: "/about", icon: Info, label: "About" },
  ];

  const settingItems = [
    { to: "/settings/users", icon: Users, label: "Nhân Viên" },
    { to: "/settings/roles", icon: Shield, label: "Phân quyền" },
    { to: "/settings/files", icon: Folder, label: "Tài liệu & Hình ảnh" },
    { to: "/settings/mails", icon: Mail, label: "Gửi mail" },
  ];

  const renderNavLink = (item: any) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
          isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        )
      }
    >
      <item.icon size={20} />
      {item.label}
    </NavLink>
  );

  return (
    <div className="h-screen w-64 bg-[#1e293b] text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl">
      {/* Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-[#0f172a]">
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-wide">IT Service Shop</span>
          <span className="text-xs text-slate-400">Management System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
        {/* Menu chính */}
        {menuItems.map(renderNavLink)}

        {/* Menu Admin (Chỉ hiện nếu là ADMIN) */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-700">
            <span className="px-3 text-xs font-semibold text-slate-500 uppercase">Quản trị</span>
            <div className="mt-2 space-y-1">
              {settingItems.map(renderNavLink)}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}