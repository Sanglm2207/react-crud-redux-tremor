import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser, selectUsers, User, deactivateUsers, activateUsers } from "../store/users";
import { selectAuth } from "../store/auth"; // Import auth selector
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import { Pagination } from "../components/ui/Pagination";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Edit2, Trash2, Plus, Ban, Unlock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";
import { FilterChip } from "../components/ui/FilterChip";

type UserFilterStatus = 'all' | 'active' | 'inactive';


export default function UsersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user: currentUser } = useAppSelector(selectAuth);
  
  const isSuperAdmin = currentUser?.role?.name === 'ADMIN';

  const { list: users, meta, isLoading } = useAppSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const [filterStatus, setFilterStatus] = useState<UserFilterStatus>('all'); 
  const [selectedIds, setSelectedIds] = useState<number[]>([]); 

  // Lấy ra danh sách các user object đang được chọn
  const selectedUsers = users.filter(u => selectedIds.includes(u.id));
  
  // Kiểm tra xem trong list chọn có user nào đang active/inactive không
  const hasActiveUsers = selectedUsers.some(u => u.is_active);
  const hasInactiveUsers = selectedUsers.some(u => !u.is_active);

  useEffect(() => {
    const statusParam = filterStatus === 'all' ? undefined : (filterStatus === 'active');

    dispatch(fetchUsers({ page: currentPage, pageSize, name: searchTerm, is_active: statusParam  }));
  }, [dispatch, currentPage, searchTerm, filterStatus]);

 // Handler: Vô hiệu hóa (Deactivate)
  const handleDeactivate = async (ids: number[]) => {
    if (confirm(`Vô hiệu hóa ${ids.length} tài khoản này?`)) {
      try {
        await dispatch(deactivateUsers(ids)).unwrap();
        toast.success("Đã vô hiệu hóa thành công!");
        setSelectedIds([]);
      } catch (e) { toast.error("Lỗi xảy ra"); }
    }
  };

  // Handler: Kích hoạt lại (Activate)
  const handleActivate = async (ids: number[]) => {
    if (confirm(`Kích hoạt lại ${ids.length} tài khoản này?`)) {
      try {
        await dispatch(activateUsers(ids)).unwrap();
        toast.success("Kích hoạt thành công!");
        setSelectedIds([]);
      } catch (e) { toast.error("Lỗi xảy ra"); }
    }
  };


  // Nút Delete trên từng dòng cũng gọi API này luôn (nếu muốn)
  // Hoặc dùng action deleteUser cũ nếu muốn xóa cứng
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn vô hiệu hóa người dùng này?")) {
      await dispatch(deactivateUsers([id])).unwrap(); 
      toast.success("Đã vô hiệu hóa");
    }
  };

  // Lọc dữ liệu dựa trên trạng thái
  const filteredUsersForStats = useMemo(() => {
    return users.filter(user => {
      // Logic lọc ở đây (nếu có search client-side hoặc filter client-side)
      // Hiện tại, ta chỉ dùng để tính tổng số lượng
      return true; 
    });
  }, [users]);
  
  // Tính toán số lượng cho các Chip
  const totalUsers = meta.total; // Lấy tổng số từ API
  // Để tính active/inactive chính xác, ta cần API trả về tổng số hoặc phải fetch hết
  // Tạm thời, ta dùng ước lượng:
  const activeCount = filteredUsersForStats.filter(u => u.is_active).length;
  const inactiveCount = filteredUsersForStats.filter(u => !u.is_active).length;
  // *LƯU Ý: Nếu tổng số user > pageSize, số lượng này sẽ KHÔNG CHÍNH XÁC.
  // Lý tưởng là Backend nên trả về meta { totalActive: X, totalInactive: Y }


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
    { header: "Trạng thái", render: (u) => <Chip color={u.is_active ? "green" : "red"}>{u.is_active ? "Active" : "Inactive"}</Chip> },
    {
      header: "Hành động",
      className: "text-right",
      render: (rowUser) => (
        <div className="flex justify-end gap-2">
          {(isSuperAdmin || currentUser?.id === rowUser.id) && (
            <Button size="sm" variant="ghost" icon={Edit2} onClick={() => navigate(`/settings/users/${rowUser.id}`)} />
          )}
          
          {isSuperAdmin && (
            rowUser.is_active ? (
                // Nếu đang Active -> Hiện nút Thùng rác (Deactivate)
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  icon={Trash2}
                  onClick={() => handleDeactivate([rowUser.id])}
                  title="Vô hiệu hóa"
                />
            ) : (
                // Nếu đang Inactive -> Hiện nút Unlock/Check (Activate)
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  icon={Unlock} // Hoặc icon RefreshCcw
                  onClick={() => handleActivate([rowUser.id])}
                  title="Kích hoạt lại"
                />
            )
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
        isSuperAdmin && (
          <div className="flex gap-2">
            {/* Nếu trong các dòng đã chọn, có user đang Active -> Hiện nút Deactivate */}
            {selectedIds.length > 0 && hasActiveUsers && (
                <Button 
                    variant="danger" 
                    icon={Ban} 
                    onClick={() => handleDeactivate(selectedIds)}
                >
                    Vô hiệu hóa ({selectedIds.length})
                </Button>
            )}

            {/* Nếu trong các dòng đã chọn, có user đang Inactive -> Hiện nút Activate */}
            {selectedIds.length > 0 && hasInactiveUsers && (
                <Button 
                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500" // Custom màu xanh lá
                    icon={CheckCircle} 
                    onClick={() => handleActivate(selectedIds)}
                >
                    Kích hoạt ({selectedIds.length})
                </Button>
            )}
            
            <Button icon={Plus} onClick={() => navigate("/settings/users/new")}>
              Tạo tài khoản
            </Button>
          </div>
        )
      }
    >
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Thanh Search */}
        <div className="w-full md:w-72 order-2 md:order-1">
          <SearchInput
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Chips (Order 1) */}
        <div className="flex items-center gap-2 order-1 md:order-2">
          
          <FilterChip 
            label={`Tất cả (${totalUsers})`}
            isActive={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
            baseColor="gray"
          />

          <FilterChip 
            label={`Active (${activeCount})`}
            isActive={filterStatus === 'active'}
            onClick={() => setFilterStatus('active')}
            baseColor="green"
          />
          
          <FilterChip 
            label={`Inactive (${inactiveCount})`}
            isActive={filterStatus === 'inactive'}
            onClick={() => setFilterStatus('inactive')}
            baseColor="red"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="Chưa có người dùng nào."
            enableSelection={isSuperAdmin} 
            selectedIds={selectedIds}
            onSelectionChange={(ids) => setSelectedIds(ids as number[])}
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