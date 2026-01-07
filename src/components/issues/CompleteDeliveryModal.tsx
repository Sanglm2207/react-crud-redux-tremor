import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import AvatarUpload from "../ui/AvatarUpload"; // Tái sử dụng

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageUrl: string) => void;
}

export function CompleteDeliveryModal({ isOpen, onClose, onSubmit }: Props) {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận bàn giao">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-slate-500">Vui lòng chụp ảnh biên bản hoặc thiết bị tại nơi bàn giao.</p>
        <AvatarUpload onUploadSuccess={setImageUrl} currentImageUrl={imageUrl} />
        
        <div className="flex justify-end gap-2 w-full mt-4">
            <Button variant="secondary" onClick={onClose}>Hủy</Button>
            <Button disabled={!imageUrl} onClick={() => onSubmit(imageUrl)}>Hoàn thành</Button>
        </div>
      </div>
    </Modal>
  );
}