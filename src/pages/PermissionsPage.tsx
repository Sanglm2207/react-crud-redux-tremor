import { useEffect, useState } from "react";
import {
  fetchPermissions, createPermission, updatePermission, deletePermission,
  selectPermissions, Permission
} from "../store/permissions";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Modal } from "../components/ui/Modal";
import { Input, SearchInput } from "../components/ui/Input";
import { Pagination } from "../components/ui/Pagination"; // Import Pagination
import Breadcrumb from "../components/ui/Breadcrumb";
import { Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function PermissionsPage() {
  const dispatch = useAppDispatch();
  
  // Lấy list, meta và loading từ Redux
  const { list: permissions, meta, isLoading } = useAppSelector((state) => state.permissions);
  
  // State quản lý trang và search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    apiPath: "",
    method: "GET",
    module: "",
  });

  // Fetch dữ liệu mỗi khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    // Dùng timeout để debounce search (tránh gọi API liên tục khi gõ)
    const timeoutId = setTimeout(() => {
      dispatch(fetchPermissions({ 
        page: currentPage, 
        pageSize: pageSize,
        // Giả sử backend hỗ trợ search chung bằng field 'name' hoặc 'apiPath'
        // Nếu backend phân tách rõ ràng, bạn có thể gửi: name: searchTerm, apiPath: searchTerm...
        name: searchTerm 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentPage, searchTerm]);

  // Reset về trang 1 khi search thay đổi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleEdit = (item: Permission) => {
    setEditingId(item.id);
    setFormData({ name: item.name, apiPath: item.apiPath, method: item.method, module: item.module });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ name: "", apiPath: "", method: "GET", module: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.apiPath) return toast.error("Thiếu thông tin!");

    const payload = { ...formData, module: formData.module.toUpperCase() };
    try {
      if (editingId) {
        await dispatch(updatePermission({ id: editingId, ...payload })).unwrap();
        toast.success("Cập nhật thành công!");
        // Fetch lại trang hiện tại để cập nhật dữ liệu
        dispatch(fetchPermissions({ page: currentPage, pageSize }));
      } else {
        await dispatch(createPermission(payload)).unwrap();
        toast.success("Tạo mới thành công!");
        // Quay về trang 1 để thấy item mới
        setCurrentPage(1);
        dispatch(fetchPermissions({ page: 1, pageSize }));
      }
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xóa quyền này?")) {
      await dispatch(deletePermission(id)).unwrap();
      toast.success("Đã xóa");
      // Fetch lại để cập nhật danh sách và pagination
      dispatch(fetchPermissions({ page: currentPage, pageSize }));
    }
  };

  const getMethodColor = (m: string) => {
    if (m === "GET") return "green";
    if (m === "POST") return "yellow";
    if (m === "DELETE") return "red";
    return "blue";
  };

  const columns: Column<Permission>[] = [
    { header: "Module", render: (p) => <Chip color="purple">{p.module}</Chip> },
    { header: "Tên quyền", accessorKey: "name", className: "font-medium" },
    { header: "Method", render: (p) => <Chip color={getMethodColor(p.method) as any}>{p.method}</Chip> },
    { header: "API Path", accessorKey: "apiPath", className: "font-mono text-xs text-slate-500" },
    {
      header: "Hành động",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" icon={Edit2} onClick={() => handleEdit(p)} />
          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" icon={Trash2} onClick={() => handleDelete(p.id)} />
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Danh sách quyền"
      subtitle="Cấu hình API endpoints và quyền truy cập hệ thống"
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Permissions" }]} />}
      actions={<Button icon={Plus} onClick={handleCreate}>Thêm quyền</Button>}
    >
      <div className="mb-4 w-72">
        <SearchInput 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Tìm kiếm quyền..." 
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable 
            columns={columns} 
            data={permissions} 
            isLoading={isLoading} 
            emptyMessage="Không tìm thấy quyền nào."
        />

        {/* Component Phân trang */}
        <Pagination 
            currentPage={meta.page}
            totalPages={meta.pages}
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Cập nhật quyền" : "Thêm quyền mới"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>Lưu lại</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Tên quyền" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Module" value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})} placeholder="VD: USER" />
          <Input label="API Path" value={formData.apiPath} onChange={e => setFormData({...formData, apiPath: e.target.value})} placeholder="/api/v1/..." />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">HTTP Method</label>
            <select 
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                value={formData.method}
                onChange={e => setFormData({...formData, method: e.target.value})}
            >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}