import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell } from
'recharts';
import { Users, DollarSign, ShoppingBag, Activity, TrendingUp, AlertCircle, Calendar, UserCheck, UserX, Loader2 } from 'lucide-react';
import { employeesAPI, salesAPI, tasksAPI, enquiriesAPI } from '../../lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const ATTENDANCE_COLORS = ['#10b981', '#ef4444', '#94a3b8']; // Green (Present), Red (Leave), Gray (Off)

const SALES_DATA = [
{ name: 'Mon', sales: 4000 },
{ name: 'Tue', sales: 3000 },
{ name: 'Wed', sales: 2000 },
{ name: 'Thu', sales: 2780 },
{ name: 'Fri', sales: 1890 },
{ name: 'Sat', sales: 2390 },
{ name: 'Sun', sales: 3490 }];


const BRANCH_SALES_DETAILS = [
{ name: 'Downtown Branch', sales: 154000, target: 140000, employees: 45, manager: 'Sarah J.' },
{ name: 'Westside Hub', sales: 98000, target: 110000, employees: 32, manager: 'Mike T.' },
{ name: 'North Hills', sales: 86000, target: 80000, employees: 28, manager: 'Jessica L.' },
{ name: 'East End', sales: 65000, target: 70000, employees: 22, manager: 'David B.' },
{ name: 'South City', sales: 120000, target: 115000, employees: 35, manager: 'Robert C.' }];


const ATTENDANCE_DATA = [
{ name: 'Present', value: 856 },
{ name: 'On Leave', value: 42 },
{ name: 'Weekly Off', value: 136 }];


function StatCard({ title, value, subtext, icon: Icon, trend, colorClass }) {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#190E5D]">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClass || (isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {subtext}
        </span>
        <span className="text-slate-400 ml-2">vs last month</span>
      </div>
    </div>);

}

export function SuperAdminDashboard() {
  const [data, setData] = useState({ employees: [], sales: [], tasks: [], enquiries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeesAPI.getAll().catch(() => ({ data: { data: [] } })),
      salesAPI.getAll().catch(() => ({ data: { data: [] } })),
      tasksAPI.getAll().catch(() => ({ data: { data: [] } })),
      enquiriesAPI.getAll().catch(() => ({ data: { data: [] } }))
    ]).then(([empRes, salesRes, tasksRes, enqRes]) => {
      setData({
        employees: empRes.data?.data || [],
        sales: salesRes.data?.data || [],
        tasks: tasksRes.data?.data || [],
        enquiries: enqRes.data?.data || []
      });
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const totalEmployees = data.employees.length;
  const totalSalesCount = data.sales.length;
  const totalRevenue = data.sales.reduce((acc, curr) => acc + curr.amount, 0);
  const presentPercentage = totalEmployees > 0 ? Math.round(856 / 1034 * 100) : 0; // Mocked attendance percentage for now

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[400px]"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${(totalRevenue/1000).toFixed(1)}K`} subtext="Dynamic" icon={DollarSign} trend="up" colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Total Sales" value={totalSalesCount.toString()} subtext="Dynamic" icon={ShoppingBag} trend="up" colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard title="Total Staff" value={totalEmployees.toString()} subtext="Dynamic" icon={Users} trend="up" colorClass="bg-orange-50 text-orange-600" />
        <StatCard title="Active Leads" value={data.enquiries.length.toString()} subtext="Dynamic" icon={Activity} trend="up" colorClass="bg-green-50 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Sales Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#190E5D]">Branch Sales Performance</h3>
              <p className="text-sm text-slate-500">Actual vs Target Sales by Branch</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Actual</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300 rounded-full"></div> Target</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <BarChart data={BRANCH_SALES_DETAILS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual Sales" barSize={30} />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Target Sales" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Dashboard Widget */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-[#190E5D] mb-2">Workforce Status</h3>
          <p className="text-sm text-slate-500 mb-6">Today's attendance overview</p>
          
          <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ATTENDANCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {ATTENDANCE_DATA.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index]} />
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-[#190E5D]">{presentPercentage}%</span>
              <span className="text-xs text-slate-500 font-medium uppercase">Present</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
              <div className="text-green-600 mb-1 flex justify-center"><UserCheck size={18} /></div>
              <div className="text-lg font-bold text-[#190E5D]">{ATTENDANCE_DATA[0].value}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Present</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100">
              <div className="text-red-500 mb-1 flex justify-center"><UserX size={18} /></div>
              <div className="text-lg font-bold text-[#190E5D]">{ATTENDANCE_DATA[1].value}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Leave</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 mb-1 flex justify-center"><Calendar size={18} /></div>
              <div className="text-lg font-bold text-[#190E5D]">{ATTENDANCE_DATA[2].value}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Off</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Branch Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#190E5D]">Branch Performance Overview</h3>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View Full Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Branch Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Manager</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Staff Count</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Sales Target</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Actual Sales</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BRANCH_SALES_DETAILS.map((branch, index) => {
                const performance = Math.round(branch.sales / branch.target * 100);
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#190E5D]">{branch.name}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.manager}</td>
                    <td className="px-6 py-4 text-slate-600">{branch.employees}</td>
                    <td className="px-6 py-4 text-slate-600">${branch.target.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-[#190E5D]">${branch.sales.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${performance >= 100 ? 'bg-green-500' : performance >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(performance, 100)}%` }}>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${performance >= 100 ? 'text-green-600' : performance >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {performance}%
                        </span>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts (Kept but minimized if needed, or just as a row) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-red-500" size={20} />
          <h3 className="font-bold text-[#190E5D]">System Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
            <span className="text-sm text-red-800 font-medium">North Hills: Target Missed (-15%)</span>
            <span className="text-xs text-red-500">2h ago</span>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-between">
            <span className="text-sm text-orange-800 font-medium">High Leave Rate: Westside</span>
            <span className="text-xs text-orange-500">5h ago</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium">New Branch Policy Update</span>
            <span className="text-xs text-blue-500">1d ago</span>
          </div>
        </div>
      </div>
    </div>);

}