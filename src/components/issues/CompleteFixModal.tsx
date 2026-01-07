import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string, needDelivery: boolean) => void;
}

export function CompleteFixModal({ isOpen, onClose, onSubmit }: Props) {
  const [note, setNote] = useState("");
  const [needDelivery, setNeedDelivery] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận hoàn thành sửa chữa">
      <div className="space-y-4">
        <Input 
            label="Ghi chú sửa chữa" 
            placeholder="VD: Đã thay mực, cài lại win..." 
            value={note} 
            onChange={e => setNote(e.target.value)} 
        />
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
            <span className="text-sm font-medium">Cần bàn giao thiết bị?</span>
            <Switch checked={needDelivery} onCheckedChange={setNeedDelivery} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>Hủy</Button>
            <Button onClick={() => onSubmit(note, needDelivery)}>Xác nhận</Button>
        </div>
      </div>
    </Modal>
  );
}