import { useState } from 'react';
import { Card, Input, Modal, PageTitle, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useAppData } from '../../context/dataContext';

const initialForm = {
  name: '',
  manager: '',
  totalEmployees: '0',
  openPositions: '0',
  budget: '',
};

export default function DepartmentsPage() {
  const { departments, addDepartment } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    addDepartment({
      name: form.name,
      manager: form.manager,
      totalEmployees: Number(form.totalEmployees || 0),
      openPositions: Number(form.openPositions || 0),
      budget: form.budget,
    });
    setForm(initialForm);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Phòng ban" subtitle="Quản lý phòng ban, trưởng bộ phận và ngân sách hiện tại." action={<PrimaryButton onClick={() => setOpen(true)}>Thêm phòng ban</PrimaryButton>} />
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {departments.map((department) => (
          <Card key={department.id} title={department.name} subtitle={`Trưởng bộ phận: ${department.manager}`}>
            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex items-center justify-between rounded-2xl bg-[#f7f2ec] px-4 py-3 ring-1 ring-line">
                <span>Nhân sự hiện tại</span>
                <span className="font-semibold text-stone-900">{department.totalEmployees}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#f7f2ec] px-4 py-3 ring-1 ring-line">
                <span>Vị trí đang tuyển</span>
                <span className="font-semibold text-stone-900">{department.openPositions}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#f7f2ec] px-4 py-3 ring-1 ring-line">
                <span>Ngân sách tháng</span>
                <span className="font-semibold text-stone-900">{department.budget}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Thêm phòng ban" description="Tạo mới phòng ban để hiển thị vào danh sách quản trị">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Tên phòng ban" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
          <Input label="Trưởng bộ phận" value={form.manager} onChange={(value) => setForm((prev) => ({ ...prev, manager: value }))} />
          <Input label="Số nhân sự" type="number" value={form.totalEmployees} onChange={(value) => setForm((prev) => ({ ...prev, totalEmployees: value }))} />
          <Input label="Vị trí tuyển" type="number" value={form.openPositions} onChange={(value) => setForm((prev) => ({ ...prev, openPositions: value }))} />
          <div className="md:col-span-2">
            <Input label="Ngân sách tháng" value={form.budget} onChange={(value) => setForm((prev) => ({ ...prev, budget: value }))} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Hủy</SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={!form.name || !form.manager || !form.budget}>Lưu phòng ban</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
