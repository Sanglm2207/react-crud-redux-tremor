import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../store/files/actions";
import { PageLayout } from "../components/ui/PageLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { UploadCloud, X, FileCheck, AlertCircle } from "lucide-react";
import { getFileIcon, getFileColor } from "../utils/file-icons";
import { formatBytes } from "../utils/format";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch } from "../store/store";

export default function FileUploadPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Xử lý kéo thả
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await dispatch(uploadFile(selectedFile)).unwrap();
      toast.success("Tải lên thành công!");
      navigate("/settings/files");
    } catch (error) {
      toast.error("Tải lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageLayout
      title="Tải tập tin lên"
      subtitle="Hỗ trợ tải lên hình ảnh, tài liệu, văn bản (Lưu trữ AWS S3)"
      showBack={true}
      breadcrumbs={
        <Breadcrumb 
          items={[
            { label: "Cài đặt" }, 
            { label: "Files", to: "/settings/files" }, 
            { label: "Upload" }
          ]} 
        />
      }
    >
      <div className="max-w-2xl mx-auto">
        <div 
          className={clsx(
            "relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all min-h-[300px]",
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100",
            selectedFile ? "border-green-500 bg-green-50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            // accept="*" // Backend hỗ trợ all nên không cần chặn
          />

          {!selectedFile ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-white rounded-full shadow-sm inline-block">
                <UploadCloud size={40} className="text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-700">Kéo thả file vào đây</p>
                <p className="text-sm text-slate-500 mt-1">hoặc click để chọn từ máy tính</p>
              </div>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                Chọn File
              </Button>
              <p className="text-xs text-slate-400 mt-4">Hỗ trợ: JPG, PNG, PDF, DOCX, XLSX...</p>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-green-200 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-4">
                {/* Preview Icon/Image */}
                <div className={clsx("w-16 h-16 rounded-lg flex items-center justify-center shrink-0", getFileColor(selectedFile.type))}>
                    {selectedFile.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover rounded-lg" alt="preview"/>
                    ) : (
                        getFileIcon(selectedFile.type, "w-8 h-8")
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate" title={selectedFile.name}>{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatBytes(selectedFile.size)} • {selectedFile.type || "Unknown type"}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                        <FileCheck size={14} /> Sẵn sàng tải lên
                    </div>
                </div>

                <button 
                    onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-slate-400 hover:text-red-500 p-1"
                >
                    <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate("/settings/files")}>
                Hủy bỏ
            </Button>
            <Button 
                onClick={handleUpload} 
                disabled={!selectedFile} 
                loading={isUploading}
                className={clsx(isUploading ? "w-40" : "w-32")}
            >
                {isUploading ? "Đang tải..." : "Tải lên"}
            </Button>
        </div>
      </div>
    </PageLayout>
  );
}