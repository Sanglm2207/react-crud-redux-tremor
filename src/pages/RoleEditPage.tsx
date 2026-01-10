import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoles, createRole, updateRole, selectRoles } from "../store/roles";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { Save, Shield } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function RoleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const roles = useAppSelector(selectRoles);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  // 1. Fetch Roles nếu chưa có (để tìm ID khi edit)
  useEffect(() => {
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
        });
      } else {
        toast.error("Không tìm thấy Role");
        navigate("/settings/roles");
      }
    }
  }, [id, roles, navigate]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Tên Role là bắt buộc");

    setIsSaving(true);
    try {
      if (id) {
        await dispatch(updateRole({ id: Number(id), ...formData })).unwrap();
        toast.success("Cập nhật Role thành công!");
      } else {
        await dispatch(createRole(formData)).unwrap();
        toast.success("Tạo Role thành công!");
      }
      navigate("/settings/roles");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = !!id;

  return (
    <PageLayout
      title={isEditMode ? "Cập nhật Role" : "Tạo Role mới"}
      subtitle={isEditMode ? `Chỉnh sửa thông tin role #${id}` : "Thêm vai trò mới vào hệ thống"}
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
      actions={
        <Button loading={isSaving} icon={Save} onClick={handleSubmit}>
            Lưu thay đổi
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Thông tin vai trò</h3>
                    <p className="text-xs text-slate-500">Định danh và mô tả vai trò người dùng</p>
                </div>
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
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-32 resize-none"
                    placeholder="Mô tả nhiệm vụ của vai trò này..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                    <span className="text-sm font-medium text-slate-900 block">Trạng thái hoạt động</span>
                    <span className="text-xs text-slate-500">Kích hoạt hoặc vô hiệu hóa vai trò này</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className={clsx("text-xs font-bold uppercase", formData.active ? "text-green-600" : "text-slate-400")}>
                        {formData.active ? "Active" : "Inactive"}
                    </span>
                    <Switch 
                        checked={formData.active} 
                        onCheckedChange={(val) => setFormData({...formData, active: val})} 
                    />
                </div>
            </div>
        </div>
      </div>
    </PageLayout>
  );
}