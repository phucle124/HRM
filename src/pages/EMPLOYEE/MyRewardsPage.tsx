import { useEffect, useMemo, useState } from 'react';
import { Card, InlineMessage, PageTitle } from '../../components/ui';
import { useAuth } from '../../context/authContext';
import { fetchApi, formatApiError } from '../../lib/api';
import { normalizeEmployeeRows, unwrapApiArray, formatDisplayDate } from '../../lib/employeeUtils';

type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  department_name?: string;
};

type RewardDecision = {
  id: number;
  title: string;
  type: 'Khen thưởng' | 'Kỷ luật';
  reason: string;
  decision_date: string;
  amount?: number;
  note?: string;
};

const formatMoney = (value?: number) => {
  if (!value) return '--';
  return `${value.toLocaleString('vi-VN')} đ`;
};

const normalizeText = (value: unknown) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function MyRewardsPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? user?.profileUserId ?? (user?.role === 'employee' ? user?.id : undefined);

  const [employee, setEmployee] = useState<EmployeeRow | null>(null);
  const [rewards, setRewards] = useState<RewardDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmployee = async () => {
      if (!employeeId) {
        setError('Không xác định được mã nhân viên.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Lấy profile cá nhân để hiển thị chính xác thông tin nhân viên.
        try {
          const response = await fetchApi<any>(`/employee/profile/${employeeId}`);
          setEmployee({
            id: Number(response.employee_id ?? response.id ?? employeeId),
            name: String(response.full_name || response.name || ''),
            email: String(response.email || ''),
            department_name: String(response.department_name || response.department || ''),
          });
        } catch {
          const employeesResponse = await fetchApi<any>('/employees');
          const rows = normalizeEmployeeRows(employeesResponse);
          const matched = rows.find((item) => Number(item.id ?? item.employee_id) === Number(employeeId));

          setEmployee(
            matched
              ? {
                  id: Number(matched.id ?? matched.employee_id),
                  name: String(matched.full_name || matched.name || ''),
                  email: String(matched.email || ''),
                  department_name: String(matched.department_name || matched.department || ''),
                }
              : null,
          );
        }

        // Khen thưởng - kỷ luật đang dùng API thật từ BE.
        const rewardResponse = await fetchApi<any>('/rewards-discipline');
        const rows = unwrapApiArray<any>(rewardResponse);

        const mappedRewards: RewardDecision[] = rows
          .filter((item: any) => Number(item.employee_id) === Number(employeeId))
          .map((item: any) => ({
            id: Number(item.record_id ?? item.id),
            title: String(item.title || item.name || 'Quyết định'),
            type: (String(item.type || '').toLowerCase().includes('kỷ') || String(item.type || '').toLowerCase().includes('discipline')
              ? 'Kỷ luật'
              : 'Khen thưởng') as 'Khen thưởng' | 'Kỷ luật',
            reason: String(item.description || item.reason || '—'),
            decision_date: String(item.date_recorded || item.decision_date || ''),
            amount: item.amount ? Number(item.amount) : undefined,
            note: item.note ? String(item.note) : undefined,
          }))
          .sort((a, b) => String(b.decision_date).localeCompare(String(a.decision_date)));

        setRewards(mappedRewards);
      } catch (err) {
        setError(formatApiError(err, 'Không tải được dữ liệu khen thưởng - kỷ luật'));
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  const rewardData = useMemo(() => rewards, [rewards]);

  return (
    <div className="space-y-6">
      <PageTitle title="Khen thưởng - kỷ luật của tôi" subtitle="Tra cứu quyết định cá nhân." />

      {error ? <InlineMessage>{error}</InlineMessage> : null}

      <Card title="Thông tin nhân viên">
        {loading ? (
          <InlineMessage>Đang tải thông tin nhân viên...</InlineMessage>
        ) : employee ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Họ và tên</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">{employee.name}</p>
            </div>

            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Email</p>
              <p className="mt-2 text-sm font-semibold text-stone-900">{employee.email || '--'}</p>
            </div>

            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Phòng ban</p>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                {employee.department_name || 'Chưa phân phòng ban'}
              </p>
            </div>
          </div>
        ) : (
          <InlineMessage>Không tìm thấy nhân viên từ API.</InlineMessage>
        )}
      </Card>

      <Card title="Danh sách quyết định">
        {loading ? (
          <InlineMessage>Đang tải dữ liệu quyết định...</InlineMessage>
        ) : !employee ? (
          <InlineMessage>Chưa thể hiển thị quyết định.</InlineMessage>
        ) : rewardData.length === 0 ? (
          <InlineMessage>Hiện chưa có dữ liệu khen thưởng - kỷ luật cho nhân viên này.</InlineMessage>
        ) : (
          <div className="space-y-4">
            {rewardData.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-stone-900">{item.title}</p>
                    <p className="mt-1 text-sm text-stone-500">Ngày quyết định: {formatDisplayDate(item.decision_date)}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.type === 'Khen thưởng' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Lý do</p>
                    <p className="mt-2 text-sm text-stone-700">{item.reason}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Mức tiền</p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">{formatMoney(item.amount)}</p>
                  </div>
                </div>

                {item.note ? (
                  <div className="mt-4 border-t border-stone-200 pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Ghi chú</p>
                    <p className="mt-2 text-sm text-stone-700">{item.note}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
