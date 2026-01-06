import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Bell, LogOut, ChevronDown, User as UserIcon, Settings } from "lucide-react";
import { selectAuth } from "../store/auth";
import { Badge } from "@tremor/react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logout } from "../store/auth/reducers";

export default function DashboardLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC XÁC ĐỊNH TÊN MÀN HÌNH (MODULE) ---
  const getNavbarTitle = (pathname: string) => {
    // Nhóm Cài đặt
    if (pathname.includes("/settings/users")) return "Quản lý người dùng";
    if (pathname.includes("/settings/roles")) return "Phân quyền (Roles)";
    if (pathname.includes("/settings/permissions")) return "Danh sách quyền (Permissions)";

    // Nhóm Nghiệp vụ
    if (pathname.includes("/devices")) return "Quản lý thiết bị";
    if (pathname.includes("/maintenance")) return "Bảo trì & Sửa chữa";
    if (pathname.includes("/about")) return "Thông tin phần mềm";

    // Trang chủ
    return "Dashboard Overview";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Khu vực nội dung bên phải */}
      <div className="flex-1 ml-64 flex flex-col transition-all duration-300">
        
        {/* --- NAVBAR: Chỉ hiển thị Tên Module và User Actions --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          
          {/* LEFT: Tên Module */}
          <div className="flex items-center gap-4">
            {/* Thanh trang trí nhỏ màu xanh (tùy chọn) */}
            <div className="h-5 w-1 bg-blue-600 rounded-full hidden sm:block"></div>
            
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {getNavbarTitle(location.pathname)}
            </h1>
          </div>

          {/* RIGHT: Actions (Giữ nguyên logic cũ) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-lg transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                   )}
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-semibold text-slate-700 leading-tight">
                    {user?.name || "Admin User"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {user?.role?.name || "Member"}
                  </span>
                </div>
                <ChevronDown size={16} className={clsx("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </button>

              {/* Menu Items */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-2">
                        <Badge size="xs" color="blue">{user?.role?.name}</Badge>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link 
                        to={`/settings/users/${user?.id}`} 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon size={16} /> Thông tin cá nhân
                    </Link>
                    <Link 
                        to="/settings/users" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} /> Cài đặt hệ thống
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button onClick={() => dispatch(logout())} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT (Nơi chứa PageLayout) --- */}
        <main className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}