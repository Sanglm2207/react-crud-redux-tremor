import { 
  FileText, Image, FileSpreadsheet, FileCode, FileArchive, File, Video, Music 
} from "lucide-react";

export const getFileIcon = (mimeType: string, className?: string) => {
  if (mimeType.startsWith("image/")) return <Image className={className} />;
  if (mimeType.startsWith("video/")) return <Video className={className} />;
  if (mimeType.startsWith("audio/")) return <Music className={className} />;
  
  if (mimeType.includes("pdf")) return <FileText className={`text-red-500 ${className}`} />;
  if (mimeType.includes("word") || mimeType.includes("document")) return <FileText className={`text-blue-500 ${className}`} />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("csv")) return <FileSpreadsheet className={`text-green-500 ${className}`} />;
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return <FileArchive className={`text-yellow-600 ${className}`} />;
  if (mimeType.includes("json") || mimeType.includes("xml") || mimeType.includes("javascript")) return <FileCode className={`text-slate-600 ${className}`} />;

  return <File className={`text-slate-400 ${className}`} />;
};

export const getFileColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "bg-purple-50 text-purple-600 border-purple-200";
    if (mimeType.includes("pdf")) return "bg-red-50 text-red-600 border-red-200";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "bg-green-50 text-green-600 border-green-200";
    if (mimeType.includes("word")) return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
}