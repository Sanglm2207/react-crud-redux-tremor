import { useEffect, useState } from "react";
import { fetchMails } from "../store/mails/actions";
import { Mail, MailStatus } from "../store/mails/types";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import { Pagination } from "../components/ui/Pagination";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Plus, Mail as MailIcon, Clock, CheckCircle, AlertCircle, Eye, Edit } from "lucide-react";
import { formatDate } from "../utils/format";
import { ComposeMailModal } from "../components/ui/ComposeMailModal";
import { useAppDispatch, useAppSelector } from "../store/store";
import { MailDetailModal } from "../components/ui/MailDetailModal";

export default function MailsPage() {
  const dispatch = useAppDispatch();
  const { list: mails, meta, isLoading } = useAppSelector((state) => state.mails);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  useEffect(() => {
    dispatch(fetchMails({ page: currentPage, pageSize: 10, to: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  // Helper render status
  const getStatusChip = (status: MailStatus) => {
    switch (status) {
      case "SENT": return <Chip color="green">Đã gửi</Chip>;
      case "SCHEDULED": return <Chip color="yellow">Đang chờ gửi</Chip>;
      case "FAILED": return <Chip color="red">Gửi lỗi</Chip>;
      default: return <Chip color="gray">Nháp</Chip>;
    }
  };

  const columns: Column<Mail>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-mono text-xs text-slate-500" },
    { 
        header: "Người nhận", 
        render: (mail) => (
            <div className="flex flex-col">
                <span className="font-medium text-slate-900">{mail.to}</span>
                {mail.cc && <span className="text-xs text-slate-400">CC: {mail.cc}</span>}
            </div>
        )
    },
    { 
        header: "Chủ đề", 
        render: (mail) => (
            <span className="font-medium text-slate-700 truncate block max-w-xs" title={mail.subject}>
                {mail.subject}
            </span>
        ) 
    },
    { header: "Trạng thái", render: (mail) => getStatusChip(mail.status) },
    { 
        header: "Thời gian", 
        render: (mail) => (
            <div className="flex items-center gap-2 text-xs text-slate-500">
                {mail.status === 'SCHEDULED' ? <Clock size={14}/> : <CheckCircle size={14}/>}
                {formatDate(mail.status === 'SCHEDULED' ? mail.scheduledAt! : mail.sentAt!)}
            </div>
        ) 
    },
    {
      header: "Hành động",
      className: "text-right",
      render: (mail) => (
        <div className="flex justify-end gap-2">
          {/* Nút Xem chi tiết */}
          <Button 
            size="sm" 
            variant="ghost" 
            icon={Eye} 
            onClick={() => setSelectedMail(mail)} 
            title="Xem chi tiết"
          />
          
          {/* Nút Sửa nhanh (Chỉ hiện nếu chưa gửi) */}
          {(mail.status === 'SCHEDULED' || mail.status === 'FAILED') && (
             <Button 
                size="sm" 
                variant="ghost" 
                className="text-blue-600 hover:bg-blue-50"
                icon={Edit} 
                onClick={() => setSelectedMail(mail)} // Mở modal (Modal sẽ tự check logic edit)
                title="Cập nhật"
             />
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Hộp thư đi"
      subtitle="Quản lý lịch sử gửi email và email tự động"
      breadcrumbs={<Breadcrumb items={[{ label: "Hệ thống" }, { label: "Mails" }]} />}
      actions={
        <Button icon={Plus} onClick={() => setIsComposeOpen(true)}>
          Soạn thư
        </Button>
      }
    >
      <div className="mb-4 w-72">
        <SearchInput 
            placeholder="Tìm theo email nhận..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable
            columns={columns}
            data={mails}
            isLoading={isLoading}
            emptyMessage="Chưa có email nào được gửi."
        />
        <Pagination 
            currentPage={meta.page}
            totalPages={meta.pages}
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={setCurrentPage}
        />
      </div>

      {/* Compose Modal (Luôn render nhưng ẩn hiện bằng css/portal) */}
      {isComposeOpen && (
          <ComposeMailModal 
            isOpen={isComposeOpen} 
            onClose={() => setIsComposeOpen(false)} 
          />
      )}

      {selectedMail && (
        <MailDetailModal 
            mail={selectedMail} 
            onClose={() => setSelectedMail(null)} 
        />
      )}
    </PageLayout>
  );
}