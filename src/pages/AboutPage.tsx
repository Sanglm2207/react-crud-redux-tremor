import { useState } from "react";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { 
  Cpu, Server, Database, Github, Globe, Mail, Phone, 
  Layers, ShieldCheck, History, ArrowRight, Download, BookOpen 
} from "lucide-react";
import clsx from "clsx";

export default function AboutPage() {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
        setIsCheckingUpdate(false);
        alert("Bạn đang sử dụng phiên bản mới nhất!");
    }, 1500);
  }

  return (
    <PageLayout
      title="Thông tin phần mềm"
      subtitle="Thông tin phiên bản, đội ngũ phát triển và lịch sử cập nhật"
      breadcrumbs={<Breadcrumb items={[{ label: "Hệ thống" }, { label: "About" }]} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI (INFO & CONTACT) --- */}
        <div className="col-span-1 space-y-6">
            
            {/* 1. App Info Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Layers size={100} />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <span className="font-bold text-2xl">IT</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">IT Support System</h2>
                        <p className="text-sm text-slate-500">Management Dashboard</p>
                    </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Phiên bản</span>
                        <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">v1.2.5 (Stable)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Build Date</span>
                        <span className="text-sm font-medium text-slate-700">08/01/2026</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">License</span>
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <ShieldCheck size={14}/> Enterprise
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button 
                        className="w-full justify-center" 
                        variant="outline" 
                        loading={isCheckingUpdate}
                        onClick={handleCheckUpdate}
                    >
                        {isCheckingUpdate ? "Checking..." : "Kiểm tra cập nhật"}
                    </Button>
                </div>
            </div>

            {/* 2. Tech Stack */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Cpu size={18} className="text-blue-500"/> Công nghệ sử dụng
                </h3>
                <div className="space-y-4">
                    <TechItem 
                        icon={Globe} color="text-cyan-500" bg="bg-cyan-50"
                        title="Frontend" desc="React 18 + Vite + TypeScript" 
                    />
                    <TechItem 
                        icon={Server} color="text-green-600" bg="bg-green-50"
                        title="Backend" desc="Java Spring Boot 3.2" 
                    />
                    <TechItem 
                        icon={Database} color="text-orange-500" bg="bg-orange-50"
                        title="Database" desc="MySQL 8.0 + Redis Cache" 
                    />
                </div>
            </div>

            {/* 3. Developer Contact */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg text-white">
                <h3 className="font-semibold mb-1">Liên hệ hỗ trợ</h3>
                <p className="text-slate-400 text-sm mb-4">Gặp sự cố? Liên hệ ngay với đội kỹ thuật.</p>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Phone size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-300">Hotline Kỹ thuật</p>
                            <p className="font-bold text-sm">0963.945.826 (Mr. Côn)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-300">Email Support</p>
                            <p className="font-bold text-sm">support@itsystem.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI (CHANGELOG & DOCS) --- */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
            
            {/* 1. Resources / Docs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocCard 
                    title="Hướng dẫn sử dụng" 
                    desc="Tài liệu PDF chi tiết các chức năng"
                    icon={BookOpen} color="blue"
                />
                <DocCard 
                    title="Mã nguồn (Github)" 
                    desc="Repository backend và frontend"
                    icon={Github} color="gray"
                />
            </div>

            {/* 2. Changelog */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <History size={20} className="text-purple-500"/> Lịch sử cập nhật
                    </h3>
                    <span className="text-xs text-slate-400">Last updated: 2 hours ago</span>
                </div>

                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                    {/* Version 1.2.5 */}
                    <TimelineItem 
                        version="v1.2.5" 
                        date="08/01/2026" 
                        isLatest 
                        changes={[
                            "Thêm module quản lý File/Media (AWS S3).",
                            "Nâng cấp tính năng Phân quyền (Role Based Access Control).",
                            "Tối ưu hóa giao diện Dashboard và Sidebar."
                        ]}
                    />

                    {/* Version 1.1.0 */}
                    <TimelineItem 
                        version="v1.1.0" 
                        date="25/12/2025" 
                        changes={[
                            "Tích hợp API gửi Email tự động.",
                            "Thêm tính năng Báo cáo sự cố (Issues).",
                            "Fix lỗi hiển thị trên thiết bị di động."
                        ]}
                    />

                    {/* Version 1.0.0 */}
                    <TimelineItem 
                        version="v1.0.0" 
                        date="01/12/2025" 
                        changes={[
                            "Phát hành phiên bản đầu tiên.",
                            "Quản lý Users và Devices cơ bản.",
                            "Đăng nhập / Đăng xuất hệ thống."
                        ]}
                    />
                </div>
            </div>
        </div>
      </div>
    </PageLayout>
  );
}

// --- HELPER COMPONENTS ---

function TechItem({ icon: Icon, title, desc, color, bg }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", bg, color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </div>
    )
}

function DocCard({ title, desc, icon: Icon, color }: any) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 hover:border-blue-300",
        gray: "bg-slate-50 text-slate-700 hover:border-slate-300"
    }
    return (
        <div className={clsx(
            "p-4 rounded-xl border border-transparent transition-all cursor-pointer flex items-center gap-4",
            colors[color as keyof typeof colors]
        )}>
            <div className="p-3 bg-white rounded-full shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs opacity-80">{desc}</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-50" />
        </div>
    )
}

function TimelineItem({ version, date, changes, isLatest }: any) {
    return (
        <div className="ml-6 relative">
            {/* Dot */}
            <span className={clsx(
                "absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                isLatest ? "bg-green-500" : "bg-slate-300"
            )}></span>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-800 text-lg">{version}</h4>
                {isLatest && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">LATEST</span>}
                <span className="text-xs text-slate-400 sm:ml-auto">{date}</span>
            </div>
            
            <ul className="space-y-2">
                {changes.map((change: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-slate-400 mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                        <span className="leading-relaxed">{change}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}