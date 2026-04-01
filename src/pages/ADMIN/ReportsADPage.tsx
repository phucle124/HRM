import React, { useState } from 'react';
import {
  employeeRecords,
  attendanceRecord,
  salaryRecord,
  leaveRecord,
} from '../../data/mockData';

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);

  const sampleData: Record<string, any[]> = {
    'Nhân viên theo phòng ban': employeeRecords,
    'Bảng công/tháng': attendanceRecord,
    'Lương tổng hợp': salaryRecord,
    'Nghỉ phép / hợp đồng': leaveRecord,
  };

  const handleGenerateReport = () => {
    setReportData(sampleData[reportType] || []);
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map((row) =>
      Object.values(row).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${reportType}.csv`;
    link.click();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Báo cáo - Thống kê</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-4"
        >
          <option value="">Chọn loại báo cáo</option>
          <option>Nhân viên theo phòng ban</option>
          <option>Bảng công/tháng</option>
          <option>Lương tổng hợp</option>
          <option>Nghỉ phép / hợp đồng</option>
        </select>

        <div className="flex gap-4">
          <button
            onClick={handleGenerateReport}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Tạo báo cáo
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Xuất file CSV
          </button>
        </div>
      </div>

      {reportData.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key} className="px-6 py-4 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reportData.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {Object.values(row).map((value, index) => (
                    <td key={index} className="px-6 py-4">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;