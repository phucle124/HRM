import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/authContext';
import { PageTitle, Card, Table, EmployeeChip, Input, StatusBadge } from '../../components/ui';

const BASE_URL = 'https://hrm-phkz.onrender.com';

interface Employee {
  id: number;
  name: string;
  email: string;
  department_name: string;
  position?: string;
  status?: string;
  avatar?: string;
}

// Mock Data dùng khi API rỗng hoặc lỗi
const MOCK_EMPLOYEES: Employee[] = [
  { id: 101, name: "Trần Thu Hà", email: "ha.thu@hrm.vn", department_name: "Tài chính", position: "Chuyên viên Kế toán", status: "Đang làm", avatar: "TH" },
  { id: 102, name: "Nguyễn Minh Khang", email: "khang.nm@hrm.vn", department_name: "Tài chính", position: "Nhân viên Kiểm toán", status: "Đang làm", avatar: "MK" }
];

export default function EmployeesMNPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      // Chỉ Manager mới có quyền xem danh sách này dựa trên API route bạn gửi
      if (!user || user.role !== 'manager') return;

      try {
        setLoading(true);
        // Sử dụng API dành riêng cho Manager để lấy nhân viên cấp dưới
        const res = await fetch(`${BASE_URL}/manager/staff-list`, {
          method: 'GET',
          credentials: 'include', // Quan trọng để Backend nhận diện Manager qua Cookie/Session
        });

        const result = await res.json();
        
        // Backend của bạn thường bọc dữ liệu trong result.data
        const dataList = result.data || (Array.isArray(result) ? result : []);
        
        if (!res.ok || dataList.length === 0) {
          throw new Error('API rỗng hoặc lỗi');
        }

        setEmployees(dataList);
        setIsUsingMock(false);
      } catch (err) {
        console.warn("Đang sử dụng dữ liệu giả (Mock Data) do API chưa trả về kết quả.");
        setEmployees(MOCK_EMPLOYEES);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [user]);

  // Logic lọc tại Front-end (Client-side filtering)
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return parts.length === 1 
      ? parts[0].substring(0, 2).toUpperCase() 
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-stone-500">Đang tải danh sách nhân viên...</div>;

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Nhân viên phòng ban" 
        subtitle={isUsingMock ? "Chế độ xem thử (Dữ liệu mẫu)" : `Quản lý nhân sự cấp dưới`} 
      />

      <Card title={`Thành viên (${filteredEmployees.length})`}>
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="w-full max-w-md">
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
            />
          </div>
          {isUsingMock && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
              Dữ liệu Demo
            </span>
          )}
        </div>

        <Table columns={['Nhân viên', 'Phòng ban', 'Vị trí', 'Trạng thái']}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <EmployeeChip 
                    name={emp.name} 
                    detail={emp.email} 
                    avatar={emp.avatar || getInitials(emp.name)} 
                  />
                </td>
                <td className="px-5 py-4 text-stone-600">{emp.department_name || 'N/A'}</td>
                <td className="px-5 py-4 font-medium text-stone-900">{emp.position || 'Nhân viên'}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={emp.status || 'Đang làm'} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-5 py-12 text-center text-stone-500 italic">
                Không tìm thấy nhân viên nào khớp với từ khóa.
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}