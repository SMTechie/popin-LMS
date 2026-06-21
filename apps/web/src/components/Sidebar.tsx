import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  ShoppingCart,
  Package,
  Shirt,
  Ticket,
  GraduationCap,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  Presentation,
  ShieldCheck,
  BedDouble,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useBranding } from '../settings/BrandingContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/boards', label: 'Boards', icon: Kanban },
  { path: '/requisitions', label: 'Requisitions', icon: ShoppingCart },
  { path: '/supply-chain', label: 'Supply Chain', icon: Truck },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/store', label: 'Uniform Store', icon: Shirt },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/admissions', label: 'Admissions', icon: GraduationCap },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/hostel', label: 'Hostel Management', icon: BedDouble },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/parent-portal', label: 'Parent Portal', icon: Users },
  { path: '/teacher-portal', label: 'Teacher Portal', icon: Presentation },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/settings/identity-integrations', label: 'Microsoft / Google / Apple', icon: ShieldCheck },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { branding } = useBranding();

  const schoolName = branding?.schoolName || "Your School";
  const initials = schoolName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#0F1629] text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-white/10 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={`${schoolName} logo`}
                className="w-8 h-8 rounded-lg bg-white/10 object-contain p-1"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight font-heading">{schoolName}</span>
          </div>
        )}
        {collapsed && (
          branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={`${schoolName} logo`}
              className="w-8 h-8 rounded-lg bg-white/10 object-contain p-1"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          )
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/10 transition-colors duration-200 text-white/60 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' || path === '/settings' ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onMobileClose}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{label}</span>}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 border border-white/10">
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* School info */}
      {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-400">{initials || "PS"}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{schoolName}</p>
                <p className="text-xs text-white/40 truncate">Enterprise Plan</p>
              </div>
            </div>
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="relative flex flex-col h-full z-10">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
