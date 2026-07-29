import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend } from
'recharts';
import { Download, Calendar } from 'lucide-react';

const MONTHLY_SALES_DATA = [
{ name: 'Jan', revenue: 45000, target: 40000 },
{ name: 'Feb', revenue: 52000, target: 42000 },
{ name: 'Mar', revenue: 48000, target: 45000 },
{ name: 'Apr', revenue: 61000, target: 48000 },
{ name: 'May', revenue: 55000, target: 50000 },
{ name: 'Jun', revenue: 67000, target: 55000 }];


const SERVICE_TYPE_DATA = [
{ name: 'Periodic Service', value: 450 },
{ name: 'Repairs', value: 300 },
{ name: 'Warranty', value: 150 },
{ name: 'Accidental', value: 80 }];


const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="text-2xl">📊</span> Analytics Overview
        </h2>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 border border-slate-200">
            <Calendar size={16} /> This Month
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Target */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Revenue vs Target</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <BarChart data={MONTHLY_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" name="Target ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Type Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Service Type Distribution</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <PieChart>
                <Pie
                  data={SERVICE_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {SERVICE_TYPE_DATA.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales Trend Line */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Staff Performance Trend</h3>
        <div style={{ width: '100%', height: 288 }}>
            <ResponsiveContainer width="100%" height={288} minWidth={0}>
            <LineChart data={MONTHLY_SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);

}