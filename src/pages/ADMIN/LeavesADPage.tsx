import React, { useState } from 'react';

interface Leave {
  id: number;
  employee: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, employee: 'Lê Thanh Tùng', type: 'Phép năm', start_date: '2026-03-28', end_date: '2026-04-01', days: 3, status: 'pending', reason: 'Về quê thăm gia đình' },
    { id: 2, employee: 'Trần Thị Lan', type: 'Nghỉ bệnh', start_date: '2026-03-25', end_date: '2026-03-27', days: 2, status: 'approved', reason: 'Ốm' },
    { id: 3, employee: 'Nguyễn Hoàng Minh', type: 'Phép năm', start_date: '2026-04-05', end_date: '2026-04-07', days: 2, status: 'pending', reason: 'Đi du lịch' },
  ]);

  const updateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: newStatus } : leave
    ));
    alert(newStatus === 'approved' ? 'Đã duyệt đơn nghỉ phép!' : 'Đã từ chối đơn nghỉ phép!');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý Nghỉ phép</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Nhân viên</th>
              <th className="px-6 py-4 text-left">Loại nghỉ</th>
              <th className="px-6 py-4 text-left">Từ ngày</th>
              <th className="px-6 py-4 text-left">Đến ngày</th>
              <th className="px-6 py-4 text-center">Số ngày</th>
              <th className="px-6 py-4 text-left">Lý do</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{leave.employee}</td>
                <td className="px-6 py-4">{leave.type}</td>
                <td className="px-6 py-4">{leave.start_date}</td>
                <td className="px-6 py-4">{leave.end_date}</td>
                <td className="px-6 py-4 text-center font-semibold">{leave.days}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.reason}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-medium
                    ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {leave.status === 'pending' ? 'Chờ duyệt' : 
                     leave.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {leave.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(leave.id, 'approved')} className="text-green-600 hover:underline mr-3">Duyệt</button>
                      <button onClick={() => updateStatus(leave.id, 'rejected')} className="text-red-600 hover:underline">Từ chối</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavesPage;