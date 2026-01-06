import clsx from "clsx";
import { Loader2 } from "lucide-react";

// Định nghĩa cột
export interface Column<T> {
  header: string;
  accessorKey?: keyof T; // Key data
  render?: (item: T) => React.ReactNode; // Custom render
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: number | string }>({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "Không có dữ liệu.",
  onRowClick 
}: TableProps<T>) {
  
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
            {columns.map((col, idx) => (
              <th key={idx} className={clsx("px-6 py-3 font-semibold", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr 
              key={item.id} 
              onClick={() => onRowClick && onRowClick(item)}
              className={clsx(
                "border-b last:border-0 hover:bg-slate-50 transition-colors",
                onRowClick ? "cursor-pointer" : ""
              )}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={clsx("px-6 py-4 text-slate-700", col.className)}>
                  {col.render ? col.render(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}