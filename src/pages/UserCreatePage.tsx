import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../store/users";
import { selectRoles, fetchRoles } from "../store/roles";
import { Gender } from "../store/users/types";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import AvatarUpload from "../components/ui/AvatarUpload";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const [isSaving, setIsSaving] = useState(false);

  // Form State (Default values)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Create cần password
    age: 0,
    gender: "MALE" as Gender,
    address: "",
    phone: "",
    roleId: "",
    avatar: ""
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) return toast.error("Họ tên không được để trống!");
    if (!formData.email.trim()) return toast.error("Email không được để trống!");
    if (!formData.password.trim()) return toast.error("Mật khẩu không được để trống!");
    if (!formData.roleId) return toast.error("Vui lòng chọn vai trò!");

    setIsSaving(true);
    try {
      await dispatch(createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        avatar: formData.avatar,
        role: { id: Number(formData.roleId) }
      })).unwrap();

      toast.success("Tạo người dùng thành công!");
      navigate("/settings/users");
    } catch (error) {
      toast.error("Tạo thất bại (Email có thể đã tồn tại)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title="Tạo người dùng mới"
      subtitle="Thêm nhân viên mới vào hệ thống"
      showBack={true}
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Users", to: "/settings/users" }, { label: "Tạo mới" }]} />}
      actions={<Button loading={isSaving} icon={Save} onClick={handleSubmit}>Lưu lại</Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AVATAR */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <h3 className="font-semibold text-slate-800 mb-4">Ảnh đại diện</h3>
            <AvatarUpload onUploadSuccess={(url) => setFormData(prev => ({...prev, avatar: url}))} />
          </div>
        </div>

        {/* FORM */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Account Info */}
            <section>
                <h3 className="text-sm uppercase font-bold text-slate-500 mb-4 border-b pb-2">Thông tin tài khoản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Họ và tên (*)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="Email (*)" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <Input label="Mật khẩu (*)" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò (*)</label>
                        <select 
                            className="block w-full rounded-md border border-slate-300 py-2 px-3 sm:text-sm"
                            value={formData.roleId}
                            onChange={e => setFormData({...formData, roleId: e.target.value})}
                        >
                            <option value="" disabled>-- Chọn vai trò --</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* Personal Info */}
            <section>
                <h3 className="text-sm uppercase font-bold text-slate-500 mb-4 border-b pb-2 pt-2">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Tuổi" type="number" min={0} value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                        <select className="block w-full rounded-md border border-slate-300 py-2 px-3 sm:text-sm" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})}>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <Input label="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                        <Input label="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}