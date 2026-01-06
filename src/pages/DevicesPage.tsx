import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Monitor, CheckCircle, AlertTriangle, XCircle, Printer, Projector } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Mock Data
const data = [
  { id: "2314ac15", name: "HP EliteBook 840", type: "Laptop", status: "active", department: "Kế toán" },
  { id: "dcb8f697", name: "Dell OptiPlex 7090", type: "PC", status: "active", department: "Nhân sự" },
  { id: "ec6fa871", name: "Canon LBP 2900", type: "Printer", status: "maintenance", department: "Hành chính" },
  { id: "f24e835b", name: "Epson EB-X06", type: "Projector", status: "broken", department: "Hội trường" },
];

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const columns: Column<typeof data[0]>[] = [
    { header: "Mã TB", accessorKey: "id", className: "font-mono" },
    { 
        header: "Tên thiết bị", 
        render: (item) => (
            <div className="flex items-center gap-2">
                {item.type === "Laptop" || item.type === "PC" ? <Monitor size={16} className="text-gray-400"/> : 
                 item.type === "Printer" ? <Printer size={16} className="text-gray-400"/> : <Projector size={16} className="text-gray-400"/>}
                <span className="font-medium">{item.name}</span>
            </div>
        ) 
    },
    { header: "Loại", accessorKey: "type" },
    { 
        header: "Trạng thái", 
        render: (item) => (
            <Chip color={item.status === 'active' ? 'green' : item.status === 'broken' ? 'red' : 'yellow'}>
                {item.status === 'active' ? 'Hoạt động' : item.status === 'broken' ? 'Hư hỏng' : 'Bảo trì'}
            </Chip>
        ) 
    },
    { header: "Phòng ban", accessorKey: "department" },
  ];

  return (
    <PageLayout
      title="Quản lý thiết bị"
      subtitle="Theo dõi tình trạng tài sản và thiết bị IT"
      breadcrumbs={<Breadcrumb items={[{ label: "Thiết bị" }]} />}
    >
      {/* Summary Cards - Custom Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Tổng thiết bị" value="45" icon={Monitor} color="blue" />
        <SummaryCard title="Đang hoạt động" value="40" icon={CheckCircle} color="green" />
        <SummaryCard title="Đang bảo trì" value="3" icon={AlertTriangle} color="yellow" />
        <SummaryCard title="Hư hỏng" value="2" icon={XCircle} color="red" />
      </div>

      <div className="mb-4 w-72">
        <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm thiết bị..." />
      </div>

      <DataTable columns={columns} data={data} />
    </PageLayout>
  );
}

// Helper Component cho Card thống kê
function SummaryCard({ title, value, icon: Icon, color }: any) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        yellow: "bg-yellow-50 text-yellow-600",
        red: "bg-red-50 text-red-600",
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={clsx("p-3 rounded-full", colorStyles[color as keyof typeof colorStyles])}>
                <Icon size={24} />
            </div>
        </div>
    )
}