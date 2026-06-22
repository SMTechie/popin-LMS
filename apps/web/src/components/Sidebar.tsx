import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  Package,
  Presentation,
  Settings,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Ticket,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useBranding } from '../settings/BrandingContext';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/boards', label: 'Boards', icon: Kanban },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/requisitions', label: 'Requisitions', icon: ShoppingCart },
      { path: '/supply-chain', label: 'Supply Chain', icon: Truck },
      { path: '/inventory', label: 'Inventory', icon: Package },
      { path: '/store', label: 'Uniform Store', icon: Shirt },
      { path: '/tickets', label: 'Tickets', icon: Ticket },
    ],
  },
  {
    label: 'School',
    items: [
      { path: '/admissions', label: 'Admissions', icon: GraduationCap },
      { path: '/students', label: 'Students', icon: Users },
      { path: '/hostel', label: 'Hostel', icon: BedDouble },
      { path: '/parent-portal', label: 'Parent Portal', icon: Users },
      { path: '/teacher-portal', label: 'Teacher Portal', icon: Presentation },
    ],
  },
  {
    label: 'Admin',
    items: [
      { path: '/settings', label: 'Settings', icon: Settings },
      { path: '/settings/identity-integrations', label: 'Identity', icon: ShieldCheck },
    ],
  },
];

const isPathActive = (path: string, pathname: string) => {
  if (path === '/') return pathname === '/';
  if (path === '/settings') return pathname === '/settings';
  return pathname.startsWith(path);
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((group) => [group.label, false]))
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { branding } = useBranding();

  const schoolName = branding?.schoolName || 'POPIN Demo School';
  const initials = schoolName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isActivePath = (path: string) => isPathActive(path, location.pathname);

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }));
  };

  const sidebarContent = (
    <div className={`flex h-full flex-col border-r border-slate-800 bg-[#111827] text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className={`flex h-16 items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex min-w-0 items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={`${schoolName} logo`}
              className="h-9 w-9 rounded-lg bg-white object-contain p-1"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold font-heading">{schoolName}</p>
              <p className="truncate text-xs text-white/45">{branding?.schoolMotto || 'School workspace'}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-7 w-7 items-center justify-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Main navigation"
      >
        <div className="space-y-5">
          {navGroups.map((group) => {
            const groupHasActiveItem = group.items.some((item) => isActivePath(item.path));
            const groupOpen = collapsed || openGroups[group.label] || groupHasActiveItem;

            return (
            <div key={group.label}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="mb-2 flex w-full items-center justify-between rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/35 transition hover:bg-white/5 hover:text-white/60"
                  aria-expanded={groupOpen}
                  aria-controls={`sidebar-group-${group.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${groupOpen ? '' : '-rotate-90'}`} />
                </button>
              )}
              {groupOpen && (
                <ul
                  id={`sidebar-group-${group.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="space-y-1"
                >
                  {group.items.map(({ path, label, icon: Icon }) => {
                    const active = isActivePath(path);
                    return (
                      <li key={path}>
                        <NavLink
                          to={path}
                          onClick={onMobileClose}
                          title={collapsed ? label : undefined}
                          className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                            active
                              ? 'bg-white text-slate-950 shadow-sm'
                              : 'text-white/65 hover:bg-white/10 hover:text-white'
                          } ${collapsed ? 'justify-center' : ''}`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {!collapsed && <span className="truncate">{label}</span>}
                          {collapsed && (
                            <span className="pointer-events-none absolute left-full z-50 ml-2 rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                              {label}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="rounded-lg bg-white/6 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <span className="text-xs font-bold text-white">{initials || 'PS'}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">Local prototype</p>
                <p className="truncate text-xs text-white/45">Frontend only</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-white/80"
            title="Sign out"
          >
            {initials || 'PS'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen shrink-0 lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
            aria-label="Close navigation overlay"
          />
          <aside className="relative z-10 flex h-full">
            <button
              onClick={onMobileClose}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
