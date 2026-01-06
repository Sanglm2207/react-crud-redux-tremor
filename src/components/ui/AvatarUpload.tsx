import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadFile } from "../../store/users/actions";
import { Button } from "@tremor/react";

interface AvatarUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export default function AvatarUpload({ currentImageUrl, onUploadSuccess }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size/type nếu cần
    if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("File quá lớn (Max 5MB)");
        return;
    }

    try {
      setIsUploading(true);
      // Hiển thị preview ngay lập tức cho mượt
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Gọi API Upload
      const uploadedUrl = await uploadFile(file);
      
      // Upload xong -> Trả URL về cho Form cha
      onUploadSuccess(uploadedUrl);
      toast.success("Upload ảnh thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Upload thất bại!");
      setPreview(currentImageUrl); // Revert nếu lỗi
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <ImageIcon size={32} />
            <span className="text-xs mt-1">Upload</span>
          </div>
        )}

        {/* Overlay khi hover hoặc uploading */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           {isUploading ? (
             <Loader2 className="animate-spin text-white" />
           ) : (
             <Upload className="text-white" />
           )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      <Button 
        size="xs" 
        variant="secondary" 
        type="button" // Quan trọng: type button để không submit form cha
        onClick={() => fileInputRef.current?.click()}
        loading={isUploading}
      >
        Chọn ảnh
      </Button>
    </div>
  );
}