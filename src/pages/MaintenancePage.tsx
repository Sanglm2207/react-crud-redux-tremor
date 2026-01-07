import { useEffect, useState, useMemo } from "react";
import { fetchDevices, updateDevice, selectDevices } from "../store/devices";
import { Device } from "../store/devices/types";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Wrench, CalendarClock, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { formatDate } from "../utils/format";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

// Helper tính toán ngày
const getMaintenanceInfo = (device: Device) => {
    if (!device.lastMaintenanceDate || device.maintenanceCycleDays <= 0) {
        return { status: 'UNKNOWN', daysLeft: 0, nextDate: null };
    }

    const lastDate = new Date(device.lastMaintenanceDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + device.maintenanceCycleDays);

    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'GOOD' | 'UPCOMING' | 'OVERDUE' = 'GOOD';
    if (daysLeft < 0) status = 'OVERDUE';
    else if (daysLeft <= 7) status = 'UPCOMING';

    return { status, daysLeft, nextDate: nextDate.toISOString() };
};

export default function MaintenancePage() {
  const dispatch = useAppDispatch();
  const { list: devices, isLoading } = useAppSelector(selectDevices);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'ALL' | 'OVERDUE' | 'UPCOMING'>('ALL');

  useEffect(() => {
    // Fetch tất cả thiết bị để tính toán (trong thực tế nên có API filter riêng)
    dispatch(fetchDevices({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  // --- LOGIC LỌC DỮ LIỆU ---
  const processedData = useMemo(() => {
    return devices
        .filter(d => d.maintenanceCycleDays > 0) // Chỉ lấy máy cần bảo trì
        .map(d => ({ ...d, ...getMaintenanceInfo(d) })) // Gắn thêm thông tin tính toán
        .filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (filterType === 'OVERDUE') return d.status === 'OVERDUE';
            if (filterType === 'UPCOMING') return d.status === 'UPCOMING';
            return true;
        })
        .sort((a, b) => a.daysLeft - b.daysLeft); // Sắp xếp cái nào gấp lên đầu
  }, [devices, searchTerm, filterType]);

  // Thống kê
  const stats = useMemo(() => {
      const all = devices.filter(d => d.maintenanceCycleDays > 0).map(d => getMaintenanceInfo(d));
      return {
          overdue: all.filter(x => x.status === 'OVERDUE').length,
          upcoming: all.filter(x => x.status === 'UPCOMING').length,
          total: all.length
      }
  }, [devices]);

  // --- ACTIONS ---
  const handleMaintain = async (device: Device) => {
      if (confirm(`Xác nhận đã bảo trì thiết bị [${device.name}] hôm nay?`)) {
          try {
              await dispatch(updateDevice({
                  id: device.id,
                  lastMaintenanceDate: new Date().toISOString() 
              })).unwrap();
              
              
              toast.success("Cập nhật bảo trì thành công!");
              // Refresh lại list
              dispatch(fetchDevices({ page: 1, pageSize: 100 }));
          } catch (e) {
              toast.error("Có lỗi xảy ra");
          }
      }
  }

  // --- TABLE COLUMNS ---
  const columns: Column<typeof processedData[0]>[] = [
    { header: "Mã TB", accessorKey: "code", className: "font-mono w-20" },
    { 
        header: "Thiết bị", 
        render: (item) => (
            <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Chu kỳ: {item.maintenanceCycleDays} ngày</p>
            </div>
        )
    },
    { 
        header: "Bảo trì lần cuối", 
        render: (item) => <span className="text-slate-600">{item.lastMaintenanceDate ? formatDate(item.lastMaintenanceDate) : "Chưa có"}</span>
    },
    { 
        header: "Hạn tiếp theo", 
        render: (item) => (
            <div>
                <p className={clsx("font-medium", 
                    item.status === 'OVERDUE' ? "text-red-600" : 
                    item.status === 'UPCOMING' ? "text-yellow-600" : "text-green-600"
                )}>
                    {item.nextDate ? formatDate(item.nextDate) : "N/A"}
                </p>
                <p className="text-[10px] text-slate-400">
                    {item.daysLeft < 0 ? `Quá hạn ${Math.abs(item.daysLeft)} ngày` : `Còn ${item.daysLeft} ngày`}
                </p>
            </div>
        )
    },
    {
        header: "Trạng thái",
        render: (item) => {
            if (item.status === 'OVERDUE') return <Chip color="red">Quá hạn</Chip>;
            if (item.status === 'UPCOMING') return <Chip color="yellow">Sắp đến hạn</Chip>;
            return <Chip color="green">Đang tốt</Chip>;
        }
    },
    {
        header: "Hành động",
        className: "text-right",
        render: (item) => (
            <div className="flex justify-end">
                <Button 
                    size="sm" 
                    variant="outline"
                    className="text-blue-600 hover:bg-blue-50 border-blue-200"
                    icon={Wrench} 
                    onClick={() => handleMaintain(item)}
                >
                    Bảo trì xong
                </Button>
            </div>
        )
    }
  ];

  return (
    <PageLayout
      title="Lịch bảo trì định kỳ"
      subtitle="Theo dõi và quản lý lịch bảo dưỡng thiết bị"
      breadcrumbs={<Breadcrumb items={[{ label: "Hệ thống" }, { label: "Bảo trì" }]} />}
    >
        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard 
                title="Cần bảo trì gấp (Quá hạn)" 
                value={stats.overdue} 
                icon={AlertOctagon} 
                color="red" 
                onClick={() => setFilterType('OVERDUE')}
                active={filterType === 'OVERDUE'}
            />
            <SummaryCard 
                title="Sắp đến hạn (7 ngày)" 
                value={stats.upcoming} 
                icon={AlertTriangle} 
                color="yellow" 
                onClick={() => setFilterType('UPCOMING')}
                active={filterType === 'UPCOMING'}
            />
            <SummaryCard 
                title="Tổng thiết bị cần theo dõi" 
                value={stats.total} 
                icon={CalendarClock} 
                color="blue" 
                onClick={() => setFilterType('ALL')}
                active={filterType === 'ALL'}
            />
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex justify-between mb-4">
            <div className="w-72">
                <SearchInput 
                    placeholder="Tìm thiết bị..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-lg border shadow-sm">
            <DataTable 
                columns={columns} 
                data={processedData} 
                isLoading={isLoading} 
                emptyMessage="Không có thiết bị nào cần bảo trì."
            />
        </div>
    </PageLayout>
  );
}

// Component Card thống kê nhỏ
function SummaryCard({ title, value, icon: Icon, color, onClick, active }: any) {
    const colors = {
        red: "bg-red-50 text-red-600 border-red-200",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
        blue: "bg-blue-50 text-blue-600 border-blue-200",
    };

    return (
        <div 
            onClick={onClick}
            className={clsx(
                "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md flex items-center justify-between",
                active ? `ring-2 ring-offset-1 ${colors[color as keyof typeof colors].replace('bg-', 'ring-')}` : "bg-white border-slate-200"
            )}
        >
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <p className={clsx("text-2xl font-bold mt-1", `text-${color}-600`)}>{value}</p>
            </div>
            <div className={clsx("p-3 rounded-full", colors[color as keyof typeof colors])}>
                <Icon size={24} />
            </div>
        </div>
    )
}