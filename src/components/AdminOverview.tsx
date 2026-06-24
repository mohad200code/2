/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Product, Order } from '../types';

interface AdminOverviewProps {
  products: Product[];
  orders: Order[];
}

interface TodoItem {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ products, orders }) => {
  // Todo List State
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 'todo-1', text: 'Prepare weekly marketing banners', date: '9/24/2025', completed: false },
    { id: 'todo-2', text: 'Confirm restock of Nike shoes category', date: '9/25/2025', completed: true },
    { id: 'todo-3', text: 'Perform security patch of payment webhooks', date: '9/26/2025', completed: false },
    { id: 'todo-4', text: 'Review customer inquiries from contact form', date: '9/28/2025', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Revenue chart data
  const revenueData = [
    { name: 'April', Total: 120, Successful: 98 },
    { name: 'May', Total: 210, Successful: 180 },
    { name: 'June', Total: 190, Successful: 145 },
    { name: 'July', Total: 250, Successful: 210 },
    { name: 'August', Total: 310, Successful: 285 },
    { name: 'September', Total: 340, Successful: 312 },
  ];

  // Visitors chart data
  const visitorData = [
    { name: 'Mon', Mobile: 140, Desktop: 220 },
    { name: 'Tue', Mobile: 180, Desktop: 290 },
    { name: 'Wed', Mobile: 230, Desktop: 340 },
    { name: 'Thu', Mobile: 170, Desktop: 310 },
    { name: 'Fri', Mobile: 290, Desktop: 410 },
    { name: 'Sat', Mobile: 380, Desktop: 480 },
    { name: 'Sun', Mobile: 210, Desktop: 320 },
  ];

  // Browser usage pie data
  const browserData = [
    { name: 'Chrome', value: 650, color: '#3B82F6' },
    { name: 'Safari', value: 280, color: '#EC4899' },
    { name: 'Firefox', value: 120, color: '#F59E0B' },
    { name: 'Other', value: 75, color: '#10B981' },
  ];

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodoText,
      date: new Date().toLocaleDateString(),
      completed: false,
    };
    setTodos([...todos, item]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div id="admin-dashboard-overview" className="space-y-6 font-sans">
      {/* Metrics Row */}
      <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Sessions</p>
            <h3 id="stat-sessions" className="text-3xl font-black mt-2">12,482</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from yesterday
            </p>
          </div>
          <div className="p-4 bg-slate-700/50 text-indigo-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">API Throughput</p>
            <h3 id="stat-throughput" className="text-3xl font-black mt-2">842ms</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>Optimal response speed</span>
            </p>
          </div>
          <div className="p-4 bg-slate-700/50 text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Errors Logged</p>
            <h3 id="stat-errors" className="text-3xl font-black mt-2">0.02%</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>Healthy application state</span>
            </p>
          </div>
          <div className="p-4 bg-slate-700/50 text-rose-400 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div id="charts-grid-row-1" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue Double Bar Chart */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg lg:col-span-2 flex flex-col h-[380px]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
            <span>Total Revenue</span>
            <span className="text-xs font-normal text-slate-500 font-sans">Monthly performance (K$)</span>
          </h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Total" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Successful" fill="#A855F7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Browser Usage Pie Chart */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-[380px]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Browser Usage</h4>
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browserData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {browserData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center visitors label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span id="pie-center-number" className="text-2xl font-black">1,125</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Visitors</span>
            </div>
          </div>
          {/* Legend indicator badges */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-700/50 font-medium">
            {browserData.map((b) => (
              <div key={b.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: b.color }} />
                <span className="text-slate-300">{b.name}</span>
                <span className="text-slate-500 font-bold ml-auto">({b.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="charts-grid-row-2" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Area Chart */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg lg:col-span-2 flex flex-col h-[380px]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
            <span>Total Visitors</span>
            <span className="text-xs font-normal text-slate-500 font-sans">Weekly wave breakdown</span>
          </h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Desktop" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDesktop)" />
                <Area type="monotone" dataKey="Mobile" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMobile)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Todo List */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-[380px]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
            <span>Admin Checklist</span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-bold">{todos.length} Active</span>
          </h4>

          {/* Add Todo Inline Form */}
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4 shrink-0">
            <input
              id="todo-add-input"
              type="text"
              placeholder="Add new task..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-xs text-white focus:border-indigo-400 outline-none"
            />
            <button
              id="todo-add-btn"
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors cursor-pointer"
              title="Add task"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Todo list records */}
          <div id="todo-records" className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-0">
            {todos.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-10">No items left to do!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  id={`todo-card-${todo.id}`}
                  className={`flex items-start gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-900/30 transition-all ${
                    todo.completed ? 'opacity-50' : ''
                  }`}
                >
                  <button
                    id={`todo-toggle-${todo.id}`}
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer mt-0.5 transition-colors ${
                      todo.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500 hover:border-indigo-400'
                    }`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <p className={`text-xs font-medium text-slate-200 leading-tight ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans">{todo.date}</p>
                  </div>

                  <button
                    id={`todo-delete-${todo.id}`}
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Products & Recent Transactions Grid */}
      <div id="admin-secondary-metrics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Popular Products</h4>
          <div className="divide-y divide-slate-700/50">
            {products.slice(0, 4).map((p, index) => (
              <div key={p.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-slate-500 w-4">#{index + 1}</span>
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-xs p-1 shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-lg">👕</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.category}</p>
                </div>
                <p className="text-xs font-bold text-indigo-400 shrink-0">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Transactions</h4>
          <div className="divide-y divide-slate-700/50">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">Order #{o.id.substr(0, 8)}</p>
                  <p className="text-[10px] text-slate-400">{o.address.name} • {o.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-indigo-400">${o.total.toFixed(2)}</p>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
