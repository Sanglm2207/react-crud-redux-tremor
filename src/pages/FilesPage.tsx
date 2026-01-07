import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFiles, deleteFile } from "../store/files/actions";
import { selectAuth } from "../store/auth";
import { FileData } from "../store/files/types";
import { PageLayout } from "../components/ui/PageLayout";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import Breadcrumb from "../components/ui/Breadcrumb";
import { formatBytes, formatDate } from "../utils/format";
import { getFileIcon, getFileColor } from "../utils/file-icons";
import { 
  Grid, List, Download, Trash2, Eye, UploadCloud, Search, Copy, Check 
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'image' | 'document';

export default function FilesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Data from Redux
  const { list: files, isLoading } = useAppSelector((state) => state.files);
  const { user } = useAppSelector(selectAuth);
  
  // Permission Check
  const isSuperAdmin = user?.role?.name === "SUPER_ADMIN";

  // Local State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [copied, setCopied] = useState(false); // State cho nút copy

  // Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  // Logic Filter & Search
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesType = true;
      if (filterType === 'image') matchesType = f.fileType.startsWith('image/');
      if (filterType === 'document') matchesType = !f.fileType.startsWith('image/'); // Tạm coi là doc
      
      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, filterType]);

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa file này vĩnh viễn? Hành động này không thể hoàn tác.")) {
      try {
        await dispatch(deleteFile(id)).unwrap();
        toast.success("Xóa file thành công");
        setSelectedFile(null);
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  // Handle Copy Link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Đã sao chép liên kết");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout
      title="Thư viện Media"
      subtitle="Quản lý tập tin, hình ảnh và tài liệu trên hệ thống"
      breadcrumbs={<Breadcrumb items={[{ label: "Cài đặt" }, { label: "Files & Media" }]} />}
      actions={
        <Button icon={UploadCloud} onClick={() => navigate("/settings/files/new")}>
          Tải File lên
        </Button>
      }
    >
      {/* --- TOOLBAR (Filter & View Mode) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {(['all', 'image', 'document'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={clsx(
                "flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                filterType === type 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              {type === 'all' ? 'Tất cả' : type === 'image' ? 'Hình ảnh' : 'Tài liệu'}
            </button>
          ))}
        </div>

        {/* Search & Toggle View */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
             <input 
                placeholder="Tìm tên file..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={clsx("p-2 transition-colors", viewMode === 'grid' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50")}
              title="Lưới"
            >
              <Grid size={18} />
            </button>
            <div className="w-[1px] bg-slate-200"></div>
            <button 
              onClick={() => setViewMode('list')}
              className={clsx("p-2 transition-colors", viewMode === 'list' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50")}
              title="Danh sách"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {isLoading && filteredFiles.length === 0 ? (
         <div className="text-center py-20"><p className="text-slate-500">Đang tải dữ liệu...</p></div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <div className="inline-flex p-4 bg-white rounded-full mb-3 shadow-sm"><Search className="text-slate-300" size={32}/></div>
          <p className="text-slate-500">Không tìm thấy file nào phù hợp.</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            /* --- GRID VIEW --- */
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-in fade-in duration-300">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
                  onClick={() => setSelectedFile(file)}
                >
                  {/* Thumbnail Area */}
                  <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100 relative">
                    {file.fileType.startsWith('image/') ? (
                      <img src={file.fileUrl} alt={file.fileName} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    ) : (
                      // Dùng Helper render Icon tài liệu
                      <div className={clsx("p-4 rounded-full", getFileColor(file.fileType))}>
                         {getFileIcon(file.fileType, "w-10 h-10")}
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm">Xem chi tiết</span>
                    </div>
                  </div>
                  
                  {/* Info Area */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-700 truncate" title={file.fileName}>{file.fileName}</p>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">{formatBytes(file.fileSize)}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded uppercase">
                            {file.fileType.split('/').pop()?.toUpperCase()}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* --- LIST VIEW --- */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tên File</th>
                    <th className="px-6 py-3 font-semibold">Kích thước</th>
                    <th className="px-6 py-3 font-semibold">Ngày tải lên</th>
                    <th className="px-6 py-3 font-semibold">Người tạo</th>
                    <th className="px-6 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", getFileColor(file.fileType))}>
                                {getFileIcon(file.fileType, "w-5 h-5")}
                            </div>
                            <div className="flex flex-col max-w-xs">
                                <span className="font-medium text-slate-700 truncate" title={file.fileName}>{file.fileName}</span>
                                <span className="text-xs text-slate-400">{file.fileType}</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{formatBytes(file.fileSize)}</td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(file.uploadDate)}</td>
                      <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {file.createdBy.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-600 truncate max-w-[150px]">{file.createdBy}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" icon={Eye} onClick={() => setSelectedFile(file)} title="Xem chi tiết" />
                            <a href={file.fileUrl} download target="_blank" rel="noreferrer">
                                <Button size="sm" variant="ghost" icon={Download} title="Tải xuống" />
                            </a>
                            {isSuperAdmin && (
                                <Button 
                                    size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" 
                                    icon={Trash2} onClick={() => handleDelete(file.id)} 
                                    title="Xóa file"
                                />
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* --- FILE DETAIL MODAL --- */}
      <Modal
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        title="Thông tin chi tiết"
        size="lg"
        footer={
            <div className="flex justify-between w-full">
                {isSuperAdmin ? (
                    <Button 
                        variant="danger" 
                        icon={Trash2} 
                        onClick={() => selectedFile && handleDelete(selectedFile.id)}
                    >
                        Xóa vĩnh viễn
                    </Button>
                ) : <div></div>}
                
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setSelectedFile(null)}>Đóng</Button>
                    <a href={selectedFile?.fileUrl} target="_blank" rel="noreferrer" download>
                        <Button icon={Download}>Tải xuống</Button>
                    </a>
                </div>
            </div>
        }
      >
        {selectedFile && (
            <div className="flex flex-col md:flex-row gap-6">
                {/* Preview Area */}
                <div className="w-full md:w-1/2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-4 min-h-[300px]">
                    {selectedFile.fileType.startsWith('image/') ? (
                        <img 
                            src={selectedFile.fileUrl} 
                            alt={selectedFile.fileName} 
                            className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm" 
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-400">
                            <div className={clsx("p-6 rounded-full bg-white shadow-sm scale-150", getFileColor(selectedFile.fileType))}>
                                {getFileIcon(selectedFile.fileType, "w-16 h-16")}
                            </div>
                            <span className="text-sm font-medium">Không hỗ trợ xem trước</span>
                        </div>
                    )}
                </div>

                {/* Metadata Area */}
                <div className="w-full md:w-1/2 space-y-5">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tên tập tin</h4>
                        <p className="text-base font-semibold text-slate-900 break-words leading-tight">{selectedFile.fileName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Định dạng</h4>
                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600">
                                {selectedFile.fileType}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kích thước</h4>
                            <p className="text-sm font-medium text-slate-700">{formatBytes(selectedFile.fileSize)}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày tải lên</h4>
                        <p className="text-sm text-slate-700">{formatDate(selectedFile.uploadDate)}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Người tải lên</h4>
                        <div className="flex items-center gap-2 mt-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                {selectedFile.createdBy.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700 truncate">{selectedFile.createdBy}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Liên kết công khai</h4>
                        <div className="flex gap-2">
                            <input 
                                readOnly 
                                value={selectedFile.fileUrl} 
                                className="flex-1 text-xs border border-slate-200 rounded-md px-3 py-2 bg-slate-50 text-slate-500 focus:outline-none" 
                            />
                            <button 
                                onClick={() => handleCopyLink(selectedFile.fileUrl)}
                                className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                title="Copy link"
                            >
                                {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </PageLayout>
  );
}