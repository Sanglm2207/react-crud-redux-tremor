import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Bell } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  // Helper function để lấy Title dựa trên route hiện tại
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/": return "Danh sách báo lỗi";
      case "/devices": return "Quản lý thiết bị";
      case "/maintenance": return "Lịch sử bảo trì";
      case "/about": return "Thông tin phần mềm";
      default: return "Dashboard Overview";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             {/* Đường kẻ xanh trang trí giống ảnh 1 */}
            <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
            <h1 className="text-xl font-bold text-slate-800">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative text-gray-600">
              <Bell size={20} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Nội dung thay đổi theo route */}
        <main className="p-6 md:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}