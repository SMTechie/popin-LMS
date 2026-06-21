import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare, Ticket, ShoppingBag, DollarSign,
  GraduationCap, AlertTriangle, Clock, TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import ChartWidget from '../components/ChartWidget';
import ActivityFeed from '../components/ActivityFeed';
import { mockStats, revenueData, ticketData, mockAdmissions } from '../data/mockData';
import { useBranding } from '../settings/BrandingContext';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const admissionStageColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  approved: 'bg-emerald-100 text-emerald-700',
};

export default function Home() {
  const { branding } = useBranding();
  const schoolName = branding?.schoolName || "your school";

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-heading">Good morning, Sarah 👋</h2>
            <p className="text-sm text-gray-500 mt-0.5">Here's what's happening at {schoolName} today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Monday, 7 Feb 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Open Tasks"
              value={mockStats.openTasks}
              trend={{ value: 12, label: 'vs last week' }}
              icon={<CheckSquare className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Open Tickets"
              value={mockStats.ticketsOpen}
              trend={{ value: -5, label: 'vs last week' }}
              icon={<Ticket className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Store Sales Today"
              value={`R ${mockStats.storeSalesToday.toLocaleString()}`}
              trend={{ value: 8, label: 'vs yesterday' }}
              icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Outstanding Fees"
              value={`R ${mockStats.outstandingFees.toLocaleString()}`}
              trend={{ value: -3, label: 'vs last month' }}
              icon={<DollarSign className="w-5 h-5 text-amber-600" />}
              iconBg="bg-amber-50"
            />
          </motion.div>
        </motion.div>

        {/* Second row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Admissions Pipeline"
              value={mockStats.admissionsPipeline}
              subtitle="Active applications"
              icon={<GraduationCap className="w-5 h-5 text-cyan-600" />}
              iconBg="bg-cyan-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Pending Approvals"
              value={mockStats.pendingApprovals}
              subtitle="Requires your action"
              icon={<Clock className="w-5 h-5 text-rose-600" />}
              iconBg="bg-rose-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Low Stock Alerts"
              value={mockStats.lowStockAlerts}
              subtitle="Items below threshold"
              icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
              iconBg="bg-orange-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Revenue MTD"
              value="R 67,000"
              trend={{ value: 22, label: 'vs last month' }}
              icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
              iconBg="bg-indigo-50"
            />
          </motion.div>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartWidget
              title="Revenue & Fees Overview"
              subtitle="Last 7 months"
              type="bar"
              data={revenueData}
              nameKey="month"
              dataKeys={[
                { key: 'revenue', color: '#3B82F6', name: 'Store Revenue' },
                { key: 'fees', color: '#E5E7EB', name: 'School Fees' },
              ]}
              height={240}
            />
          </div>
          <div>
            <ChartWidget
              title="Tickets by Category"
              subtitle="Current month"
              type="pie"
              data={ticketData}
              nameKey="name"
              valueKey="value"
              height={240}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admissions pipeline */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Admissions Pipeline</h3>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Applicant', 'Grade', 'Stage', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockAdmissions.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 text-sm font-medium text-gray-800">{a.name}</td>
                      <td className="py-2.5 text-sm text-gray-500">{a.grade}</td>
                      <td className="py-2.5 text-sm text-gray-600">{a.stage}</td>
                      <td className="py-2.5 text-sm text-gray-400">{a.date}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${admissionStageColors[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity feed */}
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}
