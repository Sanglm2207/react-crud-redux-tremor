import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { selectUsers, updateUser, fetchUsers } from "../store/users";
import { selectRoles, fetchRoles } from "../store/roles";
import { Gender, User } from "../store/users/types";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import AvatarUpload from "../components/ui/AvatarUpload";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"; // Input custom
import { Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Lấy dữ liệu từ Redux
  // Lưu ý: Lấy 'list' ra đặt tên là 'users' để dùng hàm find
  const { list: users, isLoading: isUsersLoading } = useAppSelector((state) => state.users);
  const roles = useAppSelector(selectRoles);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Email thường không cho sửa, chỉ để hiển thị
    age: 0,
    gender: "OTHER" as Gender,
    address: "",
    phone: "",
    roleId: "",
    avatar: ""
  });

  // 1. Fetch dữ liệu nếu store rỗng (F5 trang)
  useEffect(() => {
    dispatch(fetchRoles());
    if (users.length === 0) {
      dispatch(fetchUsers({ page: 1, pageSize: 100 })); // Fetch đủ để tìm
    }
  }, [dispatch, users.length]);

  // 2. Bind dữ liệu User vào Form khi tìm thấy ID
  useEffect(() => {
    if (id && users.length > 0) {
      const found = users.find(u => String(u.id) === id);
      if (found) {
        setCurrentUser(found);
        setFormData({
          name: found.name || "",
          email: found.email || "",
          age: found.age || 0,
          gender: found.gender || "OTHER",
          address: found.address || "",
          phone: found.phone || "",
          roleId: found.role?.id ? String(found.role.id) : "",
          avatar: found.avatar || ""
        });
      }
    }
  }, [id, users]);

  // Handle Submit
  const handleSubmit = async () => {
    if (!id) return;
    
    // Validation
    if (!formData.name.trim()) return toast.error("Họ tên không được để trống!");
    if (!formData.roleId) return toast.error("Vui lòng chọn vai trò!");

    setIsSaving(true);
    try {
      await dispatch(updateUser({
        id: Number(id),
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address,
        phone: formData.phone,
        avatar: formData.avatar,
        // Backend yêu cầu object role { id: ... }
        role: { id: Number(formData.roleId) }
      })).unwrap();

      toast.success("Cập nhật thông tin thành công!");
      navigate("/settings/users"); 
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER LOADING ---
  if (isUsersLoading && !currentUser) {
    return (
      <div className="flex h-96 items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // --- RENDER NOT FOUND ---
  if (!isUsersLoading && !currentUser) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy người dùng</h3>
            <Button variant="outline" onClick={() => navigate("/settings/users")}>Quay lại danh sách</Button>
        </div>
    );
  }

  // --- RENDER MAIN FORM ---
  return (
    <PageLayout
      title="Cập nhật người dùng"
      subtitle={`Chỉnh sửa thông tin chi tiết cho tài khoản #${id}`}
      showBack={true}
      breadcrumbs={
        <Breadcrumb 
          items={[
            { label: "Cài đặt" },
            { label: "Users", to: "/settings/users" },
            { label: `Cập nhật #${id}` }
          ]} 
        />
      }
      actions={
        <div className="flex gap-2">
            {/* Nút Refresh dữ liệu */}
            <Button variant="ghost" onClick={() => dispatch(fetchUsers({ page: 1, pageSize: 100 }))}>
                <RefreshCw size={18} />
            </Button>
            {/* Nút Save chính */}
            <Button loading={isSaving} icon={Save} onClick={handleSubmit}>
                Lưu thay đổi
            </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI: AVATAR */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-6 flex flex-col items-center">
            <h3 className="font-semibold text-slate-800 mb-4">Ảnh đại diện</h3>
            
            <AvatarUpload 
                currentImageUrl={formData.avatar}
                onUploadSuccess={(url) => setFormData(prev => ({...prev, avatar: url}))}
            />
            
            <div className="mt-6 text-center">
                <p className="text-sm font-medium text-slate-700">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
                <span className={clsx(
                    "inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                    currentUser?.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                )}>
                    {currentUser?.is_active ? "Active" : "Inactive"}
                </span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM NHẬP LIỆU */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Nhóm 1: Thông tin tài khoản */}
            <section>
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-4 border-b pb-2">
                    Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Họ và tên (*)" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    
                    {/* Custom Select bằng HTML chuẩn + Tailwind */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò (*)</label>
                        <select 
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                            value={formData.roleId}
                            onChange={e => setFormData({...formData, roleId: e.target.value})}
                        >
                            <option value="" disabled>-- Chọn vai trò --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <Input 
                            label="Email" 
                            value={formData.email} 
                            disabled 
                            className="bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 italic">Email không thể chỉnh sửa vì là định danh đăng nhập.</p>
                    </div>
                </div>
            </section>

            {/* Nhóm 2: Thông tin cá nhân */}
            <section>
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-4 border-b pb-2 pt-2">
                    Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Tuổi" 
                        type="number"
                        min={0}
                        value={formData.age} 
                        onChange={e => setFormData({...formData, age: Number(e.target.value)})} 
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                        <select 
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                            value={formData.gender}
                            onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <Input 
                            label="Số điện thoại" 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="VD: 0912..." 
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Input 
                            label="Địa chỉ" 
                            value={formData.address} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            placeholder="VD: Số 1, Đường ABC..." 
                        />
                    </div>
                </div>
            </section>
          </div>
          
          {/* Nút Save cho Mobile (Hiện cuối form) */}
          <div className="md:hidden mt-4">
               <Button className="w-full" loading={isSaving} icon={Save} onClick={handleSubmit}>
                  Lưu thay đổi
               </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}