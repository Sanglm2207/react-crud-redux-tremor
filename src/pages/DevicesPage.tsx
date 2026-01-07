import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Monitor, CheckCircle, AlertTriangle, XCircle, Printer, Projector, Plus, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { deleteDevice, Device, fetchDevices, selectDevices } from "../store/devices";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



export default function DevicesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: devices, meta, isLoading } = useAppSelector(selectDevices);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDevices({ page: currentPage, pageSize: 10 }));
  }, [dispatch, currentPage]);

  const handleDelete = async (id: number) => {
    if(confirm("Xóa thiết bị này?")) {
        await dispatch(deleteDevice(id)).unwrap();
        toast.success("Đã xóa");
        dispatch(fetchDevices({ page: currentPage }));
    }
  }

  const columns: Column<Device>[] = [
    { header: "Mã", accessorKey: "code", className: "font-mono" }, 
    { header: "Tên thiết bị", accessorKey: "name", className: "font-medium" },
    { header: "Loại", accessorKey: "type" },
    { header: "Phòng ban", accessorKey: "department" },
    { header: "Trạng thái", render: (d) => <Chip color="green">{d.status}</Chip> }, 
    { header: "Mô tả", accessorKey: "description", className: "text-slate-500 truncate max-w-xs" },
    {
      header: "Hành động",
      className: "text-right",
      render: (device) => (
        <div className="flex justify-end gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            icon={Edit2} 
            onClick={() => navigate(`/devices/${device.id}`)}
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-600 hover:bg-red-50"
            icon={Trash2} 
            onClick={() => handleDelete(device.id)}
          />
        </div>
      )
    }
  ];
  return (
    <PageLayout
      title="Quản lý thiết bị"
      subtitle="Theo dõi tình trạng tài sản và thiết bị IT"
      breadcrumbs={<Breadcrumb items={[{ label: "Thiết bị" }]} />}
      actions={
        <Button icon={Plus} onClick={() => navigate("/devices/new")}>
            Thêm thiết bị
        </Button>
      }
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

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable columns={columns} data={devices} isLoading={isLoading} />
        <Pagination 
            currentPage={meta.page} 
            totalPages={meta.pages} 
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={setCurrentPage} 
        />
      </div>
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