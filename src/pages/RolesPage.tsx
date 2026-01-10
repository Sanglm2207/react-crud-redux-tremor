import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRoles, deleteRole, selectRoles, Role } from "../store/roles";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { SearchInput } from "../components/ui/Input";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function RolesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { dispatch(fetchRoles()); }, [dispatch]);

  // Lọc dữ liệu client-side demo
  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

 const columns: Column<Role>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-mono text-xs text-slate-500" },
    { 
        header: "Tên Role", 
        render: (role) => (
            <div className="font-bold text-slate-700">{role.name}</div>
        )
    },
    { 
        header: "Mô tả", 
        accessorKey: "description", 
        className: "text-slate-500 max-w-md truncate" 
    },
    {
      header: "Trạng thái",
      render: (role) => (
        <Chip color={role.active ? "green" : "red"} className="text-xs">
          {role.active ? "Hoạt động" : "Vô hiệu"}
        </Chip>
      ),
    },
    {
      header: "Hành động",
      className: "text-right",
      render: (role) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={Edit2}
            onClick={() => navigate(`/settings/roles/${role.id}`)}
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            icon={Trash2}
            onClick={() => {
                if(confirm("Xóa Role này?")) dispatch(deleteRole(role.id));
            }}
          />
        </div>
      ),
    }
  ];

  return (
    <PageLayout
      title="Phân quyền (Roles)"
      subtitle="Quản lý danh sách vai trò và quyền hạn trong hệ thống"
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Roles" }]} />}
      actions={
        <Button icon={Plus} onClick={() => navigate("/settings/roles/new")}>
          Tạo mới Role
        </Button>
      }
    >
      {/* Thanh Search & Filter */}
      <div className="mb-4 flex justify-between">
        <div className="w-72">
          <SearchInput 
            placeholder="Tìm kiếm Role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <DataTable 
        columns={columns} 
        data={filteredRoles} 
        isLoading={false} // Thay bằng biến loading thật từ redux
      />
    </PageLayout>
  );
}