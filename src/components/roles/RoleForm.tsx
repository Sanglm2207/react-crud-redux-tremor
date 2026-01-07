import { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch"; // Switch xịn đã làm
import { Permission } from "../../store/permissions";
import { Role } from "../../store/roles";
import { Save, CheckCheck } from "lucide-react";
import clsx from "clsx";

interface RoleFormProps {
  initialData?: Role; // Nếu có -> Update, không có -> Create
  allPermissions: Permission[];
  isSaving: boolean;
  onSubmit: (data: any) => void;
}

export default function RoleForm({ initialData, allPermissions, isSaving, onSubmit }: RoleFormProps) {
  // State Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    permissionIds: [] as number[],
  });

  // Load data nếu là mode Edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        active: initialData.active,
        permissionIds: initialData.permissions.map((p) => p.id),
      });
    }
  }, [initialData]);

  // Gom nhóm Permission theo Module
  const permissionsByModule = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((p) => {
      const moduleName = p.module ? p.module : "OTHER";
      if (!groups[moduleName]) groups[moduleName] = [];
      groups[moduleName].push(p);
    });
    return groups;
  }, [allPermissions]);

  // --- HANDLERS ---

  // Toggle 1 permission
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

  // Toggle cả module (Select All / Deselect All)
  const toggleModule = (moduleName: string) => {
    const modulePerms = permissionsByModule[moduleName];
    const moduleids = modulePerms.map((p) => p.id);
    const isAllSelected = moduleids.every((id) => formData.permissionIds.includes(id));

    setFormData((prev) => {
      let newIds = [...prev.permissionIds];
      if (isAllSelected) {
        newIds = newIds.filter((id) => !moduleids.includes(id)); // Bỏ chọn hết
      } else {
        newIds = [...new Set([...newIds, ...moduleids])]; // Chọn hết
      }
      return { ...prev, permissionIds: newIds };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
      <div className="col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
          <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Thông tin vai trò</h3>
          
          <div className="space-y-4">
            <Input 
                label="Tên Role (*)" 
                placeholder="VD: SALE_MANAGER" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
            
            <Input 
                label="Mô tả" 
                placeholder="Mô tả nhiệm vụ..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
            />

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
              <div className="flex items-center gap-3 p-3 border rounded-md bg-slate-50">
                <Switch 
                    checked={formData.active} 
                    onCheckedChange={(val) => setFormData({...formData, active: val})} 
                />
                <span className={clsx("text-sm font-medium", formData.active ? "text-green-600" : "text-slate-500")}>
                    {formData.active ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button type="submit" loading={isSaving} icon={Save} className="w-full justify-center">
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: DANH SÁCH QUYỀN (SWITCH ON/OFF) */}
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-slate-800">Phân quyền hệ thống</h3>
                    <p className="text-sm text-slate-500">Bật/tắt các chức năng cho vai trò này.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    Đã chọn: {formData.permissionIds.length}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissionsByModule).map(([moduleName, perms]) => {
                    const moduleids = perms.map((p) => p.id);
                    const isAllSelected = moduleids.every((id) => formData.permissionIds.includes(id));

                    return (
                        <div key={moduleName} className="border border-slate-100 rounded-lg overflow-hidden shadow-sm">
                            {/* Header Module */}
                            <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                                <span className="font-bold text-slate-700 text-sm">{moduleName}</span>
                                <button
                                    type="button"
                                    onClick={() => toggleModule(moduleName)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    {isAllSelected ? "Bỏ chọn hết" : "Chọn tất cả"}
                                    {isAllSelected && <CheckCheck size={14} />}
                                </button>
                            </div>

                            {/* List Permissions */}
                            <div className="p-4 space-y-3 bg-white">
                                {perms.map((p) => {
                                    const isChecked = formData.permissionIds.includes(p.id);
                                    return (
                                        <div key={p.id} className="flex items-center justify-between group">
                                            <div className="flex flex-col pr-4">
                                                <span className={clsx("text-sm font-medium transition-colors", isChecked ? "text-slate-900" : "text-slate-500")}>
                                                    {p.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {p.method} - {p.apiPath}
                                                </span>
                                            </div>
                                            
                                            {/* SWITCH CHO TỪNG ITEM */}
                                            <Switch 
                                                checked={isChecked} 
                                                onCheckedChange={() => togglePermission(p.id)} 
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </form>
  );
}