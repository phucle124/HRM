import { useMemo, useState } from 'react';
import { Card, MiniBars, Modal, PageTitle, PrimaryButton, SecondaryButton, Select, SummaryCard } from '../../components/ui';
import { departmentPerformance, monthlyAttendance } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { employees, departments, salaryRecords } = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState({ reportType: 'Nhân sự tổng hợp', format: 'PDF' });
  const latestPayrollMonth = salaryRecords[0]?.month ?? '03/2026';

  const reportPreview = useMemo(
    () => [
      `BÁO CÁO: ${form.reportType}`,
      `Định dạng: ${form.format}`,
      `Tổng nhân viên: ${employees.length}`,
      `Tổng phòng ban: ${departments.length}`,
      `Kỳ lương gần nhất: ${latestPayrollMonth}`,
    ].join('\n'),
    [departments.length, employees.length, form.format, form.reportType, latestPayrollMonth],
  );

  const handleExport = () => {
    const extension = form.format === 'Excel' ? 'csv' : 'txt';
    const mimeType = form.format === 'Excel' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    downloadFile(`bao-cao-${form.reportType.toLowerCase().replace(/\s+/g, '-')}.${extension}`, reportPreview, mimeType);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Báo cáo" subtitle="Theo dõi nhân sự, ngày công, nghỉ phép và hiệu suất làm việc." action={<PrimaryButton onClick={() => setOpen(true)}>Xuất PDF / Excel</PrimaryButton>} />
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard label="Tỷ lệ chấm công" value="94%" change="Tăng 3% so với tháng trước" accent="bg-brand-soft" />
        <SummaryCard label="Tỷ lệ nghỉ phép" value="7.5%" change="Ổn định theo quý" accent="bg-[#f1ebe4]" />
        <SummaryCard label="Hiệu suất trung bình" value="82%" change="3 phòng ban vượt KPI" accent="bg-emerald-50" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="So sánh phòng ban" subtitle="Tương quan hiệu suất giữa các bộ phận">
          <MiniBars data={departmentPerformance} />
        </Card>
        <Card title="Xu hướng chấm công" subtitle="Tỷ lệ chuyên cần 6 tháng gần đây">
          <div className="flex h-72 items-end gap-4 rounded-3xl bg-[#f7f2ec] p-5 ring-1 ring-line">
            {monthlyAttendance.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-2xl bg-brand transition-all duration-500" style={{ height: `${item.value}%` }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-900">{item.month}</p>
                  <p className="text-xs text-stone-500">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={isOpen} onClose={() => setOpen(false)} title="Xuất báo cáo" description="Chọn loại báo cáo và định dạng để tải file demo về máy">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Loại báo cáo"
            value={form.reportType}
            onChange={(value) => setForm((prev) => ({ ...prev, reportType: value }))}
            options={[
              { label: 'Nhân sự tổng hợp', value: 'Nhân sự tổng hợp' },
              { label: 'Chấm công', value: 'Chấm công' },
              { label: 'Bảng lương', value: 'Bảng lương' },
            ]}
          />
          <Select
            label="Định dạng"
            value={form.format}
            onChange={(value) => setForm((prev) => ({ ...prev, format: value }))}
            options={[
              { label: 'PDF', value: 'PDF' },
              { label: 'Excel', value: 'Excel' },
            ]}
          />
          <div className="md:col-span-2 rounded-2xl bg-[#f7f2ec] p-4 text-sm text-stone-700 ring-1 ring-line whitespace-pre-line">{reportPreview}</div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton onClick={() => setOpen(false)}>Đóng</SecondaryButton>
          <PrimaryButton onClick={handleExport}>Xuất file</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
