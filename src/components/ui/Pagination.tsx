import { Button } from "./Button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  
  // Tính toán hiển thị "Showing 1-10 of 50"
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-100 mt-2">
      {/* Thông tin số lượng */}
      <div className="text-sm text-slate-500">
        Hiển thị <span className="font-medium text-slate-900">{startItem}-{endItem}</span> trên tổng số <span className="font-medium text-slate-900">{totalItems}</span>
      </div>

      {/* Nút điều hướng */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="hidden sm:flex"
        >
          <ChevronsLeft size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} className="mr-1" /> Trước
        </Button>

        <div className="text-sm font-medium px-2">
          Trang {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau <ChevronRight size={16} className="ml-1" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:flex"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
}