import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/authContext';

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
}

const BASE_URL = 'https://hrm-phkz.onrender.com';

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Load danh sách chấm công
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/employee/check-in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token || ''}`,
          },
          body: JSON.stringify({}), // gửi body trống nếu API chấp nhận, hoặc theo yêu cầu server
        });

        if (!res.ok) throw new Error('Không thể tải dữ liệu');

        const result = await res.json();
        setRecords(Array.isArray(result.data) ? result.data.map((r: any, idx: number) => ({
          id: r.attendance_id || idx + 1,
          employeeId: r.employeeId || r.employee_id,
          date: r.date,
          checkIn: r.checkIn || r.check_in,
          checkOut: r.checkOut || r.check_out,
        })) : []);
      } catch (err) {
        console.error('Lỗi load chấm công:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  // Filter theo tên nhân viên (nếu có employeeName)
  const filteredRecords = useMemo(() => {
    return records.filter((rec) =>
      rec.employeeId.toString().includes(search)
    );
  }, [records, search]);

  return (
    <div className="flex gap-6 p-4">
      {/* Danh sách chấm công */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo Mã NV..."
            className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm border-b">
                <th className="px-6 py-4 font-semibold">Mã NV</th>
                <th className="px-6 py-4 font-semibold">Ngày</th>
                <th className="px-6 py-4 font-semibold">Check-in</th>
                <th className="px-6 py-4 font-semibold">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-t border-gray-100 hover:bg-blue-50/50 transition cursor-pointer"
                    onClick={() => setSelectedRecord(rec)}
                  >
                    <td className="px-6 py-4 text-gray-500">#{rec.employeeId}</td>
                    <td className="px-6 py-4 text-gray-800">{rec.date}</td>
                    <td className="px-6 py-4">{rec.checkIn || '-'}</td>
                    <td className="px-6 py-4">{rec.checkOut || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Không có dữ liệu chấm công</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chi tiết record (Side Panel) */}
      {selectedRecord && (
        <div className="w-80 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết chấm công</h2>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedRecord(null)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-400 block">Mã NV</label>
              <p className="text-base font-semibold text-gray-900">{selectedRecord.employeeId}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Ngày</label>
              <p className="text-base text-gray-900">{selectedRecord.date}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Check-in</label>
              <p className="text-base text-gray-900">{selectedRecord.checkIn || '-'}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Check-out</label>
              <p className="text-base text-gray-900">{selectedRecord.checkOut || '-'}</p>
            </div>
          </div>

          <button
            className="mt-8 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setSelectedRecord(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}