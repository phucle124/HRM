import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

interface SalaryRecord {
  salary_id: number;
  employee_id: number;
  _month: number;
  _year: number;
  basic_salary: string | number;
  allowance: string | number;
  bonus: string | number;
  deduction: string | number;
  total_salary: string | number;
}

// Thêm khuôn mẫu cho Employee để dò dữ liệu
interface EmployeeData {
  id: number;
  name: string;
  department_name: string;
}

const BASE_URL = 'https://hrm-phkz.onrender.com';

export default function SalaryMNPage() {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [employeesList, setEmployeesList] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // GỌI CÙNG LÚC 2 API: Lấy Lương và Lấy Nhân viên
        const [salariesRes, employeesRes] = await Promise.all([
          fetch(`${BASE_URL}/salaries`, { credentials: 'include' }),
          fetch(`${BASE_URL}/employees`, { credentials: 'include' })
        ]);

        if (!salariesRes.ok || !employeesRes.ok) {
          throw new Error('Lỗi khi tải dữ liệu từ máy chủ');
        }

        const salariesData = await salariesRes.json();
        const employeesData = await employeesRes.json();

        // Xử lý mảng dữ liệu
        const sList = Array.isArray(salariesData) ? salariesData : (salariesData.data || []);
        const eList = Array.isArray(employeesData) ? employeesData : (employeesData.data || []);
        
        setEmployeesList(eList); // Lưu danh sách nhân viên làm "từ điển" dò tên

        // LỌC THEO MANAGER:
        // Lấy lương của chính mình HOẶC lương của những employee_id thuộc phòng ban mình
        const myDepartmentSalaries = sList.filter((salary: SalaryRecord) => {
          // 1. Nếu là lương của chính mình -> Lấy
          if (salary.employee_id === user.id) return true;

          // 2. Dò xem employee_id này là ai, ở phòng nào
          const foundEmp = eList.find((e: EmployeeData) => e.id === salary.employee_id);
          
          // 3. Nếu người đó cùng phòng ban với Manager -> Lấy
          return foundEmp && foundEmp.department_name === user.departmentName;
        });
        
        setSalaries(myDepartmentSalaries);

      } catch (err: any) {
        setError('Không thể tải dữ liệu bảng lương lúc này.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Hàm dò tên nhân viên bằng ID ngay trong lúc Render HTML
  const getEmployeeName = (empId: number) => {
    const emp = employeesList.find(e => e.id === empId);
    return emp ? emp.name : `Nhân viên #${empId}`;
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount) return '0 đ';
    return Number(amount).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Bảng lương phòng {user?.departmentName || 'của bạn'}
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr className="text-gray-600 text-sm">
              <th className="p-4 font-semibold">Nhân viên</th>
              <th className="p-4 font-semibold">Kỳ lương</th>
              <th className="p-4 font-semibold">Lương cơ bản</th>
              <th className="p-4 font-semibold">Phụ cấp & Thưởng</th>
              <th className="p-4 font-semibold">Khấu trừ</th>
              <th className="p-4 font-semibold">Thực lãnh</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center py-10 text-red-500">{error}</td></tr>
            ) : salaries.length > 0 ? (
              salaries?.map((item) => (
                <tr key={item.salary_id} className="border-b hover:bg-blue-50/50 transition">
                  <td className="p-4 font-medium text-blue-600">
                    {/* GỌI HÀM DÒ TÊN BẰNG ID Ở ĐÂY */}
                    {getEmployeeName(item.employee_id)}
                    {item.employee_id === user?.id && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">(Bạn)</span>}
                  </td>
                  <td className="p-4">Tháng {item._month}/{item._year}</td>
                  <td className="p-4">{formatCurrency(item.basic_salary)}</td>
                  <td className="p-4 text-green-600">
                    +{formatCurrency(Number(item.allowance) + Number(item.bonus))}
                  </td>
                  <td className="p-4 text-red-500">
                    -{formatCurrency(item.deduction)}
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {formatCurrency(item.total_salary)}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Chưa có dữ liệu lương cho phòng ban này</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}