import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { useEffect } from 'react';
import { formatCurrency } from '../data/mockData';
import { AppIcon } from './icons';

const avatarTones = [
  'from-[#efe4d8] to-[#f7f2ec] text-[#7c6754]',
  'from-[#e3ddd6] to-[#f4efe9] text-[#6f6254]',
  'from-[#e8e0d5] to-[#f6f0e8] text-[#866d58]',
  'from-[#e7d7cc] to-[#f7f1ea] text-[#7c5e4f]',
];

function pickAvatarTone(seed: string) {
  const total = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarTones[total % avatarTones.length];
}

export function BrandMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/20">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="8" r="2" />
        <circle cx="12" cy="7" r="2" />
        <circle cx="18" cy="8" r="2" />
        <path d="M3 18c0-2 1.7-4 4-4" />
        <path d="M8 18c0-2.8 2.2-5 5-5" />
        <path d="M16 18c0-2 1.7-4 4-4" />
      </svg>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'Đang làm' || status === 'Đã duyệt' || status === 'Đúng giờ' || status === 'Đã thanh toán' || status === 'Còn hiệu lực' || status === 'Khen thưởng'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : status === 'Thử việc' || status === 'Chờ duyệt' || status === 'Đi muộn' || status === 'Sắp hết hạn' || status === 'Nghỉ phép' || status === 'Làm từ xa'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : 'bg-rose-50 text-rose-700 ring-rose-100';

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}>{status}</span>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-panel p-6 shadow-soft md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-deep">Hệ thống quản lý nhân sự</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">{title}</h1>
        <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PrimaryButton({ children, className = '', type = 'button', ...props }: BaseButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', type = 'button', ...props }: BaseButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-2xl border border-line bg-panel px-5 py-3 text-sm font-semibold text-stone-700 transition duration-300 ease-out hover:bg-[#f6efe7] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SummaryCard({ label, value, change, accent }: { label: string; value: string; change: string; accent?: string }) {
  return (
    <div className="rounded-[26px] border border-line bg-panel p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <h3 className="mt-3 text-3xl font-bold text-stone-900">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-2xl ${accent ?? 'bg-brand-soft'} ring-1 ring-line`} />
      </div>
      <p className="mt-4 text-sm text-stone-500">{change}</p>
    </div>
  );
}

export function Card({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[28px] border border-line bg-panel p-6 shadow-soft ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-stone-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function MiniBars({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.name}>
          <div className="mb-2 flex items-center justify-between text-sm text-stone-600">
            <span>{item.name}</span>
            <span className="font-semibold text-stone-900">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#f1ebe4]">
            <div className="h-2 rounded-full bg-brand transition-all duration-500" style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Table({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#f3eee7] text-xs uppercase tracking-[0.2em] text-stone-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-panel text-sm text-stone-600">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AvatarBadge({
  initials,
  imageUrl,
  size = 'md',
}: {
  initials: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClass = {
    sm: 'h-9 w-9 text-xs rounded-xl',
    md: 'h-11 w-11 text-sm rounded-2xl',
    lg: 'h-16 w-16 text-xl rounded-[22px]',
    xl: 'h-24 w-24 text-3xl rounded-[28px]',
  }[size];

  if (imageUrl) {
    return <img src={imageUrl} alt={initials} className={`${sizeClass} object-cover ring-1 ring-line`} />;
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br font-bold ring-1 ring-line ${sizeClass} ${pickAvatarTone(initials)}`}
    >
      {initials}
    </div>
  );
}

export function EmployeeChip({ name, detail, avatar, avatarUrl, compact = false }: { name: string; detail: string; avatar: string; avatarUrl?: string; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <AvatarBadge initials={avatar} imageUrl={avatarUrl} size={compact ? 'sm' : 'md'} />
      <div>
        <p className="font-semibold text-stone-900">{name}</p>
        <p className="text-xs text-stone-500">{detail}</p>
      </div>
    </div>
  );
}

export function KeyValueGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-[#f7f2ec] p-4 ring-1 ring-line">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{item.label}</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function MetricRow({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f2ec] px-4 py-3 text-sm ring-1 ring-line">
      <div>
        <p className="font-semibold text-stone-900">{label}</p>
        {note ? <p className="mt-1 text-xs text-stone-500">{note}</p> : null}
      </div>
      <p className="font-bold text-brand-deep">{formatCurrency(value)}</p>
    </div>
  );
}

export function InlineMessage({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-line bg-[#f7f2ec] px-4 py-3 text-sm text-stone-600">{children}</div>;
}

interface OverlayProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, children, onClose }: OverlayProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/35 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-line bg-panel p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
          </div>
          <button className="rounded-xl border border-line p-2 text-stone-500 transition hover:bg-[#f5ede5]" onClick={onClose}>
            <AppIcon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Drawer({ open, title, description, children, onClose }: OverlayProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, open]);

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-stone-900/25 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-xl transform border-l border-line bg-panel p-6 shadow-2xl transition duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
          </div>
          <button className="rounded-xl border border-line p-2 text-stone-500 transition hover:bg-[#f5ede5]" onClick={onClose}>
            <AppIcon name="close" />
          </button>
        </div>
        <div className="h-[calc(100%-64px)] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement> & { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  const { label, value, onChange, type = 'text', className = '', ...rest } = props;
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft ${className}`}
        {...rest}
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft"
      />
    </label>
  );
}
