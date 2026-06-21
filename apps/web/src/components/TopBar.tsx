import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, Plus } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notifyAction } from '../lib/notify';

interface TopBarProps {
  onMobileMenuOpen: () => void;
  title: string;
}

export default function TopBar({ onMobileMenuOpen, title }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifIcons: Record<string, string> = {
    approval: '✅',
    ticket: '🎫',
    order: '📦',
    fee: '💰',
    appointment: '📅',
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 font-heading hidden sm:block">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto lg:mx-0 lg:ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick add */}
        <button
          onClick={() => notifyAction("Create flow coming soon.")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={notifOpen}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {mockNotifications.map(n => (
                  <li key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-base mt-0.5">{notifIcons[n.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" aria-label="Unread" />}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={profileOpen}
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">SK</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">Sarah K.</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Sarah Khumalo</p>
                <p className="text-xs text-gray-500">Principal</p>
              </div>
              <ul className="py-1">
                {['Profile', 'Preferences', 'Help'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => notifyAction(`${item} is coming soon.`)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100 mt-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      logout();
                      navigate('/login', { replace: true });
                    }}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
