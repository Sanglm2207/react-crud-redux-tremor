import { useState, useEffect } from "react";
import { sendMail } from "../../store/mails/actions";
import { X, Minus, Maximize2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "../../store/store";
import { Button } from "./Button";

interface ComposeMailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComposeMailModal({ isOpen, onClose }: ComposeMailModalProps) {
  const dispatch = useAppDispatch();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    scheduledAt: "", // Để trống = gửi ngay
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject || !formData.body) {
        return toast.error("Vui lòng nhập đầy đủ thông tin");
    }

    setIsSending(true);
    try {
        await dispatch(sendMail({
            ...formData,
            scheduledAt: formData.scheduledAt || null // null để gửi ngay
        })).unwrap();
        
        toast.success("Đã gửi email thành công!");
        onClose(); // Đóng modal
        setFormData({ to: "", subject: "", body: "", scheduledAt: "" }); // Reset form
    } catch (error) {
        toast.error("Gửi thất bại");
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className={clsx(
        "fixed right-4 z-50 bg-white rounded-t-lg shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
        isMinimized ? "bottom-0 w-64 h-10 overflow-hidden" : "bottom-0 w-[500px] h-[500px]"
    )}>
      {/* --- HEADER --- */}
      <div 
        className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center cursor-pointer rounded-t-lg"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="font-medium text-sm truncate">
            {isMinimized ? "Tin nhắn mới" : "Soạn thư mới"}
        </span>
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                className="hover:bg-slate-700 p-1 rounded"
            >
                {isMinimized ? <Maximize2 size={14}/> : <Minus size={14}/>}
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="hover:bg-slate-700 p-1 rounded"
            >
                <X size={14}/>
            </button>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className={clsx("flex-1 p-0 flex flex-col", isMinimized && "hidden")}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="border-b border-slate-100">
                <input 
                    className="w-full px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400"
                    placeholder="Đến (To)" 
                    type="email"
                    value={formData.to}
                    onChange={e => setFormData({...formData, to: e.target.value})}
                />
            </div>
            <div className="border-b border-slate-100">
                <input 
                    className="w-full px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                    placeholder="Chủ đề (Subject)" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                />
            </div>
            
            <textarea 
                className="flex-1 w-full px-4 py-3 text-sm focus:outline-none resize-none"
                placeholder="Nội dung email..."
                value={formData.body}
                onChange={e => setFormData({...formData, body: e.target.value})}
            />

            {/* --- FOOTER (Actions) --- */}
            <div className="p-3 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                    <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                        loading={isSending}
                    >
                        Gửi <Send size={14} className="ml-2"/>
                    </Button>
                    
                    {/* Hẹn giờ gửi (Optional) */}
                    <input 
                        type="datetime-local" 
                        className="text-xs border rounded p-1.5 bg-white text-slate-500"
                        title="Hẹn giờ gửi"
                        value={formData.scheduledAt}
                        onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                    />
                </div>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
