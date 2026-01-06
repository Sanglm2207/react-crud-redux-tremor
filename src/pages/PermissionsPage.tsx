import { useEffect, useState } from "react";
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
  Select,
  SelectItem,
} from "@tremor/react";
import {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  selectPermissions,
  Permission,
} from "../store/permissions";
import { Trash2, Edit2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function PermissionsPage() {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);

  const [viewState, setViewState] = useState<"LIST" | "FORM">("LIST");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    apiPath: "",
    method: "GET",
    module: "",
  });

  // Fetch data
  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  // --- HANDLERS ---

  const handleEdit = (item: Permission) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      apiPath: item.apiPath,
      method: item.method,
      module: item.module,
    });
    setViewState("FORM");
  };

  const resetForm = () => {
    setViewState("LIST");
    setEditingId(null);
    setFormData({ name: "", apiPath: "", method: "GET", module: "" });
  };

  const handleSubmit = async () => {
    // Validation cơ bản
    if (!formData.name || !formData.apiPath || !formData.module) {
      return toast.error("Vui lòng điền đầy đủ thông tin!");
    }

    const payload = {
      ...formData,
      module: formData.module.toUpperCase(), // Module nên viết hoa (VD: USER)
    };

    const promise = editingId
      ? dispatch(updatePermission({ id: editingId, ...payload })).unwrap()
      : dispatch(createPermission(payload)).unwrap();

    toast.promise(promise, {
      loading: "Đang xử lý...",
      success: () => {
        resetForm();
        return editingId ? "Cập nhật thành công!" : "Tạo mới thành công!";
      },
      error: (err) => (typeof err === "string" ? err : "Có lỗi xảy ra!"),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa Permission này?")) {
      toast.promise(dispatch(deletePermission(id)).unwrap(), {
        loading: "Đang xóa...",
        success: "Đã xóa thành công",
        error: "Xóa thất bại",
      });
    }
  };

  // Helper chọn màu cho Method
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "green";
      case "POST": return "yellow";
      case "PUT": return "blue";
      case "PATCH": return "cyan";
      case "DELETE": return "red";
      default: return "gray";
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {viewState === "LIST" && (
          <Button
            icon={Plus}
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", apiPath: "", method: "GET", module: "" });
              setViewState("FORM");
            }}
          >
            Create Permission
          </Button>
        )}
      </div>

      {/* --- FORM VIEW --- */}
      {viewState === "FORM" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
             <Button variant="light" icon={ArrowLeft} onClick={resetForm} className="p-0" />
             <Title>Thông tin Permission API</Title>
          </div>

          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Text>Permission Name (*)</Text>
                <TextInput
                  placeholder="e.g. Create User"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Text>Module (*)</Text>
                <TextInput
                  placeholder="e.g. USER, AUTH"
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Text>API Path (*)</Text>
                <TextInput
                  placeholder="e.g. /api/v1/users"
                  value={formData.apiPath}
                  onChange={(e) => setFormData({ ...formData, apiPath: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Text>HTTP Method</Text>
                <Select
                  value={formData.method}
                  onValueChange={(val) => setFormData({ ...formData, method: val })}
                >
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
              <Button variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {editingId ? "Save Changes" : "Create Permission"}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* --- LIST VIEW --- */
        <Card className="p-0 overflow-hidden shadow-sm">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableHeaderCell>Module</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>API Path</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Text>No permissions found.</Text>
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <Badge color="slate" size="xs">{item.module}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Badge color={getMethodColor(item.method)} size="xs">
                        {item.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {item.apiPath}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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