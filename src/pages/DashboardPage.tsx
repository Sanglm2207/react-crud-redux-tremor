import { useEffect, useState } from "react";
import {
    fetchIssues, acceptIssue, completeFix, completeDelivery, selectIssues
} from "../store/issues";
import { Issue, IssueStatus } from "../store/issues/types";
import { selectAuth } from "../store/auth";

import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Pagination } from "../components/ui/Pagination";
import Breadcrumb from "../components/ui/Breadcrumb";

// Import các Modal xử lý quy trình
import { CreateIssueModal } from "../components/issues/CreateIssueModal";
import { CompleteFixModal } from "../components/issues/CompleteFixModal";
import { CompleteDeliveryModal } from "../components/issues/CompleteDeliveryModal";

import { Plus, Image as ImageIcon, Play, Wrench, Truck, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { list: issues, meta, isLoading } = useAppSelector(selectIssues);
    const { user } = useAppSelector(selectAuth);

    // State phân trang & lọc
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    // State quản lý Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const [workflowType, setWorkflowType] = useState<"FIX" | "DELIVERY" | null>(null);

    useEffect(() => {
        dispatch(fetchIssues({
            page: currentPage,
            pageSize: 10,
            status: filterStatus === "ALL" ? undefined : filterStatus
        }));
    }, [dispatch, currentPage, filterStatus]);


    // 1. Nhận việc
    const handleAccept = async (id: number) => {
        if(confirm("Bạn có chắc muốn nhận yêu cầu này?")) {
            try {
                await dispatch(acceptIssue(id)).unwrap();
                
                toast.success("Đã nhận việc thành công!");
                
                dispatch(fetchIssues({ page: currentPage, pageSize: 10 }));
                
            } catch(e) {
                toast.error("Lỗi khi nhận việc");
            }
        }
    }

    // 2. Xử lý sau khi nhập Note sửa chữa
    const handleFixSubmit = async (note: string, needDelivery: boolean) => {
        if (selectedIssueId) {
            try {
                await dispatch(completeFix({ id: selectedIssueId, note, needDelivery })).unwrap();
                toast.success(needDelivery ? "Đã chuyển sang trạng thái GIAO HÀNG" : "Đã hoàn thành!");
                setWorkflowType(null);
            } catch (e) {
                toast.error("Lỗi cập nhật");
            }
        }
    }

    // 3. Xử lý sau khi upload ảnh giao hàng
    const handleDeliverySubmit = async (imageUrl: string) => {
        if (selectedIssueId) {
            try {
                await dispatch(completeDelivery({ id: selectedIssueId, imageUrl })).unwrap();
                toast.success("Xác nhận giao hàng thành công!");
                setWorkflowType(null);
            } catch (e) {
                toast.error("Lỗi cập nhật");
            }
        }
    }

    // --- HELPER RENDER --- //

    const getStatusColor = (status: IssueStatus) => {
        switch (status) {
            case "PENDING": return "yellow";    // Chờ xử lý
            case "PROCESSING": return "blue";   // Đang sửa
            case "DELIVERING": return "purple"; // Đang giao (Cam/Tím)
            case "DONE":
            case "DELIVERED": return "green";   // Hoàn thành
            case "CLOSED": return "gray";
            default: return "gray";
        }
    };

    const getStatusLabel = (status: IssueStatus) => {
        switch (status) {
            case "PENDING": return "Chờ xử lý";
            case "PROCESSING": return "Đang sửa";
            case "DELIVERING": return "Đang giao";
            case "DONE": return "Hoàn thành";
            case "DELIVERED": return "Đã giao xong";
            case "CLOSED": return "Đóng";
            default: status;
        }
    }

    // Cấu hình cột bảng
    const columns: Column<Issue>[] = [
        { header: "ID", accessorKey: "id", className: "font-mono w-16 text-slate-500 text-xs" },
        {
            header: "Người báo / Phòng ban",
            render: (i) => (
                <div>
                    <p className="font-medium text-sm text-slate-900"> {i.creatorEmail || i.reporterName || i.creatorEmail || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{i.department}</p>
                </div>
            )
        },
        {
            header: "Thiết bị & Lỗi",
            render: (i) => (
                <div>
                    <p className="font-medium text-sm text-slate-800">{i.deviceName}</p>
                    <p className="text-xs text-red-500 font-medium">{i.errorType}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]" title={i.description}>{i.description}</p>
                </div>
            )
        },
        {
            header: "Trạng thái",
            render: (i) => {
                const colors: Record<string, string> = {
                    PENDING: 'gray',
                    PROCESSING: 'blue',
                    DONE: 'green',
                    DELIVERING: 'orange',
                    DELIVERED: 'green',
                    CLOSED: 'slate'
                };
                return <Chip color={colors[i.status] || 'gray' as any}>{i.status}</Chip>
            }
        },
        {
            header: "Người xử lý",
            render: (i) => {
                // Lấy tên hoặc email người xử lý
                const assigneeName = i.assignee?.name || i.assigneeEmail;

                return assigneeName ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                            {assigneeName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs">{assigneeName}</span>
                    </div>
                ) : <span className="text-xs text-slate-400 italic">Chưa có</span>
            }
        },
        {
            header: "Ảnh",
            render: (i) => i.imageUrl ? (
                <a href={i.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                    <ImageIcon size={16} />
                </a>
            ) : null
        },
        {
            header: "Thao tác",
            className: "text-right",
            render: (issue) => {

                // 1. Check Admin
                const isAdmin = user?.role?.name === 'ADMIN';

                // 2. Check Người được phân công (Assignee)
                // Vì API chỉ trả về assigneeEmail, ta so sánh email của người đang login với email trong issue
                const isAssignee = user?.email && issue.assigneeEmail && (user.email === issue.assigneeEmail);

                // Debug để kiểm tra nếu nút vẫn không hiện
                // console.log("Current User:", user?.email, "Issue Assignee:", issue.assigneeEmail, "Match:", isAssignee);

                return (
                    <div className="flex justify-end gap-2">
                        {/* 1. Nút Nhận Việc (PENDING) */}
                        {issue.status === 'PENDING' && (
                            <Button
                                size="sm"
                                icon={Play}
                                onClick={() => handleAccept(issue.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Nhận việc
                            </Button>
                        )}

                        {/* 2. Nút Xong Sửa (PROCESSING) */}
                        {/* Hiện nếu là Admin HOẶC đúng là người staff đó (check theo email) */}
                        {issue.status === 'PROCESSING' && (isAdmin || isAssignee) && (
                            <Button
                                size="sm"
                                variant="outline"
                                icon={Wrench}
                                onClick={() => {
                                    setSelectedIssueId(issue.id);
                                    setWorkflowType("FIX");
                                }}
                            >
                                Xong sửa
                            </Button>
                        )}

                        {/* 3. Nút Giao Hàng (DELIVERING) */}
                        {issue.status === 'DELIVERING' && (isAdmin || isAssignee) && (
                            <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                                icon={Truck}
                                onClick={() => {
                                    setSelectedIssueId(issue.id);
                                    setWorkflowType("DELIVERY");
                                }}
                            >
                                Giao hàng
                            </Button>
                        )}

                        {/* Trạng thái Hoàn thành */}
                        {(issue.status === 'DONE' || issue.status === 'DELIVERED') && (
                            <span className="text-green-600 flex items-center text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                <CheckCircle size={14} className="mr-1" /> Xong
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <PageLayout
            title="Danh sách báo lỗi"
            subtitle="Theo dõi và xử lý sự cố thiết bị"
            breadcrumbs={<Breadcrumb items={[{ label: "Hệ thống" }, { label: "Báo lỗi" }]} />}
            actions={
                <Button icon={Plus} onClick={() => setIsCreateOpen(true)}>
                    Báo lỗi mới
                </Button>
            }
        >
            {/* Filter Tabs */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {["ALL", "PENDING", "PROCESSING", "DELIVERING", "DONE"].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
                            filterStatus === status
                                ? "bg-slate-800 text-white border-slate-800"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        {status === "ALL" ? "Tất cả" : getStatusLabel(status as IssueStatus)}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
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

            {/* --- MODALS --- */}

            {/* 1. Modal Tạo mới */}
            <CreateIssueModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => dispatch(fetchIssues({ page: 1 }))}
            />

            {/* 2. Modal Hoàn thành sửa chữa */}
            {workflowType === "FIX" && (
                <CompleteFixModal
                    isOpen={true}
                    onClose={() => setWorkflowType(null)}
                    onSubmit={handleFixSubmit}
                />
            )}

            {/* 3. Modal Giao hàng */}
            {workflowType === "DELIVERY" && (
                <CompleteDeliveryModal
                    isOpen={true}
                    onClose={() => setWorkflowType(null)}
                    onSubmit={handleDeliverySubmit}
                />
            )}
        </PageLayout>
    );
}