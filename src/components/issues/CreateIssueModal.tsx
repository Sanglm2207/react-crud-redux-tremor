import { useState, useEffect } from "react";
import { createIssue } from "../../store/issues/actions";
import { fetchUsers, selectUsers } from "../../store/users"; // Import store users
import { selectAuth } from "../../store/auth"; // Import store auth
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import AvatarUpload from "../ui/AvatarUpload";
import { toast } from "sonner";
import { User as UserIcon, Users as UsersIcon } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../store/store";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateIssueModal({ isOpen, onClose, onSuccess }: CreateIssueModalProps) {
  const dispatch = useAppDispatch();
  
  // 1. Lấy data từ Redux
  const { user: currentUser } = useAppSelector(selectAuth);
  const { list: usersList } = useAppSelector(selectUsers);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2. Mode: 'SELF' (Chính tôi) | 'OTHER' (Chọn danh sách)
  const [reportMode, setReportMode] = useState<'SELF' | 'OTHER'>('SELF');

  const [formData, setFormData] = useState({
    reporterName: "",
    department: "",
    deviceName: "",
    errorType: "Phần cứng",
    description: "",
    imageUrl: ""
  });

  // Load danh sách user nếu chưa có (để hiển thị trong select box)
  useEffect(() => {
    if (isOpen && usersList.length === 0) {
      dispatch(fetchUsers({ page: 1, pageSize: 100 }));
    }
  }, [isOpen, dispatch, usersList.length]);

  // Logic tự động điền khi mở modal hoặc đổi Mode
  useEffect(() => {
    if (isOpen && currentUser) {
        if (reportMode === 'SELF') {
            // Nếu là chính tôi -> Điền thông tin login
            setFormData(prev => ({
                ...prev,
                reporterName: currentUser.name,
                // Giả sử user có field department, nếu không thì để trống hoặc hardcode
                // Ở đây mình giả định trong User object chưa có field department thì để trống
                department: (currentUser as any).department || "" 
            }));
        } else {
            // Nếu chuyển sang chọn người khác -> Reset
            setFormData(prev => ({ ...prev, reporterName: "", department: "" }));
        }
    }
  }, [isOpen, reportMode, currentUser]);

  // Handle khi chọn user từ Dropdown
  const handleSelectUser = (userId: string) => {
      const selectedUser = usersList.find(u => String(u.id) === userId);
      if (selectedUser) {
          setFormData(prev => ({
              ...prev,
              reporterName: selectedUser.name,
              // Giả sử user object có field department
              department: (selectedUser as any).department || "" 
          }));
      }
  };

  const handleSubmit = async () => {
    if (!formData.reporterName || !formData.deviceName || !formData.description) {
        return toast.error("Vui lòng điền đầy đủ thông tin (*)");
    }

    setIsSubmitting(true);
    try {
        await dispatch(createIssue(formData)).unwrap();
        toast.success("Đã gửi báo lỗi thành công!");
        onSuccess();
        onClose();
        // Reset form
        setFormData({ 
            reporterName: currentUser?.name || "", 
            department: "", 
            deviceName: "", 
            errorType: "Phần cứng", 
            description: "", 
            imageUrl: "" 
        });
        setReportMode('SELF'); // Reset về chính tôi
    } catch (error) {
        toast.error("Gửi báo lỗi thất bại");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo báo lỗi mới"
      size="lg"
      footer={
        <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={onClose}>Hủy</Button>
            <Button loading={isSubmitting} onClick={handleSubmit}>Gửi báo cáo</Button>
        </div>
      }
    >
        <div className="space-y-5">
            {/* --- SWITCH MODE NGƯỜI BÁO --- */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Người báo cáo (*)</label>
                <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-3">
                    <button
                        type="button"
                        onClick={() => setReportMode('SELF')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            reportMode === 'SELF' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <UserIcon size={16} /> Chính tôi
                    </button>
                    <button
                        type="button"
                        onClick={() => setReportMode('OTHER')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            reportMode === 'OTHER' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <UsersIcon size={16} /> Chọn nhân viên
                    </button>
                </div>

                {/* INPUT HOẶC SELECT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportMode === 'SELF' ? (
                        <Input 
                            value={formData.reporterName} 
                            disabled 
                            className="bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    ) : (
                        <div>
                            <select 
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                onChange={(e) => handleSelectUser(e.target.value)}
                                defaultValue=""
                            >
                                <option value="" disabled>-- Chọn nhân viên --</option>
                                {usersList.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <Input 
                        placeholder="Phòng ban (Tự động hoặc nhập tay)"
                        value={formData.department} 
                        onChange={e => setFormData({...formData, department: e.target.value})}
                    />
                </div>
            </div>

            {/* --- CÁC TRƯỜNG CÒN LẠI GIỮ NGUYÊN --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Tên thiết bị (*)" 
                    placeholder="VD: Máy in Canon LBP..."
                    value={formData.deviceName} 
                    onChange={e => setFormData({...formData, deviceName: e.target.value})}
                />
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại lỗi</label>
                    <select 
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                        value={formData.errorType}
                        onChange={e => setFormData({...formData, errorType: e.target.value})}
                    >
                        <option value="Phần cứng">Phần cứng</option>
                        <option value="Phần mềm">Phần mềm</option>
                        <option value="Mạng / Internet">Mạng / Internet</option>
                        <option value="Bảo trì định kỳ">Bảo trì định kỳ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả lỗi (*)</label>
                    <textarea 
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-24"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Mô tả chi tiết tình trạng..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Ảnh minh họa (nếu có)</label>
                    <div className="flex justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
                        <AvatarUpload 
                            currentImageUrl={formData.imageUrl} 
                            onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
}