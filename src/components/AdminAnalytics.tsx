import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Package,
  Award,
  Search,
  ArrowUpDown,
  ShoppingBag,
  PieChart as LucidePieChart,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAnalyticsProps {
  products: Product[];
  theme: 'day' | 'night' | 'cyberpunk';
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ products, theme }) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'categories' | 'price-audit'>('individual');
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'sales-desc' | 'sales-asc' | 'revenue-desc' | 'name-asc'>('sales-desc');

  // Price audit report highlighting products whose price deviates by more than 20% from their category average.
  const priceAuditReport = useMemo(() => {
    // 1. Calculate sum and count for each category
    const categoryTotals: { [key: string]: { total: number; count: number } } = {};
    products.forEach((p) => {
      if (!categoryTotals[p.category]) {
        categoryTotals[p.category] = { total: 0, count: 0 };
      }
      categoryTotals[p.category].total += p.price;
      categoryTotals[p.category].count += 1;
    });

    // 2. Calculate average for each category
    const categoryAverages: { [key: string]: number } = {};
    Object.entries(categoryTotals).forEach(([cat, data]) => {
      categoryAverages[cat] = data.total / data.count;
    });

    // 3. Find products deviating by more than 20%
    const flaggedProducts = products
      .map((p) => {
        const avg = categoryAverages[p.category] || 1;
        const deviation = ((p.price - avg) / avg) * 100;
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          categoryAverage: avg,
          deviation,
          isHigh: deviation > 20,
          isLow: deviation < -20,
          absDeviation: Math.abs(deviation),
        };
      })
      .filter((p) => p.absDeviation > 20)
      .sort((a, b) => b.absDeviation - a.absDeviation);

    return {
      categoryAverages,
      flaggedProducts,
      totalAudited: products.length,
    };
  }, [products]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Aggregate stats across all products
  const stats = useMemo(() => {
    let totalSales = 0;
    let totalRevenue = 0;
    let topProduct: Product | null = null;
    let maxSales = -1;

    products.forEach((p) => {
      const sales = p.salesCount || 0;
      const rev = sales * p.price;
      totalSales += sales;
      totalRevenue += rev;

      if (sales > maxSales) {
        maxSales = sales;
        topProduct = p;
      }
    });

    return {
      totalSales,
      totalRevenue,
      topProduct,
      activeSkus: products.length
    };
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.map((p) => ({
      ...p,
      salesCount: p.salesCount || 0,
      revenue: (p.salesCount || 0) * p.price,
    }));

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'sales-desc') return b.salesCount - a.salesCount;
      if (sortBy === 'sales-asc') return a.salesCount - b.salesCount;
      if (sortBy === 'revenue-desc') return b.revenue - a.revenue;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Max sales count in filtered products for calculating percentage relative to best
  const maxFilteredSales = useMemo(() => {
    if (filteredAndSortedProducts.length === 0) return 1;
    return Math.max(...filteredAndSortedProducts.map((p) => p.salesCount), 1);
  }, [filteredAndSortedProducts]);

  // Recharts chart data format
  const chartData = useMemo(() => {
    // Limit to top 15 products for readability on the bar chart
    return filteredAndSortedProducts.slice(0, 15).map((p) => ({
      name: p.name.length > 18 ? p.name.substring(0, 16) + '...' : p.name,
      fullName: p.name,
      sales: p.salesCount,
      revenue: p.revenue,
      category: p.category
    }));
  }, [filteredAndSortedProducts]);

  // Category sales volume distribution data
  const categoryData = useMemo(() => {
    const dataMap: { [key: string]: { value: number; revenue: number; skus: number } } = {};
    
    products.forEach((p) => {
      const sales = p.salesCount || 0;
      const rev = sales * p.price;
      if (!dataMap[p.category]) {
        dataMap[p.category] = { value: 0, revenue: 0, skus: 0 };
      }
      dataMap[p.category].value += sales;
      dataMap[p.category].revenue += rev;
      dataMap[p.category].skus += 1;
    });

    const totalSalesVolume = Object.values(dataMap).reduce((sum, item) => sum + item.value, 0) || 1;

    return Object.entries(dataMap).map(([name, item]) => ({
      name,
      value: item.value,
      revenue: item.revenue,
      skus: item.skus,
      percentage: Math.round((item.value / totalSalesVolume) * 100),
    })).sort((a, b) => b.value - a.value);
  }, [products]);

  // Premium dynamic color palette for Pie Chart slices based on theme
  const pieColors = useMemo(() => {
    if (theme === 'cyberpunk') {
      return ['#ec4899', '#00f0ff', '#10b981', '#a855f7', '#f59e0b', '#3b82f6', '#ef4444'];
    }
    if (theme === 'night') {
      return ['#3b82f6', '#6366f1', '#00f0ff', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b'];
    }
    return ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b'];
  }, [theme]);

  // Theme color mapping
  const colors = {
    barFill: theme === 'day' ? '#4f46e5' : theme === 'cyberpunk' ? '#ec4899' : '#00f0ff',
    barGradientStop: theme === 'day' ? '#3b82f6' : theme === 'cyberpunk' ? '#f43f5e' : '#3b82f6',
    border: theme === 'day' ? 'border-slate-200' : 'border-slate-800/80',
    bgCard: theme === 'day' ? 'bg-white' : 'bg-slate-950/40 backdrop-blur-md',
    textMain: theme === 'day' ? 'text-slate-900' : 'text-slate-100',
    textSub: theme === 'day' ? 'text-slate-500' : 'text-slate-400',
    gridLines: theme === 'day' ? '#f1f5f9' : '#1e293b'
  };

  return (
    <div id="analytics" className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Top Product Card */}
        <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-2`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold font-mono tracking-widest uppercase ${colors.textSub}`}>
              🏆 Top Seller Machinery
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          {stats.topProduct ? (
            <div>
              <h4 className={`text-base font-black truncate ${colors.textMain}`}>
                {stats.topProduct.name}
              </h4>
              <p className="text-xs font-mono text-indigo-400 font-bold mt-1">
                {(stats.topProduct.salesCount || 0).toLocaleString()} Units Shipped
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No sales recorded</p>
          )}
        </div>

        {/* Total Shipped Volume */}
        <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-2`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold font-mono tracking-widest uppercase ${colors.textSub}`}>
              📦 Shipped Volume
            </span>
            <Package className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <h4 className={`text-2xl font-black font-mono ${colors.textMain}`}>
              {stats.totalSales.toLocaleString()}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Aggregate units across catalog</p>
          </div>
        </div>

        {/* Aggregate Sales Revenue */}
        <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-2`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold font-mono tracking-widest uppercase ${colors.textSub}`}>
              💵 Pipeline Revenue
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className={`text-2xl font-black font-mono text-emerald-400`}>
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Simulated valuation from orders</p>
          </div>
        </div>

        {/* Active Catalog SKUs */}
        <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-2`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold font-mono tracking-widest uppercase ${colors.textSub}`}>
              ⚙️ Tracked Catalog Items
            </span>
            <TrendingUp className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <h4 className={`text-2xl font-black font-mono ${colors.textMain}`}>
              {stats.activeSkus}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Active heavy machinery models</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher: Individual Products vs Category Distribution */}
      <div className="flex border-b border-slate-800/60 gap-6">
        <button
          onClick={() => setActiveTab('individual')}
          className={`pb-3 text-xs uppercase font-mono font-bold tracking-wider relative transition-all cursor-pointer ${
            activeTab === 'individual'
              ? (theme === 'day' ? 'text-indigo-600' : theme === 'cyberpunk' ? 'text-pink-500' : 'text-[#00f0ff]')
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Individual Machinery Demand</span>
          </div>
          {activeTab === 'individual' && (
            <motion.div
              layoutId="activeAnalyticsTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === 'day' ? 'bg-indigo-600' : theme === 'cyberpunk' ? 'bg-pink-500' : 'bg-[#00f0ff]'
              }`}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-xs uppercase font-mono font-bold tracking-wider relative transition-all cursor-pointer ${
            activeTab === 'categories'
              ? (theme === 'day' ? 'text-indigo-600' : theme === 'cyberpunk' ? 'text-pink-500' : 'text-[#00f0ff]')
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <LucidePieChart className="w-4 h-4" />
            <span>Category Distribution</span>
          </div>
          {activeTab === 'categories' && (
            <motion.div
              layoutId="activeAnalyticsTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === 'day' ? 'bg-indigo-600' : theme === 'cyberpunk' ? 'bg-pink-500' : 'bg-[#00f0ff]'
              }`}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('price-audit')}
          className={`pb-3 text-xs uppercase font-mono font-bold tracking-wider relative transition-all cursor-pointer ${
            activeTab === 'price-audit'
              ? (theme === 'day' ? 'text-indigo-600' : theme === 'cyberpunk' ? 'text-pink-500' : 'text-[#00f0ff]')
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Price Audit Report</span>
          </div>
          {activeTab === 'price-audit' && (
            <motion.div
              layoutId="activeAnalyticsTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === 'day' ? 'bg-indigo-600' : theme === 'cyberpunk' ? 'bg-pink-500' : 'bg-[#00f0ff]'
              }`}
            />
          )}
        </button>
      </div>

      {/* Control Panel and Individual views wrapped in activeTab conditional */}
      {activeTab === 'individual' && (
        <>
          {/* Control Panel: Search & Filter bar */}
          <div className={`p-4 rounded-2xl border ${colors.border} ${colors.bgCard} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by machinery name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl font-mono border transition-all outline-none ${
                    theme === 'day'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-[#00f0ff] focus:bg-slate-950'
                  }`}
                />
              </div>

              {/* Category Selector */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-2 pr-8 text-xs rounded-xl font-mono border transition-all outline-none cursor-pointer appearance-none ${
                    theme === 'day'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-[#00f0ff]'
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Classifications' : cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[8px]">▼</div>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold ${colors.textSub}`}>Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-3 py-2 pr-8 text-xs rounded-xl font-mono border transition-all outline-none cursor-pointer appearance-none ${
                    theme === 'day'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-[#00f0ff]'
                  }`}
                >
                  <option value="sales-desc">Sales Count (High to Low)</option>
                  <option value="sales-asc">Sales Count (Low to High)</option>
                  <option value="revenue-desc">Simulated Revenue (Highest)</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[8px]">▼</div>
              </div>
            </div>
          </div>

          {/* Main Bar Chart Panel */}
          <div className={`p-5 md:p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-6`}>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
                  Machinery Shipped Volume Audit (Top 15 Items)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Unit dispatch tracking index for operational demand forecasting
                </p>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="text-center py-16 space-y-3 font-mono">
                <p className="text-2xl">🔍</p>
                <p className="text-xs text-slate-500">No catalog products match current search parameters.</p>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.barFill} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={colors.barGradientStop} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colors.gridLines}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                      className="font-mono font-bold"
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      dx={-8}
                      className="font-mono"
                      tickFormatter={(val) => val.toLocaleString()}
                    />
                    <Tooltip
                      cursor={{ fill: theme === 'day' ? '#f8fafc' : '#0f172a', opacity: 0.4 }}
                      contentStyle={{
                        backgroundColor: theme === 'day' ? '#ffffff' : '#090a0f',
                        borderColor: theme === 'day' ? '#e2e8f0' : '#1e293b',
                        borderRadius: '16px',
                        color: theme === 'day' ? '#0f172a' : '#fff',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 space-y-2 border border-slate-800 rounded-xl bg-[#090a0f]/95 text-xs text-slate-200">
                              <p className="font-bold text-[#00f0ff] uppercase">{data.fullName}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] pt-1 border-t border-slate-800/80">
                                <span className="text-slate-500">Category:</span>
                                <span className="text-right text-slate-300">{data.category}</span>
                                <span className="text-slate-500">Units Dispatched:</span>
                                <span className="text-right text-indigo-400 font-bold">{data.sales.toLocaleString()}</span>
                                <span className="text-slate-500">Pipe Revenue:</span>
                                <span className="text-right text-emerald-400 font-bold">${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          className="transition-all duration-300 cursor-pointer hover:opacity-100 opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Leaderboard Table Grid */}
          <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/40 pb-4">
              <div>
                <h3 className={`text-sm font-black uppercase tracking-widest font-mono flex items-center gap-2 ${colors.textMain}`}>
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                  High-Performing Inventory Leaderboard
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Ranked list of products sorted by sales volumes and simulated revenue
                </p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-mono font-bold self-start sm:self-center">
                {filteredAndSortedProducts.length} Items Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="p-3 w-12 text-center">Rank</th>
                    <th className="p-3">Machinery Model</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3 text-center">Units Sold</th>
                    <th className="p-3 text-right">Est. Revenue</th>
                    <th className="p-3 w-40 text-right">Sales Share</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((p, idx) => {
                    const percentage = Math.round((p.salesCount / maxFilteredSales) * 100);
                    
                    // Rank Styling
                    let rankBadge = `${idx + 1}`;
                    if (idx === 0) rankBadge = '🥇';
                    else if (idx === 1) rankBadge = '🥈';
                    else if (idx === 2) rankBadge = '🥉';

                    return (
                      <tr key={p.id} className="border-b border-slate-900 hover:bg-slate-900/20 transition-colors">
                        <td className="p-3 text-center font-bold font-mono">
                          <span className={idx < 3 ? 'text-base' : 'text-slate-400 text-xs'}>
                            {rankBadge}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-800 p-0.5">
                                <img src={p.image} className="w-full h-full object-cover rounded" alt={p.name} referrerPolicy="no-referrer" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 border border-slate-800 font-bold text-slate-500 font-mono text-[9px]">
                                N/A
                              </div>
                            )}
                            <div>
                              <div className={`font-bold ${colors.textMain} text-xs`}>{p.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">SKU ID: {p.id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{p.category}</td>
                        <td className="p-3 font-mono text-slate-300">${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center font-bold font-mono text-indigo-400">
                          {p.salesCount.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-black font-mono text-emerald-400">
                          ${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-24 bg-slate-900 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  idx === 0 
                                    ? 'bg-amber-400' 
                                    : idx === 1 
                                      ? 'bg-slate-300' 
                                      : idx === 2 
                                        ? 'bg-amber-700' 
                                        : 'bg-indigo-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 w-8 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        /* Dynamic Category Distribution Sub-view containing Interactive Pie Chart & Breakdown */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive Pie/Donut Chart Container */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg flex flex-col justify-between min-h-[460px]`}>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-widest font-mono flex items-center gap-2 ${colors.textMain}`}>
                  <LucidePieChart className="w-4 h-4 text-[#00f0ff]" />
                  Sales Volume Share
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Visual distribution of dispatched units by category classification
                </p>
              </div>

              {/* Centered Donut Chart with live indicators */}
              <div className="relative w-full h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="85%"
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={(_, index) => setHoveredCategoryIndex(index)}
                      onMouseLeave={() => setHoveredCategoryIndex(null)}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={pieColors[index % pieColors.length]} 
                          stroke={theme === 'day' ? '#fff' : '#090a0f'}
                          strokeWidth={hoveredCategoryIndex === index ? 3 : 1}
                          style={{
                            filter: hoveredCategoryIndex === index ? 'drop-shadow(0px 0px 8px rgba(0, 240, 255, 0.5))' : 'none',
                            transition: 'all 0.2s ease-in-out'
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 border border-slate-800 rounded-xl bg-[#090a0f]/95 text-xs text-slate-200 font-mono shadow-2xl">
                              <p className="font-bold text-[#00f0ff] uppercase">{data.name}</p>
                              <div className="space-y-1 pt-1.5 mt-1 border-t border-slate-800">
                                <p className="flex justify-between gap-4">
                                  <span className="text-slate-500">Units Sold:</span>
                                  <span className="text-indigo-400 font-bold">{data.value.toLocaleString()}</span>
                                </p>
                                <p className="flex justify-between gap-4">
                                  <span className="text-slate-500">Share %:</span>
                                  <span className="text-pink-500 font-bold">{data.percentage}%</span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Centered live readout */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className={`text-[9px] font-mono uppercase font-bold tracking-widest px-2 truncate max-w-[150px] ${colors.textSub}`}>
                    {hoveredCategoryIndex !== null ? categoryData[hoveredCategoryIndex].name : 'Aggregate Volume'}
                  </span>
                  <span className={`text-2xl font-black font-mono mt-0.5 ${colors.textMain}`}>
                    {hoveredCategoryIndex !== null 
                      ? categoryData[hoveredCategoryIndex].value.toLocaleString() 
                      : stats.totalSales.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
                    {hoveredCategoryIndex !== null 
                      ? `${categoryData[hoveredCategoryIndex].percentage}% share` 
                      : '100% Demand'}
                  </span>
                </div>
              </div>

              {/* Helper guide */}
              <p className="text-[9px] text-slate-500 font-mono text-center">
                Interactive segment tracking: Hover over the slices to project metrics.
              </p>
            </div>

            {/* List and breakdown cards */}
            <div className={`lg:col-span-7 p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg flex flex-col justify-between`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-widest font-mono ${colors.textMain}`}>
                      Machinery Classification Intelligence
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Operational performance aggregate indicators
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 rounded text-[9px] font-mono font-bold">
                    {categoryData.length} Portfolios
                  </span>
                </div>

                <div className="space-y-3">
                  {categoryData.map((cat, idx) => {
                    const isHovered = hoveredCategoryIndex === idx;
                    const rowColor = pieColors[idx % pieColors.length];
                    
                    return (
                      <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onMouseEnter={() => setHoveredCategoryIndex(idx)}
                        onMouseLeave={() => setHoveredCategoryIndex(null)}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          isHovered 
                            ? (theme === 'day' ? 'bg-slate-50 border-indigo-200 shadow-md scale-[1.01]' : 'bg-slate-900/60 border-slate-700/80 shadow-[0_0_15px_rgba(0,240,255,0.15)] scale-[1.01]')
                            : `border-slate-800/40 bg-black/10 hover:bg-black/20`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: rowColor }}
                            />
                            <span className={`text-xs font-bold font-mono ${isHovered ? (theme === 'day' ? 'text-indigo-600' : 'text-[#00f0ff]') : colors.textMain}`}>
                              {cat.name}
                            </span>
                          </div>
                          <span className={`text-xs font-black font-mono ${colors.textMain}`}>
                            {cat.value.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">Units</span>
                          </span>
                        </div>

                        {/* Custom visual progress track */}
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mb-2 border border-slate-800/60">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: rowColor }}
                          />
                        </div>

                        {/* Interactive analytical rows */}
                        <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-slate-500 pt-0.5">
                          <div>
                            <span className="block text-slate-600 uppercase text-[8px]">Sales Contribution</span>
                            <span className="font-bold text-slate-300">{cat.percentage}% of total</span>
                          </div>
                          <div>
                            <span className="block text-slate-600 uppercase text-[8px]">Active models</span>
                            <span className="font-bold text-slate-300">{cat.skus} SKUs</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-slate-600 uppercase text-[8px]">Est. Revenue</span>
                            <span className="font-bold text-emerald-400">${cat.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Automated actionable insight banner */}
              <div className={`mt-4 p-3 rounded-xl border border-dashed text-[10px] font-mono leading-relaxed ${
                theme === 'day' 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : 'bg-slate-950/20 border-slate-800 text-slate-400'
              }`}>
                <span className="font-bold text-amber-500 mr-1">💡 INSIGHT REPORT:</span>
                The primary category <strong className="text-white">{categoryData[0]?.name || 'N/A'}</strong> drives peak operations with <strong>{categoryData[0]?.percentage || 0}%</strong> of cumulative units shipped. Maintain safety margins and buffer inventory levels for these key assets.
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {activeTab === 'price-audit' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Header info */}
          <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-4`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
              <div>
                <h3 className={`text-base font-black uppercase tracking-widest font-mono flex items-center gap-2 ${colors.textMain}`}>
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  Price Deviation Audit Report
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Identifies and flags products whose price deviates by more than 20% from their category average.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl text-xs font-mono font-bold">
                  Audited: {priceAuditReport.totalAudited} SKUs
                </span>
                <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                  priceAuditReport.flaggedProducts.length > 0
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  Flagged: {priceAuditReport.flaggedProducts.length} Anomalies
                </span>
              </div>
            </div>

            {/* Overview KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${colors.border} bg-black/10 font-mono`}>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Audit Status</span>
                <span className={`text-sm font-bold ${priceAuditReport.flaggedProducts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {priceAuditReport.flaggedProducts.length > 0 ? '⚠️ ATTENTION REQUIRED' : '✅ VALUATION STABLE'}
                </span>
              </div>
              <div className={`p-4 rounded-xl border ${colors.border} bg-black/10 font-mono`}>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Max Positive Deviation</span>
                <span className="text-sm font-bold text-red-400">
                  {priceAuditReport.flaggedProducts.filter(p => p.deviation > 0)[0]
                    ? `+${priceAuditReport.flaggedProducts.filter(p => p.deviation > 0)[0].deviation.toFixed(1)}%`
                    : '0.0%'}
                </span>
              </div>
              <div className={`p-4 rounded-xl border ${colors.border} bg-black/10 font-mono`}>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Max Negative Deviation</span>
                <span className="text-sm font-bold text-blue-400">
                  {priceAuditReport.flaggedProducts.filter(p => p.deviation < 0)[0]
                    ? `${priceAuditReport.flaggedProducts.filter(p => p.deviation < 0)[0].deviation.toFixed(1)}%`
                    : '0.0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Category Baseline Averages Tracker */}
          <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-4`}>
            <div className="border-b border-slate-800/40 pb-3">
              <h3 className={`text-sm font-black uppercase tracking-widest font-mono ${colors.textMain}`}>
                Category Baseline Averages
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Computed average values used as base comparisons
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(priceAuditReport.categoryAverages).map(([category, avg]) => {
                const count = products.filter(p => p.category === category).length;
                return (
                  <div key={category} className={`p-4 rounded-xl border ${colors.border} bg-black/10 space-y-1`}>
                    <span className={`text-[10px] font-bold font-mono uppercase truncate block ${colors.textSub}`}>
                      {category}
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className={`text-base font-black font-mono ${colors.textMain}`}>
                        ${(avg as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {count} SKUs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Products Details */}
          <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bgCard} shadow-lg space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
              <div>
                <h3 className={`text-sm font-black uppercase tracking-widest font-mono ${colors.textMain}`}>
                  Flagged Deviating Products (&gt; 20% deviation)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Products requiring price review due to significant category deviation
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                priceAuditReport.flaggedProducts.length > 0
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {priceAuditReport.flaggedProducts.length} Anomalies found
              </span>
            </div>

            {priceAuditReport.flaggedProducts.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500 font-mono">
                  🎉 Excellent! No products deviate by more than 20% from their category average.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800/40">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase bg-black/20">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Product Price</th>
                      <th className="p-3 text-right">Category Average</th>
                      <th className="p-3 text-right">Deviation</th>
                      <th className="p-3 text-right">Recommendation</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceAuditReport.flaggedProducts.map((item) => (
                      <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/20 transition-colors">
                        <td className="p-3">
                          <div className={`font-bold ${colors.textMain} text-xs`}>{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {item.id.substring(0, 8)}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{item.category}</td>
                        <td className="p-3 text-right font-bold font-mono text-slate-200">
                          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400">
                          ${item.categoryAverage.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`p-3 text-right font-black font-mono ${item.deviation > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                          {item.deviation > 0 ? '+' : ''}{item.deviation.toFixed(1)}%
                        </td>
                        <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                          Set to ${item.categoryAverage.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            item.deviation > 0
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {item.deviation > 0 ? 'OVERPRICED' : 'UNDERPRICED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
