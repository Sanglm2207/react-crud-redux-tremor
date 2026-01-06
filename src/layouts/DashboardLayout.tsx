import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Bell, LogOut, ChevronDown, User as UserIcon, Settings, ArrowLeft, Layers } from "lucide-react";
import { selectAuth } from "../store/auth";
import clsx from "clsx";
import Breadcrumb, { BreadcrumbItem } from "../components/ui/Breadcrumb"; 
import { logout } from "../store/auth/reducers";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (pathname.includes("/settings")) {
      items.push({ label: "Cài đặt" });
    } else {
       // Các trang nghiệp vụ khác
    }

    if (pathname.includes("/settings/users")) {
      items.push({ label: "Người dùng", to: "/settings/users" });
      
      const match = pathname.match(/\/settings\/users\/(\d+)/);
      if (match) {
        items.push({ label: `Cập nhật #${match[1]}` });
      }
    } 
    else if (pathname.includes("/settings/roles")) {
      items.push({ label: "Phân quyền (Roles)" });
    } 
    else if (pathname.includes("/settings/permissions")) {
      items.push({ label: "Danh sách quyền" });
    }
    else if (pathname.includes("/devices")) {
      items.push({ label: "Quản lý thiết bị" });
    }
    else {
      if(pathname === "/") return [{ label: "Dashboard Overview" }];
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbItems(location.pathname);
  
  const showBackButton = location.pathname.match(/\/\d+$/);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button 
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors mr-1"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
               <div className="mr-1 text-slate-300">
                  <Layers size={20} />
               </div>
            )}
            <Breadcrumb 
                items={breadcrumbs} 
                showHome={false} 
                className="text-sm"
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            
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
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to={`/settings/users/${user?.id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600" onClick={() => setIsDropdownOpen(false)}>
                      <UserIcon size={16} /> Thông tin cá nhân
                    </Link>
                    <Link to="/settings/users" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600" onClick={() => setIsDropdownOpen(false)}>
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

        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}