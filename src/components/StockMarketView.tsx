import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart as LineChartIcon, 
  RefreshCw, 
  Play, 
  Pause,
  ArrowUp,
  ArrowDown,
  Info,
  Layers,
  Sparkles,
  DollarSign,
  Activity,
  Compass,
  PieChart as PieChartIcon,
  Zap,
  Percent,
  Flame,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ComposedChart, 
  Bar, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema?: number;
  sma?: number;
  rsi?: number;
  macd?: number;
}

interface StockMarketViewProps {
  theme: 'day' | 'night' | 'cyberpunk';
  language: 'en' | 'zh' | 'ar';
  speakAiText: (text: string) => void;
}

export function StockMarketView({ theme, language, speakAiText }: StockMarketViewProps) {
  const [chartType, setChartType] = useState<'candle' | 'area' | 'technical'>('candle');
  const [selectedTicker, setSelectedTicker] = useState<'AAPL' | 'SDAZUM'>('AAPL');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [isLiveTicking, setIsLiveTicking] = useState(true);
  const [livePriceOffset, setLivePriceOffset] = useState(0);
  const [activeIndicators, setActiveIndicators] = useState({
    ema: true,
    sma: true,
    rsi: false,
    macd: false
  });

  // User-facing interactive state for market sentiment
  const [userSentimentOffset, setUserSentimentOffset] = useState(0);

  // Simulated live trade states
  const [cash, setCash] = useState<number>(() => {
    const saved = localStorage.getItem('azum_stock_cash');
    return saved !== null ? Number(saved) : 100000;
  });
  const [shares, setShares] = useState<{ AAPL: number; SDAZUM: number }>(() => {
    const saved = localStorage.getItem('azum_stock_shares');
    return saved !== null ? JSON.parse(saved) : { AAPL: 5, SDAZUM: 2 };
  });
  const [tradeQty, setTradeQty] = useState<number>(1);
  const [recentTrades, setRecentTrades] = useState<{ id: string; time: string; price: number; qty: number; type: 'BUY' | 'SELL' }[]>([]);

  // Sound/Visual flash trigger on execution
  const [flashType, setFlashType] = useState<'BUY' | 'SELL' | null>(null);

  useEffect(() => {
    localStorage.setItem('azum_stock_cash', String(cash));
  }, [cash]);

  useEffect(() => {
    localStorage.setItem('azum_stock_shares', JSON.stringify(shares));
  }, [shares]);

  // Replicating Apple Stock Data
  const initialAaplData: Record<string, StockDataPoint[]> = useMemo(() => {
    return {
      '1D': [
        { date: '09:30', open: 224.2, high: 224.8, low: 223.5, close: 224.1, volume: 4500000 },
        { date: '10:00', open: 224.1, high: 225.2, low: 224.0, close: 225.0, volume: 5200000 },
        { date: '10:30', open: 225.0, high: 225.8, low: 224.5, close: 225.5, volume: 6800000 },
        { date: '11:00', open: 225.5, high: 226.4, low: 225.1, close: 226.2, volume: 7200000 },
        { date: '11:30', open: 226.2, high: 226.9, low: 225.8, close: 226.0, volume: 6100000 },
        { date: '12:00', open: 226.0, high: 226.5, low: 225.5, close: 225.8, volume: 4900000 },
        { date: '12:30', open: 225.8, high: 226.2, low: 225.3, close: 225.5, volume: 4100000 },
        { date: '13:00', open: 225.5, high: 226.0, low: 225.1, close: 225.9, volume: 5400000 },
        { date: '13:30', open: 225.9, high: 226.3, low: 225.7, close: 226.1, volume: 4800000 },
        { date: '14:00', open: 226.1, high: 226.8, low: 225.9, close: 226.4, volume: 4600000 },
        { date: '14:30', open: 226.4, high: 227.2, low: 226.1, close: 227.0, volume: 5100000 },
        { date: '15:00', open: 227.0, high: 227.5, low: 226.8, close: 227.3, volume: 4300000 },
        { date: '15:30', open: 227.3, high: 227.8, low: 227.1, close: 227.5, volume: 5700000 },
        { date: '16:00', open: 227.5, high: 228.2, low: 227.4, close: 228.0, volume: 7900000 }
      ],
      '1W': [
        { date: 'Mon', open: 221.0, high: 223.5, low: 220.2, close: 222.8, volume: 24000000 },
        { date: 'Tue', open: 222.8, high: 224.9, low: 221.5, close: 223.4, volume: 27000000 },
        { date: 'Wed', open: 223.4, high: 226.1, low: 222.8, close: 225.0, volume: 31000000 },
        { date: 'Thu', open: 225.0, high: 225.8, low: 223.1, close: 224.2, volume: 29000000 },
        { date: 'Fri', open: 224.2, high: 228.5, low: 224.0, close: 228.0, volume: 38000000 }
      ],
      '1M': [
        { date: 'Week 1', open: 215.0, high: 220.4, low: 214.2, close: 219.1, volume: 110000000 },
        { date: 'Week 2', open: 219.1, high: 223.2, low: 218.0, close: 222.0, volume: 125000000 },
        { date: 'Week 3', open: 222.0, high: 224.5, low: 220.1, close: 223.8, volume: 98000000 },
        { date: 'Week 4', open: 223.8, high: 229.5, low: 223.0, close: 228.0, volume: 145000000 }
      ],
      '3M': [
        { date: 'Jul Beg', open: 205.0, high: 212.0, low: 204.1, close: 210.5, volume: 410000000 },
        { date: 'Jul End', open: 210.5, high: 218.4, low: 209.0, close: 216.2, volume: 430000000 },
        { date: 'Aug Beg', open: 216.2, high: 224.0, low: 215.1, close: 222.1, volume: 480000000 },
        { date: 'Aug End', open: 222.1, high: 226.5, low: 220.2, close: 225.0, volume: 390000000 },
        { date: 'Sep Beg', open: 225.0, high: 230.1, low: 223.8, close: 228.0, volume: 460000000 }
      ],
      '1Y': [
        { date: 'Q1', open: 185.2, high: 198.5, low: 180.1, close: 195.4, volume: 1600000000 },
        { date: 'Q2', open: 195.4, high: 215.2, low: 192.3, close: 210.2, volume: 1850000000 },
        { date: 'Q3', open: 210.2, high: 231.5, low: 208.5, close: 228.0, volume: 1920000000 },
        { date: 'Q4 (Est)', open: 228.0, high: 242.0, low: 225.1, close: 239.5, volume: 2200000000 }
      ]
    };
  }, []);

  // Shandong Azum Industrial Index
  const initialSdazumData: Record<string, StockDataPoint[]> = useMemo(() => {
    return {
      '1D': [
        { date: '09:30', open: 4420, high: 4435, low: 4410, close: 4425, volume: 2500 },
        { date: '10:00', open: 4425, high: 4450, low: 4420, close: 4445, volume: 3800 },
        { date: '10:30', open: 4445, high: 4465, low: 4438, close: 4460, volume: 4200 },
        { date: '11:00', open: 4460, high: 4480, low: 4452, close: 4478, volume: 5100 },
        { date: '11:30', open: 4478, high: 4495, low: 4470, close: 4485, volume: 3900 },
        { date: '12:00', open: 4485, high: 4492, low: 4475, close: 4480, volume: 2800 },
        { date: '12:30', open: 4480, high: 4488, low: 4472, close: 4482, volume: 1900 },
        { date: '13:00', open: 4482, high: 4505, low: 4478, close: 4498, volume: 3400 },
        { date: '13:30', open: 4498, high: 4515, low: 4492, close: 4510, volume: 4100 },
        { date: '14:00', open: 4510, high: 4530, low: 4505, close: 4524, volume: 3700 },
        { date: '14:30', open: 4524, high: 4545, low: 4520, close: 4538, volume: 4900 },
        { date: '15:00', open: 4538, high: 4552, low: 4532, close: 4546, volume: 4300 },
        { date: '15:30', open: 4546, high: 4568, low: 4540, close: 4562, volume: 5500 },
        { date: '16:00', open: 4562, high: 4640, low: 4555, close: 4628.5, volume: 8400 }
      ],
      '1W': [
        { date: 'Mon', open: 4350, high: 4410, low: 4330, close: 4390, volume: 15000 },
        { date: 'Tue', open: 4390, high: 4440, low: 4380, close: 4415, volume: 18000 },
        { date: 'Wed', open: 4415, high: 4495, low: 4410, close: 4480, volume: 22000 },
        { date: 'Thu', open: 4480, high: 4510, low: 4460, close: 4495, volume: 19000 },
        { date: 'Fri', open: 4495, high: 4650, low: 4480, close: 4628.5, volume: 31000 }
      ],
      '1M': [
        { date: 'Week 1', open: 4210, high: 4330, low: 4200, close: 4305, volume: 85000 },
        { date: 'Week 2', open: 4305, high: 4410, low: 4290, close: 4385, volume: 92000 },
        { date: 'Week 3', open: 4385, high: 4490, low: 4360, close: 4470, volume: 104000 },
        { date: 'Week 4', open: 4470, high: 4650, low: 4450, close: 4628.5, volume: 128000 }
      ],
      '3M': [
        { date: 'Jul Beg', open: 3950, high: 4120, low: 3930, close: 4080, volume: 380000 },
        { date: 'Jul End', open: 4080, high: 4250, low: 4060, close: 4210, volume: 410000 },
        { date: 'Aug Beg', open: 4210, high: 4380, low: 4190, close: 4345, volume: 440000 },
        { date: 'Aug End', open: 4345, high: 4510, low: 4320, close: 4480, volume: 395000 },
        { date: 'Sep Beg', open: 4480, high: 4660, low: 4460, close: 4628.5, volume: 470000 }
      ],
      '1Y': [
        { date: 'Q1', open: 3400, high: 3850, low: 3350, close: 3780, volume: 1400000 },
        { date: 'Q2', open: 3780, high: 4120, low: 3700, close: 4050, volume: 1650000 },
        { date: 'Q3', open: 4050, high: 4480, low: 4010, close: 4420, volume: 1820000 },
        { date: 'Q4 (Est)', open: 4420, high: 4750, low: 4390, close: 4628.5, volume: 2150000 }
      ]
    };
  }, []);

  // Simulating live price fluctuations
  useEffect(() => {
    if (!isLiveTicking) return;
    const interval = setInterval(() => {
      setLivePriceOffset(prev => prev + (Math.random() - 0.495) * (selectedTicker === 'SDAZUM' ? 4.5 : 0.25));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveTicking, selectedTicker]);

  // Merge ticker data with ticking offset
  const currentData = useMemo(() => {
    const raw = selectedTicker === 'AAPL' ? initialAaplData[timeframe] : initialSdazumData[timeframe];
    return raw.map((d, index) => {
      // Apply offset to the latest data point to simulate real-time stream
      if (index === raw.length - 1) {
        const updatedClose = d.close + livePriceOffset;
        const updatedHigh = Math.max(d.high, updatedClose);
        const updatedLow = Math.min(d.low, updatedClose);
        return {
          ...d,
          close: Number(updatedClose.toFixed(2)),
          high: Number(updatedHigh.toFixed(2)),
          low: Number(updatedLow.toFixed(2)),
          ema: Number((updatedClose * 0.985).toFixed(2)),
          sma: Number((updatedClose * 0.97).toFixed(2)),
          rsi: Math.round(55 + (livePriceOffset * (selectedTicker === 'SDAZUM' ? 0.2 : 2.5))),
          macd: Number((livePriceOffset * 0.05).toFixed(2))
        };
      } else {
        // Compute standard mock indicators for previous points
        const pointFactor = 1 - (raw.length - index) * 0.005;
        return {
          ...d,
          ema: Number((d.close * 0.99).toFixed(2)),
          sma: Number((d.close * 0.975).toFixed(2)),
          rsi: Math.round(48 + (index * 1.8)),
          macd: Number(((index - raw.length / 2) * 0.08).toFixed(2))
        };
      }
    });
  }, [selectedTicker, timeframe, livePriceOffset, initialAaplData, initialSdazumData]);

  // Compute key stats dynamically
  const latestPoint = currentData[currentData.length - 1];
  const previousPoint = currentData[currentData.length - 2] || currentData[0];
  const priceChange = latestPoint.close - previousPoint.close;
  const percentChange = (priceChange / previousPoint.close) * 100;

  const keyStats = useMemo(() => {
    const isSda = selectedTicker === 'SDAZUM';
    return {
      ticker: isSda ? 'SDAZUM' : 'AAPL',
      companyName: isSda ? 'Shandong Azum Heavy Industries' : 'Apple Inc.',
      exchange: isSda ? 'SDAZUM AUTO GLOBAL INDEX' : 'NASDAQ',
      sector: isSda ? 'Heavy Machinery & Automation' : 'Consumer Electronics',
      price: latestPoint.close,
      daysMin: isSda ? 4380 : 222.5,
      daysMax: isSda ? 4650 : 229.5,
      yrMin: isSda ? 3350 : 165.0,
      yrMax: isSda ? 4850 : 235.0,
      preMarket: isSda ? latestPoint.close * 1.002 : latestPoint.close * 1.0015,
      preMarketChange: isSda ? 8.5 : 0.35,
      preMarketPercent: isSda ? '0.18' : '0.15',
      earningsDays: isSda ? 12 : 18
    };
  }, [selectedTicker, latestPoint]);

  // Ticking recent trades simulation
  useEffect(() => {
    if (!isLiveTicking) return;
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.45;
      const spreadOffset = (Math.random() - 0.5) * (selectedTicker === 'SDAZUM' ? 10 : 0.6);
      const matchedPrice = Number((keyStats.price + spreadOffset).toFixed(2));
      const matchedQty = Math.floor(Math.random() * 75) + 5;
      const timestamp = new Date().toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setRecentTrades(prev => [
        {
          id: String(Date.now()),
          time: timestamp,
          price: matchedPrice,
          qty: matchedQty,
          type: isBuy ? 'BUY' : 'SELL'
        },
        ...prev.slice(0, 7) // Keep recent 8 trades
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveTicking, keyStats.price, selectedTicker]);

  // Market Sentiment Calculation (Buy/Sell pressure indicator)
  const marketSentiment = useMemo(() => {
    // Standard baseline + interactive actions + random noise
    const baseVal = selectedTicker === 'SDAZUM' ? 68 : 54;
    const liveNoise = Math.sin(Date.now() / 10000) * 2;
    const finalVal = Math.max(5, Math.min(95, baseVal + userSentimentOffset + liveNoise));
    return {
      buyPercent: Math.round(finalVal),
      sellPercent: Math.round(100 - finalVal)
    };
  }, [selectedTicker, userSentimentOffset]);

  // Voice Announcement trigger for Gemini AI
  const triggerGeminiReport = () => {
    let reportText = '';
    if (language === 'ar') {
      reportText = `التقرير المالي الفوري لمؤشر ${keyStats.ticker}. السعر الحالي هو ${keyStats.price} دولار، التغير اليومي هو ${percentChange.toFixed(2)} في المائة. مؤشرات شاندونغ عزام جيميناي تشير إلى استقرار تقني ممتاز.`;
    } else if (language === 'zh') {
      reportText = `${keyStats.companyName}（代码：${keyStats.ticker}）实时交易分析报告。当前价格为 ${keyStats.price} 美元，今日涨跌幅为 ${percentChange.toFixed(2)}%。双子座智能系统显示重型设备供应链运转极其健康。`;
    } else {
      reportText = `Live analytical telemetry report for ${keyStats.companyName} ticker ${keyStats.ticker}, Sir. The index is trading at ${keyStats.price} dollars, showing a dynamic daily movement of ${percentChange.toFixed(2)} percent. Gemini AI systems confirm safe operating parameters with positive momentum.`;
    }
    speakAiText(reportText);
  };

  return (
    <div 
      id="machinery-stock-market-dashboard"
      className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
        theme === 'cyberpunk'
          ? 'bg-[#05060f]/95 border-pink-500/30 text-pink-400 shadow-[0_0_40px_rgba(236,72,153,0.15)]'
          : theme === 'night'
            ? 'bg-[#0b0e14] border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
      }`}
    >
      {/* Laser scanner grid line background for cool depth (Cyberpunk & Night modes) */}
      {theme !== 'day' && (
        <div className="absolute inset-0 bg-linear-to-b from-[#00f0ff]/2 to-transparent pointer-events-none opacity-30 cyber-grid" />
      )}

      {/* Decorative ambient color spots */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* FLASH ACTION EFFECT ON SCREEN */}
      {flashType && (
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 z-50 border-2 ${
          flashType === 'BUY' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
        }`} />
      )}

      {/* Upper header segment mirroring the live trading monitor look */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/60 pb-5 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-md shadow-sm">
              {keyStats.exchange}
            </span>
            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Real-Time Intelligence Node</span>
            </div>
          </div>
          <h2 className="text-2xl font-black font-mono tracking-tight flex items-center gap-2">
            <span>{keyStats.companyName}</span>
            <span className="text-indigo-400 font-bold">({keyStats.ticker})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">{keyStats.sector}</p>
        </div>

        {/* Ticker Swapping controller and Gemini Voice */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            <button
              onClick={() => { setSelectedTicker('AAPL'); setLivePriceOffset(0); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                selectedTicker === 'AAPL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
              }`}
            >
              🍎 APPLE (AAPL)
            </button>
            <button
              onClick={() => { setSelectedTicker('SDAZUM'); setLivePriceOffset(0); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                selectedTicker === 'SDAZUM'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
              }`}
            >
              ⚡ SD-AZUM INDEX
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <button
              onClick={triggerGeminiReport}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 text-indigo-400 border border-indigo-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-2 active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
              <span>Gemini AI Speech Report</span>
            </button>

            <button
              onClick={() => setIsLiveTicking(!isLiveTicking)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isLiveTicking 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-800/40 border-slate-700 text-slate-500'
              }`}
              title={isLiveTicking ? "Pause Live Feed" : "Resume Live Feed"}
            >
              {isLiveTicking ? <Play className="w-4 h-4 animate-spin text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Area: The interactive Stock price chart */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Real-time values ticker ribbon with neon styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-900/60 font-mono">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Spot Price</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">
                  ${keyStats.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Daily Delta</span>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-bold px-1.5 py-0.5 rounded ${
                  priceChange >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Pre-Market Feed</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-400">${keyStats.preMarket.toFixed(2)}</span>
                <span className="text-[9px] text-emerald-400 font-bold">
                  +{keyStats.preMarketChange.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-500 space-y-0.5 hidden md:block">
              <span>Sync Status: SECURE</span>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-emerald-400 font-bold">LIVE SOCKET</span>
              </div>
            </div>
          </div>

          {/* Timeframe Bar & Chart Display Toggles */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-900 pb-2">
            
            {/* Timeframes Selector */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => { setTimeframe(tf); setLivePriceOffset(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    timeframe === tf 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Display Types */}
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('candle')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartType === 'candle' ? 'bg-slate-900 text-indigo-400 border border-indigo-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3 h-3 text-indigo-400" />
                <span>Candles</span>
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartType === 'area' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LineChartIcon className="w-3 h-3 text-emerald-400" />
                <span>Area View</span>
              </button>
              <button
                onClick={() => setChartType('technical')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartType === 'technical' ? 'bg-slate-900 text-amber-400 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 text-amber-400" />
                <span>Indicators On</span>
              </button>
            </div>
          </div>

          {/* Interactive Chart stage */}
          <div className="h-[380px] w-full bg-slate-950/80 border border-slate-900 rounded-3xl p-4 overflow-hidden relative shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                // Smooth glowing area chart
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedTicker === 'SDAZUM' ? '#ec4899' : '#10b981'} stopOpacity={0.45}/>
                      <stop offset="95%" stopColor={selectedTicker === 'SDAZUM' ? '#ec4899' : '#10b981'} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#101524" />
                  <XAxis dataKey="date" stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis domain={['auto', 'auto']} stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke={selectedTicker === 'SDAZUM' ? '#ec4899' : '#10b981'} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              ) : chartType === 'technical' ? (
                // Indicators Overlaid Chart
                <ComposedChart data={currentData}>
                  <CartesianGrid strokeDasharray="1 3" stroke="#101524" />
                  <XAxis dataKey="date" stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis domain={['auto', 'auto']} stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
                  />
                  
                  {/* Candle bodies simulated with styled bars */}
                  <Bar dataKey="close" fill="#10b981" name="Price" maxBarSize={15}>
                    {currentData.map((entry, index) => {
                      const isUp = entry.close >= entry.open;
                      return <Cell key={`cell-${index}`} fill={isUp ? '#10b981' : '#ef4444'} />;
                    })}
                  </Bar>
                  
                  {activeIndicators.ema && (
                    <Line type="monotone" dataKey="ema" stroke="#00f0ff" strokeWidth={2} dot={false} name="EMA (20)" strokeDasharray="5 5" />
                  )}
                  {activeIndicators.sma && (
                    <Line type="monotone" dataKey="sma" stroke="#f59e0b" strokeWidth={2} dot={false} name="SMA (50)" />
                  )}
                </ComposedChart>
              ) : (
                // High-volatility Traditional Candle charts
                <ComposedChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#101524" />
                  <XAxis dataKey="date" stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis domain={['auto', 'auto']} stroke="#334155" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
                  />
                  
                  {/* High-Low Range wicks */}
                  <Bar dataKey="high" fill="#475569" maxBarSize={3} />
                  
                  {/* Candle stick bodies */}
                  <Bar dataKey="close" maxBarSize={14}>
                    {currentData.map((entry, index) => {
                      const isUp = entry.close >= entry.open;
                      return <Cell key={`cell-${index}`} fill={isUp ? '#10b981' : '#ef4444'} />;
                    })}
                  </Bar>
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Sub-indicators section (MACD/RSI sparkline widgets if selected) */}
          {chartType === 'technical' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-900 text-xs font-mono">
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>Relative Strength Index (RSI 14)</span>
                  <span className={`font-bold ${latestPoint.rsi && latestPoint.rsi > 70 ? 'text-rose-400 animate-pulse' : latestPoint.rsi && latestPoint.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    RSI: {latestPoint.rsi} ({latestPoint.rsi && latestPoint.rsi > 70 ? 'Overbought' : latestPoint.rsi && latestPoint.rsi < 30 ? 'Oversold' : 'Neutral'})
                  </span>
                </div>
                <div className="h-10 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-900 flex items-center relative">
                  <div className="absolute left-0 right-0 h-0.5 bg-slate-800 border-dashed border-t border-slate-700/60" style={{ top: '30%' }} />
                  <div className="absolute left-0 right-0 h-0.5 bg-slate-800 border-dashed border-t border-slate-700/60" style={{ top: '70%' }} />
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData}>
                      <Area type="monotone" dataKey="rsi" stroke="#c084fc" fill="#c084fc" fillOpacity={0.05} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-900 text-xs font-mono">
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>MACD Oscillator (12, 26, 9)</span>
                  <span className="font-bold text-amber-400">Signal Delta: {latestPoint.macd}</span>
                </div>
                <div className="h-10 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-900 flex items-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData}>
                      <Area type="monotone" dataKey="macd" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Simulated Volume bars */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
              <span>Volume Profile</span>
              <span className="text-[#00f0ff] font-bold">AVG_VOL: {keyStats.ticker === 'AAPL' ? '44.25M' : '41.5K'}</span>
            </div>
            <div className="h-12 w-full flex items-end gap-[2px] bg-slate-950/40 p-1.5 rounded-xl border border-slate-900/60">
              {currentData.map((d, i) => {
                const isUp = d.close >= d.open;
                const pct = (d.volume / (selectedTicker === 'SDAZUM' ? 10000 : 10000000)) * 100;
                return (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm transition-all duration-300 cursor-help ${
                      isUp ? 'bg-emerald-500/40 hover:bg-emerald-400' : 'bg-rose-500/40 hover:bg-rose-400'
                    }`}
                    style={{ height: `${Math.max(10, Math.min(pct, 100))}%` }}
                    title={`Volume: ${d.volume.toLocaleString()}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Trade Desk, Order Book, Live Feed */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* 1. Terminal Trade Execution Desk */}
          <div className="p-4 bg-slate-950/85 rounded-2xl border border-slate-900/80 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-black font-mono uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                Automated Exchange Desk
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">SECURE SHELL</span>
            </div>

            {/* Account Valuation HUD */}
            <div className="p-3.5 bg-[#07080d] rounded-xl border border-slate-900/80 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>SIMULATED BALANCE</span>
                <span className="text-emerald-400 font-bold">${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>SHARES PORTFOLIO</span>
                <span className="text-indigo-400 font-bold">{shares[selectedTicker]} {selectedTicker} Units</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-900/60 pt-2 mt-2">
                <span className="uppercase text-[9px] text-slate-500">Total Asset Worth</span>
                <span className="text-white font-extrabold text-sm">
                  ${(cash + (shares.AAPL * (selectedTicker === 'AAPL' ? keyStats.price : 228.0)) + (shares.SDAZUM * (selectedTicker === 'SDAZUM' ? keyStats.price : 4628.50))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Trading Inputs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">ORDER AMOUNT</label>
                <span className="text-[9px] font-mono text-[#00f0ff] font-bold">LIMIT / MARKET MATCH</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTradeQty(prev => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center flex items-center justify-center cursor-pointer transition-colors border border-slate-800"
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 h-9 rounded-xl bg-[#07080d] border border-slate-800 text-center text-xs font-mono text-white font-bold focus:outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={() => setTradeQty(prev => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center flex items-center justify-center cursor-pointer transition-colors border border-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons with visual feedback */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  if (tradeQty <= 0) return;
                  const totalCost = keyStats.price * tradeQty;
                  if (cash < totalCost) {
                    speakAiText(
                      language === 'ar' ? "عذراً، الرصيد الافتراضي غير كافٍ لإتمام الصفقة." :
                      language === 'zh' ? "抱歉，您的虚拟资金不足以完成此项交易。" :
                      "Alert, Sir: Insufficient simulated funds to complete this transaction."
                    );
                    return;
                  }
                  setCash(prev => prev - totalCost);
                  setShares(prev => ({ ...prev, [selectedTicker]: prev[selectedTicker] + tradeQty }));
                  setUserSentimentOffset(prev => prev + 3.5); // Push buyers pressure up!
                  setFlashType('BUY');
                  setTimeout(() => setFlashType(null), 500);
                  speakAiText(
                    language === 'ar' ? `تم شراء ${tradeQty} من أسهم ${selectedTicker} بنجاح.` :
                    language === 'zh' ? `成功购买 ${tradeQty} 股 ${selectedTicker}。` :
                    `Successfully purchased ${tradeQty} shares of ${selectedTicker} at $${keyStats.price.toFixed(2)}, Sir.`
                  );
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950/40 border border-emerald-500/20"
              >
                BUY / Market
              </button>
              <button
                onClick={() => {
                  if (tradeQty <= 0) return;
                  const currentShares = shares[selectedTicker] || 0;
                  if (currentShares < tradeQty) {
                    speakAiText(
                      language === 'ar' ? "عذراً، ليس لديك عدد كافٍ من الأسهم لإتمام صفقة البيع." :
                      language === 'zh' ? "抱歉，您持有的股份不足以执行此项卖出交易。" :
                      "Alert, Sir: Insufficient shares held to execute this sell order."
                    );
                    return;
                  }
                  const totalCredit = keyStats.price * tradeQty;
                  setCash(prev => prev + totalCredit);
                  setShares(prev => ({ ...prev, [selectedTicker]: prev[selectedTicker] - tradeQty }));
                  setUserSentimentOffset(prev => prev - 3.5); // Push sellers pressure up!
                  setFlashType('SELL');
                  setTimeout(() => setFlashType(null), 500);
                  speakAiText(
                    language === 'ar' ? `تم بيع ${tradeQty} من أسهم ${selectedTicker} بنجاح.` :
                    language === 'zh' ? `成功卖出 ${tradeQty} 股 ${selectedTicker}。` :
                    `Successfully executed market sell order of ${tradeQty} shares of ${selectedTicker} at $${keyStats.price.toFixed(2)}, Sir.`
                  );
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-950/40 border border-rose-500/20"
              >
                SELL / Market
              </button>
            </div>
          </div>

          {/* 2. Interactive Sentiment Meter Gauge */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900/80 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-xs font-black font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Exchange Sentiment Radar
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">METER</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">BUY PRESSURE: {marketSentiment.buyPercent}%</span>
                <span className="text-rose-400 font-bold">SELL PRESSURE: {marketSentiment.sellPercent}%</span>
              </div>
              <div className="h-2 w-full bg-rose-500/40 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${marketSentiment.buyPercent}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>INDEX OUTLOOK:</span>
                <span className={`font-bold ${marketSentiment.buyPercent > 60 ? 'text-emerald-400' : marketSentiment.buyPercent < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {marketSentiment.buyPercent > 65 ? 'STRONG ACCUMULATION' : marketSentiment.buyPercent < 35 ? 'STRONG DISTRIBUTION' : 'STABLE BOUNDS'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Live Depth Order Book & Trade Matching Feed */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900/80 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-xs font-black font-mono uppercase tracking-wider text-slate-400">
                Exchange Order Book
              </span>
              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest animate-pulse">MATCHING INSTANTLY</span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
              {/* ASKS (Sells) */}
              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase border-b border-slate-900/40 pb-0.5">Asks (Sell Limit)</span>
                {(() => {
                  const base = keyStats.price;
                  const isSda = selectedTicker === 'SDAZUM';
                  const tick = isSda ? 4.5 : 0.25;
                  const asksList = [
                    { price: base + tick * 3, qty: Math.floor(Math.random() * 450) + 110 },
                    { price: base + tick * 2, qty: Math.floor(Math.random() * 320) + 70 },
                    { price: base + tick * 1, qty: Math.floor(Math.random() * 180) + 40 },
                  ].reverse();
                  return asksList.map((a, i) => (
                    <div key={`ask-${i}`} className="flex justify-between items-center text-rose-400/90 relative py-0.5 overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 bg-rose-500/10 transition-all duration-300" style={{ width: `${Math.min(100, (a.qty / 500) * 100)}%` }} />
                      <span className="relative z-10 font-bold">${a.price.toFixed(2)}</span>
                      <span className="relative z-10 font-mono text-[9px] text-slate-400">{a.qty} units</span>
                    </div>
                  ));
                })()}
              </div>

              {/* BIDS (Buys) */}
              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase border-b border-slate-900/40 pb-0.5">Bids (Buy Limit)</span>
                {(() => {
                  const base = keyStats.price;
                  const isSda = selectedTicker === 'SDAZUM';
                  const tick = isSda ? 4.5 : 0.25;
                  const bidsList = [
                    { price: base - tick * 1, qty: Math.floor(Math.random() * 210) + 50 },
                    { price: base - tick * 2, qty: Math.floor(Math.random() * 360) + 80 },
                    { price: base - tick * 3, qty: Math.floor(Math.random() * 490) + 120 },
                  ];
                  return bidsList.map((b, i) => (
                    <div key={`bid-${i}`} className="flex justify-between items-center text-emerald-400/90 relative py-0.5 overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-300" style={{ width: `${Math.min(100, (b.qty / 500) * 100)}%` }} />
                      <span className="relative z-10 font-bold">${b.price.toFixed(2)}</span>
                      <span className="relative z-10 font-mono text-[9px] text-slate-400">{b.qty} units</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Spread and Matching Stream Segment */}
            <div className="border-t border-slate-900/80 pt-2 space-y-2">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>ESTIMATED LIQUIDITY DEPTH:</span>
                <span className="text-white font-bold">{selectedTicker === 'SDAZUM' ? 'Spread: $4.50' : 'Spread: $0.25'}</span>
              </div>
              
              {/* Trade Matching History Feed */}
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-900/60 space-y-1.5 font-mono text-[9px]">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest block border-b border-slate-900 pb-1 mb-1">Live Executed Contracts</span>
                {recentTrades.length === 0 ? (
                  <div className="text-slate-600 text-center py-2 uppercase tracking-wide">Connecting data pipeline...</div>
                ) : (
                  recentTrades.map((t, idx) => (
                    <div key={t.id || idx} className="flex justify-between items-center animate-fade-in">
                      <span className="text-slate-500">{t.time}</span>
                      <span className={t.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        ${t.price.toFixed(2)}
                      </span>
                      <span className="text-slate-400">{t.qty} Units</span>
                      <span className={`px-1 rounded-sm font-bold text-[8px] ${t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {t.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4. Ticker Statistics Slider Block */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-black font-mono uppercase tracking-wider text-slate-400">
                Index Bound Limits
              </span>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Day's Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>DAY'S HIGH/LOW BOUND</span>
                <span className="font-bold text-white">
                  ${keyStats.daysMin} - ${keyStats.daysMax}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="h-1 bg-slate-800 rounded-full relative">
                  <div 
                    className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full border border-white -top-0.75 shadow cursor-pointer transition-all duration-500"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((keyStats.price - keyStats.daysMin) / (keyStats.daysMax - keyStats.daysMin)) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 52-Week Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>52-WEEK LIMIT RANGE</span>
                <span className="font-bold text-white">
                  ${keyStats.yrMin} - ${keyStats.yrMax}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="h-1 bg-slate-800 rounded-full relative">
                  <div 
                    className="absolute w-2.5 h-2.5 bg-pink-500 rounded-full border border-white -top-0.75 shadow cursor-pointer transition-all duration-500"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((keyStats.price - keyStats.yrMin) / (keyStats.yrMax - keyStats.yrMin)) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
