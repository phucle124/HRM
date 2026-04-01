import { useState } from 'react';
import { Card, InlineMessage, Input, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, StatusBadge, Textarea } from '../../components/ui';
import { useAppData } from '../../context/dataContext';

export default function MyLeavePage() {
  const { currentEmployeeLeaves, currentEmployee } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Phép năm', startDate: '2026-03-25', endDate: '2026-03-25', reason: '' });

  return (
    <div className="space-y-6">
      <PageTitle title="Nghỉ phép của tôi" subtitle="Theo dõi số ngày phép còn lại và lịch sử yêu cầu nghỉ." action={<PrimaryButton onClick={() => setOpen(true)}>Tạo đơn nghỉ</PrimaryButton>} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Số dư phép năm" subtitle="Quyền lợi hiện tại của bạn">
          <div className="rounded-[28px] bg-brand-soft p-6 text-stone-900 ring-1 ring-line">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-deep">Ngày phép còn lại</p>
            <h3 className="mt-3 text-4xl font-bold">{currentEmployee.leaveBalance} ngày</h3>
            <p className="mt-3 text-sm text-stone-600">Số liệu hiển thị sẽ tự cập nhật khi nối API nghỉ phép thực tế.</p>
          </div>
        </Card>
        <Card title="Lịch sử yêu cầu" subtitle="Các đơn nghỉ phép của riêng bạn">
          <div className="space-y-4">
            {currentEmployeeLeaves.length === 0 ? (
              <InlineMessage>Chưa có yêu cầu nghỉ phép nào.</InlineMessage>
            ) : (
              currentEmployeeLeaves.map((item) => (
                <div key={item.id} className="rounded-2xl border border-line bg-[#fffaf5] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900">{item.type}</h3>
                      <p className="mt-1 text-sm text-stone-500">{item.startDate} → {item.endDate} · {item.days} ngày</p>
                      <p className="mt-3 text-sm text-stone-600">{item.reason}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      <Modal open={isOpen} onClose={() => setOpen(false)} title="Tạo đơn nghỉ" description="Biểu mẫu FE demo để thầy có thể bấm xem luồng thao tác">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Loại nghỉ"
            value={form.type}
            onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
            options={[
              { label: 'Phép năm', value: 'Phép năm' },
              { label: 'Ốm', value: 'Ốm' },
              { label: 'Cá nhân', value: 'Cá nhân' },
            ]}
          />
          <div className="rounded-2xl bg-[#f7f2ec] p-4 text-sm text-stone-600 ring-1 ring-line">Đơn mới đang là FE demo, sau này chỉ cần gọi API tạo đơn là lưu được dữ liệu thật.</div>
          <Input label="Ngày bắt đầu" type="date" value={form.startDate} onChange={(value) => setForm((prev) => ({ ...prev, startDate: value }))} />
          <Input label="Ngày kết thúc" type="date" value={form.endDate} onChange={(value) => setForm((prev) => ({ ...prev, endDate: value }))} />
          <div className="md:col-span-2">
            <Textarea label="Lý do" value={form.reason} onChange={(value) => setForm((prev) => ({ ...prev, reason: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Đóng</SecondaryButton>
          <PrimaryButton onClick={() => setOpen(false)} disabled={!form.reason}>Gửi đơn</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
