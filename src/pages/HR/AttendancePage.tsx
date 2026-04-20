import { useEffect, useMemo, useState } from 'react';
import { Card, EmployeeChip, InlineMessage, PageTitle, SummaryCard, Table } from '../../components/ui';
import { fetchApi, formatApiError } from '../../lib/api';
import { unwrapApiArray, formatDisplayDate } from '../../lib/employeeUtils';

interface EmployeeRow {
  id: number;
  name: string;
  email: string;
  department_name?: string;
}

interface AttendanceRow {
  attendance_id?: number;
  id?: number;
  employee_id?: number;
  employeeId?: number;
  full_name?: string;
  status?: string;
  check_in?: string;
  checkIn?: string;
  check_out?: string;
  checkOut?: string;
  created_at?: string;
  date?: string;
}

interface AttendanceSummaryRow {
  name?: string;
  full_name?: string;
  totalDays?: number;
  lateCount?: number;
  totalHours?: number;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toUpperCase() || '').join('') || 'NV';

export default function AttendancePage() {
  const today = new Date();
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [summaryRows, setSummaryRows] = useState<AttendanceSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(today.getFullYear()));
  const [date, setDate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const employeeResponse = await fetchApi<any>('/employees');
        setEmployees(unwrapApiArray<EmployeeRow>(employeeResponse));

        // Ưu tiên gọi API chấm công có filter để bám đúng backend.
        const query = date ? `date=${date}` : `month=${month}&year=${year}`;
        const attendanceResponse = await fetchApi<any>(`/attendance?${query}`);
        const details = Array.isArray(attendanceResponse?.details)
          ? attendanceResponse.details
          : unwrapApiArray<AttendanceRow>(attendanceResponse);
        const summary = Array.isArray(attendanceResponse?.summary)
          ? attendanceResponse.summary
          : [];

        setAttendanceRows(details as AttendanceRow[]);
        setSummaryRows(summary as AttendanceSummaryRow[]);
      } catch (err) {
        setEmployees([]);
        setAttendanceRows([]);
        setSummaryRows([]);
        setError(formatApiError(err, 'Không tải được bảng chấm công'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [date, month, year]);

  const latestByEmployee = useMemo(() => {
    const map = new Map<number, AttendanceRow[]>();

    attendanceRows.forEach((item) => {
      const employeeId = Number(item.employee_id ?? item.employeeId);
      if (!employeeId) return;

      const current = map.get(employeeId) || [];
      current.push(item);
      map.set(employeeId, current);
    });

    return map;
  }, [attendanceRows]);


  const tableRows = useMemo(() => {
    return employees.map((item) => {
      const rows = latestByEmployee.get(item.id) || [];
      const latest = [...rows].sort((a, b) => {
        const aTime = new Date(a.created_at || a.date || a.check_in || a.checkIn || 0).getTime();
        const bTime = new Date(b.created_at || b.date || b.check_in || b.checkIn || 0).getTime();
        return bTime - aTime;
      })[0];

      return {
        ...item,
        latest,
      };
    });
  }, [employees, latestByEmployee]);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Chấm công nhân viên"
        subtitle="Theo dõi danh sách nhân viên và trạng thái dữ liệu chấm công."
      />

      {error ? <InlineMessage>{error}</InlineMessage> : null}

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:flex-row md:items-end">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Tháng</label>
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Năm</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-2xl border border-line px-4 py-3 outline-none"
            />
          </div>
        </div>
      </div>

     

      <Card title="Danh sách nhân viên">
        {loading ? (
          <InlineMessage>Đang tải dữ liệu chấm công...</InlineMessage>
        ) : (
          <Table columns={['Nhân viên', 'Email', 'Phòng ban', 'Lần chấm gần nhất', 'Trạng thái']}>
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-stone-500">
                  Chưa có dữ liệu chấm công phù hợp bộ lọc.
                </td>
              </tr>
            ) : (
              tableRows.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <EmployeeChip
                      name={item.name}
                      detail={`#${item.id}`}
                      avatar={initials(item.name)}
                      compact
                    />
                  </td>
                  <td className="px-5 py-4">{item.email}</td>
                  <td className="px-5 py-4">{item.department_name || 'Chưa phân phòng ban'}</td>
                  <td className="px-5 py-4">{formatDisplayDate(item.latest?.check_in || item.latest?.checkIn || item.latest?.created_at || item.latest?.date)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                      {item.latest?.status || 'Chưa có'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </Table>
        )}
      </Card>
    </div>
  );
}