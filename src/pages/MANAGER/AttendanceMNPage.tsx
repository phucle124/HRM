import React, { useState } from 'react';
import { PageTitle, Card, Table, EmployeeChip, StatusBadge, Input } from '../../components/ui';

const MOCK_ATTENDANCE = [
  { id: 1, name: 'Nguyễn Văn A', date: '24/04/2026', checkIn: '07:55', checkOut: '17:30', status: 'Đúng giờ', hours: 8 },
  { id: 2, name: 'Lê Anh Đức', date: '24/04/2026', checkIn: '08:15', checkOut: '17:45', status: 'Đi muộn', hours: 8 },
  { id: 3, name: 'Trần Thu Hà', date: '24/04/2026', checkIn: '--:--', checkOut: '--:--', status: 'Nghỉ phép', hours: 0 },
];

export default function AttendanceMNPage() {
  const [date, setDate] = useState('2026-04-24'); // Lấy ngày mặc định

  return (
    <div className="space-y-6">
      <PageTitle title="Quản lý Chấm công" subtitle="Theo dõi giờ giấc làm việc của nhân viên" />

      <Card title="Lịch sử chấm công">
        <div className="mb-6 max-w-xs">
          <Input 
            type="date" 
            label="Chọn ngày xem báo cáo" 
            value={date} 
            onChange={(val) => setDate(val)} 
          />
        </div>

        <Table columns={['Nhân viên', 'Giờ vào', 'Giờ ra', 'Tổng giờ', 'Trạng thái']}>
          {MOCK_ATTENDANCE.map((record) => (
            <tr key={record.id} className="hover:bg-stone-50 transition-colors">
              <td className="px-5 py-4">
                <EmployeeChip name={record.name} detail={`Ngày: ${record.date}`} avatar={record.name.substring(0, 2).toUpperCase()} compact />
              </td>
              <td className="px-5 py-4 font-mono text-stone-600">{record.checkIn}</td>
              <td className="px-5 py-4 font-mono text-stone-600">{record.checkOut}</td>
              <td className="px-5 py-4 font-semibold text-stone-900">{record.hours}h</td>
              <td className="px-5 py-4">
                <StatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}