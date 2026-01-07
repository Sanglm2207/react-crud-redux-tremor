import { useEffect, useState } from "react";
import { fetchIssues } from "../store/issues/actions";
import { IssueStatus } from "../store/issues/types";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Pagination } from "../components/ui/Pagination";
import { CreateIssueModal } from "../components/issues/CreateIssueModal";
import { Plus, Image as ImageIcon } from "lucide-react";
import { formatDate } from "../utils/format";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { list: issues, meta, isLoading } = useAppSelector((state) => state.issues);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    dispatch(fetchIssues({ 
        page: currentPage, 
        pageSize: 10,
        status: filterStatus === "ALL" ? undefined : filterStatus
    }));
  }, [dispatch, currentPage, filterStatus]);

  // Helper Status Color
  const getStatusColor = (status: IssueStatus) => {
      switch (status) {
          case "PENDING": return "yellow";
          case "IN_PROGRESS": return "blue";
          case "RESOLVED": return "green";
          case "CLOSED": return "gray";
          default: return "gray";
      }
  };

  const getStatusLabel = (status: IssueStatus) => {
      switch (status) {
          case "PENDING": return "Chờ xử lý";
          case "IN_PROGRESS": return "Đang xử lý";
          case "RESOLVED": return "Hoàn thành";
          case "CLOSED": return "Đã đóng";
          default: status;
      }
  }

  const columns: Column<typeof issues[0]>[] = [
    { header: "ID", accessorKey: "id", className: "font-mono w-16 text-slate-500" },
    { header: "Người báo", accessorKey: "reporterName", className: "font-medium" },
    { header: "Phòng ban", render: (i) => <Chip color="blue">{i.department}</Chip> },
    { header: "Thiết bị", accessorKey: "deviceName" },
    { header: "Lỗi", accessorKey: "errorType" },
    { 
        header: "Trạng thái", 
        render: (i) => <Chip color={getStatusColor(i.status)}>{getStatusLabel(i.status)}</Chip> 
    },
    { header: "Thời gian", render: (i) => <span className="text-xs text-slate-500">{i.reportedAt ? formatDate(i.reportedAt) : "-"}</span> },
    { 
        header: "Ảnh", 
        render: (i) => i.imageUrl ? (
            <a href={i.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1 hover:underline text-xs">
                <ImageIcon size={14}/> Xem ảnh
            </a>
        ) : <span className="text-xs text-gray-400">-</span> 
    }
  ];

  return (
    <PageLayout
      title="Danh sách báo lỗi"
      subtitle={`Hôm nay: ${meta.total} lỗi mới`} // Demo số liệu
      actions={
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Báo lỗi mới
        </Button>
      }
    >
      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map(status => (
            <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    filterStatus === status 
                    ? "bg-slate-800 text-white border-slate-800" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
                {status === "ALL" ? "Tất cả" : getStatusLabel(status as IssueStatus)}
            </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable
            columns={columns}
            data={issues}
            isLoading={isLoading}
            emptyMessage="Không có báo lỗi nào."
        />
        <Pagination 
            currentPage={meta.page}
            totalPages={meta.pages}
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={setCurrentPage}
        />
      </div>

      <CreateIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => dispatch(fetchIssues({ page: 1 }))}
      />
    </PageLayout>
  );
}