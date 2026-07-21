import React, { useState, useMemo } from 'react';
import { X, Search, Activity, User, Monitor, Smartphone, Globe, Clock, SlidersHorizontal, RefreshCw, Download, Scan, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { CameraScannerModal } from './CameraScannerModal';
import { Product } from '../types';

export interface UserActivityLog {
  id: string;
  timestamp: string;
  userEmail: string;
  type: 'search' | 'voice' | 'scan' | 'cart' | 'view_details' | 'theme' | 'checkout';
  description: string;
  details: string;
  device: 'Desktop' | 'Mobile' | 'Tablet' | 'Industrial Terminal';
  ip?: string;
}

interface CustomerActivityTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: UserActivityLog[];
  onClearActivities: () => void;
  theme: 'day' | 'night' | 'cyberpunk';
  onLogActivity?: (
    type: 'search' | 'voice' | 'scan' | 'cart' | 'view_details' | 'theme' | 'checkout',
    description: string,
    details: string
  ) => void;
  products: Product[];
}

export const CustomerActivityTrackerModal: React.FC<CustomerActivityTrackerModalProps> = ({
  isOpen,
  onClose,
  activities,
  onClearActivities,
  theme,
  onLogActivity,
  products = [],
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  // Framer Motion Staggered Entry Variants
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      x: -15,
      transition: { duration: 0.15 }
    }
  };

  // Barcode / QR Scanner Simulator state
  const [isScanSimulatorOpen, setIsScanSimulatorOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [customBarcode, setCustomBarcode] = useState('');
  const [isLaserAnimating, setIsLaserAnimating] = useState(false);

  const simulatedBarcodes = [
    { code: 'BARCODE-SD-AZ8291', name: '🔧 Excavator Hydraulic Piston Unit (SD-AZ-HEAVY)', category: 'Maintenance' },
    { code: 'BARCODE-SD-RIG7812', name: '⚙️ Diamond Carbide Coupling (SD-DR-RIG)', category: 'Maintenance' },
    { code: 'BARCODE-SD-TI-BITS40', name: '💎 Titanium Core Drill Bits Set (Box of 40)', category: 'Restock' },
    { code: 'BARCODE-SD-DOZER-TRACK', name: '🚜 Reinforced Crawler Link (Dozer Unit 4)', category: 'Maintenance' },
    { code: 'BARCODE-SD-PARTS991', name: '📦 High-Strength Carbon Fiber Drive Belt', category: 'Logistics' },
  ];

  const handleSimulateScan = (code: string, label: string) => {
    setIsLaserAnimating(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsLaserAnimating(false);
      setScannedResult(`Success: Registered "${label}" (${code})`);
      if (onLogActivity) {
        onLogActivity(
          'scan',
          'Physical Barcode Audited',
          `Scanned physical inventory component for security audit. Decoded: "${label}" (ID: ${code}). Status: LOGGED.`
        );
      }
    }, 1000);
  };

  const handleExportToCSV = () => {
    const headers = ['ID', 'Timestamp', 'User Email', 'Type', 'Description', 'Details', 'Device', 'IP'];
    const rows = processedActivities.map(log => [
      log.id,
      log.timestamp,
      log.userEmail,
      log.type,
      log.description.replace(/"/g, '""'),
      log.details.replace(/"/g, '""'),
      log.device,
      log.ip || '127.0.0.1'
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shandong_azum_telemetry_logs_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered and sorted activities
  const processedActivities = useMemo(() => {
    let result = [...activities];

    if (filterType !== 'all') {
      result = result.filter(a => a.type === filterType);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        a =>
          a.description.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q) ||
          a.userEmail.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return result;
  }, [activities, filterType, searchTerm, sortBy]);

  // Chart data: count by activity type
  const typeChartData = useMemo(() => {
    const counts: Record<string, number> = {
      search: 0,
      voice: 0,
      scan: 0,
      cart: 0,
      view_details: 0,
      theme: 0,
      checkout: 0,
    };

    activities.forEach(a => {
      if (counts[a.type] !== undefined) {
        counts[a.type]++;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.toUpperCase().replace('_', ' '),
      value,
    }));
  }, [activities]);

  // Chart data: count by device type
  const deviceChartData = useMemo(() => {
    const counts: Record<string, number> = {
      Desktop: 0,
      Mobile: 0,
      Tablet: 0,
      'Industrial Terminal': 0,
    };

    activities.forEach(a => {
      if (counts[a.device] !== undefined) {
        counts[a.device]++;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [activities]);

  // Theme-specific colors
  const colors = {
    search: '#3B82F6',
    voice: '#10B981',
    scan: '#06B6D4',
    cart: '#F59E0B',
    view_details: '#8B5CF6',
    theme: '#EC4899',
    checkout: '#EF4444',
  };

  const getLogTypeBadge = (type: string) => {
    const styleMap: Record<string, { bg: string; text: string; label: string }> = {
      search: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', label: '🔍 SEARCH' },
      voice: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', label: '🎙️ VOICE' },
      scan: { bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400', label: '📷 QR SCAN' },
      cart: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', label: '🛒 CART' },
      view_details: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', label: '⚙️ VIEW' },
      theme: { bg: 'bg-pink-500/10 border-pink-500/30', text: 'text-pink-400', label: '🎨 STYLE' },
      checkout: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', label: '💳 CHECKOUT' },
    };

    const style = styleMap[type] || { bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400', label: 'LOG' };
    return (
      <span className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-black tracking-wider ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden border relative flex flex-col font-sans shadow-[0_0_60px_rgba(0,0,0,0.85)] ${
          theme === 'day'
            ? 'bg-white border-slate-200 text-slate-800'
            : theme === 'night'
              ? 'bg-slate-950 border-slate-850 text-slate-100'
              : 'bg-black border-pink-500/40 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                Customer Activity Tracker
                <span className="px-2 py-0.5 bg-indigo-500/20 text-[10px] text-indigo-300 rounded-full font-black font-sans">
                  LIVE SYSTEM
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Operator Console: Session Telemetry & Human-in-the-Loop Logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800/30 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Area (Scrollable body) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Analytics Dashboard Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Summary Stat Cards */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total Recorded Actions</span>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2">
                <span className={`text-3xl font-black font-mono tracking-tight ${
                  theme === 'day' ? 'text-slate-900' : 'text-white'
                }`}>{activities.length}</span>
                <p className="text-[10px] text-slate-400 mt-1">Telemetry buffer actively recording clicks, inputs, and voice sweeps</p>
              </div>
            </div>

            {/* Recharts Chart 1: Activity Category Share */}
            <div className={`p-4 rounded-2xl border flex flex-col h-[160px] ${
              theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Activities by Classification</span>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeChartData.filter(d => d.value > 0)}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '9px', color: '#fff' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {typeChartData.map((entry, index) => {
                        const typeKey = entry.name.toLowerCase().replace(' ', '_');
                        const barColor = colors[typeKey as keyof typeof colors] || '#6366f1';
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Chart 2: Client Device Distribution */}
            <div className={`p-4 rounded-2xl border flex flex-col h-[160px] ${
              theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Operator Device Profiler</span>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceChartData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#10b981', '#06b6d4'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '9px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Controls Bar: Filters, Search, Scan Code, Export CSV, Clear */}
          <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
            theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/20 border-slate-800/80'
          }`}>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> Filter Log:
                </span>
                <select
                  id="log-category-filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 outline-none cursor-pointer focus:border-indigo-500 font-mono"
                >
                  <option value="all">📂 ALL CLASSIFICATIONS</option>
                  <option value="checkout">💳 CHECKOUTS ONLY</option>
                  <option value="search">🔍 SEARCH QUERIES ONLY</option>
                  <option value="voice">🎙️ VOICE DECODES ONLY</option>
                  <option value="scan">📷 BARCODE / QR SCANS ONLY</option>
                  <option value="cart">🛒 SHOPPING CARTS ONLY</option>
                  <option value="view_details">⚙️ VIEW DETAILS ONLY</option>
                  <option value="theme">🎨 STYLE/THEMES ONLY</option>
                </select>
              </div>

              {/* Search box for activities */}
              <div className="relative flex-1 sm:w-64 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query telemetry log info..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Scan Code Button */}
              <button
                id="modal-scan-barcode-btn"
                type="button"
                onClick={() => {
                  setScannedResult(null);
                  setIsScanSimulatorOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                title="Scan physical barcodes or QR codes directly into log history"
              >
                <Scan className="w-4 h-4 text-indigo-200" />
                <span>Scan Code</span>
              </button>

              {/* Export CSV Button */}
              <button
                id="modal-export-csv-btn"
                type="button"
                onClick={handleExportToCSV}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                title="Export current filtered log data to a downloadable CSV file"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Export CSV</span>
              </button>

              {/* Reset logs */}
              <button
                onClick={onClearActivities}
                className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 rounded-xl text-rose-400 hover:text-rose-300 transition-colors cursor-pointer shrink-0"
                title="Flush and reset trace logs buffer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Activities List / Table */}
          <div className={`border rounded-2xl overflow-hidden ${
            theme === 'day' ? 'bg-slate-50/40 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className={`max-h-[350px] overflow-y-auto divide-y ${
              theme === 'day' ? 'divide-slate-200' : 'divide-slate-800/60'
            }`}>
              {processedActivities.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 font-mono text-center">
                  <Activity className="w-8 h-8 mb-2 animate-pulse text-indigo-400/50" />
                  <p className="text-xs">Zero trace-back logs registered matching filter</p>
                  <p className="text-[10px] text-slate-600 mt-1">Execute a scan, search, or add-to-cart to view real-time feedback</p>
                </div>
              ) : (
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`divide-y w-full ${
                    theme === 'day' ? 'divide-slate-200' : 'divide-slate-800/60'
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {processedActivities.map((log) => (
                      <motion.div
                        key={log.id}
                        variants={listItemVariants}
                        layout
                        className={`p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-900/10 dark:hover:bg-slate-900/20 transition-colors border-b last:border-0 ${
                          theme === 'day' ? 'border-slate-200' : 'border-slate-800/60'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          {/* Device Icon */}
                          <div className={`p-2 rounded-xl shrink-0 mt-0.5 border ${
                            theme === 'day' 
                              ? 'bg-white border-slate-200 text-slate-500' 
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}>
                            {log.device === 'Mobile' ? (
                              <Smartphone className="w-4 h-4 text-cyan-400" />
                            ) : log.device === 'Industrial Terminal' ? (
                              <Activity className="w-4 h-4 text-pink-400" />
                            ) : (
                              <Monitor className="w-4 h-4 text-indigo-400" />
                            )}
                          </div>

                          {/* Log details */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-black ${
                                theme === 'day' ? 'text-slate-800' : 'text-slate-100'
                              }`}>{log.description}</span>
                              {getLogTypeBadge(log.type)}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-mono">{log.details}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {log.userEmail}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" /> IP: {log.ip || '127.0.0.1'}
                              </span>
                              <span>•</span>
                              <span>Device: {log.device}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right shrink-0 md:self-center">
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 rounded px-2 py-1 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="block text-[8px] font-mono text-slate-600 mt-1">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-slate-500 font-mono text-[10px]">
          <div>
            SHANDONG AZUM SYSTEM SECURITY TELEMETRY GATEWAY v2.80
          </div>
          <div>
            ACTIVE BUFFER: {activities.length} RECORDS
          </div>
        </div>

        {/* BARCODE / QR SCANNER SIMULATOR PANEL */}
        <AnimatePresence>
          {isScanSimulatorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden"
              >
                {/* Red animated laser scanning line */}
                {isLaserAnimating && (
                  <motion.div
                    animate={{
                      top: ['10%', '90%', '10%'],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_#f43f5e] z-10"
                  />
                )}

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h4 className="text-sm font-black font-mono uppercase tracking-wider text-white">
                      Physical Scanner Console
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsScanSimulatorOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  Perform secure physical component auditing. Point device at Shandong Azum machinery tags, or trigger instant diagnostic telemetry logging.
                </p>

                {/* Laser scan window simulator */}
                <div className="relative border-2 border-indigo-500/20 rounded-2xl bg-black/50 h-32 flex items-center justify-center overflow-hidden mb-5">
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
                  
                  {isLaserAnimating ? (
                    <div className="text-center font-mono text-[10px] text-indigo-400 tracking-widest animate-pulse">
                      ⚡ EMITTING COHERENT LASER SWEEP...
                    </div>
                  ) : scannedResult ? (
                    <div className="text-center font-mono px-4">
                      <div className="text-[10px] text-emerald-400 font-bold mb-1">✔ TRACE LOGGED SUCCESSFULLY</div>
                      <div className="text-[11px] text-slate-300 break-all">{scannedResult}</div>
                    </div>
                  ) : (
                    <div className="text-center font-mono text-[10px] text-slate-500">
                      [ SCANNER READY - AIM AT AZUM BARCODE TAG ]
                    </div>
                  )}
                </div>

                {/* Simulated physical barcodes buttons */}
                <div className="space-y-2 mb-4">
                  <span className="text-[9px] font-mono font-black tracking-wider text-slate-500 uppercase">
                    Physical Industrial Barcode Tags:
                  </span>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                    {simulatedBarcodes.map((tag) => (
                      <button
                        key={tag.code}
                        disabled={isLaserAnimating}
                        onClick={() => handleSimulateScan(tag.code, tag.name)}
                        className="w-full text-left p-2.5 bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition-all flex items-center justify-between text-xs font-mono group disabled:opacity-50"
                      >
                        <div className="truncate pr-2">
                          <div className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                            {tag.name}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono font-semibold">{tag.code}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-black text-indigo-400 shrink-0">
                          SCAN TAG
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Barcode Registration */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <span className="text-[9px] font-mono font-black tracking-wider text-slate-500 uppercase block">
                    Custom Alphanumeric Audit Input:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BARCODE-SD-GENERATOR-X"
                      value={customBarcode}
                      onChange={(e) => setCustomBarcode(e.target.value)}
                      disabled={isLaserAnimating}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-500 text-white font-mono disabled:opacity-50"
                    />
                    <button
                      onClick={() => {
                        if (customBarcode.trim()) {
                          handleSimulateScan(customBarcode.trim().toUpperCase(), `Custom Tag ID: ${customBarcode.trim()}`);
                          setCustomBarcode('');
                        }
                      }}
                      disabled={isLaserAnimating || !customBarcode.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl font-mono cursor-pointer transition-colors"
                    >
                      Audit
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button (FAB) for CameraScannerModal */}
        <div className="absolute bottom-6 right-6 z-40">
          <button
            id="activities-modal-camera-scan-fab"
            type="button"
            onClick={() => setIsCameraScannerOpen(true)}
            className="p-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border border-cyan-400/30 cursor-pointer"
            title="Scan physical inventory codes via Camera"
          >
            <QrCode className="w-6 h-6 animate-pulse text-white" />
          </button>
        </div>

        {/* CAMERA SCANNER MODAL INTEGRATION */}
        <AnimatePresence>
          {isCameraScannerOpen && (
            <CameraScannerModal
              isOpen={isCameraScannerOpen}
              onClose={() => setIsCameraScannerOpen(false)}
              products={products}
              onScanSuccess={(productId) => {
                const matchedProduct = products.find(p => p.id === productId);
                const prodName = matchedProduct ? matchedProduct.name : `Product ID: ${productId}`;
                if (onLogActivity) {
                  onLogActivity(
                    'scan',
                    'Physical Barcode Audited via Webcam',
                    `Webcam scanner decoded physical barcode. Matched with inventory record: "${prodName}" (ID: ${productId}). Status: MATCHED & LOGGED.`
                  );
                }
              }}
              theme={theme}
            />
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
