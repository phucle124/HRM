import React, { useState, useMemo } from 'react';
import type { RewardRecord } from '../../types/hrm';
import { rewardRecords } from '../../data/mockData';

export default function RewardsPage() {
  const [records] = useState<RewardRecord[]>(rewardRecords);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RewardRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) =>
      rec.employeeName.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  return (
    <div className="flex gap-6 p-4">
      {/* Bảng khen thưởng - kỷ luật */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên nhân viên..."
            className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm border-b">
                <th className="px-6 py-4 font-semibold">Nhân viên</th>
                <th className="px-6 py-4 font-semibold">Loại</th>
                <th className="px-6 py-4 font-semibold">Tiêu đề</th>
                <th className="px-6 py-4 font-semibold">Ngày</th>
                <th className="px-6 py-4 font-semibold">Số tiền</th>
                <th className="px-6 py-4 font-semibold">Nội dung</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-t border-gray-100 hover:bg-blue-50/50 transition cursor-pointer"
                    onClick={() => setSelectedRecord(rec)}
                  >
                    <td className="px-6 py-4 text-blue-600 font-medium">{rec.employeeName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          rec.category === 'Khen thưởng'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {rec.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{rec.title}</td>
                    <td className="px-6 py-4">{rec.date}</td>
                    <td className="px-6 py-4">{rec.amount}</td>
                    <td className="px-6 py-4">{rec.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel chi tiết */}
      {selectedRecord && (
        <div className="w-80 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết</h2>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedRecord(null)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-400 block">Nhân viên</label>
              <p className="text-base font-semibold text-gray-900">{selectedRecord.employeeName}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Loại</label>
              <p className="text-base text-gray-900">{selectedRecord.category}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Tiêu đề</label>
              <p className="text-base text-gray-900">{selectedRecord.title}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Ngày</label>
              <p className="text-base text-gray-900">{selectedRecord.date}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Số tiền</label>
              <p className="text-base text-gray-900">{selectedRecord.amount}</p>
            </div>
            <div>
              <label className="text-gray-400 block">Nội dung</label>
              <p className="text-base text-gray-900">{selectedRecord.note}</p>
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