import { Card, MetricRow, PageTitle, PrimaryButton, StatusBadge } from '../../components/ui';
import { formatCurrency } from '../../data/mockData';
import { useAppData } from '../../context/dataContext';

function downloadPayslip(content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'phieu-luong.txt';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function MySalaryPage() {
  const { currentEmployeeSalary } = useAppData();
  const payslip = [
    `Kỳ lương: ${currentEmployeeSalary.month}`,
    `Thực nhận: ${formatCurrency(currentEmployeeSalary.total)}`,
    `Lương cơ bản: ${formatCurrency(currentEmployeeSalary.basicSalary)}`,
    `Phụ cấp: ${formatCurrency(currentEmployeeSalary.allowance)}`,
    `Thưởng: ${formatCurrency(currentEmployeeSalary.bonus)}`,
    `Khấu trừ: ${formatCurrency(currentEmployeeSalary.deduction)}`,
  ].join('\n');

  return (
    <div className="space-y-6">
      <PageTitle title="Lương của tôi" subtitle="Tra cứu phiếu lương, phụ cấp, thưởng và khấu trừ cá nhân." action={<PrimaryButton onClick={() => downloadPayslip(payslip)}>Tải phiếu lương</PrimaryButton>} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Tóm tắt kỳ lương" subtitle={`Kỳ lương ${currentEmployeeSalary.month}`}>
          <div className="rounded-[28px] bg-brand-soft p-6 text-stone-900 ring-1 ring-line">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-deep">Thực nhận</p>
            <h3 className="mt-3 text-4xl font-bold">{formatCurrency(currentEmployeeSalary.total)}</h3>
            <div className="mt-5"><StatusBadge status={currentEmployeeSalary.status} /></div>
          </div>
        </Card>
        <Card title="Chi tiết phiếu lương" subtitle="Từng khoản cấu thành thu nhập tháng này">
          <div className="space-y-3">
            <MetricRow label="Lương cơ bản" value={currentEmployeeSalary.basicSalary} />
            <MetricRow label="Phụ cấp" value={currentEmployeeSalary.allowance} />
            <MetricRow label="Thưởng" value={currentEmployeeSalary.bonus} />
            <MetricRow label="Khấu trừ" value={currentEmployeeSalary.deduction} />
          </div>
        </Card>
      </div>
    </div>
  );
}
