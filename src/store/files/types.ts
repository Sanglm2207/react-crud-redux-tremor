export interface FileData {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string; // VD: "image/jpeg", "application/pdf"
  fileSize: number; // bytes
  s3Key: string;
  uploadDate: string;
  createdBy: string; // Email người tạo
}

export interface FilesState {
  list: FileData[];
  isLoading: boolean;
  error: string | null;
}