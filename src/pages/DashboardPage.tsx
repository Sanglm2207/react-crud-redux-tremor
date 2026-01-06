import { Card, Title, Text } from "@tremor/react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <Title>Dashboard - Báo lỗi</Title>
        <Text>Tổng quan tình hình hệ thống IT hôm nay.</Text>
        
        <div className="mt-10 flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
          Chưa có dữ liệu báo lỗi...
        </div>
      </Card>
    </div>
  );
}