import { 
  Card, 
  Title, 
  Text, 
  Grid, 
  Badge, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell 
} from "@tremor/react";
import { Monitor, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const data = [
  { id: "2314ac15", name: "Máy tính HP EliteBook", type: "Máy tính", status: "active", department: "Kế toán" },
  { id: "dcb8f697", name: "Máy tính Dell OptiPlex", type: "Máy tính", status: "active", department: "Nhân sự" },
  { id: "ec6fa871", name: "Máy in Canon LBP", type: "Máy in", status: "maintenance", department: "Hành chính" },
  { id: "f24e835b", name: "Máy chiếu Epson X300", type: "Máy chiếu", status: "broken", department: "Hội trường" },
];

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card decoration="top" decorationColor="blue" className="flex items-center justify-between">
          <div>
            <Text>Tổng thiết bị</Text>
            <Title>4</Title>
          </div>
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
             <Monitor size={24} />
          </div>
        </Card>
        <Card decoration="top" decorationColor="green" className="flex items-center justify-between">
          <div>
            <Text>Đang hoạt động</Text>
            <Title>2</Title>
          </div>
          <div className="p-2 bg-green-100 rounded-full text-green-600">
             <CheckCircle size={24} />
          </div>
        </Card>
        <Card decoration="top" decorationColor="yellow" className="flex items-center justify-between">
          <div>
            <Text>Đang bảo trì</Text>
            <Title>1</Title>
          </div>
          <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
             <AlertTriangle size={24} />
          </div>
        </Card>
        <Card decoration="top" decorationColor="red" className="flex items-center justify-between">
          <div>
            <Text>Hư hỏng</Text>
            <Title>1</Title>
          </div>
          <div className="p-2 bg-red-100 rounded-full text-red-600">
             <XCircle size={24} />
          </div>
        </Card>
      </Grid>

      {/* Device List Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
            <Title>Danh sách thiết bị</Title>
            {/* Giả lập bộ lọc */}
            <div className="flex gap-2">
                <select className="border rounded-md px-2 py-1 text-sm"><option>Tất cả trạng thái</option></select>
                <select className="border rounded-md px-2 py-1 text-sm"><option>Tất cả loại</option></select>
            </div>
        </div>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>MÃ</TableHeaderCell>
              <TableHeaderCell>TÊN THIẾT BỊ</TableHeaderCell>
              <TableHeaderCell>LOẠI</TableHeaderCell>
              <TableHeaderCell>TRẠNG THÁI</TableHeaderCell>
              <TableHeaderCell>PHÒNG BAN</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  {item.status === "active" && <Badge color="green">Hoạt động</Badge>}
                  {item.status === "maintenance" && <Badge color="yellow">Bảo trì</Badge>}
                  {item.status === "broken" && <Badge color="red">Hư hỏng</Badge>}
                </TableCell>
                <TableCell>{item.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}