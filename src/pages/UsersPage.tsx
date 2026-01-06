import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser, selectUsers, User } from "../store/users";
import { selectAuth } from "../store/auth"; // Import auth selector
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import { Pagination } from "../components/ui/Pagination";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user: currentUser } = useAppSelector(selectAuth);
  
  const isSuperAdmin = currentUser?.role?.name === 'SUPER_ADMIN';

  const { list: users, meta, isLoading } = useAppSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, pageSize, name: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Đã xóa thành công");
      dispatch(fetchUsers({ page: currentPage, pageSize }));
    }
  };

  // Cấu hình cột
  const columns: Column<User>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-mono text-xs text-slate-500" },
    {
      header: "Thông tin",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{user.name}</span>
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
        </div>
      ),
    },
    { header: "Vai trò", render: (u) => <Chip color="blue">{u.role?.name}</Chip> },
    { header: "Trạng thái", render: (u) => <Chip color={u.active ? "green" : "red"}>{u.active ? "Active" : "Inactive"}</Chip> },
    {
      header: "Hành động",
      className: "text-right",
      render: (rowUser) => (
        <div className="flex justify-end gap-2">
          {/* NÚT EDIT: Chỉ hiện nếu là Admin HOẶC là chính mình */}
          {(isSuperAdmin || currentUser?.id === rowUser.id) && (
            <Button
              size="sm"
              variant="ghost"
              icon={Edit2}
              onClick={() => navigate(`/settings/users/${rowUser.id}`)}
              title="Cập nhật"
            />
          )}

          {/* NÚT DELETE: Chỉ hiện nếu là Admin */}
          {isSuperAdmin && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              icon={Trash2}
              onClick={() => handleDelete(rowUser.id)}
              title="Xóa"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Người dùng"
      subtitle="Quản lý tài khoản và phân quyền nhân viên"
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Users" }]} />}
      
      actions={
        isSuperAdmin ? (
          <Button icon={Plus} onClick={() => navigate("/settings/users/new")}>
            Tạo tài khoản
          </Button>
        ) : null
      }
    >
      <div className="mb-4 w-full md:w-72">
        <SearchInput
          placeholder="Tìm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="Chưa có người dùng nào."
        />
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