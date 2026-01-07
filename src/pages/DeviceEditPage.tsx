import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDevices, createDevice, updateDevice, selectDevices } from "../store/devices";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function DeviceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: devices, isLoading } = useAppSelector(selectDevices);

  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "LAPTOP",
    status: "ACTIVE",
    department: "",
    description: ""
  });

  // Load data nếu F5 hoặc Edit
  useEffect(() => {
    if (devices.length === 0) {
      dispatch(fetchDevices({ page: 1, pageSize: 100 }));
    }
  }, [dispatch, devices.length]);

  useEffect(() => {
    if (id && devices.length > 0) {
      const found = devices.find(d => String(d.id) === id);
      if (found) {
        setFormData({
          code: found.code,
          name: found.name,
          type: found.type,
          status: found.status,
          department: found.department,
          description: found.description || ""
        });
      }
    }
  }, [id, devices]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) return toast.error("Vui lòng điền các trường bắt buộc");

    setIsSaving(true);
    try {
      if (id) {
        await dispatch(updateDevice({ id: Number(id), ...formData })).unwrap();
        toast.success("Cập nhật thiết bị thành công!");
      } else {
        await dispatch(createDevice(formData)).unwrap();
        toast.success("Thêm thiết bị thành công!");
      }
      navigate("/devices");
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsSaving(false);
    }
  };

  const isEdit = !!id;

  if (isLoading && isEdit && !formData.code) return <div>Loading...</div>;

  return (
    <PageLayout
      title={isEdit ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}
      subtitle={isEdit ? `Chỉnh sửa thông tin thiết bị #${id}` : "Nhập thông tin tài sản mới"}
      showBack={true}
      breadcrumbs={
        <Breadcrumb 
          items={[
            { label: "Quản lý thiết bị", to: "/devices" },
            { label: isEdit ? `Cập nhật #${id}` : "Tạo mới" }
          ]} 
        />
      }
      actions={
        <Button loading={isSaving} icon={Save} onClick={handleSubmit}>
          Lưu lại
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Input 
                label="Mã thiết bị (*)" 
                placeholder="VD: LT-001" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
            />

            <Input 
                label="Tên thiết bị (*)" 
                placeholder="VD: Dell XPS 15" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại thiết bị</label>
                <select 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                >
                    <option value="LAPTOP">Laptop</option>
                    <option value="PC">PC (Máy bàn)</option>
                    <option value="PRINTER">Máy in</option>
                    <option value="PROJECTOR">Máy chiếu</option>
                    <option value="OTHER">Khác</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                >
                    <option value="ACTIVE">Hoạt động tốt</option>
                    <option value="MAINTENANCE">Đang bảo trì</option>
                    <option value="BROKEN">Hư hỏng</option>
                    <option value="LIQUIDATED">Đã thanh lý</option>
                </select>
            </div>

            <div className="md:col-span-2">
                <Input 
                    label="Phòng ban / Vị trí" 
                    placeholder="VD: Phòng Marketing, Tầng 2" 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-24"
                    placeholder="Cấu hình, ghi chú thêm..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
        </div>
      </div>
    </PageLayout>
  );
}