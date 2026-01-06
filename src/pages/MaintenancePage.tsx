import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow,Button } from "@tremor/react";
import { Download, Printer } from "lucide-react";

export default function MaintenancePage() {
  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex gap-2">
           <input type="date" className="border rounded-md px-3 py-1.5 text-sm" />
           <span className="self-center">-</span>
           <input type="date" className="border rounded-md px-3 py-1.5 text-sm" />
           <Button size="xs">Lọc</Button>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" icon={Printer} size="xs">In bảng</Button>
           <Button variant="secondary" icon={Download} size="xs">Xuất Excel</Button>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>THIẾT BỊ</TableHeaderCell>
            <TableHeaderCell>NGÀY</TableHeaderCell>
            <TableHeaderCell>MÔ TẢ</TableHeaderCell>
            <TableHeaderCell>CHI PHÍ</TableHeaderCell>
            <TableHeaderCell>GHI CHÚ</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
           {/* Mock Data */}
            <TableRow>
                <TableCell>c66fdfde</TableCell>
                <TableCell>Máy chiếu Epson X300</TableCell>
                <TableCell>14/07/2025</TableCell>
                <TableCell>Kiểm tra tình trạng</TableCell>
                <TableCell>0 ₫</TableCell>
                <TableCell>Sửa lỗi phần mềm</TableCell>
            </TableRow>
             <TableRow>
                <TableCell>2f0705eb</TableCell>
                <TableCell>Máy in Canon LBP</TableCell>
                <TableCell>14/07/2025</TableCell>
                <TableCell>Bơm mực</TableCell>
                <TableCell>200.000 ₫</TableCell>
                <TableCell>Thay mực chính hãng</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}