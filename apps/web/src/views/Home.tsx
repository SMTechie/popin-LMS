import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckSquare,
  Clock,
  DollarSign,
  GraduationCap,
  ShoppingBag,
  Ticket,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import ChartWidget from '../components/ChartWidget';
import ActivityFeed from '../components/ActivityFeed';
import { mockAdmissions, mockStats, revenueData, ticketData } from '../data/mockData';
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
  const schoolName = branding?.schoolName || 'your school';

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Frontend prototype</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Local data</span>
              </div>
              <h2 className="mt-5 max-w-2xl font-heading text-2xl font-bold text-gray-950 sm:text-3xl">
                Good morning, Sarah. Here is the school at a glance.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Track applications, tickets, stock, store activity and parent-facing work from one clean workspace for {schoolName}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Review approvals
                </button>
                <button className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  Open admissions
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-6 lg:border-l lg:border-t-0 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Today</p>
              <div className="mt-4 space-y-3">
                {[
                  ['8', 'Approvals waiting'],
                  ['42', 'Parents notified'],
                  ['12', 'Store orders ready'],
                ].map(([value, label]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="font-heading text-xl font-bold text-gray-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-heading">Operational snapshot</h2>
            <p className="mt-0.5 text-sm text-gray-500">The numbers below are mocked locally until the API returns later.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 sm:flex">
            <Clock className="h-3.5 w-3.5" />
            <span>Monday, 22 Jun 2026</span>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Open Tasks"
              value={mockStats.openTasks}
              trend={{ value: 12, label: 'vs last week' }}
              icon={<CheckSquare className="h-5 w-5 text-blue-600" />}
              iconBg="bg-blue-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Open Tickets"
              value={mockStats.ticketsOpen}
              trend={{ value: -5, label: 'vs last week' }}
              icon={<Ticket className="h-5 w-5 text-purple-600" />}
              iconBg="bg-purple-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Store Sales Today"
              value={`R ${mockStats.storeSalesToday.toLocaleString()}`}
              trend={{ value: 8, label: 'vs yesterday' }}
              icon={<ShoppingBag className="h-5 w-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Outstanding Fees"
              value={`R ${mockStats.outstandingFees.toLocaleString()}`}
              trend={{ value: -3, label: 'vs last month' }}
              icon={<DollarSign className="h-5 w-5 text-amber-600" />}
              iconBg="bg-amber-50"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Admissions Pipeline"
              value={mockStats.admissionsPipeline}
              subtitle="Active applications"
              icon={<GraduationCap className="h-5 w-5 text-cyan-600" />}
              iconBg="bg-cyan-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Pending Approvals"
              value={mockStats.pendingApprovals}
              subtitle="Requires your action"
              icon={<Clock className="h-5 w-5 text-rose-600" />}
              iconBg="bg-rose-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Low Stock Alerts"
              value={mockStats.lowStockAlerts}
              subtitle="Items below threshold"
              icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
              iconBg="bg-orange-50"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DashboardCard
              title="Revenue MTD"
              value="R 67,000"
              trend={{ value: 22, label: 'vs last month' }}
              icon={<TrendingUp className="h-5 w-5 text-indigo-600" />}
              iconBg="bg-indigo-50"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartWidget
              title="Revenue and Fees Overview"
              subtitle="Last 7 months"
              type="bar"
              data={revenueData}
              nameKey="month"
              dataKeys={[
                { key: 'revenue', color: '#2563EB', name: 'Store Revenue' },
                { key: 'fees', color: '#CBD5E1', name: 'School Fees' },
              ]}
              height={240}
            />
          </div>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Admissions Pipeline</h3>
              <button className="text-xs font-medium text-blue-600 hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Applicant', 'Grade', 'Stage', 'Date', 'Status'].map((heading) => (
                      <th key={heading} className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockAdmissions.map((application) => (
                    <tr key={application.id} className="transition hover:bg-gray-50">
                      <td className="py-2.5 text-sm font-medium text-gray-800">{application.name}</td>
                      <td className="py-2.5 text-sm text-gray-500">{application.grade}</td>
                      <td className="py-2.5 text-sm text-gray-600">{application.stage}</td>
                      <td className="py-2.5 text-sm text-gray-400">{application.date}</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${admissionStageColors[application.status]}`}>
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}
