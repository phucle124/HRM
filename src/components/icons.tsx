import type { ReactNode } from 'react';
import {
  HiArrowTrendingUp,
  HiBars3BottomLeft,
  HiBuildingOffice2,
  HiCalendarDays,
  HiClock,
  HiCurrencyDollar,
  HiDocumentText,
  HiHome,
  HiIdentification,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBell,
  HiOutlineChartBarSquare,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentList,
  HiOutlineGift,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineXMark,
  HiCog6Tooth,
} from 'react-icons/hi2';

const map: Record<string, ReactNode> = {
  dashboard: <HiHome className="h-5 w-5" />,
  'layout-dashboard': <HiHome className="h-5 w-5" />,

  employees: <HiOutlineUsers className="h-5 w-5" />,
  users: <HiOutlineUsers className="h-5 w-5" />,

  departments: <HiBuildingOffice2 className="h-5 w-5" />,
  'building-2': <HiBuildingOffice2 className="h-5 w-5" />,

  attendance: <HiClock className="h-5 w-5" />,
  'calendar-days': <HiCalendarDays className="h-5 w-5" />,

  salary: <HiCurrencyDollar className="h-5 w-5" />,
  wallet: <HiCurrencyDollar className="h-5 w-5" />,

  leave: <HiCalendarDays className="h-5 w-5" />,
  plane: <HiCalendarDays className="h-5 w-5" />,

  contracts: <HiDocumentText className="h-5 w-5" />,
  'file-text': <HiDocumentText className="h-5 w-5" />,

  rewards: <HiOutlineGift className="h-5 w-5" />,
  award: <HiOutlineGift className="h-5 w-5" />,

  reports: <HiOutlineChartBarSquare className="h-5 w-5" />,
  'bar-chart-3': <HiOutlineChartBarSquare className="h-5 w-5" />,

  settings: <HiCog6Tooth className="h-5 w-5" />,

  profile: <HiOutlineUserCircle className="h-5 w-5" />,
  'user-circle': <HiOutlineUserCircle className="h-5 w-5" />,

  menu: <HiBars3BottomLeft className="h-5 w-5" />,
  close: <HiOutlineXMark className="h-5 w-5" />,
  search: <HiOutlineMagnifyingGlass className="h-5 w-5" />,
  bell: <HiOutlineBell className="h-5 w-5" />,
  badge: <HiOutlineCheckBadge className="h-5 w-5" />,
  security: <HiOutlineShieldCheck className="h-5 w-5" />,
  payroll: <HiOutlineClipboardDocumentList className="h-5 w-5" />,
  performance: <HiArrowTrendingUp className="h-5 w-5" />,
  userId: <HiIdentification className="h-5 w-5" />,
  logout: <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />,
};

export function AppIcon({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) {
  return <span className={className}>{map[name] ?? <HiHome className="h-5 w-5" />}</span>;
}