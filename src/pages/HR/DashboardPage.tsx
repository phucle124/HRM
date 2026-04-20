import { useEffect, useMemo, useState } from 'react';
import { Card, InlineMessage, PageTitle, SummaryCard } from '../../components/ui';
import { fetchApi } from '../../lib/api';
import { departments as mockDepartments, employees as mockEmployees } from '../../data/mockData';

interface EmployeeRow {
  id: number;
  name: string;
  email: string;
  department_name?: string;
}

interface DepartmentRow {
  department_id: number;
  name: string;
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const employeesRes = await fetchApi('/employees');
        const employeeRows = (employeesRes || []) as EmployeeRow[];
        setEmployees(employeeRows.length ? employeeRows : mockEmployees.map((item) => ({ id: item.id, name: item.fullName, email: item.email, department_name: item.department })));
      } catch {
        setEmployees(mockEmployees.map((item) => ({ id: item.id, name: item.fullName, email: item.email, department_name: item.department })));
      }

      try {
        const departmentsRes = await fetchApi('/departments');
        const departmentRows = (departmentsRes || []) as DepartmentRow[];
        setDepartments(departmentRows.length ? departmentRows : mockDepartments.map((item) => ({ department_id: item.id, name: item.name })));
      } catch {
        setDepartments(mockDepartments.map((item) => ({ department_id: item.id, name: item.name })));
      }

      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Tổng nhân viên', value: String(employees.length), change: 'Dữ liệu hiện có trong hệ thống', icon: 'users' },
    { label: 'Tổng phòng ban', value: String(departments.length), change: 'Các phòng ban đang quản lý', icon: 'building-2' },
    { label: 'Nhân viên phòng HR', value: String(employees.filter((item) => (item.department_name || '').toLowerCase().includes('nhân sự')).length), change: 'Phục vụ theo dõi nội bộ', icon: 'user-circle' },
    { label: 'Báo cáo khả dụng', value: '1', change: 'Báo cáo tổng hợp nhân sự', icon: 'bar-chart-3' },
  ]), [employees, departments]);

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard HR" subtitle="Tổng quan nhanh về nhân sự và phòng ban." />
      {loading ? <InlineMessage>Đang tải dữ liệu...</InlineMessage> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <SummaryCard key={item.label} {...item} accent="bg-brand-soft" />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Nhân viên mới nhất">
          <div className="space-y-3 text-sm text-stone-600">
            {employees.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
                <p className="font-semibold text-stone-900">{item.name}</p>
                <p className="mt-1">{item.email}</p>
                <p className="mt-1 text-stone-500">{item.department_name || 'Chưa phân phòng ban'}</p>
              </div>
            ))}
            {!loading && employees.length === 0 ? <InlineMessage>Chưa có dữ liệu nhân viên.</InlineMessage> : null}
          </div>
        </Card>
        <Card title="Phòng ban">
          <div className="space-y-3 text-sm text-stone-600">
            {departments.map((item) => (
              <div key={item.department_id} className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
                <p className="font-semibold text-stone-900">{item.name}</p>
                <p className="mt-1 text-stone-500">Mã phòng ban: {item.department_id}</p>
              </div>
            ))}
            {!loading && departments.length === 0 ? <InlineMessage>Chưa có dữ liệu phòng ban.</InlineMessage> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}