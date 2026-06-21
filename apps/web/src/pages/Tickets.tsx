import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Ticket } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import FilterBar from '../components/FilterBar';
import { notifyAction } from '../lib/notify';

const mockTickets = [
  { id: 'TKT-001', title: 'Broken AC in Staff Room', category: 'Maintenance', priority: 'high', assignee: 'John M.', status: 'open', created: '2026-02-06' },
  { id: 'TKT-002', title: 'Projector not working in Lab 3', category: 'IT', priority: 'high', assignee: 'John M.', status: 'in-progress', created: '2026-02-05' },
  { id: 'TKT-003', title: 'Request for new whiteboard markers', category: 'Supplies', priority: 'low', assignee: 'Lisa P.', status: 'open', created: '2026-02-04' },
  { id: 'TKT-004', title: 'Network outage in Block C', category: 'IT', priority: 'high', assignee: 'John M.', status: 'resolved', created: '2026-02-03' },
  { id: 'TKT-005', title: 'Leaking roof in Room 7', category: 'Maintenance', priority: 'medium', assignee: 'Mike T.', status: 'open', created: '2026-02-02' },
];

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export default function Tickets() {
  const [search, setSearch] = useState('');

  const filtered = mockTickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Tickets">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Open', count: 3, color: 'text-blue-600 bg-blue-50' },
            { label: 'In Progress', count: 1, color: 'text-amber-600 bg-amber-50' },
            { label: 'Resolved', count: 1, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Total', count: 5, color: 'text-gray-600 bg-gray-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 font-heading">{stat.count}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search tickets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-52"
              />
            </div>
            <FilterBar
              filters={[
                { label: 'Category', options: ['IT', 'Maintenance', 'HR', 'Finance', 'Supplies'] },
                { label: 'Priority', options: ['High', 'Medium', 'Low'] },
                { label: 'Status', options: ['Open', 'In Progress', 'Resolved'] },
              ]}
            />
          </div>
          <button
            onClick={() => notifyAction("Create a new ticket.")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['ID', 'Title', 'Category', 'Priority', 'Assignee', 'Status', 'Created'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((ticket, i) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => notifyAction(`Opening ${ticket.id}`)}
                >
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{ticket.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">{ticket.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ticket.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ticket.assignee}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[ticket.status]}`}>{ticket.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{ticket.created}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
