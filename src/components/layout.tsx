import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import {
  brand,
  employeeNavItems,
  hrNavItems,
  adminNavItems,
  managerNavItems,
} from '../data/mockData';

import { useAuth } from '../context/authContext';
import type { NavItem, Role } from '../types/hrm';
import { AppIcon } from './icons';
import { BrandMark } from './ui';

function Sidebar({
  items,
  title,
  collapsed,
  onToggleCollapse,
  onNavigate,
  onLogout,
}: {
  items: NavItem[];
  title: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-panel">
      <div className={`flex items-center gap-3 border-b border-line py-5 ${collapsed ? 'px-3 lg:justify-center' : 'px-6'}`}>
        <BrandMark />

        <div className={`${collapsed ? 'lg:hidden' : 'block'} min-w-0`}>
          <h1 className="truncate text-xl font-bold text-stone-900">{brand.name}</h1>
          <p className="truncate text-sm text-stone-500">{title}</p>
        </div>

        <button
          onClick={onToggleCollapse}
          className="ml-auto hidden rounded-xl border border-line bg-canvas p-2 lg:flex"
        >
          <AppIcon name="menu" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl py-3 px-4 ${
                isActive ? 'bg-brand-soft text-brand-deep' : 'text-stone-600'
              }`
            }
          >
            <AppIcon name={item.icon} />
            <span className={`${collapsed ? 'lg:hidden' : 'inline'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl py-3 px-4 text-stone-600"
        >
          <AppIcon name="logout" />
          <span className={`${collapsed ? 'lg:hidden' : 'inline'}`}>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

function Topbar({
  role,
}: {
  role: Role;
}) {
  const { user } = useAuth();
  const location = useLocation();

  const pageName = useMemo(() => {
    const map = [
      ...adminNavItems,
      ...hrNavItems,
      ...managerNavItems,
      ...employeeNavItems,
    ].find((item) => item.path === location.pathname);

    return map?.label ?? 'Dashboard';
  }, [location.pathname]);

  const roleCode =
    role === 'admin'
      ? 'AD'
      : role === 'hr'
      ? 'HR'
      : role === 'manager'
      ? 'MN'
      : 'PL';

  const roleLabel =
    role === 'admin'
      ? 'Administrator'
      : role === 'hr'
      ? 'HR Staff'
      : role === 'manager'
      ? 'Manager'
      : 'Employee';

  return (
    <header className="border-b border-line bg-panel px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{role.toUpperCase()}</p>
          <h2 className="text-xl font-semibold">{pageName}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {roleCode}
          </div>

          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ role }: { role: Role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const items =
    role === 'admin'
      ? adminNavItems
      : role === 'hr'
      ? hrNavItems
      : role === 'manager'
      ? managerNavItems
      : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      <aside className={`${collapsed ? 'w-24' : 'w-72'}`}>
        <Sidebar
          items={items}
          title={
            role === 'admin'
              ? 'Quản trị hệ thống'
              : role === 'hr'
              ? 'Quản lý nhân sự'
              : role === 'manager'
              ? 'Quản lý phòng ban'
              : 'Nhân viên'
          }
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex-1">
        <Topbar role={role} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}