import React, { useState } from 'react';
import type { LeaveRecord } from '../../types/hrm';
import { leaveRecords } from '../../data/mockData';

const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>(leaveRecords);

  const updateStatus = (id: number, newStatus: 'Đã duyệt' | 'Từ chối') => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Quản lý Nghỉ phép</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr className="text-center text-gray-700">
              <th className="py-4 px-4">Mã NV</th>
              <th className="py-4 px-4">Nhân viên</th>
              <th className="py-4 px-4">Loại nghỉ</th>
              <th className="py-4 px-4">Từ ngày</th>
              <th className="py-4 px-4">Đến ngày</th>
              <th className="py-4 px-4">Số ngày</th>
              <th className="py-4 px-4">Lý do</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4 w-[160px]">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="text-center border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-4 px-4">{leave.employeeId}</td>
                <td className="py-4 px-4 font-medium">{leave.employeeName}</td>
                <td className="py-4 px-4">{leave.type}</td>
                <td className="py-4 px-4">{leave.startDate}</td>
                <td className="py-4 px-4">{leave.endDate}</td>
                <td className="py-4 px-4">{leave.days}</td>
                <td className="py-4 px-4 text-gray-600">{leave.reason}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        leave.status === 'Đã duyệt'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'Từ chối'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="py-4 px-4">
                  {leave.status === 'Chờ duyệt' && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateStatus(leave.id, 'Đã duyệt')}
                        className="px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                      >
                        Duyệt
                      </button>

                      <button
                        onClick={() => updateStatus(leave.id, 'Từ chối')}
                        className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Từ chối
                      </button>
                    </div>
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