import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
// Import các component UI đã có sẵn trong project của bạn
import { PageTitle, Card, Table, EmployeeChip, Input, StatusBadge } from '../../components/ui';

const BASE_URL = 'https://hrm-phkz.onrender.com';

// Interface khớp với dữ liệu thực tế từ Backend
interface Employee {
  id: number;
  name: string;
  email: string;
  department_name: string;
  position?: string;
  phone?: string;
  status?: string;
  avatar?: string;
}

export default function EmployeesMNPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Lấy danh sách nhân viên của phòng ban (Manager Role)
  useEffect(() => {
    const fetchStaff = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Sử dụng API dành riêng cho Manager
        const res = await fetch(`${BASE_URL}/manager/staff-list`, {
          method: 'GET',
          credentials: 'include', // Quan trọng để gửi Session Cookie
        });

        if (!res.ok) {
          throw new Error('Không thể tải danh sách nhân viên của phòng ban.');
        }

        const result = await res.json();
        
        // Chuẩn hóa dữ liệu trả về thành mảng
        const dataList = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
        setEmployees(dataList);
      } catch (err: any) {
        console.error('Lỗi fetch staff:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [user]);

  // 2. Logic tìm kiếm theo tên
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Lấy tên phòng ban để hiển thị
  const departmentName = user?.departmentName || employees[0]?.department_name || 'Phòng ban của bạn';

  // Hàm hỗ trợ tạo chữ cái viết tắt cho Avatar (Ví dụ: "Nguyễn Văn A" -> "VA")
  const getInitials = (name: string) => {
    if (!name) return 'NV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Giao diện khi đang tải
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-stone-500 font-medium animate-pulse">
        Đang tải danh sách nhân viên phòng ban...
      </div>
    );
  }

  // Giao diện khi lỗi
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="font-semibold">Đã xảy ra lỗi:</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sử dụng PageTitle của bạn */}
      <PageTitle 
        title="Nhân viên phòng ban" 
        subtitle={`Quản lý danh sách nhân sự thuộc ${departmentName}`} 
      />

      {/* Sử dụng Card của bạn */}
      <Card title={`Danh sách nhân viên (${filteredEmployees.length})`}>
        
        {/* THANH TÌM KIẾM - Sử dụng Input component */}
        <div className="mb-6 max-w-md">
          <Input
            label=""
            type="text"
            placeholder="🔍 Tìm kiếm theo tên nhân viên..."
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)} // Component Input của bạn trả về string trực tiếp
          />
        </div>

        {/* BẢNG DỮ LIỆU - Sử dụng component Table của bạn */}
        <Table columns={['Nhân viên', 'Vị trí', 'Phòng ban', 'Trạng thái']}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.id} className="transition-colors hover:bg-[#f6efe7]/40">
                <td className="px-5 py-4">
                  <EmployeeChip 
                    name={emp.name} 
                    detail={emp.email} 
                    avatar={emp.avatar || getInitials(emp.name)} 
                  />
                </td>
                <td className="px-5 py-4 font-medium text-stone-900">
                  {emp.position || 'Nhân viên'}
                </td>
                <td className="px-5 py-4 text-stone-600">
                  {emp.department_name}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={emp.status || 'Đang làm'} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-5 py-12 text-center text-stone-500 italic">
                Không tìm thấy nhân viên nào phù hợp với từ khóa "{searchTerm}".
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}