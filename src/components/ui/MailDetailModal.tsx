import { useState, useEffect } from "react";
import { Mail, MailStatus } from "../../store/mails/types";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { updateMail, deleteMail } from "../../store/mails/actions";
import { Trash2, Save, Edit3, X, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "../../utils/format";
import { Chip } from "./Chip";
import { useAppDispatch } from "../../store/store";

interface MailDetailModalProps {
  mail: Mail | null;
  onClose: () => void;
}

export function MailDetailModal({ mail, onClose }: MailDetailModalProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    scheduledAt: "",
  });

  // Load data khi mở modal
  useEffect(() => {
    if (mail) {
      setFormData({
        to: mail.to,
        subject: mail.subject,
        body: mail.body,
        scheduledAt: mail.scheduledAt || "",
      });
      setIsEditing(false); // Mặc định là xem
    }
  }, [mail]);

  if (!mail) return null;

  // Chỉ cho phép sửa nếu mail CHƯA gửi thành công
  const canEdit = mail.status === "SCHEDULED" || mail.status === "FAILED";

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateMail({
        id: mail.id,
        data: {
            ...formData,
            scheduledAt: formData.scheduledAt || null
        }
      })).unwrap();
      
      toast.success("Cập nhật email thành công!");
      setIsEditing(false);
      onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Xóa email này?")) {
      try {
        await dispatch(deleteMail(mail.id)).unwrap();
        toast.success("Đã xóa email");
        onClose();
      } catch (e) { toast.error("Lỗi xóa mail"); }
    }
  };

  const getStatusColor = (s: MailStatus) => {
      if(s === 'SENT') return 'green';
      if(s === 'SCHEDULED') return 'yellow';
      if(s === 'FAILED') return 'red';
      return 'gray';
  }

  return (
    <Modal
      isOpen={!!mail}
      onClose={onClose}
      title={isEditing ? "Cập nhật Email" : "Chi tiết Email"}
      size="lg"
      footer={
        <div className="flex justify-between w-full items-center">
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" icon={Trash2} onClick={handleDelete}>
            Xóa Email
          </Button>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Đóng</Button>
            
            {isEditing ? (
              <Button loading={isSaving} icon={Save} onClick={handleUpdate}>
                Lưu thay đổi
              </Button>
            ) : (
              // Nút sửa chỉ hiện khi có thể sửa
              canEdit && (
                <Button onClick={() => setIsEditing(true)} icon={Edit3}>
                  Chỉnh sửa / Lên lịch lại
                </Button>
              )
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header Info (Read-only) */}
        {!isEditing && (
            <div className="flex gap-4 mb-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                    <span className="text-slate-500 block text-xs uppercase font-bold">Trạng thái</span>
                    <Chip color={getStatusColor(mail.status)} className="mt-1">{mail.status}</Chip>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase font-bold">Thời gian gửi</span>
                    <span className="font-medium mt-1 block">
                        {mail.sentAt ? formatDate(mail.sentAt) : (mail.scheduledAt ? formatDate(mail.scheduledAt) : "Chưa gửi")}
                    </span>
                </div>
            </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Người nhận (To)" 
                    value={formData.to} 
                    disabled={!isEditing} // Disable nếu không phải chế độ edit
                    onChange={e => setFormData({...formData, to: e.target.value})}
                />
                
                {/* Chỉ hiện input hẹn giờ khi Edit hoặc nếu mail có lịch */}
                {(isEditing || mail.scheduledAt) && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian gửi</label>
                        <input 
                            type="datetime-local" 
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border disabled:bg-slate-50 disabled:text-slate-500"
                            value={formData.scheduledAt}
                            disabled={!isEditing}
                            onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                        />
                    </div>
                )}
            </div>

            <Input 
                label="Chủ đề" 
                value={formData.subject} 
                disabled={!isEditing}
                onChange={e => setFormData({...formData, subject: e.target.value})}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                <textarea 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border h-40 disabled:bg-slate-50 disabled:text-slate-500"
                    value={formData.body}
                    disabled={!isEditing}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                />
            </div>
        </div>
      </div>
    </Modal>
  );
}