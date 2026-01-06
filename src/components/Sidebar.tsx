import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Monitor, 
  Wrench, 
  Info, 
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";
import { selectAuth } from "../store/auth";
import { logout } from "../store/auth/reducers";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Báo lỗi" },
    { to: "/devices", icon: Monitor, label: "Thiết bị" },
    { to: "/maintenance", icon: Wrench, label: "Bảo trì & Sửa chữa" },
    { to: "/about", icon: Info, label: "About" },
  ];

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
      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-slate-700 p-4 bg-[#0f172a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">
              {user?.name || "Admin User"}
            </span>
            <span className="text-xs text-slate-400 truncate">
               {user?.role?.name || "System Administrator"}
            </span>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-2 py-1 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}