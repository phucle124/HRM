import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
import { PageTitle, Card, Table, EmployeeChip, StatusBadge, Input, Select, InlineMessage } from '../../components/ui';

const MOCK_SALARIES = [
  {
    salary_id: 1,
    employee_id: 2,
    full_name: 'Lê Anh Đức',
    email: 'dh52201235@student.stu.edu.vn',
    _month: 4,
    _year: 2026,
    basic_salary: 15000000.00,
    allowance: 1000000.00,
    bonus: 2000000.00,
    deduction: 500000.00,
    total_salary: 17500000.00,
    status: 'Đã thanh toán' // Cột ảo thêm vào để làm màu UI
  },
  {
    salary_id: 2,
    employee_id: 1,
    full_name: 'Nguyễn Văn A',
    email: 'phuc95721@gmail.com',
    _month: 4,
    _year: 2026,
    basic_salary: 12000000.00,
    allowance: 500000.00,
    bonus: 1000000.00,
    deduction: 200000.00,
    total_salary: 13300000.00,
    status: 'Chờ duyệt'
  }
];

export default function SalaryMNPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('4');

  // Hàm định dạng tiền tệ VNĐ
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm tạo chữ cái đầu cho Avatar
  const getInitials = (name: string) => {
    if (!name) return 'NV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Logic lọc dữ liệu
  const filteredSalaries = useMemo(() => {
    return MOCK_SALARIES.filter(item => {
      const matchName = item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMonth = monthFilter === 'all' || item._month.toString() === monthFilter;
      return matchName && matchMonth;
    });
  }, [searchTerm, monthFilter]);

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Bảng lương phòng ban" 
        subtitle="Quản lý và theo dõi chi tiết thu nhập của nhân viên cấp dưới" 
      />

      <Card title="Danh sách bảng lương">
        {/* Bộ lọc tìm kiếm */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Tìm theo tên nhân viên..."
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label=""
              value={monthFilter}
              onChange={(val) => setMonthFilter(val)}
              options={[
                { label: 'Tất cả các tháng', value: 'all' },
                { label: 'Tháng 4 / 2026', value: '4' },
                { label: 'Tháng 3 / 2026', value: '3' },
              ]}
            />
          </div>
        </div>

        {/* Bảng hiển thị */}
        <Table columns={['Nhân viên', 'Kỳ lương', 'Lương CB', 'Phụ cấp', 'Thưởng', 'Khấu trừ', 'Tổng thực lãnh', 'Trạng thái']}>
          {filteredSalaries.length > 0 ? (
            filteredSalaries.map((row) => (
              <tr key={row.salary_id} className="hover:bg-stone-50 transition-colors whitespace-nowrap">
                <td className="px-5 py-4">
                  <EmployeeChip 
                    name={row.full_name} 
                    detail={`ID: ${row.employee_id}`} 
                    avatar={getInitials(row.full_name)} 
                    compact 
                  />
                </td>
                <td className="px-5 py-4 text-stone-600">
                  T{row._month}/{row._year}
                </td>
                <td className="px-5 py-4 font-medium text-stone-600">
                  {formatMoney(row.basic_salary)}
                </td>
                <td className="px-5 py-4 text-emerald-600">
                  +{formatMoney(row.allowance)}
                </td>
                <td className="px-5 py-4 text-emerald-600">
                  +{formatMoney(row.bonus)}
                </td>
                <td className="px-5 py-4 text-rose-600">
                  -{formatMoney(row.deduction)}
                </td>
                <td className="px-5 py-4 font-bold text-brand-deep">
                  {formatMoney(row.total_salary)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-5 py-12 text-center text-stone-500 italic">
                Không tìm thấy dữ liệu lương phù hợp.
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}