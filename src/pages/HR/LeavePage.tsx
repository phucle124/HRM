import { Card, PageTitle, PrimaryButton, StatusBadge } from '../../components/ui';
import { leaveRecords } from '../../data/mockData';

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Nghỉ phép" subtitle="Tiếp nhận và xét duyệt đơn nghỉ của nhân viên." action={<PrimaryButton>Duyệt đã chọn</PrimaryButton>} />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Danh sách đơn nghỉ" subtitle="Các yêu cầu nghỉ phép hiện tại">
          <div className="space-y-4">
            {leaveRecords.map((item) => (
              <div key={item.id} className="rounded-3xl border border-line bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">{item.employeeName}</h3>
                    <p className="mt-1 text-sm text-stone-500">{item.type} · {item.startDate} → {item.endDate} · {item.days} ngày</p>
                    <p className="mt-3 text-sm text-stone-600">{item.reason}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Chính sách nhanh" subtitle="Một số quy định đang áp dụng">
          <div className="space-y-4 text-sm text-stone-600">
            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">Nghỉ phép năm: 12 ngày / năm đối với nhân viên chính thức.</div>
            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">HR duyệt đơn trực tiếp trên hệ thống, trạng thái được cập nhật tại giao diện nhân viên.</div>
            <div className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">Đơn nghỉ khẩn cấp cần thông báo cho quản lý trực tiếp trước 8:30 sáng.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
