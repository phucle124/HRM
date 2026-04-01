import React, { useState } from 'react';
import type { RewardRecord } from '../../types/hrm';
import { rewardRecords } from '../../data/mockData';

const RewardsPage: React.FC = () => {
  const [records, setRecords] = useState<RewardRecord[]>(rewardRecords);

  const [newRecord, setNewRecord] = useState({
    employeeName: '',
    category: 'Khen thưởng' as 'Khen thưởng' | 'Kỷ luật',
    title: '',
    date: '',
    amount: '',
    note: '',
  });

  const [editId, setEditId] = useState<number | null>(null);

  const addRecord = () => {
    if (!newRecord.employeeName || !newRecord.title || !newRecord.date) return;

    const newItem: RewardRecord = {
      id: records.length + 1,
      ...newRecord,
    };

    setRecords((prev) => [newItem, ...prev]);

    setNewRecord({
      employeeName: '',
      category: 'Khen thưởng',
      title: '',
      date: '',
      amount: '',
      note: '',
    });
  };

  const deleteRecord = (id: number) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const editRecord = (item: RewardRecord) => {
    setEditId(item.id);
    setNewRecord(item);
  };

  const updateRecord = () => {
    setRecords((prev) =>
      prev.map((item) =>
        item.id === editId ? { ...item, ...newRecord } : item
      )
    );

    setEditId(null);

    setNewRecord({
      employeeName: '',
      category: 'Khen thưởng',
      title: '',
      date: '',
      amount: '',
      note: '',
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Khen thưởng - Kỷ luật</h1>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          placeholder="Tên nhân viên"
          value={newRecord.employeeName}
          onChange={(e) =>
            setNewRecord({ ...newRecord, employeeName: e.target.value })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        />

        <select
          value={newRecord.category}
          onChange={(e) =>
            setNewRecord({
              ...newRecord,
              category: e.target.value as RewardRecord['category'],
            })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        >
          <option>Khen thưởng</option>
          <option>Kỷ luật</option>
        </select>

        <input
          placeholder="Tiêu đề"
          value={newRecord.title}
          onChange={(e) =>
            setNewRecord({ ...newRecord, title: e.target.value })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        />

        <input
          type="date"
          value={newRecord.date}
          onChange={(e) =>
            setNewRecord({ ...newRecord, date: e.target.value })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        />

        <input
          placeholder="Số tiền"
          value={newRecord.amount}
          onChange={(e) =>
            setNewRecord({ ...newRecord, amount: e.target.value })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        />

        <input
          placeholder="Nội dung"
          value={newRecord.note}
          onChange={(e) =>
            setNewRecord({ ...newRecord, note: e.target.value })
          }
          className="rounded-xl px-4 py-2 bg-gray-100 outline-none"
        />

        <button
          onClick={editId ? updateRecord : addRecord}
          className="md:col-span-3 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          {editId ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-4">Nhân viên</th>
              <th>Loại</th>
              <th>Tiêu đề</th>
              <th>Ngày</th>
              <th>Số tiền</th>
              <th>Nội dung</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {records.map((item) => (
              <tr key={item.id} className="text-center border-t hover:bg-gray-50">

                <td className="py-4">{item.employeeName}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.category === 'Khen thưởng'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.category}
                  </span>
                </td>

                <td>{item.title}</td>
                <td>{item.date}</td>
                <td>{item.amount}</td>
                <td>{item.note}</td>

                <td>
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => editRecord(item)}
                      className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => deleteRecord(item.id)}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700"
                    >
                      Xóa
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RewardsPage;