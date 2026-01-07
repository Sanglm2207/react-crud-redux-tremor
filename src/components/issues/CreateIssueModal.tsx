import { useState } from "react";
import { createIssue } from "../../store/issues/actions";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import AvatarUpload from "../ui/AvatarUpload";
import { toast } from "sonner";
import { useAppDispatch } from "../../store/store";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateIssueModal({ isOpen, onClose, onSuccess }: CreateIssueModalProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reporterName: "",
    department: "",
    deviceName: "",
    errorType: "Phần cứng",
    description: "",
    imageUrl: ""
  });

  const handleSubmit = async () => {
    if (!formData.reporterName || !formData.deviceName || !formData.description) {
        return toast.error("Vui lòng điền đầy đủ thông tin");
    }

    setIsSubmitting(true);
    try {
        await dispatch(createIssue(formData)).unwrap();
        toast.success("Đã gửi báo lỗi thành công!");
        onSuccess();
        onClose();
        setFormData({ reporterName: "", department: "", deviceName: "", errorType: "Phần cứng", description: "", imageUrl: "" });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                label="Người báo cáo (*)" 
                value={formData.reporterName} 
                onChange={e => setFormData({...formData, reporterName: e.target.value})}
            />
            <Input 
                label="Phòng ban" 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})}
            />
            <Input 
                label="Tên thiết bị (*)" 
                placeholder="VD: Máy in Canon LBP..."
                value={formData.deviceName} 
                onChange={e => setFormData({...formData, deviceName: e.target.value})}
            />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại lỗi</label>
                <select 
                    className="block w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.errorType}
                    onChange={e => setFormData({...formData, errorType: e.target.value})}
                >
                    <option value="Phần cứng">Phần cứng</option>
                    <option value="Phần mềm">Phần mềm</option>
                    <option value="Mạng / Internet">Mạng / Internet</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả lỗi (*)</label>
                <textarea 
                    className="block w-full rounded-md border border-slate-300 py-2 px-3 text-sm h-24 focus:border-blue-500 focus:ring-blue-500"
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
    </Modal>
  );
}