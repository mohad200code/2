/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  Trash2,
  Copy,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { User as UserType } from '../types';

interface AdminUsersProps {
  users: UserType[];
  onDeleteUsers: (ids: string[]) => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onDeleteUsers, onToast }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'email' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Active User Detail Screen
  const [activeUserDetail, setActiveUserDetail] = useState<UserType | null>(null);

  // Active Row Actions Dropdown
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Filter & Search users
  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (sortField === 'email') {
      result = [...result].sort((a, b) => {
        const valA = a.email.toLowerCase();
        const valB = b.email.toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, search, sortField, sortDirection]);

  // Paginated chunk
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  // Multi-select actions
  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.has(u.id));

  const handleSelectAll = () => {
    const newSelected = new Set(selectedUserIds);
    if (isAllSelected) {
      paginatedUsers.forEach((u) => newSelected.delete(u.id));
    } else {
      paginatedUsers.forEach((u) => newSelected.add(u.id));
    }
    setSelectedUserIds(newSelected);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUserIds(newSelected);
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedUserIds);
    onDeleteUsers(ids);
    setSelectedUserIds(new Set());
    onToast('Selected user(s) deleted successfully!', 'success');
  };

  const handleSortEmail = () => {
    if (sortField === 'email') {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField('email');
      setSortDirection('asc');
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    onToast(`User ID copied to clipboard: ${id}`, 'success');
    setActiveRowId(null);
  };

  // Matthew Scott activity mock data
  const scottActivity = [
    { name: 'Mon', Mobile: 30, Desktop: 55 },
    { name: 'Tue', Mobile: 45, Desktop: 60 },
    { name: 'Wed', Mobile: 25, Desktop: 85 },
    { name: 'Thu', Mobile: 65, Desktop: 40 },
    { name: 'Fri', Mobile: 50, Desktop: 95 },
    { name: 'Sat', Mobile: 80, Desktop: 110 },
    { name: 'Sun', Mobile: 70, Desktop: 90 },
  ];

  if (activeUserDetail) {
    const u = activeUserDetail;
    return (
      <div id="user-details-screen" className="space-y-6 font-sans text-white">
        {/* Back header */}
        <button
          onClick={() => setActiveUserDetail(null)}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to customer list</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matthew Profile card */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
            <div className="text-center space-y-4">
              <img
                src={u.avatar}
                alt={u.username}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-700 shadow-md"
              />
              <div>
                <h3 id="detail-username" className="text-xl font-bold">{u.username}</h3>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 inline-block">
                  {u.role}
                </span>
              </div>
            </div>

            {/* Completion Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Profile Completion</span>
                <span className="text-indigo-400">72%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            {/* Profile Fields list */}
            <div className="space-y-4 text-xs font-sans divide-y divide-slate-700/50 pt-2">
              <div className="flex justify-between py-2.5 first:pt-0">
                <span className="text-slate-400">Email:</span>
                <span id="detail-email" className="font-bold">{u.email}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Phone:</span>
                <span id="detail-phone" className="font-bold">{u.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Status:</span>
                <span id="detail-status" className={`font-bold uppercase tracking-wider text-[10px] ${u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {u.status}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400">Join Date:</span>
                <span id="detail-joined" className="font-bold">{u.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Activity detailed chart */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl lg:col-span-2 flex flex-col h-[400px]">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Customer Activity Tracker</span>
              <span className="text-[10px] text-slate-500">Desktop vs Mobile sessions (mins)</span>
            </h4>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scottActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="detailDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="detailMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#fff' }} />
                  <Area type="monotone" dataKey="Desktop" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#detailDesktop)" />
                  <Area type="monotone" dataKey="Mobile" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#detailMobile)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-users-panel" className="space-y-4 font-sans text-white">
      {/* Search & Actions control panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="user-search-input"
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-400 outline-none"
          />
        </div>

        {/* Sliding red delete button */}
        {selectedUserIds.size > 0 && (
          <button
            id="bulk-delete-users-btn"
            onClick={handleBulkDelete}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete User(s) ({selectedUserIds.size})</span>
          </button>
        )}
      </div>

      {/* Users table */}
      <div id="users-table-card" className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700/50 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-4 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4.5 h-4.5 accent-indigo-600 rounded cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 w-16">Avatar</th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={handleSortEmail}>
                  <div className="flex items-center gap-1.5">
                    <span>Email</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-slate-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center italic text-slate-500">
                    No users matched your search terms.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const isChecked = selectedUserIds.has(u.id);
                  return (
                    <tr
                      key={u.id}
                      id={`user-row-${u.id}`}
                      className={`hover:bg-slate-700/20 transition-colors ${isChecked ? 'bg-indigo-900/10' : ''}`}
                    >
                      <td className="py-4 px-6 text-center">
                        <input
                          id={`row-checkbox-${u.id}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(u.id)}
                          className="w-4.5 h-4.5 accent-indigo-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <img
                          src={u.avatar}
                          alt={u.username}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <p id={`username-txt-${u.id}`} className="font-bold text-slate-200">{u.username}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        <span id={`email-txt-${u.id}`}>{u.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          id={`status-badge-${u.id}`}
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            u.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center relative">
                        <button
                          id={`actions-menu-btn-${u.id}`}
                          onClick={() => setActiveRowId(activeRowId === u.id ? null : u.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>

                        {/* Dropdown Options */}
                        {activeRowId === u.id && (
                          <div
                            id={`actions-dropdown-${u.id}`}
                            className="absolute right-6 top-10 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 py-1.5 text-left font-sans"
                          >
                            <button
                              id={`action-copy-${u.id}`}
                              onClick={() => handleCopyId(u.id)}
                              className="w-full px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </button>
                            <button
                              id={`action-view-${u.id}`}
                              onClick={() => {
                                setActiveUserDetail(u);
                                setActiveRowId(null);
                              }}
                              className="w-full px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>View customer details</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination indicators footer */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-700/30 flex items-center justify-between text-slate-400">
          <p id="pagination-info" className="text-xs font-medium">
            Showing Page <span className="font-bold text-slate-200">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-200">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              id="pagination-prev"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              id="pagination-next"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
