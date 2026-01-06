import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./Checkbox"; 

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  
  // Props cho Selection
  enableSelection?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: number[]) => void; // Fix type cụ thể hơn nếu cần
}


export function DataTable<T extends { id: number | string }>({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "Không có dữ liệu.",
  onRowClick,
  enableSelection,
  selectedIds = [], 
  onSelectionChange 
}: TableProps<T>) {
  
  // Logic Header Checkbox
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(d => Number(d.id)); // Ép kiểu về number
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...(selectedIds as number[]), id]);
    } else {
      onSelectionChange?.((selectedIds as number[]).filter(i => i !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border rounded-lg bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
        <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border rounded-lg bg-white border-dashed">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            {/* CỘT CHECKBOX HEADER */}
            {enableSelection && (
              <th className="px-4 py-3 w-10">
                <Checkbox 
                  checked={allSelected}
                  indeterminate={isIndeterminate} // Hiển thị dấu gạch ngang nếu chọn 1 nửa
                  onCheckedChange={handleSelectAll}
                />
              </th>
            )}
            
            {columns.map((col, idx) => (
              <th key={idx} className={clsx("px-6 py-3 font-semibold", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <tr 
                key={item.id} 
                className={clsx(
                  "border-b last:border-0 transition-colors",
                  // Highlight dòng đã chọn
                  isSelected ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-50" 
                )}
                // Nếu click vào hàng thì chọn (tuỳ chọn)
                // onClick={() => onRowClick && onRowClick(item)} 
              >
                
                {/* CỘT CHECKBOX ROW */}
                {enableSelection && (
                  <td className="px-4 py-4 w-10">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectOne(Number(item.id), checked)}
                      // Ngăn sự kiện click lan ra tr (nếu tr có onClick)
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={clsx("px-6 py-4 text-slate-700", col.className)}>
                    {col.render ? col.render(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}