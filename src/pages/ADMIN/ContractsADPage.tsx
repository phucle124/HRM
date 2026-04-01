import React, { useState } from 'react';
import type { ContractRecord } from '../../types/hrm';
import { contractRecords } from '../../data/mockData';

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<ContractRecord[]>(contractRecords);

  const [newContract, setNewContract] = useState({
    employeeId: '',
    employeeName: '',
    contractType: 'Chính thức' as 'Chính thức' | 'Thử việc' | 'Thời vụ',
    startDate: '',
    endDate: '',
    salary: '',
  });

  const renewContract = (id: number) => {
    setContracts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              endDate: '2030-12-31',
              status: 'Còn hiệu lực',
            }
          : item
      )
    );
  };

  const endContract = (id: number) => {
    setContracts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Đã hết hạn',
            }
          : item
      )
    );
  };

  const addContract = () => {
    if (!newContract.employeeId || !newContract.employeeName) return;

    const newItem: ContractRecord = {
      id: contracts.length + 1,
      employeeId: Number(newContract.employeeId),
      employeeName: newContract.employeeName,
      contractType: newContract.contractType,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      salary: Number(newContract.salary),
      status: 'Còn hiệu lực',
    };

    setContracts((prev) => [...prev, newItem]);

    setNewContract({
      employeeId: '',
      employeeName: '',
      contractType: 'Chính thức',
      startDate: '',
      endDate: '',
      salary: '',
    });
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Quản lý Hợp đồng</h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">

        <input
          placeholder="Mã NV"
          value={newContract.employeeId}
          onChange={(e) =>
            setNewContract({ ...newContract, employeeId: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Tên nhân viên"
          value={newContract.employeeName}
          onChange={(e) =>
            setNewContract({ ...newContract, employeeName: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={newContract.contractType}
          onChange={(e) =>
            setNewContract({
              ...newContract,
              contractType: e.target.value as ContractRecord['contractType'],
            })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option>Chính thức</option>
          <option>Thử việc</option>
          <option>Thời vụ</option>
        </select>

        <input
          type="date"
          value={newContract.startDate}
          onChange={(e) =>
            setNewContract({ ...newContract, startDate: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />

        <input
          type="date"
          value={newContract.endDate}
          onChange={(e) =>
            setNewContract({ ...newContract, endDate: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />

        <input
          placeholder="Lương"
          value={newContract.salary}
          onChange={(e) =>
            setNewContract({ ...newContract, salary: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={addContract}
          className="md:col-span-3 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
          Thêm hợp đồng mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th className="py-4 px-4">Mã NV</th>
              <th className="py-4 px-4">Nhân viên</th>
              <th className="py-4 px-4">Loại</th>
              <th className="py-4 px-4">Bắt đầu</th>
              <th className="py-4 px-4">Kết thúc</th>
              <th className="py-4 px-4">Lương</th>
              <th className="py-4 px-4">Trạng thái</th>
              <th className="py-4 px-4">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {contracts.map((item) => (
              <tr key={item.id} className="text-center border-b">
                <td className="py-4 px-4">{item.employeeId}</td>
                <td className="py-4 px-4">{item.employeeName}</td>
                <td className="py-4 px-4">{item.contractType}</td>
                <td className="py-4 px-4">{item.startDate}</td>
                <td className="py-4 px-4">{item.endDate}</td>
                <td className="py-4 px-4">{item.salary.toLocaleString()} ₫</td>

                <td className="py-4 px-4">{item.status}</td>

                <td className="py-4 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => renewContract(item.id)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg"
                  >
                    Gia hạn
                  </button>

                  <button
                    onClick={() => endContract(item.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg"
                  >
                    Kết thúc
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

export default ContractsPage;