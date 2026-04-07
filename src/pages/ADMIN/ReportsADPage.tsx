import React, { useState, useMemo } from 'react';
import {
  employeeRecords,
  attendanceRecord,
  salaryRecord,
  leaveRecord,
} from '../../data/mockData';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Nhân viên theo phòng ban');
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const sampleData: Record<string, any[]> = {
    'Nhân viên theo phòng ban': employeeRecords,
    'Bảng công/tháng': attendanceRecord,
    'Lương tổng hợp': salaryRecord,
    'Nghỉ phép / hợp đồng': leaveRecord,
  };

  const data = sampleData[reportType] || [];

  // Filter theo search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = data[0] ? Object.keys(data[0]) : [];

  return (
    <div className="flex gap-6 p-4">
      {/* Bảng báo cáo */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.keys(sampleData).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm border-b">
                {columns.map((col) => (
                  <th key={col} className="px-6 py-4 font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-blue-50/50 transition cursor-pointer"
                    onClick={() => setSelectedRow(row)}
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4">{String(row[col])}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel chi tiết */}
      {selectedRow && (
        <div className="w-80 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết</h2>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedRow(null)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-sm">
            {columns.map((col) => (
              <div key={col}>
                <label className="text-gray-400 block">{col}</label>
                <p className="text-base text-gray-900">{String(selectedRow[col])}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-8 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setSelectedRow(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}