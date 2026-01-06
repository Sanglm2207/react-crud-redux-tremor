import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Title,
  Button,
  Badge,
  TextInput,
  Text,
} from "@tremor/react";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  selectRoles,
  Role,
} from "../store/roles";
import {
  fetchPermissions,
  selectPermissions,
  Permission,
} from "../store/permissions";
import { Switch } from "../components/ui/Switch";
import { Trash2, Edit2, Plus, CheckSquare, Square } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const permissions = useAppSelector(selectPermissions);

  const [viewState, setViewState] = useState<"LIST" | "FORM">("LIST");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    permissionIds: [] as number[],
  });

  // Load dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Gom nhóm Permissions theo Module
  const permissionsByModule = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      const moduleName = p.module ? p.module : "OTHER";
      if (!groups[moduleName]) groups[moduleName] = [];
      groups[moduleName].push(p);
    });
    return groups;
  }, [permissions]);

  // --- HANDLERS ---

  // Chọn/Bỏ chọn 1 quyền
  const togglePermission = (id: number) => {
    setFormData((prev) => {
      const exists = prev.permissionIds.includes(id);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((pid) => pid !== id)
          : [...prev.permissionIds, id],
      };
    });
  };

  // Chọn/Bỏ chọn tất cả quyền trong 1 module
  const toggleModulePermissions = (moduleName: string) => {
    const modulePerms = permissionsByModule[moduleName];
    const modulePermIds = modulePerms.map((p) => p.id);
    
    // Kiểm tra xem đã chọn hết chưa
    const isAllSelected = modulePermIds.every((id) => 
      formData.permissionIds.includes(id)
    );

    setFormData((prev) => {
      let newIds = [...prev.permissionIds];
      if (isAllSelected) {
        // Nếu đã chọn hết -> Bỏ chọn tất cả của module này
        newIds = newIds.filter((id) => !modulePermIds.includes(id));
      } else {
        // Nếu chưa chọn hết -> Thêm tất cả ID của module này (tránh trùng lặp)
        newIds = [...new Set([...newIds, ...modulePermIds])];
      }
      return { ...prev, permissionIds: newIds };
    });
  };

  // Chuyển sang chế độ Edit
  const handleEdit = (role: Role) => {
    setEditingId(role.id);
    setFormData({
      name: role.name,
      description: role.description,
      active: role.active,
      permissionIds: role.permissions.map((p) => p.id),
    });
    setViewState("FORM");
  };

  // Reset form về mặc định
  const resetForm = () => {
    setViewState("LIST");
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      active: true,
      permissionIds: [],
    });
  };

  // Xử lý Submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Role Name is required!");

    // Chuẩn bị payload: Map permissionIds -> permissions để khớp với Backend DTO
    const payload = {
      name: formData.name,
      description: formData.description,
      active: formData.active,
      permissions: formData.permissionIds, 
    };

    const promise = editingId
      ? dispatch(updateRole({ id: editingId, ...payload })).unwrap()
      : dispatch(createRole(payload)).unwrap();

    toast.promise(promise, {
      loading: "Đang xử lý...",
      success: () => {
        resetForm();
        return editingId ? "Cập nhật Role thành công!" : "Tạo Role thành công!";
      },
      error: (err) => (typeof err === "string" ? err : "Có lỗi xảy ra!"),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa Role này?")) {
      toast.promise(dispatch(deleteRole(id)).unwrap(), {
        loading: "Đang xóa...",
        success: "Đã xóa Role thành công",
        error: "Xóa thất bại",
      });
    }
  };

  // --- RENDER ---

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        

        {/* Nút Create chỉ hiện ở màn hình List */}
        {viewState === "LIST" && (
          <Button
            icon={Plus}
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", description: "", active: true, permissionIds: [] });
              setViewState("FORM");
            }}
          >
            Create Role
          </Button>
        )}
      </div>

      {/* --- FORM VIEW --- */}
      {viewState === "FORM" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Thông tin cơ bản */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-1">
                <Text className="mb-1">Role Name (*)</Text>
                <TextInput
                  placeholder="e.g. MANAGER"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Text className="mb-1">Description</Text>
                <TextInput
                  placeholder="Short description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 pb-1">
                <Text>Active Status</Text>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(val) => setFormData({ ...formData, active: val })}
                  />
                  <span className={clsx("text-sm font-medium", formData.active ? "text-green-600" : "text-gray-500")}>
                    {formData.active ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Ma trận phân quyền */}
          <div>
            <Title className="mb-4">Permissions Matrix</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(permissionsByModule).map(([moduleName, perms]) => {
                const modulePermIds = perms.map((p) => p.id);
                const isAllSelected = modulePermIds.every((id) =>
                  formData.permissionIds.includes(id)
                );

                return (
                  <Card key={moduleName} className="flex flex-col gap-3 p-4 border border-slate-100 shadow-sm">
                    {/* Header Module */}
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Badge size="xs" color="indigo">{moduleName}</Badge>
                        <button
                          type="button"
                          onClick={() => toggleModulePermissions(moduleName)}
                          className="text-xs text-blue-600 hover:underline font-medium ml-1"
                        >
                          {isAllSelected ? "Bỏ chọn" : "Chọn tất cả"}
                        </button>
                      </div>
                      <Text className="text-xs text-gray-400">{perms.length} perms</Text>
                    </div>

                    {/* List Permissions */}
                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {perms.map((p) => {
                        const isSelected = formData.permissionIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePermission(p.id)}
                            className={clsx(
                              "flex items-start gap-3 p-2 rounded cursor-pointer border transition-all select-none group",
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-transparent hover:bg-gray-50"
                            )}
                          >
                            {isSelected ? (
                              <CheckSquare className="text-blue-600 shrink-0 mt-0.5" size={18} />
                            ) : (
                              <Square className="text-gray-300 group-hover:text-gray-400 shrink-0 mt-0.5" size={18} />
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className={clsx("text-sm font-medium truncate w-full", isSelected ? "text-blue-900" : "text-gray-700")}>
                                {p.name}
                              </span>
                              <span className="text-[10px] text-gray-500 uppercase flex gap-1 mt-0.5">
                                <span className={clsx("font-bold", 
                                    p.method === "GET" ? "text-green-600" : 
                                    p.method === "DELETE" ? "text-red-600" : 
                                    p.method === "POST" ? "text-yellow-600" : "text-blue-600"
                                )}>
                                  {p.method}
                                </span>
                                <span className="truncate" title={p.apiPath}>{p.apiPath}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-gray-50 p-4 z-10 shadow-inner">
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? "Update Role" : "Create Role"}</Button>
          </div>
        </div>
      ) : (
        /* --- LIST VIEW --- */
        <Card className="p-0 overflow-hidden shadow-sm">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Role Name</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Modules Access</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Text>No roles found.</Text>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: Role) => (
                  <TableRow key={role.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>#{role.id}</TableCell>
                    <TableCell className="font-bold text-slate-700">{role.name}</TableCell>
                    <TableCell>{role.description || "-"}</TableCell>
                    <TableCell>
                      <Badge color={role.active ? "green" : "red"} size="xs">
                        {role.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {role.permissions && role.permissions.length > 0 ? (
                          Array.from(new Set(role.permissions.map((p) => p.module)))
                            .slice(0, 4)
                            .map((m) => (
                              <span key={m} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                {m || "OTHER"}
                              </span>
                            ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No permissions</span>
                        )}
                        {new Set(role.permissions.map((p) => p.module)).size > 4 && (
                          <span className="text-[10px] text-gray-500 pt-0.5">...</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}