import { useState, useEffect } from "react";
import { fetchRoles, deleteRole, selectRoles, Role } from "../store/roles";
import { PageLayout } from "../components/ui/PageLayout";
import { DataTable, Column } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { SearchInput } from "../components/ui/Input";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { dispatch(fetchRoles()); }, [dispatch]);

  // Lọc dữ liệu client-side demo
  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Định nghĩa cột cho Table
  const columns: Column<Role>[] = [
    { header: "ID", accessorKey: "id", className: "w-16 font-mono text-xs" },
    { header: "Tên Role", accessorKey: "name", className: "font-bold" },
    { header: "Mô tả", accessorKey: "description" },
    { 
      header: "Trạng thái", 
      render: (role) => (
        <Chip color={role.active ? "green" : "red"}>
          {role.active ? "Hoạt động" : "Vô hiệu"}
        </Chip>
      ) 
    },
    {
      header: "Hành động",
      className: "text-right",
      render: (role) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" icon={Edit2} onClick={() => alert("Edit " + role.id)} />
          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" icon={Trash2} onClick={() => dispatch(deleteRole(role.id))} />
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="Phân quyền (Roles)"
      subtitle="Quản lý danh sách vai trò và quyền hạn trong hệ thống"
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Roles" }]} />}
      actions={
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
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

      {/* Modal Tạo mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tạo mới Role"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={() => setIsModalOpen(false)}>Lưu lại</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Tên Role" placeholder="VD: MANAGER" />
          <Input label="Mô tả" placeholder="Nhập mô tả..." />
        </div>
      </Modal>
    </PageLayout>
  );
}