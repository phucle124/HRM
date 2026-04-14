import React from 'react';
import { PageTitle, Card, Table, EmployeeChip, StatusBadge } from '../../components/ui';

const MOCK_LEAVES = [
  { id: 101, name: 'Lê Anh Đức', type: 'Phép năm', start: '25/04/2026', end: '26/04/2026', days: 2, reason: 'Giải quyết việc gia đình', status: 'Chờ duyệt' },
  { id: 102, name: 'Phạm Văn Long', type: 'Nghỉ ốm', start: '20/04/2026', end: '20/04/2026', days: 1, reason: 'Sốt siêu vi', status: 'Đã duyệt' },
];

export default function LeaveMNPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Quản lý Nghỉ phép" subtitle="Xét duyệt đơn từ của nhân viên phòng ban" />

      <Card title="Danh sách đơn từ">
        <Table columns={['Nhân viên', 'Loại nghỉ', 'Thời gian', 'Lý do', 'Trạng thái', 'Hành động']}>
          {MOCK_LEAVES.map((leave) => (
            <tr key={leave.id} className="hover:bg-stone-50 transition-colors">
              <td className="px-5 py-4">
                <EmployeeChip name={leave.name} detail={`${leave.days} ngày`} avatar={leave.name.substring(0, 2).toUpperCase()} compact />
              </td>
              <td className="px-5 py-4 font-medium text-stone-900">{leave.type}</td>
              <td className="px-5 py-4 text-stone-600 text-sm">
                {leave.start} - {leave.end}
              </td>
              <td className="px-5 py-4 text-stone-500 italic max-w-xs truncate">{leave.reason}</td>
              <td className="px-5 py-4">
                <StatusBadge status={leave.status} />
              </td>
              <td className="px-5 py-4">
                {leave.status === 'Chờ duyệt' ? (
                  <div className="flex gap-2">
                    <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100">Duyệt</button>
                    <button className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 hover:bg-rose-100">Từ chối</button>
                  </div>
                ) : (
                  <span className="text-sm text-stone-400">Đã xử lý</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}