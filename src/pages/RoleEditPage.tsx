import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoles, createRole, updateRole, selectRoles } from "../store/roles";
import { fetchPermissions, selectPermissions, Permission } from "../store/permissions";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch"; 
import { Save, Loader2, Search, Shield, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function RoleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux Data
  const roles = useAppSelector(selectRoles);
  const permissions = useAppSelector(selectPermissions);
  
  // Local State
  const [isSaving, setIsSaving] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState(""); // Search quyền
  
  // Form Data (State nằm ở đây để nút Save ở Header truy cập được)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    permissionIds: [] as number[],
  });

  // 1. Fetch Data
  useEffect(() => {
    dispatch(fetchPermissions({ page: 1, pageSize: 500 })); // Lấy hết quyền
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles.length]);

  // 2. Bind Data nếu là Edit Mode
  useEffect(() => {
    if (id && roles.length > 0) {
      const foundRole = roles.find((r) => String(r.id) === id);
      if (foundRole) {
        setFormData({
          name: foundRole.name,
          description: foundRole.description || "",
          active: foundRole.active,
          permissionIds: foundRole.permissions.map((p) => p.id),
        });
      } else {
        toast.error("Không tìm thấy Role");
        navigate("/settings/roles");
      }
    }
  }, [id, roles, navigate]);

  // 3. Gom nhóm Permission (Có hỗ trợ filter search)
  const permissionsByModule = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    
    // Lọc permission trước khi gom nhóm
    const filteredPermissions = permissions.filter(p => 
        p.name.toLowerCase().includes(permissionSearch.toLowerCase()) || 
        p.apiPath.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        p.module.toLowerCase().includes(permissionSearch.toLowerCase())
    );

    filteredPermissions.forEach((p) => {
      const moduleName = p.module ? p.module : "OTHER";
      if (!groups[moduleName]) groups[moduleName] = [];
      groups[moduleName].push(p);
    });
    return groups;
  }, [permissions, permissionSearch]);

  // --- HANDLERS ---

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

  const toggleModule = (moduleName: string, perms: Permission[]) => {
    const modulePermIds = perms.map((p) => p.id);
    const isAllSelected = modulePermIds.every((id) => formData.permissionIds.includes(id));

    setFormData((prev) => {
      let newIds = [...prev.permissionIds];
      if (isAllSelected) {
        newIds = newIds.filter((id) => !modulePermIds.includes(id));
      } else {
        newIds = [...new Set([...newIds, ...modulePermIds])];
      }
      return { ...prev, permissionIds: newIds };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Tên Role là bắt buộc");

    setIsSaving(true);
    try {
        const payload = {
            name: formData.name,
            description: formData.description,
            active: formData.active,
            permissions: formData.permissionIds // Backend nhận list ID
        };

        if (id) {
            await dispatch(updateRole({ id: Number(id), ...payload })).unwrap();
            toast.success("Cập nhật Role thành công!");
        } else {
            await dispatch(createRole(payload)).unwrap();
            toast.success("Tạo Role thành công!");
        }
        navigate("/settings/roles");
    } catch (error) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        setIsSaving(false);
    }
  };

  if (permissions.length === 0) {
      return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-600"/></div>
  }

  const isEditMode = !!id;

  return (
    <PageLayout
      title={isEditMode ? "Cập nhật Role" : "Tạo Role mới"}
      subtitle={isEditMode ? `Chỉnh sửa phân quyền cho role #${id}` : "Thiết lập vai trò mới trong hệ thống"}
      showBack={true}
      breadcrumbs={
        <Breadcrumb 
          items={[
            { label: "Cài đặt" },
            { label: "Roles", to: "/settings/roles" },
            { label: isEditMode ? `Cập nhật #${id}` : "Tạo mới" }
          ]} 
        />
      }
      // 🔥 NÚT LƯU NẰM Ở ĐÂY (Góc trên phải)
      actions={
        <Button loading={isSaving} icon={Save} onClick={handleSubmit}>
            Lưu thay đổi
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI: THÔNG TIN CƠ BẢN (Sticky) --- */}
        <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Shield size={20} />
                    </div>
                    <h3 className="font-semibold text-slate-800">Thông tin vai trò</h3>
                </div>
                
                <Input 
                    label="Tên Role (*)" 
                    placeholder="VD: SALE_MANAGER" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                />
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                    <textarea 
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-24"
                        placeholder="Mô tả nhiệm vụ của vai trò này..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">Trạng thái hoạt động</span>
                    <Switch 
                        checked={formData.active} 
                        onCheckedChange={(val) => setFormData({...formData, active: val})} 
                    />
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI: MA TRẬN PHÂN QUYỀN --- */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
            
            {/* Header: Search & Stats */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-slate-800">Phân quyền hệ thống</h3>
                    <p className="text-xs text-slate-500">Chọn các quyền hạn để gán cho vai trò này</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input 
                            type="text"
                            placeholder="Tìm quyền (VD: user, create...)"
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                        />
                    </div>
                    <div className="hidden sm:flex bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap">
                        {formData.permissionIds.length} đã chọn
                    </div>
                </div>
            </div>

            {/* List Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(permissionsByModule).length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed">
                        Không tìm thấy quyền nào phù hợp
                    </div>
                ) : (
                    Object.entries(permissionsByModule).map(([moduleName, perms]) => {
                        const isAllSelected = perms.every((p) => formData.permissionIds.includes(p.id));
                        
                        return (
                            <div key={moduleName} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Header Module */}
                                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700 text-sm tracking-wide">{moduleName}</span>
                                        <span className="text-[10px] bg-white border px-1.5 rounded text-slate-500">{perms.length}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggleModule(moduleName, perms)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                    >
                                        {isAllSelected ? "Bỏ chọn" : "Chọn tất cả"}
                                        {isAllSelected && <CheckCheck size={14} />}
                                    </button>
                                </div>

                                {/* List Permissions */}
                                <div className="p-2">
                                    {perms.map((p) => {
                                        const isChecked = formData.permissionIds.includes(p.id);
                                        return (
                                            <div 
                                                key={p.id} 
                                                onClick={() => togglePermission(p.id)}
                                                className={clsx(
                                                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all group",
                                                    isChecked ? "bg-blue-50/50" : "hover:bg-slate-50"
                                                )}
                                            >
                                                <div className="flex flex-col pr-3 overflow-hidden">
                                                    <span className={clsx(
                                                        "text-sm font-medium truncate",
                                                        isChecked ? "text-blue-900" : "text-slate-700"
                                                    )}>
                                                        {p.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={clsx(
                                                            "text-[10px] font-bold uppercase",
                                                            p.method === 'GET' ? 'text-green-600' :
                                                            p.method === 'POST' ? 'text-yellow-600' :
                                                            p.method === 'DELETE' ? 'text-red-600' : 'text-blue-600'
                                                        )}>
                                                            {p.method}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono truncate" title={p.apiPath}>
                                                            {p.apiPath}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <Switch 
                                                    checked={isChecked} 
                                                    onCheckedChange={() => {}} // Handle by div onClick
                                                    className="data-[state=checked]:bg-blue-600 pointer-events-none" // Disable pointer event để click div ăn
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
      </div>
    </PageLayout>
  );
}