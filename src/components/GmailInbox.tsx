/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Star, Clock, Send, File, ChevronLeft, ArrowLeft, Trash2, Printer, ExternalLink, Inbox } from 'lucide-react';
import { Order } from '../types';

interface GmailInboxProps {
  latestOrder: Order | null;
  onViewOrders: () => void;
}

export const GmailInbox: React.FC<GmailInboxProps> = ({ latestOrder, onViewOrders }) => {
  // Use a fallback order if none exists yet
  const displayOrder: Order = latestOrder || {
    id: '68d2b69243332b9cfabb2bdb',
    total: 166.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Under Armour StormFleece', quantity: 1, size: 'M', color: 'orange', price: 49.00 },
      { name: 'Nike Dri Flex T-Shirt', quantity: 3, size: 'XL', color: 'pink', price: 39.00 }
    ],
    address: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City'
    }
  };

  const formattedTotal = displayOrder.total.toFixed(2);

  return (
    <div id="gmail-container" className="flex bg-[#F6F8FC] border border-slate-200 rounded-3xl overflow-hidden min-h-[600px] shadow-lg text-slate-800">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#F6F8FC] p-4 flex flex-col gap-2 border-r border-slate-200">
        <button className="flex items-center gap-3 bg-[#C2E7FF] hover:bg-[#B3DBF7] text-[#001D35] px-6 py-4 rounded-2xl shadow-sm text-sm font-bold w-40 transition-colors cursor-pointer mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Compose
        </button>

        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center justify-between px-4 py-2 bg-[#E8F0FE] text-[#1A73E8] font-bold rounded-full text-xs cursor-pointer">
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className="bg-[#1A73E8] text-white px-1.5 py-0.5 rounded-full text-[10px]">1</span>
          </button>
          {[
            { label: 'Starred', icon: <Star className="w-4 h-4" /> },
            { label: 'Snoozed', icon: <Clock className="w-4 h-4" /> },
            { label: 'Sent', icon: <Send className="w-4 h-4" /> },
            { label: 'Drafts', icon: <File className="w-4 h-4" /> }
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-200 text-slate-600 rounded-full text-xs text-left cursor-pointer transition-colors">
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Mail Viewer */}
      <main className="flex-1 bg-white flex flex-col">
        {/* Gmail Control bar */}
        <header className="h-14 border-b border-slate-200 px-6 flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-4">
            <button onClick={onViewOrders} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer" title="Back to Orders">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="p-2 hover:bg-slate-100 rounded-full" title="Delete email"><Trash2 className="w-4.5 h-4.5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full" title="Mark unread"><Mail className="w-4.5 h-4.5" /></button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full"><Printer className="w-4.5 h-4.5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><ExternalLink className="w-4.5 h-4.5" /></button>
          </div>
        </header>

        {/* Email Header Subject */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h1 id="email-subject" className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Order Created
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium font-sans">Inbox x</span>
            </h1>
          </div>
        </div>

        {/* Sender details */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#001D35] text-[#C2E7FF] rounded-full flex items-center justify-center font-bold">
              T
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                test lama <span className="text-xs text-slate-500 font-normal ml-1">&lt;lamadevtest@gmail.com&gt;</span>
              </p>
              <p className="text-xs text-slate-500">to me</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">4:58 PM (10 minutes ago)</p>
        </div>

        {/* Email Message Body */}
        <div id="email-message-body" className="px-16 py-4 flex-1 overflow-y-auto max-w-2xl">
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 space-y-6 shadow-sm">
            {/* Branding Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-lg font-black tracking-tight text-slate-900">TRENDLAMA.</span>
              <span className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">Order Confirmation</span>
            </div>

            <p id="email-body-greeting" className="text-base font-bold text-slate-900">
              Your order has been created successfully.
            </p>

            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Amount:</span>
                <span id="email-body-amount" className="font-bold text-slate-900 text-base">${formattedTotal}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span id="email-body-status" className="font-bold text-emerald-600 uppercase tracking-wider text-xs">
                  {displayOrder.status}
                </span>
              </div>
              <div className="flex justify-between items-start py-2 border-b border-slate-100">
                <span className="text-slate-500 shrink-0">Address:</span>
                <span id="email-body-address" className="font-bold text-slate-900 text-right">
                  {displayOrder.address.address}, {displayOrder.address.city}
                </span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                id="email-view-orders-btn"
                onClick={onViewOrders}
                className="inline-block px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View your orders
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
