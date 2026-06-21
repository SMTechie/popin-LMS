import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWidget from '../components/ChartWidget';
import { revenueData, ticketData, admissionsFunnelData } from '../data/mockData';
import { Calendar } from 'lucide-react';

const dashboards = ['Executive', 'SCM', 'Store', 'Admissions', 'Tickets', 'Fees', 'Appointments'];

export default function Analytics() {
  const [activeDash, setActiveDash] = useState('Executive');

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Dashboard selector */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {dashboards.map(d => (
              <button
                key={d}
                onClick={() => setActiveDash(d)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeDash === d
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Jan 2026 – Feb 2026</span>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: 'R 366,000', change: '+18%' },
            { label: 'Fees Collected', value: 'R 1.95M', change: '+7%' },
            { label: 'Tickets Resolved', value: '89', change: '+23%' },
            { label: 'New Enrolments', value: '61', change: '+12%' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 font-heading">{kpi.value}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">{kpi.change} vs prev period</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Revenue Trend"
            subtitle="Store revenue over time"
            type="line"
            data={revenueData}
            nameKey="month"
            dataKeys={[{ key: 'revenue', color: '#3B82F6', name: 'Revenue' }]}
            height={260}
          />
          <ChartWidget
            title="Fees Collection"
            subtitle="Monthly fees collected"
            type="bar"
            data={revenueData}
            nameKey="month"
            dataKeys={[{ key: 'fees', color: '#10B981', name: 'Fees' }]}
            height={260}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartWidget
            title="Ticket Distribution"
            subtitle="By category"
            type="pie"
            data={ticketData}
            nameKey="name"
            valueKey="value"
            height={240}
          />

          {/* Admissions funnel */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Admissions Funnel</h3>
            <div className="space-y-3">
              {admissionsFunnelData.map((stage, i) => {
                const pct = Math.round((stage.count / admissionsFunnelData[0].count) * 100);
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 text-right">{stage.stage}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: `hsl(${220 - i * 15}, 80%, ${55 + i * 3}%)` }}
                      >
                        <span className="text-xs font-bold text-white">{stage.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-10">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}