import React, { useState } from 'react';
import type { AttendanceRecord } from '../../types/hrm';
import { attendanceRecords } from '../../data/mockData';

const AttendancePage: React.FC = () => {
  const [month, setMonth] = useState('2026-03');

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý Chấm công</h1>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr className="text-center text-gray-700">
              <th className="py-4 px-4">Mã NV</th>
              <th className="py-4 px-4">Họ tên</th>
              <th className="py-4 px-4">Ngày</th>
              <th className="py-4 px-4">Check-in</th>
              <th className="py-4 px-4">Check-out</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4">Giờ làm</th>
              <th className="py-4 px-4 w-[120px]">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {attendanceRecords.map((item: AttendanceRecord) => (
              <tr
                key={item.id}
                className="text-center border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-4 px-4">{item.employeeId}</td>
                <td className="py-4 px-4 font-medium">{item.employeeName}</td>
                <td className="py-4 px-4">{item.date}</td>
                <td className="py-4 px-4">{item.checkIn}</td>
                <td className="py-4 px-4">{item.checkOut}</td>
                <td className="py-4 px-4">{item.status}</td>
                <td className="py-4 px-4">{item.hours}</td>
                <td className="py-4 px-4">
                  <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AttendancePage;