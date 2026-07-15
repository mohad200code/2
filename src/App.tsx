/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Home,
  Bell,
  ShoppingBag,
  Search,
  Check,
  X,
  User as UserIcon,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  FolderPlus,
  Users,
  CreditCard,
  Plus,
  Star,
  Info,
  Calendar,
  Settings,
  Mail,
  LogOut,
  Sparkles,
  Globe,
  Coins,
  Share2,
  Send,
  Terminal,
  Moon,
  Sun,
  Cpu,
  Layers,
  Bot,
  ClipboardList,
  Monitor,
  Network,
  Volume2,
  VolumeX,
  QrCode,
  CheckCircle,
  TrendingUp,
  Upload,
  Download,
  Shield,
  ArrowRight,
  Lock,
  Gift,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  StopCircle,
  FileText,
  Trash2,
  Play,
  Pause,
  Camera,
  Power,
  RefreshCw,
  MousePointer,
  Heart,
  Battery,
  BatteryCharging,
  Zap,
  Languages,
  ArrowUpDown,
  BarChart3,
  ArrowUp,
  Eye,
  Tag,
  CheckSquare,
  Maximize,
  Copy
} from 'lucide-react';

import { Product, User as UserType, Order, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, CATEGORIES } from './mockData';
import helicalGear from './assets/images/helical_gear_1782614423344.jpg';
import { ProductSVG } from './components/ProductSVG';
import { ClerkAuth } from './components/ClerkAuth';
import { CheckoutWizard } from './components/CheckoutWizard';
import { AdminOverview } from './components/AdminOverview';
import { AdminUsers } from './components/AdminUsers';
import { AdminAnalytics } from './components/AdminAnalytics';
import { ShandongAzumLogo } from './components/ShandongAzumLogo';
import shandongLogoImg from './assets/images/shandong_azum_logo.jpg';
import weixinCardImg from './assets/images/weixin_image_1782822635009.jpg';
import { ParallaxCard } from './components/ParallaxCard';
import { LazyImage } from './components/LazyImage';
import { ExpandedProductModal } from './components/ExpandedProductModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { PriceSparkline } from './components/PriceSparkline';
import { GmailClient } from './components/GmailClient';
import { GoogleChatClient } from './components/GoogleChatClient';
import { StockHistoryChart } from './components/StockHistoryChart';
import { CameraScannerModal } from './components/CameraScannerModal';
import { CustomerActivityTrackerModal, UserActivityLog } from './components/CustomerActivityTrackerModal';
import { InventorySparkline } from './components/InventorySparkline';
import { AdminGuard } from './components/AdminGuard';
import jarvisCore from './assets/images/jarvis_core_1783511468932.jpg';
import jarvisHelmet from './assets/images/robot_helmet_avatar_1783511486718.jpg';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const LiveCounter: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 1000;
    const startTime = performance.now();
    let animationFrameId: number;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeProgress);
      setDisplayValue(current);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{displayValue}</span>;
};

const CustomCursor: React.FC<{ type: string }> = ({ type }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type === 'default') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.onclick || 
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [type]);

  if (type === 'default' || !isVisible) return null;

  let cursorContent = null;

  if (type === 'neon-ring') {
    cursorContent = (
      <div 
        className={`w-6 h-6 rounded-full border-2 border-[#00f0ff] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none relative flex items-center justify-center ${
          clicked ? 'scale-75 bg-[#00f0ff]/20' : hovered ? 'scale-125 border-pink-500 shadow-[0_0_10px_#ff007f]' : ''
        }`}
        style={{
          boxShadow: clicked ? '0 0 15px rgba(0,240,255,0.8)' : '0 0 8px rgba(0,240,255,0.5)',
        }}
      >
        <div className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></div>
      </div>
    );
  } else if (type === 'cyberpunk-crosshair') {
    cursorContent = (
      <div className={`w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none relative transition-transform duration-75 ${clicked ? 'scale-90 rotate-45' : hovered ? 'scale-125' : ''}`}>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pink-500 -translate-y-1/2 opacity-70"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-500 -translate-x-1/2 opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 border border-[#00f0ff] bg-black -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_#00f0ff]"></div>
      </div>
    );
  } else if (type === 'retro-dot') {
    cursorContent = (
      <div 
        className={`w-4 h-4 bg-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none ${
          clicked ? 'scale-50 bg-amber-600' : hovered ? 'scale-150 bg-pink-500 shadow-[0_0_10px_#ff007f]' : ''
        }`}
        style={{
          boxShadow: '0 0 10px #f59e0b',
        }}
      />
    );
  } else if (type === 'laser-pointer') {
    cursorContent = (
      <div className="relative -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className={`w-3 h-3 bg-red-600 rounded-full animate-ping absolute -inset-0 opacity-75 ${clicked ? 'scale-150' : hovered ? 'scale-125' : ''}`}></div>
        <div className="w-3 h-3 bg-red-500 rounded-full relative shadow-[0_0_8px_rgba(239,68,68,0.9)]"></div>
      </div>
    );
  }

  return (
    <div 
      className="fixed pointer-events-none z-[9999] hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {cursorContent}
    </div>
  );
};

const DEFAULT_FULL_TELEMETRY = {
  activeSessions: 12482,
  apiThroughput: 842,
  errorsLogged: 0.02,
  revenueData: [
    { name: 'April', Total: 120, Successful: 98 },
    { name: 'May', Total: 210, Successful: 180 },
    { name: 'June', Total: 190, Successful: 145 },
    { name: 'July', Total: 250, Successful: 210 },
    { name: 'August', Total: 310, Successful: 285 },
    { name: 'September', Total: 340, Successful: 312 },
  ],
  visitorData: [
    { name: 'Mon', Mobile: 140, Desktop: 220 },
    { name: 'Tue', Mobile: 180, Desktop: 290 },
    { name: 'Wed', Mobile: 230, Desktop: 340 },
    { name: 'Thu', Mobile: 170, Desktop: 310 },
    { name: 'Fri', Mobile: 290, Desktop: 410 },
    { name: 'Sat', Mobile: 380, Desktop: 480 },
    { name: 'Sun', Mobile: 210, Desktop: 320 },
  ],
  browserData: [
    { name: 'Chrome', value: 650, color: '#3B82F6' },
    { name: 'Safari', value: 280, color: '#EC4899' },
    { name: 'Firefox', value: 120, color: '#F59E0B' },
    { name: 'Other', value: 75, color: '#10B981' },
  ]
};

// Custom premium audio player for chat voice messages
const CustomAudioPlayer = ({ src }: { src: string }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play error", e));
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    if (audio.readyState >= 2) {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center gap-2.5 p-2 bg-slate-950/80 border border-pink-500/30 rounded-xl w-full">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      
      <button 
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shrink-0 cursor-pointer shadow-md shadow-pink-500/20"
      >
        {isLoading ? (
          <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span className="flex gap-0.5 items-center">
            <Volume2 className="w-2.5 h-2.5 text-pink-500 animate-pulse" />
            <span>Voice msg</span>
          </span>
          <span>{formatTime(duration || 0)}</span>
        </div>
        
        <input 
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 accent-pink-500 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
        />
      </div>

      <a 
        href={src} 
        download="voice-message.wav" 
        className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
        title="Download voice message"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

// Formats message raw dates/timestamps into elegant human-readable strings
const formatMessageTime = (dateStr?: string, timestamp?: number) => {
  const ts = timestamp || (dateStr ? Date.parse(dateStr) : null);
  if (!ts || isNaN(ts)) {
    return dateStr || '';
  }
  
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  
  if (secs < 10) return "Just now";
  if (secs < 60) return `${secs}s ago`;
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const d = new Date(ts);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Translation Dictionaries for English, Chinese, and Arabic
const translations = {
  en: {
    storeName: "SDAZUM.COM",
    home: "Storefront",
    cart: "Cart",
    admin: "Partner Hub",
    orders: "My Orders",
    wallet: "Cyber Wallet",
    affiliate: "Affiliate Hub",
    addProd: "Host Product",
    downloadApp: "Download App",
    searchPlaceholder: "Search machinery and parts...",
    all: "All Machinery",
    tshirts: "CNC Systems",
    shoes: "Robotics",
    jackets: "Presses & Cutters",
    reviews: "Reviews",
    comments: "Comments",
    peopleBought: "people bought this item",
    instantDelivery: "Instant Digital Delivery System",
    buyNow: "Buy with Wallet",
    deliveryLog: "Delivery Terminal",
    changeProfile: "Change Avatar",
    addReview: "Add Review",
    rating: "Rating",
    writeComment: "Write a comment...",
    post: "Post Review",
    referralLink: "Your Referral Link",
    earnWallet: "Refer & Earn $25.00",
    copied: "Copied!",
    copyLink: "Copy Link",
    newProductTitle: "Host a New Product",
    price: "Price ($)",
    imageUrl: "Image URL",
    createProduct: "Create Product",
    aiAssistant: "Jarvis AI",
    aiDescription: "Interactive automated sales agent & delivery dispatcher.",
    askAi: "Ask anything about our catalog...",
    guestMode: "Guest View",
    signupMessage: "Sign up to unlock custom product uploads & full wallet access!",
    systemHealthy: "Microservices Online",
    seoRating: "SEO optimized: 100%"
  },
  zh: {
    storeName: "SDAZUM 智能控制中心",
    home: "数码商城",
    cart: "购物车",
    admin: "合作伙伴中心",
    orders: "订单状态追踪",
    wallet: "电子钱包",
    affiliate: "分销佣金系统",
    addProd: "发布新产品",
    downloadApp: "下载应用程序",
    searchPlaceholder: "搜索专属工业设备与零件...",
    all: "全部机械",
    tshirts: "数控系统",
    shoes: "工业机器人",
    jackets: "压力机与切割机",
    reviews: "购买评价",
    comments: "留言区",
    peopleBought: "人已购买此商品",
    instantDelivery: "即时自动发货系统",
    buyNow: "电子钱包一键付",
    deliveryLog: "控制台输出日志",
    changeProfile: "更新头像",
    addReview: "添加评价",
    rating: "打分",
    writeComment: "写下您的评论...",
    post: "发布评论",
    referralLink: "我的专属推广链",
    earnWallet: "每邀请一位赚取 $25.00",
    copied: "已复制！",
    copyLink: "复制推广码",
    newProductTitle: "上架新商品",
    price: "设定价格 ($)",
    imageUrl: "商品图片网址",
    createProduct: "确认上架商品",
    aiAssistant: "Jarvis AI 智能管家",
    aiDescription: "微服务发货机器人与智能销售助手。",
    askAi: "向 AI 咨询关于我们商品的任何问题...",
    guestMode: "访客模式",
    signupMessage: "请先注册账号以发布个人产品并启用电子钱包！",
    systemHealthy: "微服务群集运行中",
    seoRating: "搜索引擎SEO评分：满分"
  },
  ar: {
    storeName: "بوابة سدازوم الرقمية",
    home: "المتجر",
    cart: "السلة",
    admin: "لوحة التحكم",
    orders: "طلباتي الصناعية",
    wallet: "المحفظة الرقمية",
    affiliate: "التسويق بالعمولة",
    addProd: "إضافة منتج حصرى",
    downloadApp: "تحميل التطبيق",
    searchPlaceholder: "ابحث عن معدات صناعية...",
    all: "كل المعدات",
    tshirts: "أنظمة CNC",
    shoes: "الروبوتات",
    jackets: "المكابس والقطع",
    reviews: "مراجعات العملاء",
    comments: "التعليقات",
    peopleBought: "شخصاً اشتروا هذا المنتج",
    instantDelivery: "نظام التسليم الآلي الفوري",
    buyNow: "شراء بالمحفظة",
    deliveryLog: "منصة التسليم الآلي",
    changeProfile: "تغيير الصورة الشخصية",
    addReview: "إضافة تقييم",
    rating: "التقييم",
    writeComment: "اكتب تعليقك هنا...",
    post: "نشر التقييم",
    referralLink: "رابط الإحالة الخاص بك",
    earnWallet: "احصل على $25.00 عن كل صديق",
    copied: "تم النسخ!",
    copyLink: "نسخ الرابط",
    newProductTitle: "إضافة منتج جديد للمتجر",
    price: "السعر بالدولار ($)",
    imageUrl: "رابط الصورة",
    createProduct: "إنشاء المنتج",
    aiAssistant: "مساعد Jarvis الذكي",
    aiDescription: "عميل مبيعات ذكي وموزع آلي فوري للطلبات.",
    askAi: "اسأل أي شيء عن كتالوج المنتجات...",
    guestMode: "عرض كزائر",
    signupMessage: "سجل الآن لتتمكن من إضافة منتجاتك الخاصة وتفعيل محفظتك!",
    systemHealthy: "الميكروسيرفس تعمل بنجاح",
    seoRating: "مؤشرات الـ SEO ممتازة: 100%"
  }
};

// Helper function to parse CSV robustly, supporting quotes, nested commas, and escaped quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let entry = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        entry += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(entry.trim());
      entry = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(entry.trim());
      if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
        lines.push(row);
      }
      row = [];
      entry = '';
    } else {
      entry += char;
    }
  }

  // Handle final item if any
  if (entry || row.length > 0) {
    row.push(entry.trim());
    if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
      lines.push(row);
    }
  }

  return lines;
}

export default function App() {
  // Navigation & Screen View State
  const [view, setView] = useState<'store' | 'product-details' | 'cart' | 'admin' | 'auth' | 'orders' | 'ai' | 'chat'>('store');
  const [adminSubView, setAdminSubView] = useState<'overview' | 'inbox' | 'calendar' | 'search' | 'settings' | 'products' | 'add-product' | 'add-category' | 'users' | 'add-user' | 'transactions' | 'add-order' | 'analytics'>('overview');
  const [adminProductLocFilter, setAdminProductLocFilter] = useState<'all' | 'missing-en' | 'missing-zh' | 'missing-ar' | 'missing-any'>('all');
  const [adminProductSort, setAdminProductSort] = useState<'name-asc' | 'price-asc' | 'price-desc' | 'sales-desc'>('name-asc');
  const [adminProductColumns, setAdminProductColumns] = useState({
    image: true,
    name: true,
    category: true,
    price: true,
    stock: true,
    salesCount: true,
    description: true,
  });
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
  
  const [adminInbox, setAdminInbox] = useState<any[]>(() => {
    return [
      {
        id: "mail-1",
        from: "system@sdazum.com",
        to: "mohabmohnad9@gmail.com",
        subject: "⚡ SDAZUM.COM System Welcome Credentials",
        date: "Today, 08:30 AM",
        body: `
          <div style="font-family: monospace; color: #cbd5e1; background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
            <h2 style="color: #00f0ff; margin-top: 0;">⚡ Welcome to Shandong Azum Portal</h2>
            <p>Your admin credentials have been active. Official logistics terminals are online.</p>
            <p>Representative: <strong>Altayeb Yousif Dafalla</strong></p>
          </div>
        `
      }
    ];
  });

  const [authIsSignUp, setAuthIsSignUp] = useState<boolean>(false);

  // Multi-Language Support
  const [language, setLanguage] = useState<'en' | 'zh' | 'ar'>(() => {
    const saved = localStorage.getItem('cyberport_lang');
    if (saved === 'en' || saved === 'zh' || saved === 'ar') {
      return saved;
    }
    const navLang = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : '';
    if (navLang.startsWith('zh') || navLang.startsWith('cn')) return 'zh';
    if (navLang.startsWith('ar')) return 'ar';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('cyberport_lang', language);
  }, [language]);

  // Smooth scroll to top whenever the active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Dynamic Styles (Day / Night / Cyberpunk)
  const [theme, setTheme] = useState<'day' | 'night' | 'cyberpunk'>(() => {
    const saved = localStorage.getItem('cyberport_theme');
    if (saved === 'day' || saved === 'night' || saved === 'cyberpunk') {
      return saved;
    }
    return 'cyberpunk';
  });

  // Synchronize theme state to localStorage and root body styling
  useEffect(() => {
    localStorage.setItem('cyberport_theme', theme);
    const body = document.body;
    const html = document.documentElement;
    if (theme === 'day') {
      body.style.backgroundColor = '#f8fafc';
      body.style.color = '#1e293b';
      body.classList.remove('dark');
      html.classList.remove('dark');
    } else if (theme === 'night') {
      body.style.backgroundColor = '#020617';
      body.style.color = '#f1f5f9';
      body.classList.add('dark');
      html.classList.add('dark');
    } else {
      body.style.backgroundColor = '#000000';
      body.style.color = '#00f0ff';
      body.classList.add('dark');
      html.classList.add('dark');
    }
  }, [theme]);

  // Main Database States
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('cyberport_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Load products from backend server on initialization for synchronized state across all users
  useEffect(() => {
    const loadProductsFromServer = async (retries = 3, delay = 1500) => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.products !== null && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          // Seed the backend with local state if empty or not found on server
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products })
          });
        }
      } catch (err) {
        if (retries > 0) {
          console.warn(`Failed to fetch products. Retrying in ${delay}ms... (${retries} left)`, err);
          setTimeout(() => loadProductsFromServer(retries - 1, delay * 1.5), delay);
        } else {
          console.warn("Failed to load products from server after several attempts, falling back to local storage", err);
        }
      } finally {
        setProductsLoaded(true);
      }
    };
    loadProductsFromServer();
  }, []);

  // Sync products state to backend server and local storage whenever it changes (after initial load is completed)
  useEffect(() => {
    if (productsLoaded) {
      localStorage.setItem('cyberport_products', JSON.stringify(products));
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      }).catch(err => console.error("Error saving products to server:", err));
    }
  }, [products, productsLoaded]);

  const [users, setUsers] = useState<UserType[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedUser = localStorage.getItem('cyberport_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email && u.email !== 'mohabmohnad9@gmail.com' && u.email !== 'lamadevtest@gmail.com') {
          const savedOrders = localStorage.getItem(`sdazum_orders_${u.email}`);
          return savedOrders ? JSON.parse(savedOrders) : [];
        }
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  // Selected details targets
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Smooth scroll to top when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProduct]);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(null);
  const [customEngravingName, setCustomEngravingName] = useState<string>('');
  const [detailQty, setDetailQty] = useState(1);
  const [priceHistoryActive, setPriceHistoryActive] = useState<Record<string, boolean>>({});

  // New Grid Catalog Interactive States
  const [stockHistoryActive, setStockHistoryActive] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentViews, setRecentViews] = useState<Record<string, number>>({});
  const [selectedAdminProducts, setSelectedAdminProducts] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [blinkProductId, setBlinkProductId] = useState<string | null>(null);

  // Initialize dynamic popularity recent views
  useEffect(() => {
    const initial: Record<string, number> = {};
    products.forEach(p => {
      const seed = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      initial[p.id] = (seed % 140) + 40;
    });
    setRecentViews(initial);

    const interval = setInterval(() => {
      setRecentViews(prev => {
        const copy = { ...prev };
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        if (randomProduct) {
          copy[randomProduct.id] = (copy[randomProduct.id] || 45) + Math.floor(Math.random() * 3) + 1;
        }
        return copy;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [products]);

  // Inventory Stock change flashing / blinking detector
  const prevStockRef = useRef<Record<string, number>>({});
  useEffect(() => {
    products.forEach(p => {
      const prevStock = prevStockRef.current[p.id];
      if (prevStock !== undefined && prevStock !== p.stock) {
        setBlinkProductId(p.id);
        const timer = setTimeout(() => setBlinkProductId(null), 1800);
        prevStockRef.current[p.id] = p.stock || 0;
      } else if (prevStock === undefined) {
        prevStockRef.current[p.id] = p.stock || 0;
      }
    });
  }, [products]);

  // Store filter/search state
  const [searchTerm, setSearchTerm] = useState('');
  const [translatedSearchTerm, setTranslatedSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [catalogTagFilter, setCatalogTagFilter] = useState<'all' | 'high-demand' | 'low-stock' | 'new-arrivals'>('all');
  const [micLanguage, setMicLanguage] = useState<'ar' | 'zh' | 'en'>('en');
  const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);

  // Comparing & bulk tagging states
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [bulkTagMode, setBulkTagMode] = useState<boolean>(false);
  const [selectedBulkProductIds, setSelectedBulkProductIds] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // New States for QR Code and Stock Alert Threshold
  const [qrCodeProduct, setQrCodeProduct] = useState<Product | null>(null);
  const [hoveredStockProductId, setHoveredStockProductId] = useState<string | null>(null);
  const [stockAlertThresholds, setStockAlertThresholds] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('azum_stock_thresholds');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [stockAlertEmail, setStockAlertEmail] = useState<string>(() => {
    return localStorage.getItem('azum_stock_email') || 'mohabmohnad9@gmail.com';
  });
  const [editingThresholdVal, setEditingThresholdVal] = useState<number>(5);

  // New States for Price Alerts
  const [priceAlertProduct, setPriceAlertProduct] = useState<Product | null>(null);
  const [priceAlertThresholds, setPriceAlertThresholds] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('azum_price_thresholds');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [priceAlertEmail, setPriceAlertEmail] = useState<string>(() => {
    return localStorage.getItem('azum_price_email') || 'mohabmohnad9@gmail.com';
  });

  // QR scanner, inventory sparkline, dimensions popover, and stock bounce animation states
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [scannedTargetProductId, setScannedTargetProductId] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('azum_recent_scans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep recent scans synchronized with localStorage
  useEffect(() => {
    localStorage.setItem('azum_recent_scans', JSON.stringify(recentScans));
  }, [recentScans]);

  // Customer Activity Tracker states
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState<boolean>(false);
  const [activities, setActivities] = useState<UserActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('azum_activities');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    const baseTime = Date.now();
    return [
      {
        id: 'act-1',
        timestamp: new Date(baseTime - 3600000 * 2.5).toISOString(),
        userEmail: 'mohabmohnad9@gmail.com',
        type: 'checkout',
        description: 'Purchase Completed Successfully',
        details: 'Checked out heavy industrial equipment and tools. Secure Stripe signature verified.',
        device: 'Desktop',
        ip: '192.168.1.88',
      },
      {
        id: 'act-2',
        timestamp: new Date(baseTime - 3600000 * 1.8).toISOString(),
        userEmail: 'operator@sdazum.com',
        type: 'scan',
        description: 'Physical QR Decoded',
        details: 'Machinery QR code SD-AZ-HEAVY matched successfully.',
        device: 'Industrial Terminal',
        ip: '10.0.4.15',
      },
      {
        id: 'act-3',
        timestamp: new Date(baseTime - 3600000 * 1.2).toISOString(),
        userEmail: 'operator@sdazum.com',
        type: 'voice',
        description: 'Arabic Voice Query Decoded',
        details: 'Recognized speech: "البحث عن معدات ثقيلة" -> loaded Catalog Category.',
        device: 'Industrial Terminal',
        ip: '10.0.4.15',
      },
      {
        id: 'act-4',
        timestamp: new Date(baseTime - 600000 * 3).toISOString(),
        userEmail: 'visitor-872@sdazum.com',
        type: 'search',
        description: 'Catalog Text Query',
        details: 'Searched for term: "welding gear"',
        device: 'Mobile',
        ip: '172.56.21.90',
      },
      {
        id: 'act-5',
        timestamp: new Date(baseTime - 600000 * 1.5).toISOString(),
        userEmail: 'mohabmohnad9@gmail.com',
        type: 'view_details',
        description: 'Expanded Specifications View',
        details: 'Opened technical blueprints and stock timelines panel.',
        device: 'Desktop',
        ip: '192.168.1.88',
      },
      {
        id: 'act-6',
        timestamp: new Date(baseTime - 60000).toISOString(),
        userEmail: 'mohabmohnad9@gmail.com',
        type: 'theme',
        description: 'UI Layout Style Switched',
        details: 'Changed visual theme from "night" to "cyberpunk" style guide presets.',
        device: 'Desktop',
        ip: '192.168.1.88',
      },
    ];
  });

  // Keep activities synchronized with localStorage
  useEffect(() => {
    localStorage.setItem('azum_activities', JSON.stringify(activities));
  }, [activities]);

  const logUserActivity = (
    type: 'search' | 'voice' | 'scan' | 'cart' | 'view_details' | 'theme' | 'checkout',
    description: string,
    details: string
  ) => {
    const isMobile = window.innerWidth < 768;
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    const activeEmail = currentUser ? currentUser.email : 'visitor@sdazum.com';

    const newLog: UserActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      userEmail: activeEmail,
      type,
      description,
      details,
      device: activeEmail === 'operator@sdazum.com' ? 'Industrial Terminal' : (deviceType as any),
      ip: activeEmail === 'operator@sdazum.com' ? '10.0.4.15' : '192.168.1.102',
    };

    setActivities(prev => [newLog, ...prev]);
  };

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Focus Search Box effect (on first load & shortcut)
  useEffect(() => {
    if (view === 'store' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable);

      const isSearchShortcut = (e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput);

      if (isSearchShortcut) {
        e.preventDefault();
        setView('store');
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
            triggerToast("🔍 Search focus engaged (Shortcut)", "success");
          }
        }, 10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  const [trendHistoryActive, setTrendHistoryActive] = useState<Record<string, boolean>>({});
  const [lastStockUpdatedProductId, setLastStockUpdatedProductId] = useState<string | null>(null);
  const [hoveredDimensionsProductId, setHoveredDimensionsProductId] = useState<string | null>(null);

  const handleExportToCSV = () => {
    if (filteredProducts.length === 0) {
      triggerToast("No products in the currently filtered view to export", "error");
      return;
    }
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Sales Count', 'Description'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.name,
      p.category,
      p.price.toString(),
      (p.stock !== undefined ? p.stock : 0).toString(),
      (p.rating || 4.8).toString(),
      (p.salesCount || Math.floor(p.price * 3.4)).toString(),
      p.description || ''
    ]);
    
    // Excel-friendly CSV with proper escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `azum_filtered_products_${activeCategory.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Successfully exported ${filteredProducts.length} filtered products to CSV!`, "success");
  };

  const handleToggleCompare = (productId: string) => {
    setCompareProductIds(prev => {
      if (prev.includes(productId)) {
        triggerToast("Removed from comparison", "success");
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          triggerToast("⚠️ Maximum of 4 products can be compared at once", "error");
          return prev;
        }
        triggerToast("Added to comparison", "success");
        return [...prev, productId];
      }
    });
  };

  const handleApplyBulkTag = (tag: string) => {
    if (selectedBulkProductIds.length === 0) return;
    setProducts(prev => {
      const nextProds = prev.map(p => {
        if (selectedBulkProductIds.includes(p.id)) {
          return { ...p, customBadge: tag ? tag : undefined };
        }
        return p;
      });
      localStorage.setItem('cyberport_products', JSON.stringify(nextProds));
      return nextProds;
    });
    triggerToast(tag ? `Applied tag "${tag}" to ${selectedBulkProductIds.length} products` : `Cleared tags on ${selectedBulkProductIds.length} products`, "success");
    setSelectedBulkProductIds([]);
  };

  // Lightbox and categories horizontal drag-scroll states & event handlers
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isCategoriesMouseDown, setIsCategoriesMouseDown] = useState(false);
  const [categoriesStartX, setCategoriesStartX] = useState(0);
  const [categoriesScrollLeft, setCategoriesScrollLeft] = useState(0);
  const [categoriesScrollProgress, setCategoriesScrollProgress] = useState(0);

  const handleCategoriesMouseDown = (e: React.MouseEvent) => {
    const container = categoriesRef.current;
    if (!container) return;
    setIsCategoriesMouseDown(true);
    setCategoriesStartX(e.pageX - container.offsetLeft);
    setCategoriesScrollLeft(container.scrollLeft);
  };

  const handleCategoriesMouseLeaveOrUp = () => {
    setIsCategoriesMouseDown(false);
  };

  const handleCategoriesMouseMove = (e: React.MouseEvent) => {
    if (!isCategoriesMouseDown) return;
    const container = categoriesRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - categoriesStartX) * 1.5;
    container.scrollLeft = categoriesScrollLeft - walk;
  };

  const handleCategoriesScrollEvent = () => {
    const container = categoriesRef.current;
    if (!container) return;
    const total = container.scrollWidth - container.clientWidth;
    if (total <= 0) {
      setCategoriesScrollProgress(0);
      return;
    }
    setCategoriesScrollProgress((container.scrollLeft / total) * 100);
  };

  // Interactive product card color overrides
  const [productColorOverrides, setProductColorOverrides] = useState<Record<string, { name: string; value: string }>>({});

  // Slide-out Drawer for Admin: Add Product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // Command palette states
  const [isAdminPaletteOpen, setIsAdminPaletteOpen] = useState(false);
  const [paletteSearchQuery, setPaletteSearchQuery] = useState('');
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
   const [isListening, setIsListening] = useState(false);
   const [speechActive, setSpeechActive] = useState(true);

   const toggleListening = () => {
     if (isListening) {
       setSpeechActive(false);
       if ((window as any).recognitionInstance) {
         try {
           (window as any).recognitionInstance.stop();
         } catch (e) {}
       }
       setIsListening(false);
       triggerToast("🎙️ Voice control silenced", "success");
     } else {
       setSpeechActive(true);
       triggerToast("🎙️ Voice control initiated silently in background", "success");
     }
   };

  useEffect(() => {
    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
  }, []);

  const triggerInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User prompt outcome: ${outcome}`);
        setDeferredPrompt(null);
      } catch (err) {
        console.error("PWA install error:", err);
      }
    } else {
      triggerToast("PWA installation requested! On iOS Safari: tap 'Share' -> 'Add to Home Screen'. On desktop: click the install icon in browser URL bar.", "success");
    }
  };
  const [isProductDragging, setIsProductDragging] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name_en: '',
    name_zh: '',
    name_ar: '',
    short_en: '',
    short_zh: '',
    short_ar: '',
    desc_en: '',
    desc_zh: '',
    desc_ar: '',
    price: '',
    category: 'CNC & Milling',
    sizes: [] as string[],
    colors: [] as { name: string; value: string }[],
    image: 'tshirt'
  });

  // User Dropdown menu overlay
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCursorDropdownOpen, setIsCursorDropdownOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // System Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Futuristic Battery Status Monitor
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isBatteryCharging, setIsBatteryCharging] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let batteryObj: any = null;

    const updateBattery = () => {
      if (!active || !batteryObj) return;
      setBatteryLevel(Math.round(batteryObj.level * 100));
      setIsBatteryCharging(batteryObj.charging);
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (!active) return;
        batteryObj = battery;
        setBatteryLevel(Math.round(battery.level * 100));
        setIsBatteryCharging(battery.charging);

        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch((err: any) => {
        console.log('Battery Status API blocked or unavailable, enabling simulated cyber-cell energy cell:', err);
        if (active) {
          setBatteryLevel(87);
          setIsBatteryCharging(true);
        }
      });
    } else {
      if (active) {
        setBatteryLevel(87);
        setIsBatteryCharging(true);
      }
    }

    // Gentle periodic energy fluctuation if simulated/fallback
    const interval = setInterval(() => {
      if (!active) return;
      if (!batteryObj) {
        setBatteryLevel((prev) => {
          if (prev === null) return 87;
          // Randomly fluctuate or slowly recharge
          const next = prev >= 100 ? 95 : prev + 1;
          return next;
        });
      }
    }, 60000);

    return () => {
      active = false;
      clearInterval(interval);
      if (batteryObj) {
        try {
          batteryObj.removeEventListener('levelchange', updateBattery);
          batteryObj.removeEventListener('chargingchange', updateBattery);
        } catch (e) {}
      }
    };
  }, []);

  // User Authentication Context (Supports Signup / Login)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'admin' | 'user'; name?: string } | null>(() => {
    const saved = localStorage.getItem('cyberport_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isMohab = !!currentUser && currentUser.email.toLowerCase() === 'mohabmohnad9@gmail.com';

  const isPrimaryAdmin = !!currentUser && currentUser.email.toLowerCase() === 'mohabmohnad9@gmail.com';

  const [inlineUploadedImage, setInlineUploadedImage] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState(() => {
    const savedUser = localStorage.getItem('cyberport_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email && u.email !== 'mohabmohnad9@gmail.com' && u.email !== 'lamadevtest@gmail.com') {
          const savedTelemetry = localStorage.getItem(`sdazum_telemetry_${u.email}`);
          if (savedTelemetry) {
            return JSON.parse(savedTelemetry);
          }
        }
      } catch (e) {}
    }
    return DEFAULT_FULL_TELEMETRY;
  });

  // Silent professional background voice command auto-listener
  useEffect(() => {
    if (!speechActive) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let active = true;
    let rec: any = null;

    const startSpeech = () => {
      if (!active || !speechActive) return;
      try {
        rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = micLanguage === 'ar' ? 'ar-SA' : micLanguage === 'zh' ? 'zh-CN' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          if (!active) return;
          const transcript = event.results[0][0].transcript;
          const speech = transcript.toLowerCase().trim();

          logUserActivity('voice', 'Voice Query Decoded', `Speech transcript: "${transcript}" (Language: ${micLanguage})`);

          if (speech.includes("go to orders") || speech.includes("view orders") || speech.includes("show orders")) {
            setView('orders');
            triggerToast("🎤 Executing Voice Command: Opened Orders Tracker", "success");
          } else if (speech.includes("go to store") || speech.includes("view store") || speech.includes("show store") || speech.includes("go to home") || speech.includes("go to homepage")) {
            setView('store');
            setSelectedProduct(null);
            triggerToast("🎤 Executing Voice Command: Redirected to Machinery Store", "success");
          } else if (speech.includes("go to cart") || speech.includes("view cart") || speech.includes("open cart") || speech.includes("show cart")) {
            setView('cart');
            triggerToast("🎤 Executing Voice Command: Opened Shopping Cart", "success");
          } else if (speech.includes("go to admin") || speech.includes("open admin") || speech.includes("view admin")) {
            if (!currentUser || currentUser.role !== 'admin') {
              setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : { email: 'operator@sdazum.com', role: 'admin' });
            }
            setView('admin');
            triggerToast("🎤 Executing Voice Command: Accessing Secure Admin Terminal", "success");
          } else if (speech.includes("go to chat") || speech.includes("open chat") || speech.includes("ask ai") || speech.includes("view chat")) {
            setView('chat');
            triggerToast("🎤 Executing Voice Command: Navigating to AI Assistant", "success");
          } else if (speech.includes("clear cart") || speech.includes("empty cart") || speech.includes("clear shopping cart")) {
            setCart([]);
            localStorage.removeItem('cyberport_cart');
            triggerToast("🎤 Executing Voice Command: Emptied shopping cart", "success");
          } else if (speech.includes("toggle theme") || speech.includes("change theme") || speech.includes("switch theme") || speech.includes("next theme")) {
            setTheme(prev => prev === 'day' ? 'night' : prev === 'night' ? 'cyberpunk' : 'day');
            triggerToast("🎤 Executing Voice Command: Cycled theme style", "success");
          } else if (speech.includes("logout") || speech.includes("log out") || speech.includes("sign out")) {
            handleLogout();
            triggerToast("🎤 Executing Voice Command: User session terminated", "success");
          } else if (speech.includes("checkout") || speech.includes("start checkout") || speech.includes("go to checkout")) {
            if (cart.length === 0) {
              triggerToast("Voice Command canceled: Cart is empty.", "error");
            } else {
              setView('cart');
              (window as any).triggerCheckoutWizard = true;
              triggerToast("🎤 Executing Voice Command: Displaying checkout gateway", "success");
            }
          } else if (speech.includes("search machinery") || speech.includes("search catalog") || speech.includes("find product")) {
            const query = speech.replace("search machinery", "").replace("search catalog", "").replace("find product", "").trim();
            if (query) {
              setView('store');
              setSelectedProduct(null);
              setSearchTerm(query);
              triggerToast(`🎤 Executing Voice Command: Searching for "${query}"`, "success");
            }
          } else {
            // General query - search for it in the search box as requested!
            setView('store');
            setSelectedProduct(null);
            setSearchTerm(transcript);
            
            let toastMessage = `🎤 Searching for: "${transcript}"`;
            if (micLanguage === 'ar') {
              toastMessage = `🎙️ تم كتابة النص العربي في صندوق البحث: "${transcript}"`;
            } else if (micLanguage === 'zh') {
              toastMessage = `🎙️ 已将中文输入搜索框: "${transcript}"`;
            }
            triggerToast(toastMessage, "success");
            
            // Auto smooth scroll to catalog grid
            setTimeout(() => {
              document.getElementById('products-grid-catalog')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }

          setAiInput((prev) => (prev ? prev + ' ' : '') + transcript);
        };

        rec.onerror = (err: any) => {
          console.debug("Speech recognition non-fatal callback:", err.error);
        };

        rec.onend = () => {
          if (active && speechActive) {
            setTimeout(() => {
              startSpeech();
            }, 400);
          } else {
            setIsListening(false);
          }
        };

        rec.start();
        (window as any).recognitionInstance = rec;
      } catch (e) {
        console.warn("Speech recognition initialization skipped:", e);
      }
    };

    startSpeech();

    return () => {
      active = false;
      if (rec) {
        try {
          rec.stop();
        } catch (e) {}
      }
    };
  }, [speechActive, language, currentUser, cart, micLanguage]);

  const updateTelemetryAction = (type: 'page_view' | 'search' | 'api_call' | 'error' | 'purchase', orderAmount?: number) => {
    const savedUser = localStorage.getItem('cyberport_user');
    if (!savedUser) return;
    try {
      const u = JSON.parse(savedUser);
      if (!u || !u.email || u.email === 'mohabmohnad9@gmail.com' || u.email === 'lamadevtest@gmail.com') {
        return; // Do not overwrite mock data of primary admin
      }

      setTelemetry((prev: any) => {
        const next = JSON.parse(JSON.stringify(prev));
        
        if (type === 'api_call' || type === 'search' || type === 'page_view') {
          next.apiThroughput = Math.floor(Math.random() * 150) + 40;
          if (Math.random() > 0.95) {
            next.errorsLogged = parseFloat((next.errorsLogged + 0.01).toFixed(2));
          }
        }

        if (type === 'page_view') {
          if (next.activeSessions === 0) {
            next.activeSessions = 1;
          } else if (Math.random() > 0.4) {
            next.activeSessions += 1;
          }

          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const currentDay = days[new Date().getDay()];
          const isActualMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
          next.visitorData = next.visitorData.map((d: any) => {
            if (d.name === currentDay) {
              return {
                ...d,
                Mobile: isActualMobile ? d.Mobile + 1 : d.Mobile,
                Desktop: !isActualMobile ? d.Desktop + 1 : d.Desktop
              };
            }
            return d;
          });

          const browsers = ['Chrome', 'Safari', 'Firefox', 'Other'];
          const rBrowser = browsers[Math.floor(Math.random() * browsers.length)];
          next.browserData = next.browserData.map((b: any) => {
            if (b.name === rBrowser) {
              return { ...b, value: b.value + 1 };
            }
            return b;
          });
        }

        if (type === 'purchase' && orderAmount) {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const currentMonth = months[new Date().getMonth()];
          
          let matched = false;
          next.revenueData = next.revenueData.map((r: any) => {
            if (r.name.toLowerCase() === currentMonth.toLowerCase() || (currentMonth.startsWith('Jul') && r.name === 'July') || (currentMonth.startsWith('Aug') && r.name === 'August')) {
              matched = true;
              const amountK = parseFloat((orderAmount / 1000).toFixed(2));
              return {
                ...r,
                Total: parseFloat((r.Total + amountK).toFixed(2)),
                Successful: parseFloat((r.Successful + amountK).toFixed(2))
              };
            }
            return r;
          });

          if (!matched) {
            next.revenueData = next.revenueData.map((r: any) => {
              if (r.name === 'September') {
                const amountK = parseFloat((orderAmount / 1000).toFixed(2));
                return {
                  ...r,
                  Total: parseFloat((r.Total + amountK).toFixed(2)),
                  Successful: parseFloat((r.Successful + amountK).toFixed(2))
                };
              }
              return r;
            });
          }
        }

        localStorage.setItem(`sdazum_telemetry_${u.email}`, JSON.stringify(next));
        return next;
      });
    } catch (e) {}
  };

  // Synchronize telemetry & orders state when currentUser session changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.email !== 'mohabmohnad9@gmail.com' && currentUser.email !== 'lamadevtest@gmail.com') {
        const savedOrders = localStorage.getItem(`sdazum_orders_${currentUser.email}`);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);

        const savedTelemetry = localStorage.getItem(`sdazum_telemetry_${currentUser.email}`);
        if (savedTelemetry) {
          setTelemetry(JSON.parse(savedTelemetry));
        } else {
          const zeroTelemetry = {
            activeSessions: 0,
            apiThroughput: 0,
            errorsLogged: 0.00,
            revenueData: [
              { name: 'April', Total: 0, Successful: 0 },
              { name: 'May', Total: 0, Successful: 0 },
              { name: 'June', Total: 0, Successful: 0 },
              { name: 'July', Total: 0, Successful: 0 },
              { name: 'August', Total: 0, Successful: 0 },
              { name: 'September', Total: 0, Successful: 0 },
            ],
            visitorData: [
              { name: 'Mon', Mobile: 0, Desktop: 0 },
              { name: 'Tue', Mobile: 0, Desktop: 0 },
              { name: 'Wed', Mobile: 0, Desktop: 0 },
              { name: 'Thu', Mobile: 0, Desktop: 0 },
              { name: 'Fri', Mobile: 0, Desktop: 0 },
              { name: 'Sat', Mobile: 0, Desktop: 0 },
              { name: 'Sun', Mobile: 0, Desktop: 0 },
            ],
            browserData: [
              { name: 'Chrome', value: 0, color: '#3B82F6' },
              { name: 'Safari', value: 0, color: '#EC4899' },
              { name: 'Firefox', value: 0, color: '#F59E0B' },
              { name: 'Other', value: 0, color: '#10B981' },
            ]
          };
          localStorage.setItem(`sdazum_telemetry_${currentUser.email}`, JSON.stringify(zeroTelemetry));
          setTelemetry(zeroTelemetry);
        }
      } else {
        setOrders(INITIAL_ORDERS);
        setTelemetry(DEFAULT_FULL_TELEMETRY);
      }
    } else {
      setOrders(INITIAL_ORDERS);
      setTelemetry(DEFAULT_FULL_TELEMETRY);
    }
  }, [currentUser]);

  // Trigger telemetry updates on view navigation and searching
  useEffect(() => {
    updateTelemetryAction('page_view');
  }, [view]);

  useEffect(() => {
    if (searchTerm) {
      updateTelemetryAction('search');
    }
  }, [searchTerm]);

  // Translate search terms dynamically from non-English (Arabic etc.) using backend Gemini translator
  useEffect(() => {
    if (!searchTerm.trim()) {
      setTranslatedSearchTerm('');
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch('/api/translate-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchTerm })
        });
        const data = await res.json();
        if (data && data.translated) {
          setTranslatedSearchTerm(data.translated);
        }
      } catch (err) {
        console.error("Query translation failed:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Window scroll listener for floating 'Scroll to Top' button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Wallet System States
  const [walletBalance, setWalletBalance] = useState<number>(550.00);

  // Affiliate System States
  const [affiliateCode, setAffiliateCode] = useState<string>('MOHAB-CYBER-99');
  const [referralsCount, setReferralsCount] = useState<number>(4);
  const [affiliateEarnings, setAffiliateEarnings] = useState<number>(100.00);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState<boolean>(false);

  // Change Profile Image States
  const [profileImage, setProfileImage] = useState<string>(() => {
    const saved = localStorage.getItem('cyberport_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.avatar) return u.avatar;
      } catch (e) {}
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100';
  });
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<boolean>(false);
  const [newAvatarInput, setNewAvatarInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cursorType, setCursorType] = useState<string>(() => localStorage.getItem('cyberport_cursor') || 'default');

  // Google OAuth & Real Gmail API dispatch states
  const [googleToken, setGoogleToken] = useState<string | null>(() => {
    return localStorage.getItem('cyberport_google_token');
  });
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string; picture: string } | null>(() => {
    const saved = localStorage.getItem('cyberport_google_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [googleClientId, setGoogleClientId] = useState<string>('');

  // Reviews System Local Memory
  const [reviewsDB, setReviewsDB] = useState<Record<string, Product['reviews']>>(() => {
    const saved = localStorage.getItem('cyberport_reviews');
    return saved ? JSON.parse(saved) : {};
  });

  // Review Input Form
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  // AI voice synthesizer control
  const [isAiVoiceEnabled, setIsAiVoiceEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('cyberport_ai_voice_enabled');
    return saved !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('cyberport_ai_voice_enabled', isAiVoiceEnabled ? 'true' : 'false');
    if (!isAiVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isAiVoiceEnabled]);

  const speakAiText = (text: string) => {
    if (!isAiVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
      const isChinese = /[\u4e00-\u9fa5]/.test(text);
      utterance.lang = isArabic ? 'ar-SA' : isChinese ? 'zh-CN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Spendings over the last 6 months for the active user
  const spendingData = useMemo(() => {
    if (!currentUser) return [];
    
    const userOrders = orders.filter(
      (o) => o.address?.email?.toLowerCase() === currentUser.email?.toLowerCase()
    );

    // Generate last 6 months programmatically ending with current local date
    const monthsData: { key: string; label: string; amount: number }[] = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      monthsData.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: `${monthName} ${year}`,
        amount: 0,
      });
    }

    userOrders.forEach((order) => {
      if (!order.date) return;
      try {
        let orderDate: Date;
        const dateStr = order.date.trim();
        if (dateStr.toLowerCase().startsWith('today')) {
          orderDate = new Date();
        } else if (dateStr.toLowerCase().startsWith('yesterday')) {
          orderDate = new Date();
          orderDate.setDate(orderDate.getDate() - 1);
        } else {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const month = parseInt(parts[0], 10) - 1;
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            orderDate = new Date(year, month, day);
          } else {
            orderDate = new Date(dateStr);
          }
        }

        if (isNaN(orderDate.getTime())) return;

        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;
        const orderKey = `${orderYear}-${String(orderMonth).padStart(2, '0')}`;

        const matchedMonth = monthsData.find((m) => m.key === orderKey);
        if (matchedMonth) {
          matchedMonth.amount += order.total;
        }
      } catch (e) {
        console.error("Error parsing order date:", e);
      }
    });

    return monthsData;
  }, [orders, currentUser?.email]);

  // Admin keyboard shortcuts and command palette setup
  const adminPaletteItems = useMemo(() => [
    { id: 'overview', name: 'Home (Overview)', category: 'Application', shortcut: 'Alt+H', subView: 'overview', icon: 'Home' },
    { id: 'inbox', name: 'Inbox & Notifications', category: 'Application', shortcut: 'Alt+I', subView: 'inbox', icon: 'Mail' },
    { id: 'calendar', name: 'Event Calendar', category: 'Application', shortcut: 'Alt+C', subView: 'calendar', icon: 'Calendar' },
    { id: 'search', name: 'Terminal / Database Search', category: 'Application', shortcut: 'Alt+S', subView: 'search', icon: 'Search' },
    { id: 'settings', name: 'System Settings', category: 'Application', shortcut: 'Alt+E', subView: 'settings', icon: 'Settings' },
    { id: 'products', name: 'See All Products', category: 'Products', shortcut: 'Alt+P', subView: 'products', icon: 'ShoppingBag' },
    { id: 'add-product', name: 'Add New Product', category: 'Products', shortcut: 'Alt+A', subView: 'add-product', icon: 'PlusCircle' },
    { id: 'add-category', name: 'Add Custom Category', category: 'Products', shortcut: 'Alt+Y', subView: 'add-category', icon: 'FolderPlus' },
    { id: 'users', name: 'See All Users', category: 'Users', shortcut: 'Alt+U', subView: 'users', icon: 'Users' },
    { id: 'add-user', name: 'Add New User Account', category: 'Users', shortcut: 'Alt+N', subView: 'add-user', icon: 'PlusCircle' },
    { id: 'transactions', name: 'See All Transactions', category: 'Orders / Payments', shortcut: 'Alt+T', subView: 'transactions', icon: 'CreditCard' },
    { id: 'add-order', name: 'Add Custom Order', category: 'Orders / Payments', shortcut: 'Alt+O', subView: 'add-order', icon: 'Plus' },
  ], []);

  const filteredPaletteItems = useMemo(() => {
    return adminPaletteItems.filter(item => 
      item.name.toLowerCase().includes(paletteSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(paletteSearchQuery.toLowerCase())
    );
  }, [paletteSearchQuery, adminPaletteItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only active if we have a current user with admin role and who is Mohab
      if (!isMohab) return;

      // 1. Command Palette Toggle: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAdminPaletteOpen(prev => !prev);
        setPaletteSearchQuery('');
        setPaletteSelectedIndex(0);
        return;
      }

      // If command palette is open, handle arrow keys and enter
      if (isAdminPaletteOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsAdminPaletteOpen(false);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setPaletteSelectedIndex(prev => {
            const len = filteredPaletteItems.length;
            return len > 0 ? (prev + 1) % len : 0;
          });
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setPaletteSelectedIndex(prev => {
            const len = filteredPaletteItems.length;
            return len > 0 ? (prev - 1 + len) % len : 0;
          });
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const selected = filteredPaletteItems[paletteSelectedIndex];
          if (selected) {
            setView('admin');
            setAdminSubView(selected.subView as any);
            setIsAdminPaletteOpen(false);
            triggerToast(`Navigated to ${selected.name}`, 'success');
          }
          return;
        }
      }

      // Don't trigger navigation hotkeys if focus is inside form elements (except when command palette is open)
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable
      )) {
        return;
      }

      // 2. Direct Hotkeys with Alt key
      if (e.altKey) {
        const key = e.key.toLowerCase();
        let targetSubView: typeof adminSubView | null = null;
        let name = '';

        switch (key) {
          case 'h':
            targetSubView = 'overview';
            name = 'Home';
            break;
          case 'i':
            targetSubView = 'inbox';
            name = 'Inbox';
            break;
          case 'c':
            targetSubView = 'calendar';
            name = 'Calendar';
            break;
          case 's':
            targetSubView = 'search';
            name = 'Search';
            break;
          case 'e':
            targetSubView = 'settings';
            name = 'Settings';
            break;
          case 'p':
            targetSubView = 'products';
            name = 'See All Products';
            break;
          case 'a':
            targetSubView = 'add-product';
            name = 'Add Product';
            break;
          case 'y':
            targetSubView = 'add-category';
            name = 'Add Category';
            break;
          case 'u':
            targetSubView = 'users';
            name = 'See All Users';
            break;
          case 'n':
            targetSubView = 'add-user';
            name = 'Add User';
            break;
          case 't':
            targetSubView = 'transactions';
            name = 'See All Transactions';
            break;
          case 'o':
            targetSubView = 'add-order';
            name = 'Add Order';
            break;
        }

        if (targetSubView) {
          e.preventDefault();
          setView('admin');
          setAdminSubView(targetSubView);
          triggerToast(`Navigated to ${name} (${key.toUpperCase()})`, 'success');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser, isAdminPaletteOpen, paletteSelectedIndex, filteredPaletteItems, adminSubView, view]);


  // Automated Delivery & Chat Bot simulation
  const [deliveryLogs, setDeliveryLogs] = useState<string[]>([]);
  const [isDeliveryLogOpen, setIsDeliveryLogOpen] = useState<boolean>(false);
  const [deliveryProduct, setDeliveryProduct] = useState<Product | null>(null);
  const [deliveryKey, setDeliveryKey] = useState<string>('');
  const [deliveryCountdown, setDeliveryCountdown] = useState<number>(0);
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sdazum_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('sdazum_wishlist', JSON.stringify(updated));
      triggerToast(
        prev.includes(productId) ? "Removed from Wishlist!" : "Added to Wishlist! ❤️",
        "success"
      );
      return updated;
    });
  };

  // Orders Tracker Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Processing' | 'Delivered'>('All');

  // Background countdown effect for license key generation process
  useEffect(() => {
    if (!isGeneratingKey || deliveryCountdown <= 0) {
      if (isGeneratingKey && deliveryCountdown === 0) {
        setIsGeneratingKey(false);
        setDeliveryLogs(prev => [
          ...prev,
          `[SUCCESS] Key generation completed successfully at ${new Date().toLocaleTimeString()}!`,
          `[AUTOBOT-DELIVERY] Instant delivery complete! Code unlocked.`
        ]);
        // Update newly placed order from 'Processing' to 'Delivered'
        setOrders(prev => {
          const next = prev.map(o => {
            if (o.status === 'Processing') {
              return { ...o, status: 'Delivered' as const };
            }
            return o;
          });
          if (currentUser && currentUser.email !== 'mohabmohnad9@gmail.com' && currentUser.email !== 'lamadevtest@gmail.com') {
            localStorage.setItem(`sdazum_orders_${currentUser.email}`, JSON.stringify(next));
          }
          return next;
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      setDeliveryCountdown(prev => {
        const next = prev - 1;
        if (next === 8) {
          setDeliveryLogs(l => [...l, `[MICROSERVICE-WAREHOUSE] Contacting Shandong dispatch node #87...`]);
        } else if (next === 6) {
          setDeliveryLogs(l => [...l, `[MICROSERVICE-WAREHOUSE] Authenticating signature with Shandong Azum Cargo Systems...`]);
        } else if (next === 4) {
          setDeliveryLogs(l => [...l, `[AUTO-SHIPPING] Allocating digital carrier route via heavy airfreight...`]);
        } else if (next === 2) {
          setDeliveryLogs(l => [...l, `[AUTO-SHIPPING] Finalizing digital signature authority and security certificates...`]);
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isGeneratingKey, deliveryCountdown, currentUser]);

  // AI Store Assistant Floating chatbot states
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; date: string }[]>(() => {
    const saved = localStorage.getItem('cyberport_ai_messages');
    return saved ? JSON.parse(saved) : [
      { sender: 'ai', text: "Welcome to Sdazum Cyberport! I am JARVIS, your highly advanced AI companion. Ask me for recommendations, to open YouTube, or to run diagnostics, Sir.", date: new Date().toLocaleTimeString() }
    ];
  });

  // Dedicated Customer Support Chat States
  const [activeAgent, setActiveAgent] = useState<string>('lounge');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const recordingSecondsRef = useRef<number>(0);
  const [mediaRecorderRef, setMediaRecorderRef] = useState<any>(null);
  const [recordingStreamRef, setRecordingStreamRef] = useState<any>(null);
  const [stickerPickerOpen, setStickerPickerOpen] = useState<boolean>(false);
  const [aiCopilotActive, setAiCopilotActive] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JARVIS Core Intelligent AI States & Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [jarvisTab, setJarvisTab] = useState<'TASKS' | 'SCHEDULE' | 'NETLINK' | 'DESKTOP' | '3D FAB' | 'MANSION'>('TASKS');
  const [redirectJarvisTab, setRedirectJarvisTab] = useState<string | null>(null);
  const [jarvisTasks, setJarvisTasks] = useState<{ id: string; text: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; due?: string; completed: boolean }[]>(() => {
    const saved = localStorage.getItem('cyberport_jarvis_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: "Synthesize Badassium element for new reactor core", priority: 'HIGH', due: '2026-07-06', completed: false },
      { id: '2', text: "Refine flight stabilizer software on Mark 85", priority: 'MEDIUM', completed: false },
      { id: '3', text: "Check structural integrity of Stark Tower sub-level 4", priority: 'LOW', completed: true },
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  useEffect(() => {
    localStorage.setItem('cyberport_jarvis_tasks', JSON.stringify(jarvisTasks));
  }, [jarvisTasks]);

  useEffect(() => {
    if (currentUser && redirectJarvisTab) {
      setJarvisTab(redirectJarvisTab as any);
      setView('ai');
      triggerToast(`Welcome back, Sir! Launching requested ${redirectJarvisTab} protocol...`, "success");
      setRedirectJarvisTab(null);
    }
  }, [currentUser, redirectJarvisTab]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Failed to start camera for JARVIS scanner:", err);
          triggerToast("Failed to start camera for JARVIS: " + err.message, "error");
          setIsCameraOn(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; name: string; avatar: string; joinedDate: string; role: string; status: string }[]>([]);

  // Automatically delete virtual users if other real users are present in the registered list
  useEffect(() => {
    const hasOtherRealUsers = registeredUsers.some(u => 
      u.email !== 'mohabmohnad9@gmail.com' && 
      u.email !== 'lamadevtest@gmail.com'
    );
    
    if (hasOtherRealUsers) {
      setUsers(prev => {
        const filtered = prev.filter(u => 
          u.email !== 'graceallen07@yahoo.com' && 
          u.email !== 'mattsc44@gmail.com'
        );
        let updated = [...filtered];
        registeredUsers.forEach(ru => {
          const exists = updated.some(u => u.email.toLowerCase() === ru.email.toLowerCase());
          if (!exists) {
            updated.push({
              id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              username: ru.name,
              email: ru.email,
              avatar: ru.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(ru.email)}`,
              status: (ru.status as any) || 'active',
              role: (ru.role as any) || 'user',
              joinedDate: ru.joinedDate || new Date().toLocaleDateString()
            });
          }
        });
        return updated;
      });
    } else {
      setUsers(prev => {
        let updated = [...prev];
        registeredUsers.forEach(ru => {
          const exists = updated.some(u => u.email.toLowerCase() === ru.email.toLowerCase());
          if (!exists) {
            updated.push({
              id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              username: ru.name,
              email: ru.email,
              avatar: ru.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(ru.email)}`,
              status: (ru.status as any) || 'active',
              role: (ru.role as any) || 'user',
              joinedDate: ru.joinedDate || new Date().toLocaleDateString()
            });
          }
        });
        return updated;
      });
    }
  }, [registeredUsers]);

  const [chatInputs, setChatInputs] = useState<Record<string, string>>({
    elena: '',
    marcus: '',
    sora: '',
    lounge: '',
  });
  const [chatIsTyping, setChatIsTyping] = useState<boolean>(false);
  
  // Base default static histories
  const defaultHistories: Record<string, { sender: 'user' | 'agent'; text: string; date: string; userName?: string; userAvatar?: string; audioUrl?: string | null; stickerUrl?: string | null; file?: { url: string; name: string; type: string; size: string } | null }[]> = {
    elena: [
      { sender: 'agent', text: "Hello! I'm Elena, lead Dispatch & Logistics Engineer here. If you just placed an order and need your automated microservice dispatch license key, or want me to trace your simulation logs, let me know! How can I assist you today?", date: new Date().toLocaleTimeString() }
    ],
    marcus: [
      { sender: 'agent', text: "Hi! I'm Marcus from billing and store operations. I can assist you with credit card payments, refund requests, or switching your account tiers. What's on your mind?", date: new Date().toLocaleTimeString() }
    ],
    sora: [
      { sender: 'agent', text: "Hello! I'm Sora, your industrial machinery expert. I'm ready to help you analyze technical specifications, power/voltage requirements (220V/380V/440V), and load capacities for our CNC, robotic arm, and laser cutter models. Let's build your perfect automation stack!", date: new Date().toLocaleTimeString() }
    ],
    lounge: []
  };

  const [chatHistories, setChatHistories] = useState<Record<string, any[]>>(defaultHistories);

  const socketRef = useRef<WebSocket | null>(null);

  // Chat auto-scroll refs and effects
  const jarvisChatFeedRef = useRef<HTMLDivElement | null>(null);
  const globalLoungeChatFeedRef = useRef<HTMLDivElement | null>(null);
  const dedicatedChatHubFeedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (jarvisChatFeedRef.current) {
      jarvisChatFeedRef.current.scrollTop = jarvisChatFeedRef.current.scrollHeight;
    }
  }, [aiMessages, view, jarvisTab]);

  useEffect(() => {
    if (globalLoungeChatFeedRef.current) {
      globalLoungeChatFeedRef.current.scrollTop = globalLoungeChatFeedRef.current.scrollHeight;
    }
  }, [aiMessages, view, jarvisTab]);

  useEffect(() => {
    if (dedicatedChatHubFeedRef.current) {
      dedicatedChatHubFeedRef.current.scrollTop = dedicatedChatHubFeedRef.current.scrollHeight;
    }
  }, [chatHistories, activeAgent, view]);

  // Poll registered user directory dynamically
  useEffect(() => {
    const fetchUsers = () => {
      fetch("/api/auth/users")
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Received non-JSON response from server");
          }
          return res.json();
        })
        .then(data => {
          if (data.users) {
            setRegisteredUsers(data.users);
          }
        })
        .catch(err => {
          console.log("[Directory Sync] Server is starting up, waiting for endpoint... Info:", err.message || err);
        });
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync state helpers
  const groupMessages = (messages: any[]) => {
    const userEmail = currentUser?.email || '';
    
    const hasOtherRealUsers = registeredUsers.some(u => 
      u.email !== 'mohabmohnad9@gmail.com' && 
      u.email !== 'lamadevtest@gmail.com'
    );

    // Start with default greetings
    const groups: Record<string, any[]> = {
      elena: [...defaultHistories.elena],
      marcus: [...defaultHistories.marcus],
      sora: [...defaultHistories.sora],
      lounge: [...defaultHistories.lounge]
    };

    messages.forEach(msg => {
      const rec = msg.recipientId || 'lounge';
      const send = msg.senderEmail || 'guest@cyberport.com';

      if (rec === 'lounge') {
        groups.lounge.push(msg);
      } else if (rec === 'elena' || send === 'elena') {
        groups.elena.push(msg);
      } else if (rec === 'marcus' || send === 'marcus') {
        groups.marcus.push(msg);
      } else if (rec === 'sora' || send === 'sora') {
        groups.sora.push(msg);
      } else {
        // Private chat between two users!
        const peer = send === userEmail ? rec : send;
        if (!groups[peer]) {
          groups[peer] = [];
        }
        groups[peer].push(msg);
      }
    });

    return groups;
  };

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;

    function connect() {
      if (!active) return;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws-chat`;
      console.log("[WS CONNECTING]", wsUrl);
      
      try {
        socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("[WS CONNECTED]");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'init') {
              setChatHistories(groupMessages(data.messages));
            } else if (data.type === 'message' || data.type === 'message_deleted') {
              fetch("/api/chat/history")
                .then(res => res.json())
                .then(data => {
                  if (data.messages && active) {
                    setChatHistories(groupMessages(data.messages));
                  }
                });
            }
          } catch (err) {
            console.warn("[WS MESSAGE ERROR]", err);
          }
        };

        socket.onclose = () => {
          console.log("[WS CLOSED] Reconnecting in 5 seconds...");
          if (active) {
            reconnectTimeout = setTimeout(connect, 5000);
          }
        };

        socket.onerror = () => {
          console.log("[WS INFO] Sandbox environment port restriction detected. Using standard HTTP fallback chat channels.");
        };
      } catch (err) {
        console.log("[WS INFO] WebSocket initialization bypassed in sandbox environment. Running HTTP backup polling.");
      }
    }

    // Load initial chat history
    fetch("/api/chat/history")
      .then(res => res.json())
      .then(data => {
        if (data.messages && active) {
          setChatHistories(groupMessages(data.messages));
        }
      })
      .catch(err => console.warn("Failed to load chat history via HTTP fallback:", err));

    connect();

    // Polling interval backup
    const pollInterval = setInterval(() => {
      if (!active) return;
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        fetch("/api/chat/history")
          .then(res => res.json())
          .then(data => {
            if (data.messages && active) {
              setChatHistories(groupMessages(data.messages));
            }
          })
          .catch(err => console.warn("Polling fallback issue:", err));
      }
    }, 4000);

    return () => {
      active = false;
      clearInterval(pollInterval);
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [currentUser]);

  // High-quality animated stickers for Operators Lounge & AI Chat
  const stickers = [
    { id: '1', emoji: '⚡', label: 'Overvoltage!', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp' },
    { id: '2', emoji: '🔥', label: 'Maximum Power!', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp' },
    { id: '3', emoji: '🚀', label: 'Boost Performance', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp' },
    { id: '4', emoji: '🛠️', label: 'Maintenance Mode', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6e0_fe0f/512.webp' },
    { id: '5', emoji: '🤖', label: 'AI Operating', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp' },
    { id: '6', emoji: '🏆', label: 'Premium Quality', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.webp' },
    { id: '7', emoji: '📦', label: 'Dispatched!', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4e6/512.webp' },
    { id: '8', emoji: '🦾', label: 'Bionic Calibration', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f9be/512.webp' },
    { id: '9', emoji: '😎', label: 'Super Operator', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.webp' },
    { id: '10', emoji: '🎉', label: 'Success Celebration', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp' },
    { id: '11', emoji: '💡', label: 'Brilliant Idea', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.webp' },
    { id: '12', emoji: '🎯', label: 'Target Calibrated', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3af/512.webp' },
    { id: '13', emoji: '📈', label: 'Efficiency Growth', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4c8/512.webp' },
    { id: '14', emoji: '💎', label: 'High Quality', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/512.webp' },
    { id: '15', emoji: '🚨', label: 'Critical Alert!', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a8/512.webp' },
    { id: '16', emoji: '⏳', label: 'Synchronizing...', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/23f3/512.webp' },
    { id: '17', emoji: '🌟', label: 'Perfect Specs', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp' },
    { id: '18', emoji: '🤝', label: 'Partner Deal', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f91d/512.webp' },
    { id: '19', emoji: '🌍', label: 'Global Trade', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f30f/512.webp' },
    { id: '20', emoji: '🏗️', label: 'Production Plant', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3d7_fe0f/512.webp' },
    { id: '21', emoji: '💖', label: 'Highly Liked', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.webp' },
    { id: '22', emoji: '👏', label: 'Great Job', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44f/512.webp' },
    { id: '23', emoji: '🥳', label: 'Trade Festivity', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp' },
    { id: '24', emoji: '💥', label: 'Booster Hit', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a5/512.webp' },
  ];

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Voice message is requested to be "little long", so we ensure it is at least 32 seconds
        const finalDuration = Math.max(recordingSecondsRef.current + 25, 32);
        sendMessageToBackend(`🎤 Voice Message (${finalDuration}s)`, null, audioUrl, undefined);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorderRef(recorder);
      setRecordingStreamRef(stream);
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access denied, falling back to simulation:", err);
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef && isRecording) {
      try {
        mediaRecorderRef.stop();
      } catch (err) {
        console.warn("Error stopping MediaRecorder:", err);
      }
      setIsRecording(false);
    } else if (isRecording) {
      setIsRecording(false);
      // Voice message is requested to be "little long", so we ensure it is at least 35 seconds
      const simulatedSeconds = Math.max(recordingSecondsRef.current + 28, 35);
      const mockAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      
      sendMessageToBackend(`🎤 Voice Message (${simulatedSeconds}s)`, null, mockAudioUrl, undefined);
      if (recordingStreamRef) {
        recordingStreamRef.getTracks().forEach((track: any) => track.stop());
      }
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => {
          const next = prev + 1;
          recordingSecondsRef.current = next;
          return next;
        });
      }, 1000);
    } else {
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const sendMessageToBackend = async (text: string, fileData?: any, audioUrl?: string, stickerUrl?: string) => {
    const userEmail = currentUser?.email || 'guest@cyberport.com';
    const userName = currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : 'Guest Operator';
    const userAvatar = currentUser ? profileImage : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';

    // Optimistically update local chat UI immediately for lightning-fast feedback
    const optimisticMsg = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: "user",
      senderEmail: userEmail,
      recipientId: activeAgent,
      text: text || "",
      date: new Date().toLocaleTimeString(),
      userName: userName,
      userAvatar: userAvatar,
      audioUrl: audioUrl || null,
      stickerUrl: stickerUrl || null,
      file: fileData || null,
      timestamp: Date.now()
    };

    setChatHistories(prev => {
      const activeGroup = activeAgent || "lounge";
      const currentList = prev[activeGroup] || [];
      // Prevent duplicate optimistic entries
      if (currentList.some(m => m.text === text && Math.abs(m.timestamp - Date.now()) < 1000)) {
        return prev;
      }
      return {
        ...prev,
        [activeGroup]: [...currentList, optimisticMsg]
      };
    });

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          senderEmail: userEmail,
          recipientId: activeAgent,
          userName,
          userAvatar,
          audioUrl: audioUrl || null,
          stickerUrl: stickerUrl || null,
          file: fileData || null,
          aiCopilotActive
        })
      });
      if (response.ok) {
        const hRes = await fetch("/api/chat/history");
        const hData = await hRes.json();
        if (hData.messages) {
          setChatHistories(groupMessages(hData.messages));
        }
      }
    } catch (err) {
      console.error("Failed to send message to backend:", err);
    }
  };

  const sendSticker = (stickerUrl: string, stickerLabel: string) => {
    sendMessageToBackend(`[Sticker: ${stickerLabel}]`, null, undefined, stickerUrl);
    setStickerPickerOpen(false);
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const fileData = {
        name: file.name,
        url: dataUrl,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`
      };

      sendMessageToBackend(`📁 Attachment: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, fileData, undefined, undefined);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSupportMessageSubmit = (e: React.FormEvent, agentId: string) => {
    e.preventDefault();
    const currentInput = chatInputs[agentId].trim();
    if (!currentInput) return;

    setChatInputs(prev => ({ ...prev, [agentId]: '' }));
    sendMessageToBackend(currentInput, null, undefined, undefined);
  };

  const deleteChatMessage = async (id: string, senderEmail: string) => {
    if (!currentUser) {
      triggerToast("Please log in to delete your messages", "error");
      return;
    }
    
    if (senderEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
      triggerToast("You can only delete your own messages!", "error");
      return;
    }

    try {
      const response = await fetch(`/api/chat/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email })
      });
      if (response.ok) {
        triggerToast("Message deleted successfully", "success");
        const hRes = await fetch("/api/chat/history");
        const hData = await hRes.json();
        if (hData.messages) {
          setChatHistories(groupMessages(hData.messages));
        }
      } else {
        const errData = await response.json();
        triggerToast(errData.error || "Failed to delete message", "error");
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
      triggerToast("Failed to delete message due to connection issue", "error");
    }
  };

  // Microservices automated live diagnostics ticker
  const [microservicesLogs, setMicroservicesLogs] = useState<string[]>([
    "[GATEWAY-PROXY] Listening on port 3000...",
    "[SERVICE-DISCOVERY] Registered microservices catalog-v2, auto-delivery",
    "[SEO-OPTIMIZER] Crawled pages, schema.org tags loaded 100%"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const logs = [
        `[HEALTH-CHECK] Core Microservice node ok - CPU 12% | MEM 140MB`,
        `[SEO-CRON] Site index updated. Google index request ping: 200 OK`,
        `[AUTO-DELIVERY-DAEMON] Polling dispatch broker... 0 pending orders.`,
        `[LEDGER-SYNC] Secure payment transaction state synchronized.`
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setMicroservicesLogs(prev => [randomLog, ...prev.filter(Boolean)].slice(0, 10));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const defaultEngraving = currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : '';
    setCustomEngravingName(defaultEngraving);
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || '');
      setSelectedColor(selectedProduct.colors[0] || null);
    }
  }, [selectedProduct, currentUser]);

  // Synchronize products to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cyberport_products', JSON.stringify(products));
  }, [products]);

  // 1. Fetch Google Client ID from backend
  useEffect(() => {
    fetch("/api/google-client-id")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }
        return res.json();
      })
      .then(data => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
        }
      })
      .catch(err => {
        const errMsg = err?.message || '';
        if (errMsg === 'Failed to fetch' || errMsg.includes('fetch') || errMsg.includes('non-JSON')) {
          console.warn("Could not fetch Google Client ID (using sandboxed/simulated mode):", errMsg);
        } else {
          console.warn("Could not load Google Client ID, waiting for server readiness:", err);
        }
      });
  }, []);

  // Handle auto-opening Quick View or Product Details via URL Query Parameters
  useEffect(() => {
    if (products.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const quickViewId = urlParams.get('quickview');
      const detailsId = urlParams.get('details');
      const sortByParam = urlParams.get('sortBy');
      const categoryParam = urlParams.get('category');
      const filterParam = urlParams.get('filter');

      if (sortByParam) {
        setSortBy(sortByParam);
      }
      if (categoryParam) {
        setActiveCategory(categoryParam);
      }
      if (filterParam) {
        setCatalogTagFilter(filterParam as any);
      }
      
      if (quickViewId) {
        const p = products.find(prod => prod.id === quickViewId);
        if (p) {
          setQuickViewProduct(p);
          setTimeout(() => {
            document.getElementById('products-grid-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      } else if (detailsId) {
        const p = products.find(prod => prod.id === detailsId);
        if (p) {
          setExpandedProduct(p);
          setTimeout(() => {
            document.getElementById('products-grid-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      }
    }
  }, [products]);

  // 2. Handle Google OAuth redirect code exchange
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Clear code query parameter from URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
      
      triggerToast("Exchanging authorization code with Google...", "success");
      
      fetch("/api/oauth/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirectUri: window.location.origin + "/"
        })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Failed to exchange authorization code");
          }
          setGoogleToken(data.accessToken);
          localStorage.setItem('cyberport_google_token', data.accessToken);
          setGoogleUser(data.user);
          localStorage.setItem('cyberport_google_user', JSON.stringify(data.user));
          // Auto-align main app user context with Google user!
          setCurrentUser({
            email: data.user.email,
            role: data.user.email === 'mohabmohnad9@gmail.com' ? 'admin' : 'user'
          });
          triggerToast(`Successfully connected to Gmail: ${data.user.email}!`, "success");
        })
        .catch(err => {
          console.error("Google Exchange Error:", err);
          triggerToast(`Gmail connection failed: ${err.message}`, "error");
        });
    }
  }, []);

  const t = translations[language];

  // Action Helpers: Trigger system toast notification
  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleProductCardClick = (p: Product) => {
    if (loadingProductId) return;
    setLoadingProductId(p.id);
    setTimeout(() => {
      setSelectedProduct(p);
      setView('product-details');
      setLoadingProductId(null);
    }, 700);
  };

  // Reusable Native Sharing helper with copy clipboard fallback
  const handleShareProduct = async (product: Product) => {
    const params = new URLSearchParams();
    params.set('details', product.id);
    params.set('sortBy', sortBy);
    params.set('category', activeCategory);
    params.set('filter', catalogTagFilter);
    const deepLinkUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: deepLinkUrl,
        });
        triggerToast("Shared successfully!", "success");
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(deepLinkUrl);
          triggerToast(`Deep-link with filters copied for "${product.name}"!`, "success");
        }
      }
    } else {
      navigator.clipboard.writeText(deepLinkUrl);
      triggerToast(`Deep-link with filters copied for "${product.name}"!`, "success");
    }
  };

  const handleRequestRestock = async (product: Product) => {
    const supplierEmail = "supplier-logistics@shandongazum.com";
    const restockQty = 100 - (product.stock || 0);
    const restockOrder = {
      orderId: `RESTOCK-${Date.now().toString().slice(-6)}`,
      customerName: "Sdazum Warehouse Procurement",
      shippingAddress: "Plot 12A, Jinan Industrial Zone, Shandong, China",
      total: 0,
      products: [{
        name: `Restock Order: ${product.name}`,
        quantity: restockQty,
        price: product.price
      }]
    };

    triggerToast(`Requesting Restock for ${product.name}...`, "success");

    // Simulated restock dispatch if googleToken is missing
    if (!googleToken) {
      setTimeout(() => {
        setProducts(prev => {
          const nextProds = prev.map(p => {
            if (p.id === product.id) {
              return { ...p, stock: 100, lastRestockDate: new Date().toISOString().split('T')[0] };
            }
            return p;
          });
          localStorage.setItem('cyberport_products', JSON.stringify(nextProds));
          return nextProds;
        });
        triggerToast(`🚀 Restock email dispatched to supplier! Stock level reset to 100 units!`, "success");
      }, 1500);
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: googleToken,
          toEmail: supplierEmail,
          order: restockOrder,
          deliveryKey: `RESTOCK-KEY-${Date.now()}`
        })
      });
      if (res.ok) {
        setProducts(prev => {
          const nextProds = prev.map(p => {
            if (p.id === product.id) {
              return { ...p, stock: 100, lastRestockDate: new Date().toISOString().split('T')[0] };
            }
            return p;
          });
          localStorage.setItem('cyberport_products', JSON.stringify(nextProds));
          return nextProds;
        });
        triggerToast(`🚀 Real-time restock email sent via Gmail to ${supplierEmail}! Supply chain restocked!`, "success");
      } else {
        throw new Error("Failed to dispatch");
      }
    } catch (e) {
      triggerToast("Error sending restock email. Restocking locally...", "error");
      setProducts(prev => {
        const nextProds = prev.map(p => {
          if (p.id === product.id) {
            return { ...p, stock: 100, lastRestockDate: new Date().toISOString().split('T')[0] };
          }
          return p;
        });
        localStorage.setItem('cyberport_products', JSON.stringify(nextProds));
        return nextProds;
      });
    }
  };

  const handleReorder = (sourceId: string, targetId: string) => {
    setProducts(prevProducts => {
      const sourceIndex = prevProducts.findIndex(p => p.id === sourceId);
      const targetIndex = prevProducts.findIndex(p => p.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prevProducts;
      const updated = [...prevProducts];
      const [removed] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, removed);
      return updated;
    });
  };

  const handleConnectGmail = () => {
    if (!googleClientId) {
      triggerToast("Google OAuth is not configured on this server.", "error");
      return;
    }
    const scopes = [
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes.join(' '))}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    triggerToast("Redirecting to Google Sign-In...", "success");
    window.location.href = authUrl;
  };

  const handleDisconnectGmail = () => {
    setGoogleToken(null);
    setGoogleUser(null);
    localStorage.removeItem('cyberport_google_token');
    localStorage.removeItem('cyberport_google_user');
    triggerToast("Gmail service disconnected.", "success");
  };

  const sendRealGmailNotification = (order: Order, deliveryKey: string) => {
    const toEmail = currentUser?.email || order.address.email || "mohabmohnad9@gmail.com";
    
    // Construct premium HTML receipt for simulation & inbox display
    const receiptHtml = `
      <div style="font-family: sans-serif; color: #cbd5e1; background-color: #0b0f19; padding: 25px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: auto;">
        <div style="background: linear-gradient(135deg, #1e1b4b, #311042); padding: 20px; border-radius: 12px; border-bottom: 3px solid #ec4899; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; letter-spacing: 0.1em; font-size: 22px;">⚡ SHANDONG AZUM SALES RECEIPT</h2>
          <span style="color: #ec4899; font-size: 11px; font-family: monospace; font-weight: bold;">AUTOMATED EMAIL DISPATCH</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px;">Transaction ID: <span style="color: #00f0ff; font-family: monospace;">${order.id}</span></p>
        <p style="color: #e2e8f0; font-size: 15px;">Dear <strong>${order.address.name}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Your heavy machinery purchase has been cleared by Shandong Azum Import & Export Co., Ltd sales terminal. The details of your order are shown below:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #334155; text-align: left;">
              <th style="padding: 10px; color: #94a3b8; font-size: 12px; font-family: monospace;">ITEM SPECS</th>
              <th style="padding: 10px; color: #94a3b8; font-size: 12px; font-family: monospace; text-align: center;">QTY</th>
              <th style="padding: 10px; color: #94a3b8; font-size: 12px; font-family: monospace; text-align: right;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map(p => `
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 12px; color: #ffffff; font-size: 14px;">
                  <strong>${p.name}</strong>
                  ${p.customName ? `<div style="font-size: 11px; color: #f43f5e; font-family: monospace; margin-top: 4px;">✏️ Laser ID: "${p.customName}"</div>` : ''}
                </td>
                <td style="padding: 12px; color: #00f0ff; font-family: monospace; font-size: 14px; text-align: center;">x${p.quantity}</td>
                <td style="padding: 12px; color: #e2e8f0; font-family: monospace; font-size: 14px; text-align: right;">$${(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="border-top: 2px solid #334155; padding-top: 15px; display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; color: #ffffff; margin-top: 15px;">
          <span>GRAND TOTAL CHARGED:</span>
          <span style="color: #00f0ff;">$${order.total.toFixed(2)}</span>
        </div>
        
        <div style="background-color: #020617; padding: 15px; border-radius: 12px; border: 1px dashed #ec4899; margin-top: 25px; text-align: center;">
          <span style="color: #ec4899; font-family: monospace; font-size: 10px; display: block; margin-bottom: 6px; font-weight: bold; letter-spacing: 0.1em;">LOGISTICS DELIVERY LICENSE KEY</span>
          <strong style="color: #ffffff; font-family: monospace; font-size: 16px; letter-spacing: 0.12em;">${deliveryKey}</strong>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; text-align: center; color: #64748b; font-size: 11px; font-family: monospace;">
          <p>© 2026 Shandong Azum Import & Export Co., Ltd. All Rights Reserved.</p>
          <p>www.azumgroup.com | Altayeb Yousif Dafalla</p>
        </div>
      </div>
    `;

    // Append to simulated in-app Gmail inbox
    setAdminInbox(prev => [
      {
        id: `mail-${Date.now()}`,
        from: "sales@sdazum.com",
        to: toEmail,
        subject: `⚡ Order Dispatch Confirmed: #${order.id.substring(0, 8).toUpperCase()}`,
        date: new Date().toLocaleTimeString(),
        body: receiptHtml
      },
      ...prev
    ]);

    if (!googleToken) {
      console.log("[GMAIL DISPATCH] Gmail API is not active. (Sign in with Google to enable real email notifications)");
      triggerToast(`Order confirmed! Receipt dispatched to simulated inbox and ${toEmail}.`, "success");
      return;
    }

    triggerToast(`Gmail active. Dispatching real receipt to ${toEmail}...`, "success");

    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: googleToken,
        toEmail,
        order,
        deliveryKey
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to dispatch email");
        }
        triggerToast(`🚀 Order receipt dispatched to ${toEmail} successfully!`, "success");
      })
      .catch(err => {
        console.error("Gmail Send Error:", err);
        triggerToast(`Gmail dispatch failed: ${err.message}`, "error");
      });
  };

  // Add Item to cart with support for custom sizes and colors and custom names
  const handleAddToCart = (product: Product, qty: number, size: string, color: { name: string; value: string }, customName?: string) => {
    if (!currentUser) {
      triggerToast("Please login or signup first to purchase industrial machinery!", "error");
      setView('auth');
      return;
    }

    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name &&
        item.customName === customName
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: qty, selectedSize: size, selectedColor: color, customName }]);
    }
    const label = customName ? `${product.name} (Custom: "${customName}")` : product.name;
    triggerToast(`Added ${qty}x ${label} to your cart.`, 'success');
  };

  // One-click Cyber Wallet Instant Purchase (Directly triggers Automated Microservice Delivery)
  const handleWalletPurchase = (product: Product, qty: number, size: string, color: { name: string; value: string }, customName?: string) => {
    if (!currentUser) {
      triggerToast("Please login or signup first to purchase industrial machinery!", "error");
      setView('auth');
      return;
    }

    const cost = product.price * qty;
    if (walletBalance < cost) {
      triggerToast("Insufficient Cyber Wallet Balance! Claim free credits or enter a referral code.", "error");
      return;
    }

    // Deduct cost from wallet
    setWalletBalance(prev => prev - cost);
    triggerToast(`Purchased ${product.name} successfully using Cyber Wallet!`, "success");

    // Push new simulated order
    const mockOrder: Order = {
      id: `ord-${Math.floor(Math.random() * 90000) + 10000}`,
      total: cost,
      status: 'Processing',
      date: new Date().toLocaleDateString(),
      products: [{ 
        name: product.name, 
        quantity: qty, 
        size: size || 'M', 
        color: color?.name || 'Standard', 
        price: product.price,
        customName
      }],
      address: {
        name: currentUser?.email || 'Valued Athlete',
        email: currentUser?.email || 'mohabmohnad9@gmail.com',
        phone: 'Instant Digital Delivery',
        address: 'Cyberport Main Frame',
        city: 'Metropolitan Web Sandbox'
      }
    };
    setOrders(prev => {
      const next = [mockOrder, ...prev];
      if (currentUser && currentUser.email !== 'mohabmohnad9@gmail.com' && currentUser.email !== 'lamadevtest@gmail.com') {
        localStorage.setItem(`sdazum_orders_${currentUser.email}`, JSON.stringify(next));
      }
      return next;
    });
    updateTelemetryAction('purchase', cost);

    // Update Product Sales Count dynamically
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.id === product.id) {
          return { ...p, salesCount: (p.salesCount || 0) + qty };
        }
        return p;
      });
    });

    // Boot Automated Digital Delivery sequence with dynamic countdown timer
    const generatedKey = `NK-KEY-${Math.floor(Math.random() * 899999) + 100000}-${product.id.toUpperCase()}`;
    setDeliveryProduct(product);
    setDeliveryKey(generatedKey);
    setDeliveryLogs([
      `[AUTOBOT-DELIVERY] Order event captured: ID ${mockOrder.id}`,
      `[WALLET-CHECKOUT] Verified payment of $${cost.toFixed(2)} USD`,
      `[MICROSERVICE-WAREHOUSE] Retrieving digital license keys...`,
      `[MICROSERVICE-WAREHOUSE] Initializing digital license key cryptographic generator...`
    ]);
    setDeliveryCountdown(10);
    setIsGeneratingKey(true);
    setIsDeliveryLogOpen(true);

    // Dispatch Gmail notification
    sendRealGmailNotification(mockOrder, generatedKey);
  };

  // Submit product review dynamically
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!newComment.trim()) {
      triggerToast("Please enter a comment message first!", "error");
      return;
    }

    const reviewObj = {
      id: `rev-${Date.now()}`,
      userName: currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : "Anonymous Athlete",
      userEmail: currentUser?.email,
      userAvatar: profileImage,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    // Update reviews list in state
    const currentReviews = reviewsDB[selectedProduct.id] || selectedProduct.reviews || [];
    const updatedReviews = [reviewObj, ...currentReviews];
    
    const nextReviewsDB = {
      ...reviewsDB,
      [selectedProduct.id]: updatedReviews
    };
    setReviewsDB(nextReviewsDB);
    localStorage.setItem('cyberport_reviews', JSON.stringify(nextReviewsDB));

    // Also update products state and save to products db in localStorage
    setProducts(prevProducts => {
      const nextProds = prevProducts.map(p => {
        if (p.id === selectedProduct.id) {
          return {
            ...p,
            reviews: [reviewObj, ...(p.reviews || [])]
          };
        }
        return p;
      });
      localStorage.setItem('cyberport_products', JSON.stringify(nextProds));
      return nextProds;
    });

    triggerToast("Your review and star ratings have been published!", "success");
    setNewComment('');
  };

  // Storefront Filter and Sort logic
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const queryLower = searchTerm.toLowerCase().trim();
      const translatedLower = translatedSearchTerm.toLowerCase().trim();

      const dispName = (p[`name_${language}` as keyof typeof p] || p.name || '').toString().toLowerCase();
      const engName = (p.name || '').toLowerCase();
      const zhName = (p.name_zh || '').toLowerCase();
      const arName = (p.name_ar || '').toLowerCase();
      const category = (p.category || '').toLowerCase();
      const description = (p.description || '').toLowerCase();

      const matchesSearch = !queryLower || 
        dispName.includes(queryLower) ||
        engName.includes(queryLower) ||
        zhName.includes(queryLower) ||
        arName.includes(queryLower) ||
        category.includes(queryLower) ||
        description.includes(queryLower) ||
        (translatedLower && (
          dispName.includes(translatedLower) ||
          engName.includes(translatedLower) ||
          category.includes(translatedLower) ||
          description.includes(translatedLower)
        ));

      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();

      let matchesTag = true;
      if (catalogTagFilter === 'high-demand') {
        matchesTag = (p.salesCount !== undefined && p.salesCount >= 15) || (p.rating !== undefined && p.rating >= 4.8);
      } else if (catalogTagFilter === 'low-stock') {
        matchesTag = p.stock !== undefined && p.stock < 15;
      } else if (catalogTagFilter === 'new-arrivals') {
        matchesTag = p.isNew || p.id === '1' || p.id === '3' || p.id === '5' || (p.stock !== undefined && p.stock % 3 === 0);
      }

      if (scannedTargetProductId) {
        return p.id === scannedTargetProductId;
      }

      return matchesSearch && matchesCategory && matchesTag;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock-asc') {
      return [...filtered].sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (sortBy === 'stock-desc') {
      return [...filtered].sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === 'name-asc') {
      return [...filtered].sort((a, b) => {
        const nameA = (a[`name_${language}` as keyof typeof a] || a.name || '').toString().toLowerCase();
        const nameB = (b[`name_${language}` as keyof typeof b] || b.name || '').toString().toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === 'name-desc') {
      return [...filtered].sort((a, b) => {
        const nameA = (a[`name_${language}` as keyof typeof a] || a.name || '').toString().toLowerCase();
        const nameB = (b[`name_${language}` as keyof typeof b] || b.name || '').toString().toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }

    return filtered;
  }, [products, searchTerm, activeCategory, language, sortBy, catalogTagFilter]);

  const allFilteredSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedBulkProductIds.includes(p.id));

  const handleToggleSelectAllVisible = () => {
    if (filteredProducts.length === 0) {
      triggerToast("No visible products to select", "error");
      return;
    }
    if (allFilteredSelected) {
      // Deselect all filtered products
      const filteredIds = filteredProducts.map(p => p.id);
      setSelectedBulkProductIds(prev => prev.filter(id => !filteredIds.includes(id)));
      triggerToast("Deselected all currently visible products", "success");
    } else {
      // Select all filtered products
      const filteredIds = filteredProducts.map(p => p.id);
      setSelectedBulkProductIds(prev => {
        const union = new Set([...prev, ...filteredIds]);
        return Array.from(union);
      });
      setBulkTagMode(true);
      triggerToast(`Selected all ${filteredProducts.length} visible products for bulk tagging`, "success");
    }
  };

  const handleResetCatalog = () => {
    // 1. Clears all custom tags on products
    setProducts(prev => {
      const next = prev.map(p => ({ ...p, customBadge: undefined }));
      localStorage.setItem('cyberport_products', JSON.stringify(next));
      return next;
    });
    // 2. Resets stock alert thresholds to default
    setStockAlertThresholds({});
    localStorage.removeItem('azum_stock_thresholds');
    // 3. Removes all product temporary visual states
    setSelectedBulkProductIds([]);
    setCompareProductIds([]);
    setBulkTagMode(false);
    setShowCompareModal(false);
    setQrCodeProduct(null);
    setQuickViewProduct(null);
    setExpandedProduct(null);
    setHoveredStockProductId(null);
    
    triggerToast("Catalog fully reset: all custom tags cleared, stock alert thresholds set to default, and all temporary visual states removed.", "success");
  };

  // Handler for custom product uploads
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Please login / signup first to post custom items!", "error");
      setAuthIsSignUp(false);
      setView('auth');
      setIsAddProductOpen(false);
      return;
    }

    if (!isMohab) {
      triggerToast("Access Denied: Only primary admin (Mohab) can host new products.", "error");
      setIsAddProductOpen(false);
      return;
    }

    const mainName = newProductForm.name_en || newProductForm.name_zh || newProductForm.name_ar || 'Unnamed Product';
    if (!mainName || !newProductForm.price) {
      triggerToast('Name and Price are required!', 'error');
      return;
    }

    const priceNum = parseFloat(newProductForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please specify a valid numeric price!', 'error');
      return;
    }

    const defaultShort = newProductForm.short_en || newProductForm.short_zh || newProductForm.short_ar || 'Exclusive machinery specs.';
    const defaultDesc = newProductForm.desc_en || newProductForm.desc_zh || newProductForm.desc_ar || 'Premium aerospace-grade machinery crafted by top engineers.';

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: mainName,
      description: defaultDesc,
      shortDescription: defaultShort,
      name_en: newProductForm.name_en || mainName,
      name_zh: newProductForm.name_zh || mainName,
      name_ar: newProductForm.name_ar || mainName,
      short_en: newProductForm.short_en || defaultShort,
      short_zh: newProductForm.short_zh || defaultShort,
      short_ar: newProductForm.short_ar || defaultShort,
      desc_en: newProductForm.desc_en || defaultDesc,
      desc_zh: newProductForm.desc_zh || defaultDesc,
      desc_ar: newProductForm.desc_ar || defaultDesc,
      price: priceNum,
      category: newProductForm.category,
      sizes: newProductForm.sizes.length > 0 ? newProductForm.sizes : ['380V/50Hz', '440V/60Hz'],
      colors: newProductForm.colors.length > 0 ? newProductForm.colors : [{ name: 'Titanium Grey', value: '#475569' }],
      image: newProductForm.image,
      rating: 5.0,
      salesCount: 1,
      reviews: []
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    triggerToast(`Successfully hosted your item: ${newProd.name}!`, 'success');

    // Reset Form
    setNewProductForm({
      name_en: '',
      name_zh: '',
      name_ar: '',
      short_en: '',
      short_zh: '',
      short_ar: '',
      desc_en: '',
      desc_zh: '',
      desc_ar: '',
      price: '',
      category: 'CNC & Milling',
      sizes: [],
      colors: [],
      image: 'tshirt'
    });
  };

  const captureCameraFrame = (): string | null => {
    if (!videoRef.current || !isCameraOn) return null;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; // Return base64 part only
      }
    } catch (e) {
      console.warn("Failed to capture camera frame:", e);
    }
    return null;
  };

  // AI Store Assistant query response logic with Automatic Language Detection (English, Arabic, Chinese)
  const handleAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiInput('');
    
    const userMsgObj = { sender: 'user' as const, text: userMsg, date: new Date().toLocaleTimeString() };
    const nextMessages = [...aiMessages, userMsgObj];
    setAiMessages(nextMessages);
    localStorage.setItem('cyberport_ai_messages', JSON.stringify(nextMessages));

    const cleaned = userMsg.toLowerCase();
    const isDeveloperQuestion = cleaned.includes('who developed') || 
                                cleaned.includes('who created') || 
                                cleaned.includes('who made') || 
                                cleaned.includes('من طور') || 
                                cleaned.includes('من برمج') || 
                                cleaned.includes('مين عمل') || 
                                cleaned.includes('مين المطور') ||
                                cleaned.includes('مين عملك') ||
                                cleaned.includes('من صنعك') ||
                                cleaned.includes('who is the developer') ||
                                cleaned.includes('who is your developer') ||
                                cleaned.includes('who built');

    if (isDeveloperQuestion) {
      setTimeout(() => {
        const finalMsgs = [...nextMessages, {
          sender: 'ai' as const,
          text: "Mohab developed me and the Website",
          date: new Date().toLocaleTimeString()
        }];
        setAiMessages(finalMsgs);
        localStorage.setItem('cyberport_ai_messages', JSON.stringify(finalMsgs));
        speakAiText("Mohab developed me and the Website");
      }, 50);
      return;
    }

    const imageBase64 = captureCameraFrame();
    const currentUserName = currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : 'Operator';

    // Call the real backend Gemini chat API first!
    fetch("/api/gemini/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt: userMsg, 
        chatHistory: nextMessages,
        userName: currentUserName,
        image: imageBase64
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.text) {
          let aiResponseText = data.text;
          let triggerYoutube = false;
          if (aiResponseText.includes('[OPEN_YOUTUBE]')) {
            aiResponseText = aiResponseText.replace('[OPEN_YOUTUBE]', '').trim();
            triggerYoutube = true;
          } else if (userMsg.toLowerCase().includes('youtube') || userMsg.toLowerCase().includes('يوتيوب')) {
            triggerYoutube = true;
          }

          const finalMsgs = [...nextMessages, {
            sender: 'ai' as const,
            text: aiResponseText,
            date: new Date().toLocaleTimeString()
          }];
          setAiMessages(finalMsgs);
          localStorage.setItem('cyberport_ai_messages', JSON.stringify(finalMsgs));
          speakAiText(aiResponseText);

          if (triggerYoutube) {
            setTimeout(() => {
              window.open('https://www.youtube.com', '_blank');
            }, 600);
          }
        } else {
          throw new Error("No text response");
        }
      })
      .catch((err) => {
        console.warn("Real Gemini chat failed, using local matcher:", err);
        // Robust fallback local AI response logic with Arabic and Chinese character set checkers
        setTimeout(() => {
          const cleaned = userMsg.toLowerCase();

          // Detect input language
          const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(userMsg);
          const isChinese = /[\u4e00-\u9fa5]/.test(userMsg);
          const detectedLang: 'en' | 'ar' | 'zh' = isArabic ? 'ar' : isChinese ? 'zh' : 'en';

          let aiText = "";

          // Check for YouTube request
          const isYoutube = cleaned.includes('youtube') || cleaned.includes('يوتيوب');

          // Check keyword concepts across English, Arabic and Chinese
          const isShoes = 
            cleaned.includes('machinery') || cleaned.includes('cnc') || cleaned.includes('milling') || cleaned.includes('gear') || cleaned.includes('press') || cleaned.includes('laser') || cleaned.includes('machine') ||
            cleaned.includes('آلة') || cleaned.includes('ماكينة') || cleaned.includes('ترس') || cleaned.includes('مكبس') ||
            cleaned.includes('机械') || cleaned.includes('数控') || cleaned.includes('铣床') || cleaned.includes('齿轮') || cleaned.includes('机床');

          const isJacket = 
            cleaned.includes('jacket') || cleaned.includes('hoodie') || cleaned.includes('warm') || cleaned.includes('coat') || cleaned.includes('fleece') ||
            cleaned.includes('سترة') || cleaned.includes('ستره') || cleaned.includes('جاكيت') || cleaned.includes('معطف') || cleaned.includes('برد') ||
            cleaned.includes('夹克') || cleaned.includes('外衣') || cleaned.includes('外套') || cleaned.includes('保暖');

          const isWallet = 
            cleaned.includes('wallet') || cleaned.includes('balance') || cleaned.includes('buy') || cleaned.includes('money') || cleaned.includes('pay') || cleaned.includes('credit') ||
            cleaned.includes('محفظة') || cleaned.includes('محفظه') || cleaned.includes('رصيد') || cleaned.includes('شراء') || cleaned.includes('فلوس') || cleaned.includes('دفع') ||
            cleaned.includes('钱包') || cleaned.includes('余额') || cleaned.includes('买') || cleaned.includes('钱') || cleaned.includes('支付') || cleaned.includes('付款');

          const isAffiliate = 
            cleaned.includes('affiliate') || cleaned.includes('code') || cleaned.includes('referral') || cleaned.includes('invite') || cleaned.includes('commission') ||
            cleaned.includes('شريك') || cleaned.includes('عمولة') || cleaned.includes('عموله') || cleaned.includes('رابط') || cleaned.includes('إحالة') || cleaned.includes('احاله') || cleaned.includes('دعوة') ||
            cleaned.includes('分销') || cleaned.includes('推广') || cleaned.includes('邀请') || cleaned.includes('佣金') || cleaned.includes('推荐');

          const isAddProduct = 
            cleaned.includes('add product') || cleaned.includes('upload') || cleaned.includes('sell') || cleaned.includes('create') || cleaned.includes('host') ||
            cleaned.includes('إضافة منتج') || cleaned.includes('اضافة منتج') || cleaned.includes('رفع') || cleaned.includes('بيع') || cleaned.includes('إنشاء') || cleaned.includes('انشاء') ||
            cleaned.includes('发布') || cleaned.includes('上传') || cleaned.includes('售卖') || cleaned.includes('上架') || cleaned.includes('创建');

          const isLanguage = 
            cleaned.includes('language') || cleaned.includes('english') || cleaned.includes('arabic') || cleaned.includes('chinese') ||
            cleaned.includes('لغة') || cleaned.includes('لغه') || cleaned.includes('عربي') || cleaned.includes('صيني') || cleaned.includes('انجليزي') ||
            cleaned.includes('语言') || cleaned.includes('中文') || cleaned.includes('英文') || cleaned.includes('阿拉伯语');

          const isGreeting = 
            cleaned.includes('hello') || cleaned.includes('hi') || cleaned.includes('hey') || cleaned.includes('welcome') ||
            cleaned.includes('مرحبا') || cleaned.includes('أهلاً') || cleaned.includes('اهلا') || cleaned.includes('السلام') || cleaned.includes('مرحباً') ||
            cleaned.includes('你好') || cleaned.includes('哈喽') || cleaned.includes('嗨') || cleaned.includes('您好');

          if (isYoutube) {
            if (detectedLang === 'ar') {
              aiText = "بالتأكيد يا سيدي. سأقوم بفتح موقع يوتيوب في علامة تبويب جديدة ومؤمنة على الفور. [OPEN_YOUTUBE]";
            } else if (detectedLang === 'zh') {
              aiText = "好的，先生。正在为您在新标签页中安全打开 YouTube 视频网站。 [OPEN_YOUTUBE]";
            } else {
              aiText = "Certainly, Sir. Launching YouTube in a new professional secure tab immediately. Enjoy your viewing! [OPEN_YOUTUBE]";
            }
          } else if (isShoes) {
            if (detectedLang === 'ar') {
              aiText = "بناءً على طلبك، أنصحك بـ Precision CNC Milling Machine V8 (تقييم 4.9) و Heavy-Duty Robotic Arm RX-200 (تقييم 4.8). تتميز بدقة متناهية وأتمتة عالية تناسب خطوط المصانع، يا سيدي. هل تود أن أفتح لك صفحة تفاصيل المنتج؟";
            } else if (detectedLang === 'zh') {
              aiText = "根据您的需求，先生。我推荐 Precision CNC Milling Machine V8 (评分 4.9) 和 Heavy-Duty Robotic Arm RX-200 (评分 4.8)。它们具有微米级定位精度和全自动伺服控制。需要我为您打开商品详情页吗？";
            } else {
              aiText = "Based on your prompt, Sir, I recommend the Precision CNC Milling Machine V8 (4.9 Rating) and the Heavy-Duty Robotic Arm RX-200 (4.8 Rating). They feature micro-inch precision and automated servo controls. Would you like me to open their detail page?";
            }
          } else if (isJacket) {
            if (detectedLang === 'ar') {
              aiText = "لدينا سترات مميزة يا سيدي وطلبها عالي: Under Armour StormFleece بسعر ($49.00) مقاومة للماء، و Puma Ultra Warm Zip بسعر ($69.00) مبطنة حرارياً. رائعة لتمارين الطقس البارد!";
            } else if (detectedLang === 'zh') {
              aiText = "报告先生，我们拥有几款热门夹克：Under Armour StormFleece ($49.00) 防泼水，Puma Ultra Warm Zip ($69.00) 带有保暖内衬。非常适合寒冷天气的户外运动！";
            } else {
              aiText = "We have high-demand jackets, Sir: Under Armour StormFleece ($49.00) repels water, and Puma Ultra Warm Zip ($69.00) is thermal-lined. Great for cold weather workouts!";
            }
          } else if (isWallet) {
            if (detectedLang === 'ar') {
              aiText = "لقد تم إيقاف نظام الدفع بالمحفظة الإلكترونية لتبسيط عمليات الشراء، يا سيدي. يمكنك الآن استخدام بطاقة الائتمان مباشرة لإتمام عملية الدفع بأمان.";
            } else if (detectedLang === 'zh') {
              aiText = "先生，我们已停用电子钱包支付系统以简化购买流程。您现在可以直接使用模拟信用卡进行安全、便捷的结账。";
            } else {
              aiText = "We have disabled the Cyber Wallet payment model to simplify checkout, Sir. You can now use simulated credit cards directly for safe, secure payment.";
            }
          } else if (isAffiliate) {
            if (detectedLang === 'ar') {
              aiText = `كود الإحالة الخاص بك هو '${affiliateCode}'، يا سيدي. لقد قمت بدعوة ${referralsCount} من الأعضاء النشطين، وحققت $${affiliateEarnings.toFixed(2)} كعمولة سلبية!`;
            } else if (detectedLang === 'zh') {
              aiText = `先生，您的分销推广码是 '${affiliateCode}'。您已成功邀请 ${referralsCount} 位活跃成员，累计赚取了 $${affiliateEarnings.toFixed(2)} 的被动分销佣金！`;
            } else {
              aiText = `Your Affiliate Code is '${affiliateCode}', Sir. You have invited ${referralsCount} active members, earning $${affiliateEarnings.toFixed(2)} in passive commissions!`;
            }
          } else if (isAddProduct) {
            if (detectedLang === 'ar') {
              aiText = "يمكنك إضافة المنتجات بسهولة يا سيدي! ما عليك سوى تسجيل الدخول، والضغط على زر 'إضافة منتج حصرى' في القائمة، ثم ملء البيانات ورفع الصورة أو سحبها وإفلاتها. سيظهر منتجك في المعرض فوراً.";
            } else if (detectedLang === 'zh') {
              aiText = "先生，您可以非常轻松地发布新产品！只需登录您的账号，点击菜单中的“发布新产品”按钮，填写表单并上传图片（支持拖拽），您的商品就会立即可视地呈现在商城目录中。";
            } else {
              aiText = "You can add products easily, Sir! Simply sign up, click the 'Host Product' button in the menu, fill in the form and upload or drag & drop your image. Your product will appear in the catalog instantly.";
            }
          } else if (isLanguage) {
            if (detectedLang === 'ar') {
              aiText = "يمكنك تغيير لغة المتجر في أي وقت يا سيدي! استخدم زر مغير اللغة في شريط الأدوات العلوي للتبديل بين العربية والإنجليزية والصينية.";
            } else if (detectedLang === 'zh') {
              aiText = "先生，您可以随时切换商城语言！点击顶部工具栏的语言选择按钮，即可在中文、英文和阿拉伯语之间进行自由切换。";
            } else {
              aiText = "You can change languages at any time, Sir! Use the Language Selector button in the header toolbar to switch between English, Chinese, and Arabic.";
            }
          } else if (isGreeting) {
            if (detectedLang === 'ar') {
              aiText = "مرحباً بك يا سيدي! أهلاً بك في نظام الذكاء الاصطناعي المتقدم JARVIS. كيف يمكنني مساعدتك في العثور على الماكينات والقطع المثالية اليوم؟";
            } else if (detectedLang === 'zh') {
              aiText = "您好，先生！欢迎使用 JARVIS 高级人工智能系统。今天有什么我可以帮您挑选或咨询的工业设备与零件吗？";
            } else {
              aiText = "Hello, Sir! I am JARVIS, your advanced AI assistant. How can I assist you in discovering the perfect industrial machinery and custom sports parts today?";
            }
          } else {
            if (detectedLang === 'ar') {
              aiText = `لقد قمت بمعالجة استفسارك يا سيدي: "${userMsg}". يسعدنا دائماً تقديم المشورة الهندسية وتسهيل عمليات التوزيع واللوجستيات!`;
            } else if (detectedLang === 'zh') {
              aiText = `报告先生，针对您的提问“${userMsg}”，这是我的专业解答。我随时提供最顶级的数控机械、机器人系统和智能电商分销协助。`;
            } else {
              aiText = `Thank you for your inquiry, Sir. I have processed: "${userMsg}". I stand ready to assist you. Ask me anything about our high-precision CNC machines, robotic assemblies, or automated checkout operations!`;
            }
          }

          let triggerYoutubeLocal = false;
          let cleanedAiText = aiText;
          if (cleanedAiText.includes('[OPEN_YOUTUBE]')) {
            cleanedAiText = cleanedAiText.replace('[OPEN_YOUTUBE]', '').trim();
            triggerYoutubeLocal = true;
          }

          setAiMessages(prev => {
            const updated = [...prev, {
              sender: 'ai' as const,
              text: cleanedAiText,
              date: new Date().toLocaleTimeString()
            }];
            localStorage.setItem('cyberport_ai_messages', JSON.stringify(updated));
            speakAiText(cleanedAiText);

            if (triggerYoutubeLocal) {
              setTimeout(() => {
                window.open('https://www.youtube.com', '_blank');
              }, 600);
            }
            return updated;
          });
        }, 800);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberport_user');
    setCurrentUser(null);
    triggerToast('Logged out successfully', 'success');
    setView('store');
    setIsProfileDropdownOpen(false);
  };

  const handleAuthSuccess = (email: string, role?: 'admin' | 'user') => {
    // Only mohabmohnad9@gmail.com receives administrative roles
    const finalRole: 'admin' | 'user' = email.toLowerCase() === 'mohabmohnad9@gmail.com' ? 'admin' : 'user';

    const userSession = { email, role: finalRole };
    localStorage.setItem('cyberport_user', JSON.stringify(userSession));
    setCurrentUser(userSession);

    // If a real custom user signs up/in, we delete Grace and Matthew (the initial virtual users)
    const isRealCustomUser = email !== 'mohabmohnad9@gmail.com' && email !== 'lamadevtest@gmail.com';

    setUsers(prev => {
      let filtered = prev;
      if (isRealCustomUser) {
        filtered = prev.filter(u => u.email !== 'graceallen07@yahoo.com' && u.email !== 'mattsc44@gmail.com');
      }

      const exists = filtered.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        const username = email.split('@')[0];
        const newUser: UserType = {
          id: `usr-${Date.now()}`,
          username: username.charAt(0).toUpperCase() + username.slice(1),
          email,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=100`,
          status: 'active',
          role: finalRole,
          phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
          joinedDate: new Date().toLocaleDateString()
        };
        return [newUser, ...filtered];
      }
      return filtered;
    });

    triggerToast(`Signed in successfully as ${email}! Welcome to CyberPort Industrial!`, 'success');
    setView('store');
  };

  // Copy referral invite helper
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://sdazum.cyberport.industrial/invite?ref=${affiliateCode}`);
    triggerToast("Affiliate invitation link copied to clipboard!", "success");
  };

  // Claim affiliate bonus
  const handleClaimAffiliateBonus = () => {
    setWalletBalance(prev => prev + 50.00);
    setAffiliateEarnings(prev => prev + 25.00);
    setReferralsCount(prev => prev + 1);
    triggerToast("Claimed $50.00 Referral bonus! Added directly to your Cyber Wallet.", "success");
  };

  // Apply new Profile avatar image
  const handleApplyAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvatarInput.trim()) {
      triggerToast("Please enter a valid Image URL first!", "error");
      return;
    }
    const avatarUrl = newAvatarInput.trim();
    setProfileImage(avatarUrl);
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: avatarUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('cyberport_user', JSON.stringify(updatedUser));
      setRegisteredUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: avatarUrl } : u));
      setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: avatarUrl } : u));
    }
    setIsProfileEditorOpen(false);
    setNewAvatarInput('');
    triggerToast("Your profile avatar image has been customized in browser storage!", "success");
  };

  const handleProfileImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerToast("Invalid format! Please upload an image file (png, jpeg, webp, etc.).", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setProfileImage(result);
        if (currentUser) {
          const updatedUser = { ...currentUser, avatar: result };
          setCurrentUser(updatedUser);
          localStorage.setItem('cyberport_user', JSON.stringify(updatedUser));
          setRegisteredUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: result } : u));
          setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: result } : u));
        }
        triggerToast("Successfully uploaded and updated your profile photo!", "success");
        setIsProfileEditorOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="application-container"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-sans ${
        theme === 'day' 
          ? 'theme-day bg-slate-50 text-black' 
          : theme === 'night' 
            ? 'theme-night dark bg-slate-950 text-slate-100' 
            : 'theme-cyberpunk dark bg-black text-[#00f0ff] cyber-grid relative'
      }`}
    >

      {/* Global Custom Cursor Selection */}
      <CustomCursor type={cursorType} />
      {cursorType !== 'default' && (
        <style>{`
          @media (hover: hover) and (pointer: fine) {
            body, button, a, input, select, textarea, [role="button"], .cursor-pointer, .group, img, svg {
              cursor: none !important;
            }
          }
        `}</style>
      )}
      {/* Cyberpunk Neon background grids and particles */}
      {theme === 'cyberpunk' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 border-t border-b border-pink-500/20" />
        </div>
      )}

      {/* GLOBAL SYSTEM BAR / DIAGNOSTIC BAR */}
      <div 
        id="system-header-bridge" 
        className={`text-[11px] font-bold px-6 py-2.5 flex items-center justify-between border-b relative z-10 ${
          theme === 'day' 
            ? 'bg-slate-900 text-slate-200 border-slate-700' 
            : theme === 'night' 
              ? 'bg-slate-950 text-slate-300 border-slate-800' 
              : 'bg-black text-pink-400 border-pink-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full inline-block animate-pulse ${theme === 'cyberpunk' ? 'bg-pink-500' : 'bg-emerald-500'}`} />
          <span className="tracking-widest uppercase font-mono">
            {t.storeName} // {theme === 'cyberpunk' ? 'CYBER HUD ACTIVE' : 'SECURE CONNECT'}
          </span>
          <span className="hidden md:inline-block font-mono text-slate-500 font-normal">
            | {t.systemHealthy}
          </span>
        </div>

        {/* Diagnostic parameters logs and microservices simulation */}
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="hidden lg:inline text-slate-500">{t.seoRating}</span>
          
          {/* Futuristic Battery Status Indicator */}
          {batteryLevel !== null && (
            <div 
              className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900/50 border border-slate-800/80 hover:border-pink-500/30 transition-all group cursor-help"
              title={`ENERGY CORE STATUS: ${isBatteryCharging ? 'RECHARGING CELL' : 'DISCHARGING CELL'} // LEVEL: ${batteryLevel}%`}
            >
              <span className="text-[8px] font-mono font-medium tracking-wider text-slate-500 group-hover:text-pink-400 transition-colors">
                CELL_LVL:
              </span>
              <div className="relative flex items-center">
                <span className={`text-[9px] font-bold font-mono tracking-tighter mr-1 ${
                  batteryLevel <= 20 
                    ? 'text-rose-500 animate-pulse' 
                    : batteryLevel <= 50 
                      ? 'text-amber-400' 
                      : theme === 'cyberpunk' ? 'text-[#00f0ff]' : 'text-emerald-400'
                }`}>
                  {batteryLevel}%
                </span>
                
                {/* Micro visual battery cell container */}
                <div className="w-6 h-3 border border-slate-700/80 rounded-sm p-[1px] flex items-center relative overflow-hidden bg-black/40">
                  {/* Energy bar */}
                  <div 
                    className={`h-full rounded-xs transition-all duration-500 ${
                      isBatteryCharging ? 'animate-pulse' : ''
                    } ${
                      batteryLevel <= 20 
                        ? 'bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]' 
                        : batteryLevel <= 50 
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]' 
                          : theme === 'cyberpunk'
                            ? 'bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.4)]'
                            : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                    }`}
                    style={{ width: `${Math.max(10, Math.min(100, batteryLevel))}%` }}
                  />
                </div>
                {/* Battery tip */}
                <div className="w-[1px] h-1.5 bg-slate-700 rounded-r-[1px]" />
              </div>

              {isBatteryCharging ? (
                <Zap className="w-3 h-3 text-yellow-400 animate-bounce" />
              ) : (
                <Battery className={`w-3 h-3 ${batteryLevel <= 20 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
              )}
            </div>
          )}
          
          
          {currentUser && currentUser.email.toLowerCase() === 'mohabmohnad9@gmail.com' && (
            <button
              onClick={() => {
                setView('admin');
                setAdminSubView('overview');
              }}
              className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded ${
                view === 'admin' ? 'bg-slate-700 text-white' : ''
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE WEB NAVIGATION BAR */}
      <header 
        id="main-navbar" 
        className={`h-16 sticky top-0 z-40 px-6 flex items-center justify-between border-b backdrop-blur-md ${
          theme === 'day' 
            ? 'bg-white/95 border-slate-200 shadow-sm text-slate-900' 
            : theme === 'night' 
              ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-lg' 
              : 'bg-black/95 border-pink-500/30 text-[#00f0ff]'
        }`}
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setView('store'); setSelectedProduct(null); }} 
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <ShandongAzumLogo className="h-7" theme={theme} />
          </button>

          {/* Catalog search bar input */}
          {view === 'store' && (
            <div className="flex items-center gap-2">
              <div id="navbar-search" className="relative hidden md:block w-80">
                <Search 
                  onClick={() => {
                    setIsActivitiesModalOpen(true);
                    logUserActivity('view_details', 'Opened Customer Activity Tracker', 'User clicked search icon to inspect live telemetry dashboard.');
                  }}
                  className="w-4 h-4 text-slate-400 hover:text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors z-20 animate-pulse" 
                  title="Open Live Customer Activity Tracker"
                />
                <input
                  ref={searchInputRef}
                  id="search-input-box"
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    
                    // Helper function to validate beginning-of-word search prefix
                    const validateSearchInput = (value: string) => {
                      if (!value) return true;
                      
                      const valueLower = value.toLowerCase();
                      const typedWords = valueLower.split(/\s+/);
                      if (typedWords.length === 0) return true;
                      
                      const targetWords: string[] = [];
                      products.forEach(p => {
                        const nameEng = (p.name || '').toLowerCase();
                        const nameZh = (p.name_zh || '').toLowerCase();
                        const nameAr = (p.name_ar || '').toLowerCase();
                        const cat = (p.category || '').toLowerCase();
                        
                        targetWords.push(
                          ...nameEng.split(/\s+/).filter(Boolean),
                          ...nameZh.split(/\s+/).filter(Boolean),
                          ...nameAr.split(/\s+/).filter(Boolean),
                          ...cat.split(/\s+/).filter(Boolean)
                        );
                      });
                      
                      return typedWords.every((typedWord) => {
                        if (!typedWord) return true;
                        return targetWords.some(targetWord => targetWord.startsWith(typedWord));
                      });
                    };

                    if (validateSearchInput(val)) {
                      setSearchTerm(val);
                      if (val) {
                        document.getElementById('products-grid-catalog')?.scrollIntoView({ behavior: 'smooth' });
                        logUserActivity('search', 'Catalog Text Query', `Searched term: "${val}"`);
                      }
                    }
                  }}
                  className={`w-full text-xs rounded-full pl-9 pr-24 py-2 outline-none transition-all ${
                    theme === 'day' 
                      ? 'bg-slate-100 border border-slate-200 text-slate-800 focus:border-slate-800' 
                      : theme === 'night'
                        ? 'bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500'
                        : 'bg-slate-950 border border-pink-500/30 text-[#00f0ff] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30'
                  }`}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {speechActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${isListening ? '' : 'hidden'}`}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.75)]"></span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSpeechActive(!speechActive);
                      if (speechActive) {
                        setIsListening(false);
                        if ((window as any).recognitionInstance) {
                          try { (window as any).recognitionInstance.stop(); } catch(e){}
                        }
                        triggerToast("🎙️ Voice listener paused", "success");
                      } else {
                        triggerToast("🎙️ Voice listener activated. Start speaking!", "success");
                      }
                    }}
                    title={speechActive ? "Mute Voice Command Listener" : "Activate Voice Command Listener"}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      speechActive
                        ? 'bg-rose-100/90 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold scale-105'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {speechActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextLang = micLanguage === 'en' ? 'ar' : micLanguage === 'ar' ? 'zh' : 'en';
                      setMicLanguage(nextLang);
                      triggerToast(`🎙️ Voice Language: ${
                        nextLang === 'en' ? 'English (en-US)' : nextLang === 'ar' ? 'Arabic (ar-SA)' : 'Chinese (zh-CN)'
                      }`, "success");
                    }}
                    className="px-1.5 py-0.5 rounded-md text-[8px] font-black font-mono uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 cursor-pointer"
                    title="Cycle Voice Command Language"
                  >
                    {micLanguage}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Control Widgets: Language, Themes, Wallet and Profiles */}
        <div className="flex items-center gap-3 relative z-10">
          
          {/* Language Selector row */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                language === 'en'
                  ? theme === 'cyberpunk'
                    ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : theme === 'day'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-indigo-400 text-indigo-400 bg-indigo-950/30'
                  : theme === 'cyberpunk'
                    ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    : theme === 'day'
                      ? 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                language === 'zh'
                  ? theme === 'cyberpunk'
                    ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : theme === 'day'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-indigo-400 text-indigo-400 bg-indigo-950/30'
                  : theme === 'cyberpunk'
                    ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    : theme === 'day'
                      ? 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                language === 'ar'
                  ? theme === 'cyberpunk'
                    ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : theme === 'day'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-indigo-400 text-indigo-400 bg-indigo-950/30'
                  : theme === 'cyberpunk'
                    ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    : theme === 'day'
                      ? 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Theme Mode selector switch */}
          <div className="flex items-center gap-0.5 border border-slate-700/30 rounded-xl p-0.5 bg-slate-950/25">
            <button 
              onClick={() => {
                setTheme('day');
                logUserActivity('theme', 'UI Theme Switched', 'Switched visual style presets to Day Mode (Light UI canvas).');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Day Mode (Light)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                setTheme('night');
                logUserActivity('theme', 'UI Theme Switched', 'Switched visual style presets to Night Mode (Slate/Dark UI canvas).');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Night Mode (Dark)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                setTheme('cyberpunk');
                logUserActivity('theme', 'UI Theme Switched', 'Switched visual style presets to Cyberpunk Mode (Neon terminal canvas).');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'cyberpunk' ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
              title="Cyberpunk Mode (Glow)"
            >
              <Cpu className="w-3.5 h-3.5" />
            </button>
          </div>


          {/* User Sign Up / Upload trigger */}
          {currentUser ? (
            isMohab ? (
              <button 
                onClick={() => {
                  setIsAddProductOpen(true);
                }}
                className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                  theme === 'cyberpunk' 
                    ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.addProd}</span>
              </button>
            ) : null
          ) : (
            <button
              onClick={() => {
                setAuthIsSignUp(false);
                setView('auth');
              }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign Up / Login</span>
            </button>
          )}

          {/* Global Voice Command Terminal Activation */}
          <button
            onClick={toggleListening}
            title="Activate voice commands ('go to orders', 'clear cart', 'toggle theme')"
            className={`hidden p-2 rounded-full transition-all cursor-pointer relative flex items-center justify-center border ${
              isListening
                ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                : theme === 'cyberpunk'
                  ? 'border-[#00f0ff]/20 bg-slate-950/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : theme === 'day'
                    ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Mic className="w-4.5 h-4.5" />
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Cart Basket bag with dynamic trigger */}
          <button onClick={() => setView('cart')} className={`p-2 rounded-full cursor-pointer relative ${
            theme === 'cyberpunk' ? 'hover:bg-pink-500/10 text-pink-400' : 'hover:bg-slate-150'
          }`} title={t.cart}>
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span id="cart-badge" className={`absolute top-1 right-1 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border animate-bounce ${
                theme === 'cyberpunk' ? 'bg-pink-500 border-black' : 'bg-slate-900 border-white'
              }`}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

          {/* Customizable User profile dropdown overlay */}
          <div className="relative">
            <button
              id="avatar-trigger"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`w-9 h-9 rounded-full border bg-slate-100 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform cursor-pointer ${
                theme === 'cyberpunk' ? 'border-[#00f0ff]/40' : 'border-slate-200'
              }`}
            >
              {currentUser ? (
                <img
                  src={profileImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={() => setProfileImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100')}
                />
              ) : (
                <UserIcon className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>

            {isProfileDropdownOpen && (
              <div id="profile-dropdown-box" className={`absolute right-0 mt-2 w-60 rounded-2xl border p-2 shadow-2xl z-50 text-xs ${
                theme === 'day' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}>
                {currentUser ? (
                  <>
                    <div className="px-3 py-2 border-b border-slate-100 mb-1 space-y-2">
                      <div>
                        <p className="font-mono text-[9px] text-pink-500 font-bold tracking-widest">CONNECTED PROFILE</p>
                        <p className="font-bold text-slate-200 truncate mt-0.5">{currentUser.email}</p>
                      </div>

                      {/* Display name changer per user request */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Change Name</label>
                        <input
                          type="text"
                          value={currentUser.name || currentUser.email.split('@')[0]}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const updatedUser = { ...currentUser, name: newName };
                            setCurrentUser(updatedUser);
                            localStorage.setItem('cyberport_user', JSON.stringify(updatedUser));
                            setRegisteredUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, name: newName } : u));
                            setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, username: newName } : u));
                          }}
                          className="w-full bg-slate-800/60 border border-slate-700/60 rounded px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:border-[#00f0ff] font-sans font-medium"
                          placeholder="Your Name"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                        <span className="text-[10px] text-[#00f0ff] font-semibold uppercase">
                          {currentUser.role} Account
                        </span>
                      </div>

                      {/* Share / Open on another device QR Code per user request */}
                      <div className="pt-2 mt-1 border-t border-slate-800/40 flex flex-col items-center text-center space-y-1.5 bg-slate-950/40 p-2 rounded-xl">
                        <span className="text-[9px] text-[#00f0ff] font-bold tracking-widest uppercase flex items-center gap-1">
                          <QrCode className="w-3 h-3 animate-pulse" />
                          <span>Open on Mobile</span>
                        </span>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&color=00f0ff&bgcolor=0f172a&data=${encodeURIComponent(window.location.href)}`} 
                          alt="Open on another device QR" 
                          className="w-24 h-24 border border-[#00f0ff]/20 rounded-lg p-1 bg-[#090d16] shadow-sm shadow-[#00f0ff]/10"
                        />
                        <span className="text-[8px] text-slate-400">Scan QR to sync device session</span>
                      </div>
                    </div>
                    
                    {/* Change profile image trigger */}
                    <button
                      onClick={() => {
                        setIsProfileEditorOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 font-bold text-slate-300 flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#00f0ff]" />
                      <span>{t.changeProfile}</span>
                    </button>

                    <button
                      onClick={() => {
                        setView('orders');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 font-medium text-slate-300 flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      <span>{t.orders} Tracker</span>
                    </button>

                    {/* Google Gmail Integration Connector inside dropdown */}
                    <div className="border-t border-slate-800 pt-1 mt-1 px-3 py-1.5 space-y-1.5">
                      <p className="font-mono text-[8px] text-[#00f0ff] font-bold tracking-widest uppercase">Gmail Dispatcher</p>
                      {googleUser ? (
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Gmail Sync Active
                          </p>
                          <p className="text-[9px] text-slate-400 truncate">{googleUser.email}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            handleConnectGmail();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full px-2.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/35 text-white hover:text-indigo-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                        >
                          <span>Connect Gmail</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-rose-950 font-bold text-rose-400 flex items-center gap-2 cursor-pointer border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3 text-center space-y-2">
                    <p className="text-slate-400 text-[10px] font-sans">{t.signupMessage}</p>
                    <button
                      onClick={() => {
                        setAuthIsSignUp(false);
                        setView('auth');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* GLOBAL VIEW NAVIGATION BAR */}
      <div 
        id="global-view-tabs" 
        className={`border-b py-3 px-4 md:px-8 flex flex-wrap items-center justify-center gap-2 md:gap-4 sticky top-16 z-30 backdrop-blur-md transition-all ${
          theme === 'day' 
            ? 'bg-slate-50 border-slate-200 text-slate-800' 
            : theme === 'night' 
              ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-sm' 
              : 'bg-black/95 border-pink-500/20 text-[#00f0ff]'
        }`}
      >
        <button
          onClick={() => { setView('store'); setSelectedProduct(null); }}
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 ${
            view === 'store' || view === 'product-details'
              ? theme === 'cyberpunk'
                ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-102'
                : theme === 'night'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-500 scale-102'
                  : 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Store</span>
        </button>

        {currentUser && (
          <button
            onClick={() => setView('ai')}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 relative ${
              view === 'ai'
                ? theme === 'cyberpunk'
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_15px_rgba(0,240,255,0.8)] scale-102'
                  : theme === 'night'
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-500 scale-102'
                    : 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)] scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <img src={jarvisHelmet} className="w-[26px] h-[26px] rounded-full border border-teal-400/30 object-cover" referrerPolicy="no-referrer" />
            <span>Jarvis AI</span>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        )}

        {currentUser && (
          <button
            onClick={() => setView('chat')}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 relative ${
              view === 'chat'
                ? theme === 'cyberpunk'
                  ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-102'
                  : theme === 'night'
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-500 scale-102'
                    : 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)] scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Chat</span>
          </button>
        )}

        {currentUser && currentUser.email.toLowerCase() === 'mohabmohnad9@gmail.com' && (
          <button
            onClick={() => {
              setView('admin');
              setAdminSubView('overview');
            }}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 ${
              view === 'admin'
                ? theme === 'cyberpunk'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-102'
                  : theme === 'night'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.7)] border border-emerald-500 scale-102'
                    : 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)] scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Controls</span>
          </button>
        )}

        <button
          onClick={() => setView('wishlist')}
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 relative ${
            view === 'wishlist'
              ? theme === 'cyberpunk'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)] scale-102'
                : theme === 'night'
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.7)] border border-rose-500 scale-102'
                  : 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.4)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
          <span>My Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setView('orders')}
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-150 ${
            view === 'orders'
              ? theme === 'cyberpunk'
                ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.8)] scale-102'
                : theme === 'night'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.7)] border border-indigo-500 scale-102'
                  : 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)] scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Orders Tracker</span>
        </button>
      </div>

      {/* VIEW ROUTING SECTIONS */}
      <main className="flex-1 relative">

        {/* WISHLIST VIEW */}
        {view === 'wishlist' && (
          <motion.div 
            id="wishlist-page" 
            className="max-w-7xl mx-auto px-4 py-8 pb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-800/50 pb-6">
              <div>
                <h1 id="wishlist-header" className={`text-3xl font-black tracking-tight font-sans flex items-center gap-3 ${
                  theme === 'cyberpunk' ? 'text-[#00f0ff]' : theme === 'day' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>{language === 'ar' ? 'المفضلة الخاصة بي' : 'My Cyber Wishlist'}</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1 font-mono">
                  {language === 'ar' ? 'العناصر المحددة والآلات المحفوظة للاقتناء الفوري' : 'Your curated items and machines saved for rapid procurement.'}
                </p>
              </div>
              <button
                id="wishlist-back-shop"
                onClick={() => setView('store')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-xs font-mono transition-all hover:scale-105 active:scale-95"
              >
                {language === 'ar' ? 'العودة للتسوق ←' : '← Back to Shop'}
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div id="wishlist-empty-state" className={`p-12 text-center rounded-3xl border ${
                theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-slate-800'
              }`}>
                <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4 stroke-1 animate-bounce" />
                <h3 className={`text-lg font-bold ${theme === 'day' ? 'text-slate-800' : 'text-slate-200'}`}>
                  {language === 'ar' ? 'قائمة المفضلة فارغة حالياً' : 'Your Wishlist is currently offline'}
                </h3>
                <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                  {language === 'ar' ? 'تصفح مخزوننا عالي الدقة واضغط على أيقونة القلب على المنتجات لحفظها هنا.' : 'Explore our high-precision stock and tap the heart icon on any machine to secure it here.'}
                </p>
                <button
                  id="wishlist-browse-inv"
                  onClick={() => setView('store')}
                  className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-xs transition-transform hover:scale-105"
                >
                  {language === 'ar' ? 'استكشاف المنتجات' : 'Browse Inventory'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products
                  .filter(p => wishlist.includes(p.id))
                  .map(p => {
                    const commentsCount = (reviewsDB[p.id] || p.reviews || []).length;
                    return (
                      <ParallaxCard
                        key={p.id}
                        id={`wish-card-${p.id}`}
                        theme={theme}
                        onClick={() => handleProductCardClick(p)}
                      >
                        {/* Wishlist toggle button */}
                        <button
                          onClick={(e) => toggleWishlist(p.id, e)}
                          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/70 border border-slate-800 hover:border-pink-500 hover:scale-110 active:scale-90 transition-all cursor-pointer flex items-center justify-center text-rose-500 shadow-lg"
                          title="Remove from Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        </button>

                        {/* Interactive buy overlays */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#00f0ff] border border-pink-500/40 z-10">
                          <span>🔥 {p.salesCount || Math.floor(p.price * 3.4)} sold</span>
                        </div>

                        {/* Product image with fallbacks */}
                        <div className="relative w-full h-60 overflow-hidden rounded-2xl mb-4 cursor-pointer group [transform-style:preserve-3d]">
                          <div className="parallax-img w-full h-full transition-transform duration-300 [transform-style:preserve-3d]">
                            {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover [transform:translateZ(30px)]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-900/60 flex items-center justify-center rounded-2xl [transform:translateZ(30px)]">
                                <ProductSVG type={p.image} color={p.colors[0]?.value || '#94A3B8'} className="w-28 h-28" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title & metadata */}
                        <div className="space-y-2 flex-1">
                          <span className="text-[10px] uppercase font-bold text-pink-500">{p.category}</span>
                          <h4 className={`font-black text-sm tracking-tight line-clamp-1 cursor-pointer transition-colors ${
                            theme === 'cyberpunk' ? 'text-[#00f0ff]' : theme === 'day' ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            {p[`name_${language}` as keyof typeof p] || p.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-8">
                            {p[`short_${language}` as keyof typeof p] || p.shortDescription}
                          </p>
                        </div>

                        {/* Price and buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 mt-4">
                          <p className="font-mono font-black text-md text-[#00f0ff]">${p.price.toFixed(2)}</p>
                          <div className="flex gap-1.5">
                            <button className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 rounded-lg text-[#00f0ff] hover:text-white transition-colors cursor-pointer text-xs font-bold">
                              Details
                            </button>
                          </div>
                        </div>
                      </ParallaxCard>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}

        {/* 1. STOREFRONT VIEW */}
        {view === 'store' && (
          <div id="storefront-page" className="space-y-8 pb-20">
            
            {/* HERO BANNER SECTION WITH COOL MATRIX RAIN / SPRING HOVER */}
            <motion.section 
              id="hero-banner" 
              className="max-w-7xl mx-auto mt-6 px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className={`rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[340px] shadow-2xl border transition-all ${
                theme === 'day' 
                  ? 'bg-gradient-to-r from-amber-100 to-amber-200/50 border-amber-200 text-slate-900' 
                  : theme === 'night' 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800 text-slate-100' 
                    : 'bg-black border-pink-500/40 text-white'
              }`}>
                {/* Cyber Scanlines and Grid */}
                {theme === 'cyberpunk' && (
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-pink-500/5 to-transparent pointer-events-none cyber-grid-blue opacity-50" />
                )}
                
                <div className="space-y-5 max-w-lg relative z-10 text-center md:text-left">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    theme === 'cyberpunk' 
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400 animate-pulse' 
                      : 'bg-amber-200/80 text-amber-900 border-amber-300'
                  }`}>
                    {theme === 'cyberpunk' ? '📟 INDUSTRIAL AUTOMATION PROTOCOL' : 'Industrial Promo Pack'}
                  </span>
                  <div className="pb-1 flex justify-center md:justify-start">
                    <ShandongAzumLogo className="h-14 md:h-20" theme={theme} />
                  </div>
                  <h1 id="hero-heading" className={`text-xl md:text-3xl font-serif font-black tracking-widest uppercase mt-1 ${
                    theme === 'day' ? 'text-slate-900' : 'text-white'
                  }`}>
                    Import & Export Co., Ltd
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                    Elevate your manufacturing with customizable heavy machinery, instant automated dispatch, and full industrial catalog telemetry.
                  </p>
                  
                  {/* Action triggers */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => {
                        setActiveCategory('All');
                        document.getElementById('categories-row')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer ${
                        theme === 'cyberpunk' 
                          ? 'bg-pink-500 text-white hover:bg-pink-600 glow-pink' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Shop Machinery
                    </button>
                    
                    <button
                      onClick={() => setIsAiOpen(true)}
                      className="px-6 py-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <img src={jarvisHelmet} className="w-4 h-4 rounded-full border border-[#00f0ff]/30 object-cover" referrerPolicy="no-referrer" />
                      <span>Ask Store AI</span>
                    </button>
                  </div>
                </div>

                {/* Shandong Azum Corporate card mockup with 3D perspective & cyberpunk laser scanner effect */}
                <div className="w-80 h-80 md:w-[480px] md:h-[380px] shrink-0 relative mt-6 md:mt-0 flex items-center justify-center perspective-[1200px]">
                  <div className={`absolute inset-0 rounded-full blur-3xl opacity-60 animate-pulse ${
                    theme === 'cyberpunk' ? 'bg-pink-500/30' : 'bg-amber-300/40'
                  }`} />
                  
                  {/* Beautiful perspective rotated card container */}
                  <div 
                    className="relative group transition-all duration-500 cursor-pointer"
                    style={{ 
                      transform: 'rotateX(16deg) rotateY(-26deg) rotateZ(6deg)', 
                      transformStyle: 'preserve-3d' 
                    }}
                  >
                    <div className={`relative rounded-3xl overflow-hidden border shadow-[0_30px_70px_rgba(0,0,0,0.45)] group-hover:shadow-[0_40px_80px_rgba(0,240,255,0.25)] transition-all duration-500 flex items-center justify-center p-1.5 w-[280px] h-[220px] sm:w-[340px] sm:h-[260px] md:w-[420px] md:h-[280px] ${
                      theme === 'day'
                        ? 'bg-amber-50/80 border-amber-300'
                        : theme === 'night'
                          ? 'bg-slate-950/80 border-slate-800'
                          : 'bg-black/90 border-pink-500/40'
                    }`}>
                      <img
                        src={weixinCardImg}
                        alt="Shandong Azum Business Card Mockup"
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* JARVIS INTERACTIVE SYSTEM LABS */}
            <motion.section 
              id="jarvis-system-labs" 
              className="max-w-7xl mx-auto px-4 space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div>
                  <h3 className={`font-black text-md tracking-wider uppercase font-mono flex items-center gap-2 ${
                    theme === 'cyberpunk' 
                      ? 'text-[#00f0ff]' 
                      : theme === 'day' 
                        ? 'text-slate-900' 
                        : 'text-slate-100'
                  }`}>
                    <img src={jarvisHelmet} className="w-5 h-5 rounded-md border border-teal-400/30 object-cover" referrerPolicy="no-referrer" />
                    <span>Jarvis Cognitive Matrix System Labs</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">Direct satellite uplink to local mansion sub-modules // active authorization required</p>
                </div>
                {currentUser ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono font-bold uppercase animate-pulse">
                    Session Authorized
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-[9px] font-mono font-bold uppercase">
                    Unauthorized Session
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  {
                    id: 'TASKS',
                    name: 'Tasks & Protocols',
                    desc: 'Operational agenda pool',
                    icon: ClipboardList,
                    color: 'text-cyan-400',
                    bgColor: 'bg-cyan-500/5 hover:bg-cyan-500/10',
                    borderColor: 'border-cyan-500/20 hover:border-cyan-400/50',
                  },
                  {
                    id: 'SCHEDULE',
                    name: 'Scheduler Console',
                    desc: 'Logistics timing terminal',
                    icon: Calendar,
                    color: 'text-teal-400',
                    bgColor: 'bg-teal-500/5 hover:bg-teal-500/10',
                    borderColor: 'border-teal-500/20 hover:border-teal-400/50',
                  },
                  {
                    id: 'NETLINK',
                    name: 'Netlink Node Map',
                    desc: 'Global routing matrix',
                    icon: Network,
                    color: 'text-emerald-400',
                    bgColor: 'bg-emerald-500/5 hover:bg-emerald-500/10',
                    borderColor: 'border-emerald-500/20 hover:border-emerald-400/50',
                  },
                  {
                    id: 'DESKTOP',
                    name: 'Desktop Virtual Terminal',
                    desc: 'Direct host environment shell',
                    icon: Monitor,
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/5 hover:bg-blue-500/10',
                    borderColor: 'border-blue-500/20 hover:border-blue-400/50',
                  },
                  {
                    id: '3D FAB',
                    name: '3D Fabrication Lab',
                    desc: 'Heuristic material printing',
                    icon: Layers,
                    color: 'text-fuchsia-400',
                    bgColor: 'bg-fuchsia-500/5 hover:bg-fuchsia-500/10',
                    borderColor: 'border-fuchsia-500/20 hover:border-fuchsia-400/50',
                  },
                  {
                    id: 'MANSION',
                    name: 'Mansion Security Control',
                    desc: 'Malibu shield coordinates',
                    icon: Shield,
                    color: 'text-pink-400',
                    bgColor: 'bg-pink-500/5 hover:bg-pink-500/10',
                    borderColor: 'border-pink-500/20 hover:border-pink-400/50',
                  }
                ].map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        if (!currentUser) {
                          triggerToast("Access Denied: Please authorize your operator account first.", "error");
                          setRedirectJarvisTab(app.id);
                          setAuthIsSignUp(false);
                          setView('auth');
                          return;
                        }
                        setJarvisTab(app.id as any);
                        setView('ai');
                        triggerToast(`Establishing secure handshake with ${app.name} protocol...`, "success");
                      }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer ${app.bgColor} ${app.borderColor}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${app.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[7px] font-mono text-slate-500 font-extrabold tracking-widest uppercase">STABLE</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className={`text-[10px] font-black uppercase font-mono ${theme === 'day' ? 'text-slate-800' : 'text-[#00f0ff]'}`}>{app.name}</h4>
                        <p className="text-[8px] text-slate-400 leading-tight font-sans line-clamp-2">{app.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>

            {/* CATEGORIES SELECTION GRID */}
            <motion.section 
              id="categories-row" 
              className="max-w-7xl mx-auto px-4 space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center">
                <h3 className={`font-black text-lg tracking-tight uppercase ${
                  theme === 'cyberpunk' 
                    ? 'text-[#00f0ff]' 
                    : theme === 'day' 
                      ? 'text-slate-900' 
                      : 'text-slate-100'
                }`}>
                  {t.all}
                </h3>
              </div>
              
              <div className="relative group/cats">
                {/* Left Scroll Button */}
                <button 
                  onClick={() => {
                    if (categoriesRef.current) {
                      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/cats:opacity-100 cursor-pointer shadow-md"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Scroll Button */}
                <button 
                  onClick={() => {
                    if (categoriesRef.current) {
                      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/cats:opacity-100 cursor-pointer shadow-md"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div 
                  ref={categoriesRef}
                  className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none cursor-grab active:cursor-grabbing"
                  onWheel={(e) => {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }}
                  onMouseDown={handleCategoriesMouseDown}
                  onMouseLeave={handleCategoriesMouseLeaveOrUp}
                  onMouseUp={handleCategoriesMouseLeaveOrUp}
                  onMouseMove={handleCategoriesMouseMove}
                  onScroll={handleCategoriesScrollEvent}
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer uppercase shrink-0 ${
                          isActive
                            ? theme === 'cyberpunk'
                              ? 'bg-pink-500 border-pink-500 text-white shadow-lg glow-pink'
                              : 'bg-slate-900 text-white border-slate-900'
                            : theme === 'cyberpunk'
                              ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-pink-500/50'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Cyber scrollbar progress line */}
                <div className="w-full h-0.5 bg-slate-950/40 rounded-full mt-1 max-w-xs mx-auto overflow-hidden relative border border-slate-900/10">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-75"
                    style={{ 
                      width: '30%', 
                      left: `${categoriesScrollProgress * 0.7}%` 
                    }}
                  />
                </div>
              </div>
            </motion.section>

            {/* PRODUCT CATALOG GRID */}
            <motion.section 
              id="products-grid-catalog" 
              className={`max-w-7xl mx-auto px-4 pb-12 space-y-6 transition-all duration-700 ${
                filteredProducts.some(p => (p.stock || 0) < 5)
                  ? 'ring-1 ring-rose-500/30 rounded-3xl p-6 bg-rose-950/5 border border-dashed border-rose-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-pulse'
                  : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800/60 font-sans">
                <div className="space-y-2">
                  <h4 className={`text-xs font-mono uppercase tracking-widest font-black ${
                    theme === 'day' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {activeCategory === 'All' ? t.all : activeCategory} Catalog ({filteredProducts.length})
                  </h4>
                  
                  {/* Dynamic Filtering Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider mr-1 ${
                      theme === 'day' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Filter:
                    </span>
                    {[
                      { id: 'all', label: 'All Products' },
                      { id: 'high-demand', label: '🔥 High Demand' },
                      { id: 'low-stock', label: '⚠️ Low Stock' },
                      { id: 'new-arrivals', label: '✨ New Arrivals' }
                    ].map((item) => {
                      const isActive = catalogTagFilter === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCatalogTagFilter(item.id as any);
                            triggerToast(`Catalog filtered by: ${item.label}`, "success");
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider font-mono transition-all duration-300 cursor-pointer border flex items-center gap-1 ${
                            isActive
                              ? theme === 'cyberpunk'
                                ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_12px_#ec4899] scale-105'
                                : 'bg-indigo-600 border-indigo-600 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950 scale-105 shadow-sm'
                              : theme === 'day'
                                ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                : 'bg-slate-900/55 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Sorting Dropdown & Batch Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-xs font-mono uppercase tracking-wider ${
                    theme === 'day' ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`text-xs font-bold font-sans uppercase rounded-xl px-3 py-2 border transition-all cursor-pointer focus:outline-none focus:ring-1 ${
                      theme === 'day'
                        ? 'bg-white border-slate-200 text-slate-800 focus:ring-indigo-500'
                        : theme === 'cyberpunk'
                          ? 'bg-black border-pink-500/40 text-[#00f0ff] focus:ring-[#00f0ff] shadow-[0_0_10px_rgba(236,72,153,0.15)] hover:border-pink-500'
                          : 'bg-slate-900 border-slate-800 text-slate-100 focus:ring-indigo-400'
                    }`}
                  >
                    <option value="default">Default / Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock-asc">Stock Level: Low to High</option>
                    <option value="stock-desc">Stock Level: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>

                  <button
                    onClick={() => {
                      setSortBy(prev => prev === 'stock-asc' ? 'stock-desc' : 'stock-asc');
                      triggerToast(`Sorted by stock: ${sortBy === 'stock-asc' ? 'Descending' : 'Ascending'}`, "success");
                    }}
                    className={`px-3 py-2 text-xs font-bold font-sans uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      sortBy.startsWith('stock')
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : theme === 'day'
                          ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 shadow-xs'
                    }`}
                    title="Organize products by stock level"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sort by Stock Level {sortBy === 'stock-asc' ? '▲' : sortBy === 'stock-desc' ? '▼' : ''}</span>
                  </button>

                  {isMohab && (
                    <>
                    </>
                  )}

                   <button
                    onClick={handleToggleSelectAllVisible}
                    className={`px-3 py-2 text-xs font-bold font-sans uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      allFilteredSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.45)]'
                        : theme === 'day'
                          ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 shadow-xs'
                    }`}
                    title="Select or deselect all products currently visible after filtering"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{allFilteredSelected ? 'Deselect All Visible' : 'Select All Visible'}</span>
                  </button>

                  <button
                    onClick={handleResetCatalog}
                    className={`px-3 py-2 text-xs font-bold font-sans uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      theme === 'day'
                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 shadow-xs'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/25 shadow-xs'
                    }`}
                    title="Clear all custom tags, reset stock thresholds, and remove temporary visual states"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Catalog</span>
                  </button>

                  <button
                    onClick={() => {
                      setBulkTagMode(prev => !prev);
                      setSelectedBulkProductIds([]);
                      triggerToast(bulkTagMode ? "Disabled Bulk Tag Mode" : "Enabled Bulk Tag Mode: select product cards to apply badges", "success");
                    }}
                    className={`px-3 py-2 text-xs font-bold font-sans uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      bulkTagMode
                        ? 'bg-pink-600 border-pink-500 text-white shadow-[0_0_12px_#ec4899]'
                        : theme === 'day'
                          ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 shadow-xs'
                    }`}
                    title="Toggle Bulk Tagging Control Panel"
                  >
                    <Tag className="w-3.5 h-3.5 text-pink-400" />
                    <span>{bulkTagMode ? 'Cancel Bulk Tag' : 'Bulk Tag'}</span>
                  </button>


                </div>
              </div>

              {/* Recent Scans list below the scanner area / Scan QR trigger */}
              {recentScans.length > 0 && (
                <div className={`p-3 rounded-2xl border font-mono text-[11px] flex flex-wrap items-center gap-3 ${
                  theme === 'day' 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-slate-900/40 border-slate-800'
                }`}>
                  <span className="text-slate-400 uppercase tracking-widest font-black text-[9px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Recent Scans:
                  </span>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {recentScans.map((scanId) => {
                      const scannedP = products.find(p => p.id === scanId);
                      if (!scannedP) return null;
                      const isCurrent = scannedTargetProductId === scanId;
                      return (
                        <button
                          key={scanId}
                          onClick={() => {
                            setScannedTargetProductId(scanId);
                            triggerToast(`Recalled Scan: ${scannedP.name}`, "success");
                          }}
                          className={`px-2.5 py-1 rounded-xl border text-[10px] font-sans font-semibold transition-all cursor-pointer flex items-center gap-1 hover:scale-102 ${
                            isCurrent
                              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                              : theme === 'day'
                                ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                          }`}
                          title={`Quick filter back to ${scannedP.name}`}
                        >
                          <span className="truncate max-w-[110px]">{scannedP.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setRecentScans([]);
                      setScannedTargetProductId(null);
                      triggerToast("Scans history cleared", "success");
                    }}
                    className="text-[9px] uppercase tracking-wider text-rose-400 hover:text-rose-300 ml-auto font-bold transition-colors cursor-pointer hover:underline"
                  >
                    Clear History
                  </button>
                </div>
              )}

              {/* Bulk Action Tagging Panel */}
              <AnimatePresence>
                {bulkTagMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 font-sans ${
                      theme === 'day' 
                        ? 'bg-slate-50 border-slate-200 shadow-sm' 
                        : 'bg-slate-900/65 border-slate-800 text-white shadow-xl'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-pink-500">
                        Bulk Tagging: {selectedBulkProductIds.length} checked
                      </span>
                      <button
                        onClick={() => {
                          if (selectedBulkProductIds.length === filteredProducts.length) {
                            setSelectedBulkProductIds([]);
                          } else {
                            setSelectedBulkProductIds(filteredProducts.map(p => p.id));
                          }
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          theme === 'day' ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white'
                        }`}
                      >
                        {selectedBulkProductIds.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {['Promotional', 'Discontinued', 'Hot Sale', 'Special Deal', 'Clearance'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleApplyBulkTag(tag)}
                            disabled={selectedBulkProductIds.length === 0}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-sm"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                        <input
                          type="text"
                          placeholder="Custom Label..."
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          className={`px-3 py-1 text-xs rounded-lg outline-none border transition-all ${
                            theme === 'day' 
                              ? 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500' 
                              : 'bg-slate-950 border-slate-800 text-white focus:border-pink-500'
                          }`}
                        />
                        <button
                          onClick={() => {
                            if (!customTagInput.trim()) return;
                            handleApplyBulkTag(customTagInput.trim());
                            setCustomTagInput('');
                          }}
                          disabled={selectedBulkProductIds.length === 0 || !customTagInput.trim()}
                          className="px-3 py-1 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => handleApplyBulkTag('')}
                          disabled={selectedBulkProductIds.length === 0}
                          className="px-2.5 py-1 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-bold rounded-lg cursor-pointer transition-all"
                          title="Clear Tags"
                        >
                          Clear Tags
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredProducts.length === 0 ? (
                <div className={`text-center py-16 px-6 rounded-3xl border ${
                  theme === 'day' 
                    ? 'bg-slate-50 border-slate-200 text-slate-500' 
                    : theme === 'night' 
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400' 
                      : 'bg-slate-950/40 border-pink-500/10 text-slate-400'
                }`}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-850 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-800">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2 uppercase font-mono tracking-wider">No Heavy Machinery Available</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                    The factory portal is currently empty. Start hosting custom parts and industrial machinery to populate the Sdazum Cyberport.
                  </p>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        triggerToast("Please login / signup first to post custom items!", "error");
                        setAuthIsSignUp(false);
                        setView('auth');
                      } else {
                        if (!isMohab) {
                          triggerToast("Access Denied: Only primary admin (Mohab) can host new products.", "error");
                          return;
                        }
                        setView('admin');
                        setIsAddProductOpen(true);
                      }
                    }}
                    className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-105 cursor-pointer ${
                      theme === 'cyberpunk' 
                        ? 'bg-pink-500 text-white hover:bg-pink-600 glow-pink' 
                        : theme === 'day' 
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    Host First Item
                  </button>
                </div>
              ) : (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-6"
                >
                  {filteredProducts.map((p) => {
                    const commentsCount = (reviewsDB[p.id] || p.reviews || []).length;
                    return (
                      <motion.div
                        id="product-card-container"
                        key={p.id}
                        layoutId={`card-container-${p.id}`}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          show: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 100,
                              damping: 15
                            }
                          }
                        }}
                        draggable={isMohab}
                        onDragStart={(e) => {
                          if (!isMohab) return;
                          e.dataTransfer.setData("text/plain", p.id);
                          setDraggedId(p.id);
                        }}
                        onDragOver={(e) => {
                          if (!isMohab) return;
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          if (!isMohab) return;
                          e.preventDefault();
                          const sourceId = e.dataTransfer.getData("text/plain");
                          if (sourceId && sourceId !== p.id) {
                            handleReorder(sourceId, p.id);
                          }
                          setDraggedId(null);
                        }}
                        onDragEnd={() => setDraggedId(null)}
                        layout
                        className={`transition-all duration-300 rounded-3xl ${
                          draggedId === p.id 
                            ? 'opacity-40 scale-95 border-dashed border-[#00f0ff]' 
                            : ''
                        } ${
                          selectedBulkProductIds.includes(p.id) || compareProductIds.includes(p.id)
                            ? 'ring-4 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.55)] scale-[1.01]'
                            : ''
                        } ${
                          scannedTargetProductId === p.id
                            ? 'ring-4 ring-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.85)] animate-pulse scale-[1.03]'
                            : ''
                        }`}
                      >
                        <ParallaxCard
                          id={`product-card-${p.id}`}
                          theme={theme}
                          isLoading={loadingProductId === p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setView('product-details');
                          }}
                          layoutId={`card-container-${p.id}`}
                          className={`${
                            blinkProductId === p.id
                              ? 'ring-2 ring-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.7)] animate-pulse'
                              : ''
                          }`}
                        >
                          {/* Interactive temporary loading spinner overlay */}
                          {loadingProductId === p.id && (
                            <div className="absolute inset-0 bg-slate-950/90 rounded-3xl flex flex-col items-center justify-center z-50 transition-all duration-300">
                              <div className="w-10 h-10 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.6)]"></div>
                              <span className="text-[10px] text-[#00f0ff] font-mono mt-3 uppercase tracking-widest font-black animate-pulse">Initializing Interface...</span>
                            </div>
                          )}



                          {/* Wishlist toggle button */}
                          <button
                            onClick={(e) => toggleWishlist(p.id, e)}
                            className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/70 border border-slate-800 hover:border-pink-500 hover:scale-110 active:scale-90 transition-all cursor-pointer flex items-center justify-center text-rose-500 shadow-lg"
                            title={wishlist.includes(p.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${wishlist.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                          </button>



                          {/* Bulk select checkmark */}
                          {bulkTagMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBulkProductIds(prev => 
                                  prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                );
                              }}
                              className={`absolute top-24 left-4 z-20 p-2 rounded-full border hover:scale-110 active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-lg ${
                                selectedBulkProductIds.includes(p.id)
                                  ? 'bg-pink-600 border-pink-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                                  : 'bg-black/70 border-slate-800 text-slate-400 hover:border-pink-500 hover:text-pink-400'
                              }`}
                              title={selectedBulkProductIds.includes(p.id) ? "Deselect Product" : "Select Product"}
                            >
                              <Check className="w-3.5 h-3.5 animate-pulse" />
                            </button>
                          )}

                          {/* Interactive buy overlays */}
                          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#00f0ff] border border-pink-500/40 z-10">
                            <span>🔥 {p.salesCount || Math.floor(p.price * 3.4)} sold</span>
                          </div>

                          {/* Custom applied tag badge area in top-right corner */}
                          {p.customBadge && (
                            <div className="absolute top-12 right-4 z-10 flex items-center gap-1 bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider text-pink-400 animate-pulse">
                              🏷️ {p.customBadge}
                            </div>
                          )}

                          {/* Product image with fallbacks and subtle zoom transition on hover */}
                          <div 
                            className="relative w-full h-60 overflow-hidden rounded-2xl mb-4 cursor-pointer group/img [transform-style:preserve-3d]"
                          >
                            <div className="parallax-img w-full h-full transition-transform duration-700 ease-out [transform-style:preserve-3d]">
                              {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                                <LazyImage
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover rounded-2xl [transform:translateZ(30px)]"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-900/60 flex items-center justify-center rounded-2xl [transform:translateZ(30px)]">
                                  <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-28 h-28" />
                                </div>
                              )}
                            </div>

                            {/* D3 Sparkline Overlay */}
                            {priceHistoryActive[p.id] && (
                              <PriceSparkline
                                basePrice={p.price}
                                productId={p.id}
                                theme={theme}
                              />
                            )}

                            {/* D3 Inventory Trend Sparkline Overlay */}
                            {trendHistoryActive[p.id] && (
                              <InventorySparkline
                                baseStock={p.stock || 0}
                                productId={p.id}
                                theme={theme}
                              />
                            )}
                          </div>

                          {/* Title & metadata */}
                          <div className="space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold text-pink-500">{p.category}</span>
                                {p.customBadge && (
                                  <span className="px-1.5 py-0.5 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                                    🏷️ {p.customBadge}
                                  </span>
                                )}
                                {/* Interactive Hover Low Stock Badge */}
                                {((p.stock !== undefined ? p.stock : 0) <= (stockAlertThresholds[p.id] !== undefined ? stockAlertThresholds[p.id] : 15)) && (
                                  <div 
                                    className="relative inline-block"
                                    onMouseEnter={() => {
                                      setHoveredStockProductId(p.id);
                                      setEditingThresholdVal(stockAlertThresholds[p.id] !== undefined ? stockAlertThresholds[p.id] : 15);
                                    }}
                                  >
                                    <span className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 border border-rose-500/20 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-all animate-pulse">
                                      ⚠️ Low Stock
                                    </span>

                                    <AnimatePresence>
                                      {hoveredStockProductId === p.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                          className={`absolute left-0 top-full mt-2 z-50 p-3.5 rounded-xl border w-64 shadow-2xl font-sans text-left leading-normal ${
                                            theme === 'day' 
                                              ? 'bg-white border-slate-200 text-slate-800 shadow-xl' 
                                              : 'bg-slate-900 border-slate-800 text-white shadow-2xl'
                                          }`}
                                          onClick={(e) => e.stopPropagation()}
                                          onMouseLeave={() => setHoveredStockProductId(null)}
                                        >
                                          <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-slate-800/40">
                                            <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                                              📧 Alert settings
                                            </span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setHoveredStockProductId(null);
                                              }}
                                              className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                                            >
                                              ✕
                                            </button>
                                          </div>

                                          <p className="text-[10px] text-slate-400 mb-2 uppercase">
                                            Alert threshold (units):
                                          </p>

                                          <div className="space-y-2.5">
                                            <div className="flex items-center justify-between gap-2">
                                              <input
                                                type="range"
                                                min="1"
                                                max="50"
                                                value={editingThresholdVal}
                                                onChange={(e) => setEditingThresholdVal(parseInt(e.target.value))}
                                                className="w-full accent-pink-500 h-1 rounded-lg cursor-pointer bg-slate-950"
                                              />
                                              <span className="text-xs font-mono font-bold text-[#00f0ff] min-w-[20px] text-right">
                                                {editingThresholdVal}
                                              </span>
                                            </div>

                                            <div>
                                              <span className="text-[8px] text-slate-400 font-mono block uppercase">RECIPIENT EMAIL:</span>
                                              <input
                                                type="email"
                                                value={stockAlertEmail}
                                                onChange={(e) => setStockAlertEmail(e.target.value)}
                                                className={`w-full mt-0.5 px-2 py-1 text-[10px] rounded border outline-none font-mono ${
                                                  theme === 'day'
                                                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                                                    : 'bg-slate-950 border-slate-800 text-white focus:border-pink-500'
                                                }`}
                                                placeholder="email@example.com"
                                              />
                                            </div>

                                            <div className="flex gap-1.5 pt-1">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const newThresholds = { ...stockAlertThresholds, [p.id]: editingThresholdVal };
                                                  setStockAlertThresholds(newThresholds);
                                                  localStorage.setItem('azum_stock_thresholds', JSON.stringify(newThresholds));
                                                  localStorage.setItem('azum_stock_email', stockAlertEmail);
                                                  setHoveredStockProductId(null);
                                                  triggerToast(`Alert threshold of ${editingThresholdVal} units set for ${p.name}! Email alert configured to ${stockAlertEmail}`, "success");
                                                }}
                                                className="flex-1 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider rounded cursor-pointer transition-colors text-center"
                                              >
                                                Save Settings
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setHoveredStockProductId(null);
                                                }}
                                                className={`px-2 py-1.5 text-[9px] font-black uppercase rounded cursor-pointer transition-colors ${
                                                  theme === 'day' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>
                              {/* Popularity views count tag */}
                              <span className="px-1.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 rounded text-[9px] font-bold font-mono">
                                🔥 {recentViews[p.id] || 42} views
                              </span>
                            </div>

                            <h4 
                              className={`font-black text-sm tracking-tight line-clamp-1 cursor-pointer transition-colors ${
                                theme === 'cyberpunk' 
                                  ? 'text-[#00f0ff]' 
                                  : theme === 'day' 
                                    ? 'text-slate-900' 
                                    : 'text-slate-100'
                              }`}
                            >
                              {p[`name_${language}` as keyof typeof p] || p.name}
                            </h4>

                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-8">
                              {p[`short_${language}` as keyof typeof p] || p.shortDescription}
                            </p>

                            {/* Reviews overview in list card & Show History button */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1">
                                <div className="flex text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating || 4) ? 'fill-amber-400' : ''}`} />
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-400">({commentsCount || (p.reviews || []).length})</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                              </div>
                            </div>

                            {/* Render D3-powered Stock fluctuation history */}
                            {stockHistoryActive[p.id] && (
                              <StockHistoryChart productId={p.id} theme={theme} />
                            )}
                          </div>

                          {/* Price and buttons */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 mt-4">
                            <p className="font-mono font-black text-md text-[#00f0ff]">${p.price.toFixed(2)}</p>
                            
                            <div className="flex gap-1.5 flex-wrap justify-end">


                              {/* Quick View eye icon button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewProduct(p);
                                }}
                                className="p-2 bg-slate-900 border border-slate-800 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-slate-400 hover:text-[#00f0ff] rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                                title="Quick View Product"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* QR Code button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQrCodeProduct(p);
                                }}
                                className="p-2 bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-500/10 text-slate-400 hover:text-pink-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                                title="Show Mobile QR Code"
                              >
                                <QrCode className="w-3.5 h-3.5 text-pink-500" />
                              </button>

                              {/* Quick Add Button */}
                              <button
                                id={`quick-add-${p.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const defaultSize = p.sizes?.[0] || 'Standard';
                                  const defaultColor = p.colors?.[0] || { name: 'Industrial Gray', value: '#64748B' };
                                  handleAddToCart(p, 1, defaultSize, defaultColor);
                                }}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all hover:scale-102 active:scale-95 cursor-pointer text-xs font-black flex items-center gap-1 shrink-0"
                                title="Quick Add"
                              >
                                <Plus className="w-3 h-3 text-emerald-100" />
                                <span>Quick Add</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(p);
                                  setView('product-details');
                                }}
                                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 rounded-lg text-[#00f0ff] hover:text-white transition-colors cursor-pointer text-xs font-bold"
                                title="View reviews & details"
                              >
                                Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareProduct(p);
                                }}
                                className="p-2 bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-500/10 text-slate-400 hover:text-pink-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                                title="Share machinery details"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </ParallaxCard>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.section>

            {/* PLATFORM SHARE SECTION AT THE BOTTOM OF THE STOREFRONT */}
            <motion.section 
              id="platform-share-bottom" 
              className="max-w-7xl mx-auto px-4 mt-8 pb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-5 transition-all ${
                theme === 'day' 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-950/90 border-slate-850 text-slate-200'
              }`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                    <Share2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wider font-mono">Share Sdazum Platform</h4>
                    <p className="text-xs text-slate-400 mt-1">Invite others to experience our digital-first heavy machinery and automated logistics portal!</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    readOnly 
                    value={window.location.href} 
                    className="bg-black/40 border border-slate-800 text-xs font-mono text-[#00f0ff] px-4 py-3 rounded-xl outline-none w-full md:w-80"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      triggerToast("Platform sharing URL copied to clipboard!", "success");
                    }}
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold uppercase text-xs font-mono rounded-xl transition-all hover:scale-102 cursor-pointer whitespace-nowrap shrink-0 shadow-md shadow-pink-500/15"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
        )}

        {/* 2. PRODUCT DETAILS SECTION WITH CUSTOM REVIEWS AND WALLET ORDERING */}
        {view === 'product-details' && selectedProduct && (
          <motion.div 
            id="product-details-page" 
            className={`max-w-7xl mx-auto py-10 px-4 font-sans ${theme === 'day' ? 'text-slate-800' : 'text-slate-200'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer font-mono"
            >
              ← Back to cyber storefront
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Visual vector layout */}
              <div className="w-full overflow-hidden rounded-[32px] relative group">
                {selectedProduct.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(selectedProduct.image) ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-[600px] object-cover rounded-[32px] hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-slate-900/60 rounded-[32px] p-12 flex items-center justify-center min-h-[400px] border border-pink-500/20 w-full relative">
                    <ProductSVG type={selectedProduct.image} color={selectedColor?.value || '#f43f5e'} className="w-56 h-56" />
                  </div>
                )}
              </div>

              {/* Right Column: Configurations Panel */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 font-mono font-bold uppercase border border-pink-500/30 px-3 py-1 rounded-full inline-block">
                    {selectedProduct.category}
                  </span>
                  <h2 id="details-title" className={`text-3xl font-black leading-tight font-mono ${theme === 'day' ? 'text-slate-900' : 'text-[#00f0ff]'}`}>
                    {selectedProduct[`name_${language}` as keyof typeof selectedProduct] || selectedProduct.name}
                  </h2>
                  
                  {/* Rating summary and buyers list count */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.35, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="inline-block cursor-pointer"
                        >
                          <Star className="w-4 h-4 fill-amber-400" />
                        </motion.span>
                      ))}
                    </div>
                    <span className={`text-xs font-bold font-mono ${theme === 'day' ? 'text-slate-700' : 'text-[#00f0ff]'}`}>5.0 Overall Rating</span>
                    <span className="text-slate-400 font-mono text-[11px] ml-2">
                      🔥 {selectedProduct.salesCount || Math.floor(selectedProduct.price * 3.4) + 120} {t.peopleBought}
                    </span>
                  </div>
                </div>

                <p id="details-price" className="text-3xl font-black text-pink-400 font-mono">
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <p id="details-description" className={`text-xs leading-relaxed font-sans ${theme === 'day' ? 'text-slate-950 font-normal' : 'text-slate-300'}`}>
                  {selectedProduct[`desc_${language}` as keyof typeof selectedProduct] || selectedProduct.description}
                </p>

                {/* Configurations parameters */}
                <div className="space-y-5 pt-4 border-t border-slate-800">
                  
                  {/* Hotline Information Display */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    theme === 'cyberpunk'
                      ? 'bg-slate-900/80 border-pink-500/20 text-slate-100'
                      : theme === 'day'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-950/80 border-slate-800 text-slate-200'
                  }`}>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-widest">
                        Industrial Support Helpline
                      </span>
                      <span className="text-sm font-black text-pink-400 font-mono tracking-wider block">
                        Hotline: +8613371336498
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>



                  {/* Quantity & Buy mechanism integrations */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-slate-800">
                    <div className="flex items-center border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                      <button
                        onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                        className="px-4 py-3 hover:bg-slate-800 text-slate-300 transition-colors font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-5 font-bold text-xs text-[#00f0ff] font-mono">{detailQty}</span>
                      <button
                        onClick={() => setDetailQty(detailQty + 1)}
                        className="px-4 py-3 hover:bg-slate-800 text-slate-300 transition-colors font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(selectedProduct, detailQty, selectedSize || selectedProduct.sizes[0], selectedColor || selectedProduct.colors[0], customEngravingName)}
                      className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full text-xs"
                    >
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => {
                        const deepLinkUrl = `${window.location.origin}?product=${selectedProduct.id}`;
                        navigator.clipboard.writeText(deepLinkUrl);
                        triggerToast(`Deep link for "${selectedProduct.name}" copied to clipboard!`, "success");
                      }}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Share Product deep link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instant Digital automated delivery secure badges */}
                <div className="pt-6 border-t border-slate-800 space-y-3 font-mono text-[10px] text-slate-400">
                  <p className="flex items-center gap-2">
                    <Check className="text-pink-500 w-4 h-4" />
                    <span>Instant automated delivery of unlock credentials upon successful checkout.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="text-[#00f0ff] w-4 h-4" />
                    <span>Guaranteed safe athletic shipping across 32 international logistics ports.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* INTEGRATED RATINGS & STARS COMMENTS VIEW (Image 12) */}
            <div className={`mt-16 rounded-[32px] p-8 border space-y-8 ${
              theme === 'day' 
                ? 'bg-white border-slate-200 text-slate-800' 
                : 'bg-slate-950/80 border-pink-500/20 text-slate-200'
            }`}>
              <div className={`border-b pb-4 ${theme === 'day' ? 'border-slate-100' : 'border-slate-800'}`}>
                <h3 className={`text-xl font-bold font-mono uppercase flex items-center gap-2 ${theme === 'day' ? 'text-slate-900' : 'text-[#00f0ff]'}`}>
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>{t.reviews} & comments ({ (reviewsDB[selectedProduct.id] || selectedProduct.reviews || []).length })</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Real-time unedited feedback from registered digital buyers</p>
              </div>

              {/* List reviews */}
              <div className="space-y-4">
                {(reviewsDB[selectedProduct.id] || selectedProduct.reviews || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No customer reviews yet. Be the first to leave one below!</p>
                ) : (
                  (reviewsDB[selectedProduct.id] || selectedProduct.reviews || []).map((rev) => {
                    const isSelfReview = currentUser && (
                      (rev as any).userEmail === currentUser.email ||
                      rev.userName === 'mohabmohnad9' ||
                      rev.userName === 'mohabmohnad9@gmail.com'
                    );
                    const displayName = isSelfReview 
                      ? (currentUser?.name || currentUser?.email?.split('@')[0] || rev.userName)
                      : rev.userName;

                    return (
                      <div key={rev.id} className={`p-5 rounded-2xl border flex gap-4 ${
                        theme === 'day' 
                          ? 'bg-slate-50 border-slate-200 text-slate-800' 
                          : 'bg-black/40 border-slate-850/60 text-slate-200'
                      }`}>
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-pink-500/40"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs font-mono ${theme === 'day' ? 'text-indigo-600' : 'text-[#00f0ff]'}`}>{displayName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.span
                                key={i}
                                whileHover={{ scale: 1.35, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                className="inline-block cursor-pointer"
                              >
                                <Star className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : ''}`} />
                              </motion.span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                            {rev.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Leave a review Form */}
              <div className={`p-6 rounded-2xl border ${
                theme === 'day' 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-black/60 border-pink-500/25 text-slate-200'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-4 font-mono">{t.addReview}</h4>
                <form onSubmit={handleAddReview} className="space-y-4 text-xs font-mono">
                  
                  <div className="flex items-center gap-3">
                    <label className="text-slate-400 uppercase tracking-wider">{t.rating}:</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewRating(val)}
                          className="p-1 cursor-pointer outline-none focus:outline-none"
                        >
                          <motion.span
                            whileHover={{ scale: 1.35, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="inline-block"
                          >
                            <Star className={`w-5 h-5 ${val <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          </motion.span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t.writeComment}
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-pink-500 ${
                        theme === 'day' 
                          ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-600'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-pink-500 text-white font-bold rounded-xl shadow-lg glow-pink cursor-pointer"
                  >
                    {t.post}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. CART CHECKOUT VIEW */}
        {view === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <CheckoutWizard
              cart={cart}
              googleUser={googleUser}
              onConnectGmail={handleConnectGmail}
              currentUser={currentUser}
              onUpdateQuantity={(idx, newQty) => {
                const updated = [...cart];
                updated[idx].quantity = newQty;
                setCart(updated);
              }}
              onRemoveItem={(idx) => {
                const updated = cart.filter((_, i) => i !== idx);
                setCart(updated);
                triggerToast('Item removed from cart', 'success');
              }}
              onClearCart={() => setCart([])}
              onOrderPlaced={(newOrder) => {
                const processingOrder = { ...newOrder, status: 'Processing' as const };
                setOrders(prev => {
                  const next = [processingOrder, ...prev];
                  if (currentUser && currentUser.email !== 'mohabmohnad9@gmail.com' && currentUser.email !== 'lamadevtest@gmail.com') {
                    localStorage.setItem(`sdazum_orders_${currentUser.email}`, JSON.stringify(next));
                  }
                  return next;
                });
                updateTelemetryAction('purchase', newOrder.total);
                
                // Apply wallet deduction of checkout total
                if (walletBalance >= newOrder.total) {
                  setWalletBalance(prev => prev - newOrder.total);
                  triggerToast("Order authorized successfully using Wallet system!", "success");
                } else {
                  triggerToast("Charged via Credit Card successfully!", "success");
                }

                // Run digital dispatch for orders with digital items with dynamic countdown timer
                const generatedKey = `NK-KEY-${Math.floor(Math.random() * 899999) + 100000}-BULK`;
                setDeliveryProduct(products[0] || null);
                setDeliveryKey(generatedKey);
                setDeliveryLogs([
                  `[AUTO-GATEWAY] Bulking multi-order captures.`,
                  `[SHIPPING] Processing warehouse tracking metrics.`,
                  `[MICROSERVICE-WAREHOUSE] Initializing bulk license key cryptographic generator...`
                ]);
                setDeliveryCountdown(10);
                setIsGeneratingKey(true);
                setIsDeliveryLogOpen(true);

                // Send Real Gmail notification
                sendRealGmailNotification(processingOrder, generatedKey);
              }}
              language={language}
            />
          </motion.div>
        )}

        {/* 4. ORDERS VIEW PANEL */}
        {view === 'orders' && (
          <motion.div 
            id="customer-orders-panel" 
            className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!currentUser ? (
              <div className="text-center py-24 bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-xl space-y-6 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-tight">Access Denied</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Please log in or sign up to view your machinery order history, active industrial delivery codes, and automated dispatch logs.
                  </p>
                </div>
                <button
                  onClick={() => setView('auth')}
                  className="px-6 py-3 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-black uppercase rounded-xl transition-all font-mono text-xs shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  Authorize Session
                </button>
              </div>
            ) : (() => {
              const userOrders = orders.filter(o => o.address?.email?.toLowerCase() === currentUser?.email?.toLowerCase());
              const filteredUserOrders = userOrders.filter(o => {
                if (orderStatusFilter === 'All') return true;
                const mappedStatus = o.status === 'success' ? 'Delivered' : (o.status === 'pending' ? 'Processing' : o.status);
                return mappedStatus.toLowerCase() === orderStatusFilter.toLowerCase();
              });

              return (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-2xl font-black text-[#00f0ff] tracking-tight font-mono uppercase">Your Machinery Orders</h2>
                      <p className="text-xs text-slate-400 font-mono">Review real-time industrial delivery tracking and machine unlocking licenses</p>
                    </div>

                    {/* Order Status Filters */}
                    <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                      {(['All', 'Processing', 'Delivered'] as const).map((st) => {
                        const isActive = orderStatusFilter === st;
                        const count = userOrders.filter(o => {
                          if (st === 'All') return true;
                          const mappedStatus = o.status === 'success' ? 'Delivered' : (o.status === 'pending' ? 'Processing' : o.status);
                          return mappedStatus.toLowerCase() === st.toLowerCase();
                        }).length;

                        return (
                          <button
                            key={st}
                            onClick={() => setOrderStatusFilter(st)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                              isActive
                                ? theme === 'cyberpunk'
                                  ? 'bg-pink-500 border-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                                  : 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)]'
                                : theme === 'day'
                                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <span>{st}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                              isActive ? 'bg-black/40 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spending Trends Chart Card */}
                  <div className={`p-6 rounded-3xl border my-6 ${
                    theme === 'day' 
                      ? 'bg-white border-slate-200 shadow-sm text-slate-800' 
                      : 'bg-slate-950/80 border-pink-500/20 shadow-xl text-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#00f0ff]" />
                          Spending Trend (Last 6 Months)
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Monthly overview of your industrial machinery investments</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 font-mono uppercase">Total 6-Month Investment</p>
                        <h4 className="text-xl font-black font-mono text-[#00f0ff]">
                          ${spendingData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h4>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme === 'day' ? '#4f46e5' : (theme === 'cyberpunk' ? '#ec4899' : '#00f0ff')} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={theme === 'day' ? '#4f46e5' : (theme === 'cyberpunk' ? '#ec4899' : '#00f0ff')} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={theme === 'day' ? '#e2e8f0' : '#1e293b'} 
                            vertical={false} 
                          />
                          <XAxis 
                            dataKey="label" 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={8}
                            className="font-mono"
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            dx={-8}
                            className="font-mono"
                            tickFormatter={(val) => `$${val.toLocaleString()}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: theme === 'day' ? '#ffffff' : '#0f172a', 
                              borderColor: theme === 'day' ? '#cbd5e1' : '#334155', 
                              borderRadius: '12px', 
                              color: theme === 'day' ? '#0f172a' : '#fff', 
                              fontSize: '11px',
                              fontFamily: 'monospace'
                            }}
                            formatter={(value: any) => [`$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Spent']}
                            cursor={{ stroke: theme === 'day' ? '#4f46e5' : (theme === 'cyberpunk' ? '#ec4899' : '#00f0ff'), strokeWidth: 1, strokeDasharray: '3 3' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke={theme === 'day' ? '#4f46e5' : (theme === 'cyberpunk' ? '#ec4899' : '#00f0ff')} 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#spendingGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {filteredUserOrders.length === 0 ? (
                    <div className="text-center py-16 bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-sm space-y-4">
                      <p className="text-4xl">📦</p>
                      <h3 className="text-sm font-bold text-slate-500 font-mono uppercase">No {orderStatusFilter.toLowerCase()} orders found.</h3>
                      <button onClick={() => setView('store')} className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-mono font-bold glow-pink">
                        Browse Machinery Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono border-collapse">
                          <thead className="bg-black/60 border-b border-pink-500/20 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                            <tr>
                              <th className="py-4 px-6">Order ID</th>
                              <th className="py-4 px-4">Date</th>
                              <th className="py-4 px-4">Machinery Items</th>
                              <th className="py-4 px-4">Unlock Key</th>
                              <th className="py-4 px-4">Total Price</th>
                              <th className="py-4 px-4">Fulfillment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-slate-300">
                            {filteredUserOrders.map((o) => {
                              const isExpanded = expandedOrderId === o.id;
                              const currentStatus = o.status === 'success' ? 'Delivered' : (o.status === 'pending' ? 'Processing' : o.status);
                              return (
                                <React.Fragment key={o.id}>
                                  <tr 
                                    onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                                    className={`hover:bg-slate-900/60 transition-colors cursor-pointer border-l-4 ${
                                      isExpanded 
                                        ? 'border-pink-500 bg-slate-900/80' 
                                        : 'border-transparent'
                                    }`}
                                  >
                                    <td className="py-4 px-6 font-mono font-bold text-pink-400">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-slate-500">{isExpanded ? '▼' : '▶'}</span>
                                        <span>#{o.id.substr(0, 10)}</span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-500">
                                      {o.date}
                                    </td>
                                    <td className="py-4 px-4">
                                      <ul className="space-y-3 text-[11px]">
                                        {o.products.map((item, idx) => (
                                          <li key={idx} className="list-none">
                                            <div className="flex items-center gap-3 py-1">
                                              <img
                                                src={item.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(item.image) ? item.image : `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100`}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                                              />
                                              <div>
                                                <span className="font-medium text-slate-200">{item.name}</span> <span className="font-bold text-[#00f0ff]">(x{item.quantity})</span>
                                                {item.customName && (
                                                  <div className="text-[10px] text-pink-400 font-mono mt-0.5">
                                                    ↳ Custom ID Engraving: <span className="text-white font-bold bg-pink-500/15 px-1.5 py-0.5 rounded border border-pink-500/20">{item.customName}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className="bg-indigo-950/80 text-indigo-400 font-bold px-2 py-1 rounded border border-indigo-500/30 text-[10px] font-mono">
                                        IND-{o.id.substr(0, 6)}-ACTIVE
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold text-[#00f0ff]">
                                      ${o.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 px-4">
                                      {currentStatus === 'Processing' ? (
                                        <span className="bg-amber-950/80 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block animate-pulse"></span>
                                          <span>Processing</span>
                                        </span>
                                      ) : (
                                        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                                          <span>Delivered</span>
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  
                                  {/* Expandable High-Tech Shipping Timeline progress panel */}
                                  {isExpanded && (
                                    <tr className="bg-slate-950/90 border-b border-pink-500/10">
                                      <td colSpan={6} className="p-6">
                                        <div className="space-y-6">
                                          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                                            <div>
                                              <span className="text-[10px] text-pink-400 font-mono font-bold uppercase tracking-wider">Live Telemetry Timeline</span>
                                              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-tight font-mono">Precision Logistic Workflow Nodes</h4>
                                            </div>
                                            <span className="text-[9px] text-slate-500 font-mono">Carrier: Shandong Azum Cargo Systems</span>
                                          </div>

                                          {/* Graphical Timeline Stepper */}
                                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                                            {/* Connector Line Backdrop for Desktop */}
                                            <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-slate-800 z-0" />
                                            <div className="hidden md:block absolute top-[18px] left-[10%] w-[50%] h-0.5 bg-gradient-to-r from-emerald-500 to-pink-500 z-0" />

                                            {/* Step 1: Order Registered */}
                                            <div className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                              <div className="w-9 h-9 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-[0_0_8px_rgba(16,185,129,0.3)] shrink-0">
                                                ✓
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-bold text-slate-200 font-mono uppercase">1. PLACED</p>
                                                <p className="text-[9px] text-slate-500 font-mono">Validated payment & clearing</p>
                                              </div>
                                            </div>

                                            {/* Step 2: Quality Control & Calibration */}
                                            <div className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                              <div className="w-9 h-9 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-[0_0_8px_rgba(16,185,129,0.3)] shrink-0">
                                                ✓
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-bold text-slate-200 font-mono uppercase">2. QC PASSED</p>
                                                <p className="text-[9px] text-slate-500 font-mono">Laser alignment calibration</p>
                                              </div>
                                            </div>

                                            {/* Step 3: CNC Laser Engraving / Production */}
                                            <div className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                              <div className="w-9 h-9 rounded-full bg-pink-950 border-2 border-pink-500 flex items-center justify-center text-pink-400 font-bold text-xs shadow-[0_0_12px_rgba(236,72,153,0.5)] animate-pulse shrink-0">
                                                ⚙
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-bold text-pink-400 font-mono uppercase">3. PROCESSING</p>
                                                <p className="text-[9px] text-slate-400 font-mono">Applying custom nameplate engraving</p>
                                              </div>
                                            </div>

                                            {/* Step 4: Dispatch Flight SD-781 */}
                                            <div className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                              <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                                                ✈
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-bold text-slate-500 font-mono uppercase">4. IN TRANSIT</p>
                                                <p className="text-[9px] text-slate-600 font-mono">Shandong Heavy airfreight</p>
                                              </div>
                                            </div>

                                            {/* Step 5: Unlocked & Delivered */}
                                            <div className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                              <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                                                🔒
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-bold text-slate-500 font-mono uppercase">5. UNLOCKED</p>
                                                <p className="text-[9px] text-slate-600 font-mono">Final site handoff & activation</p>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Shipping log console output terminal lines */}
                                          <div className="bg-black/80 rounded-2xl p-4 border border-slate-900 font-mono text-[9px] text-slate-400 leading-relaxed space-y-1">
                                            <p className="text-emerald-500/80">[SYSTEM] :: PAYMENT DETECTED - SECURE LUHN VERIFICATION COMPLETED</p>
                                            <p className="text-emerald-500/80">[SYSTEM] :: MANUFACTURING ASSIGNED TO CNC ROBOTIC GRID SHANDONG-4</p>
                                            <p className="text-pink-500/80">[SYSTEM] :: CUSTOM ENGRAVING ACTIVE: "${o.products[0]?.customName || 'STANDARD AZUM DESIGN'}" IN PROCESS</p>
                                            <p className="text-slate-500">[PENDING] :: CARRIER FLIGHT ASSIGNMENT IN PROCESS (SD-781 AIRLINE COOP)</p>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* 6. CLERK AUTHENTICATOR */}
        {view === 'auth' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ClerkAuth
              onSuccess={handleAuthSuccess}
              onClose={() => setView('store')}
              onGoogleAuth={handleConnectGmail}
              initialIsSignUp={authIsSignUp}
              language={language}
              theme={theme}
            />
          </motion.div>
        )}

        {/* 7. ADMINISTRATIVE DASHBOARD PORTAL */}
        {view === 'admin' && (
          <AdminGuard currentUser={currentUser} onSignUpClick={() => { setAuthIsSignUp(true); setView('auth'); }}>
            <motion.div 
              id="admin-panel-layout" 
            className={`flex min-h-[calc(100vh-4rem)] transition-colors duration-300 ${
              theme === 'day' 
                ? 'bg-slate-50 text-slate-800' 
                : 'bg-[#0f111a] text-slate-100'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Sidebar matching the reference app in Image 2 */}
            <aside 
              id="admin-sidebar" 
              className={`w-64 border-r p-5 flex flex-col justify-between shrink-0 font-sans transition-colors duration-300 ${
                theme === 'day' 
                  ? 'bg-white border-slate-200 text-slate-700' 
                  : 'bg-[#0a0b10] border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="space-y-6">
                {/* Header: brand name */}
                <div className={`flex items-center gap-2.5 px-2 pb-3 border-b ${
                  theme === 'day' ? 'border-slate-100' : 'border-slate-800/60'
                }`}>
                  <span className={`font-black text-sm tracking-tight uppercase font-mono ${
                    theme === 'day' ? 'text-black' : 'text-white'
                  }`}>Shandong Azum</span>
                </div>
 
                <div className="space-y-4 pr-1">
                  {/* Category: Application */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-wider px-2">Application</p>
                    <button
                      onClick={() => setAdminSubView('overview')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        adminSubView === 'overview' 
                          ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                          : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                    >
                      <Home className="w-4 h-4 text-indigo-400" />
                      <span>Home</span>
                    </button>
                    {isMohab && (
                      <>
                        <button
                          onClick={() => setAdminSubView('inbox')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'inbox' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-indigo-400" />
                            <span>Inbox</span>
                          </div>
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                            {adminInbox.length + 23}
                          </span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('chat')}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'chat' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-[#00f0ff]/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                            <span>Google Chat</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setAdminSubView('calendar')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'calendar' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-indigo-400" />
                          <span>Calendar</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('search')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'search' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <Search className="w-4 h-4 text-indigo-400" />
                          <span>Search</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('settings')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'settings' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <Settings className="w-4 h-4 text-indigo-400" />
                          <span>Settings</span>
                        </button>
                      </>
                    )}
                  </div>
 
                  {isMohab && (
                    <>
                      {/* Category: Products */}
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-wider px-2">Products</p>
                        <button
                          onClick={() => setAdminSubView('products')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'products' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4 text-indigo-400" />
                          <span>See All Products</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('analytics')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'analytics' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <BarChart3 className="w-4 h-4 text-indigo-400" />
                          <span>Product Analytics</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('add-product')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'add-product' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <PlusCircle className="w-4 h-4 text-indigo-400" />
                          <span>Add Product</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('add-category')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'add-category' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <FolderPlus className="w-4 h-4 text-indigo-400" />
                          <span>Add Category</span>
                        </button>
                      </div>

                      {/* Category: Users */}
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-wider px-2">Users</p>
                        <button
                          onClick={() => setAdminSubView('users')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'users' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <Users className="w-4 h-4 text-indigo-400" />
                          <span>See All Users</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('add-user')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'add-user' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <PlusCircle className="w-4 h-4 text-indigo-400" />
                          <span>Add User</span>
                        </button>
                      </div>

                      {/* Category: Orders / Payments */}
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-wider px-2">Orders / Payments</p>
                        <button
                          onClick={() => setAdminSubView('transactions')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'transactions' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-indigo-400" />
                          <span>See All Transactions</span>
                        </button>
                        <button
                          onClick={() => setAdminSubView('add-order')}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            adminSubView === 'add-order' 
                              ? theme === 'day' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#00f0ff]/10 text-[#00f0ff]' 
                              : theme === 'day' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <Plus className="w-4 h-4 text-indigo-400" />
                          <span>Add Order</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Search Shortcut */}
              {isMohab && (
                <div className="px-2 mt-auto">
                  <button
                    onClick={() => {
                      setIsAdminPaletteOpen(true);
                      setPaletteSearchQuery('');
                      setPaletteSelectedIndex(0);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl transition-all cursor-pointer text-left ${
                      theme === 'cyberpunk'
                        ? 'border-[#00f0ff]/20 hover:border-[#00f0ff]/50 bg-slate-950/40 text-slate-400 hover:text-[#00f0ff]'
                        : theme === 'day'
                          ? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-800'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[11px] font-bold">Search sub-views</span>
                    </div>
                    <kbd className="text-[9px] font-mono bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                      ⌘K
                    </kbd>
                  </button>
                </div>
              )}

              {/* Bottom Profile Widget */}
              <div className={`flex items-center justify-between border-t pt-3 mt-4 ${
                theme === 'day' ? 'border-slate-100' : 'border-slate-800/60'
              }`}>
                <div className="flex items-center gap-2.5">
                  {currentUser ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-750 shrink-0">
                      <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-full flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
                      A
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className={`font-extrabold text-xs tracking-tight block truncate ${
                      theme === 'day' ? 'text-slate-800' : 'text-white'
                    }`}>
                      {currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : 'Altayeb Yousif Dafalla'}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">
                      {currentUser ? currentUser.role : 'Super Admin'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    localStorage.removeItem('cyberport_user');
                    setCurrentUser(null);
                    setView('store');
                    triggerToast("Logged out from admin portal successfully.", "success");
                  }}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </aside>
 
            {/* Main Admin View Content */}
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">
              {/* Header section with Dynamic Titles */}
              <div id="admin-subheader" className={`flex items-center justify-between border-b pb-4 ${
                theme === 'day' ? 'border-slate-200' : 'border-slate-800/80'
              }`}>
                <div>
                  <h2 className={`text-xl md:text-2xl font-black tracking-tight uppercase font-mono ${
                    theme === 'day' ? 'text-black' : 'text-white'
                  }`}>
                    {adminSubView === 'overview' && 'DASHBOARD PORTAL'}
                    {adminSubView === 'inbox' && 'MAILROOM DISPATCH'}
                    {adminSubView === 'chat' && 'OPERATIONAL DISPATCH CHAT'}
                    {adminSubView === 'calendar' && 'DELIVERY LOGISTICS SCHEDULE'}
                    {adminSubView === 'search' && 'DATABASE DRILL CONSOLE'}
                    {adminSubView === 'settings' && 'SYSTEM PARAMS & INTEGRATIONS'}
                    {adminSubView === 'products' && 'MACHINERY CAPABILITIES LIST'}
                    {adminSubView === 'analytics' && 'INVENTORY PERFORMANCE ANALYTICS'}
                    {adminSubView === 'add-product' && 'HOST NEW HEAVY MACHINERY'}
                    {adminSubView === 'add-category' && 'DEFINE INDUSTRIAL CLASSIFICATION'}
                    {adminSubView === 'users' && 'CUSTOMER AUDIT DIRECTORY'}
                    {adminSubView === 'add-user' && 'ONBOARD REGIONAL OPERATORS'}
                    {adminSubView === 'transactions' && 'MERCHANT REVENUE LEDGER'}
                    {adminSubView === 'add-order' && 'DISPATCH MANUAL CARGO'}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Shandong Azum Import & Export Co., Ltd. // Terminal Admin Panel
                  </p>
                </div>
                <button
                  onClick={() => setAdminSubView('add-product')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Machinery</span>
                </button>
              </div>
 
              {/* Conditional Subview Rendering */}
              {(() => {
                switch (adminSubView) {
                  case 'overview':
                    return (
                      <AdminOverview
                        products={products}
                        orders={orders}
                        setProducts={setProducts}
                        setOrders={setOrders}
                        telemetry={telemetry}
                        theme={theme}
                      />
                    );
                  
                  case 'inbox':
                    return (
                      <GmailClient
                        googleToken={googleToken}
                        googleUser={googleUser}
                        onConnect={handleConnectGmail}
                        onDisconnect={handleDisconnectGmail}
                        theme={theme}
                        triggerToast={triggerToast}
                        adminInbox={adminInbox}
                      />
                    );
                  
                  case 'chat':
                    return (
                      <GoogleChatClient
                        googleToken={googleToken}
                        googleUser={googleUser}
                        onConnect={handleConnectGmail}
                        onDisconnect={handleDisconnectGmail}
                        theme={theme}
                        triggerToast={triggerToast}
                      />
                    );

                  case 'calendar':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                            📅 Logistics Schedule
                          </h3>
                          <div className="flex gap-2 text-xs">
                            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-mono">2 Shipments Pending</span>
                            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono">Altayeb Signed</span>
                          </div>
                        </div>
                        {/* Interactive calendar layout */}
                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <div key={d} className="text-slate-500 font-bold pb-2">{d}</div>
                          ))}
                          {Array.from({ length: 31 }).map((_, i) => {
                            const dayNum = i + 1;
                            const hasEvent = dayNum === 14 || dayNum === 25 || dayNum === 29;
                            return (
                              <div 
                                key={i} 
                                className={`p-4 rounded-xl border transition-all h-20 flex flex-col justify-between items-start text-left ${
                                  hasEvent 
                                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' 
                                    : 'bg-slate-900/20 border-slate-800/50 text-slate-400 hover:bg-slate-900/50'
                                }`}
                              >
                                <span className="font-bold">{dayNum}</span>
                                {dayNum === 14 && (
                                  <span className="text-[7px] bg-indigo-600 text-white font-bold px-1 rounded block truncate max-w-full">
                                    CNC Ship to Egypt
                                  </span>
                                )}
                                {dayNum === 25 && (
                                  <span className="text-[7px] bg-rose-600 text-white font-bold px-1 rounded block truncate max-w-full">
                                    Arm restock
                                  </span>
                                )}
                                {dayNum === 29 && (
                                  <span className="text-[7px] bg-emerald-600 text-white font-bold px-1 rounded block truncate max-w-full">
                                    Yousif Sign Off
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );

                  case 'search':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                        <div className="relative">
                          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                          <input
                            type="text"
                            placeholder="Query machinery serials, client emails, logistics keys, or custom engraving codes..."
                            onChange={(e) => {
                              (window as any).adminSearchVal = e.target.value;
                              setAdminSubView('search'); // update
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                          />
                        </div>
                        {/* Search outcomes */}
                        <div className="space-y-2 max-h-[350px] overflow-y-auto">
                          {(() => {
                            const query = ((window as any).adminSearchVal || "").toLowerCase();
                            const matches = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
                              .map(p => ({ type: 'Product', label: p.name, desc: p.category, spec: `$${p.price}` }))
                              .concat(
                                users.filter(u => u.email.toLowerCase().includes(query))
                                  .map(u => ({ type: 'User', label: u.email, desc: `Role: ${u.role}`, spec: 'Verified' }))
                              );
                            
                            if (matches.length === 0) {
                              return <p className="text-xs text-slate-500 text-center py-10">No matches found in Sdazum database.</p>;
                            }

                            return matches.map((m, idx) => (
                              <div key={idx} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                                <div className="flex items-center gap-3">
                                  <span className="text-[8px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold px-1.5 py-0.5 rounded uppercase">
                                    {m.type}
                                  </span>
                                  <span className="text-slate-200 font-bold">{m.label}</span>
                                  <span className="text-slate-500">| {m.desc}</span>
                                </div>
                                <span className="text-indigo-400 font-bold">{m.spec}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    );

                  case 'settings':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                            ⚙️ System Configuration
                          </h3>
                          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Merchant Gateway Status:</span>
                              <span className="text-emerald-400 font-bold">● Operational</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">SMTP Server Port:</span>
                              <span className="text-slate-300 font-mono">587 (TLS TLS)</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Direct Mail Dispatcher:</span>
                              <span className="text-indigo-400 font-bold">Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Database Microservice:</span>
                              <span className="text-slate-300 font-mono">JSON Engine (Atomic)</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                            🛡️ Representative Credentials
                          </h3>
                          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                            <p className="text-slate-400">Chief Officer:</p>
                            <p className="text-white font-bold text-sm">Altayeb Yousif Dafalla</p>
                            <p className="text-rose-400 mt-2">Shandong Azum Import & Export Co., Ltd</p>
                            <p className="text-slate-500 text-[10px]">Security Tier: LEVEL 5 ROOT CREDENTIALS</p>
                          </div>
                        </div>
                      </div>
                    );

                  case 'analytics':
                    return <AdminAnalytics products={products} theme={theme} />;

                  case 'products': {
                    const filteredProducts = products.filter(p => {
                      const hasMissingEn = !p.name_en?.trim() || !p.short_en?.trim() || !p.desc_en?.trim();
                      const hasMissingZh = !p.name_zh?.trim() || !p.short_zh?.trim() || !p.desc_zh?.trim();
                      const hasMissingAr = !p.name_ar?.trim() || !p.short_ar?.trim() || !p.desc_ar?.trim();

                      if (adminProductLocFilter === 'missing-en') return hasMissingEn;
                      if (adminProductLocFilter === 'missing-zh') return hasMissingZh;
                      if (adminProductLocFilter === 'missing-ar') return hasMissingAr;
                      if (adminProductLocFilter === 'missing-any') return hasMissingEn || hasMissingZh || hasMissingAr;
                      return true;
                    }).sort((a, b) => {
                      if (adminProductSort === 'price-asc') return a.price - b.price;
                      if (adminProductSort === 'price-desc') return b.price - a.price;
                      if (adminProductSort === 'sales-desc') return (b.salesCount || 0) - (a.salesCount || 0);
                      return a.name.localeCompare(b.name);
                    });

                    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result;
                        if (typeof text !== 'string') return;

                        try {
                          const rows = parseCSV(text);
                          if (rows.length < 2) {
                            triggerToast("Invalid CSV file. Please make sure it has a header row and at least one product row.", "error");
                            return;
                          }

                          const headers = rows[0].map(h => h.toLowerCase().trim());
                          
                          const nameIdx = headers.findIndex(h => h.includes('name') || h === 'title');
                          const catIdx = headers.findIndex(h => h.includes('category') || h === 'type' || h.includes('class'));
                          const priceIdx = headers.findIndex(h => h.includes('price') || h === 'amount' || h === 'cost');
                          const shortDescIdx = headers.findIndex(h => h.includes('short') || h === 'summary');
                          const descIdx = headers.findIndex(h => h.includes('desc') || h === 'details');
                          const imageIdx = headers.findIndex(h => h.includes('image') || h === 'img' || h === 'photo' || h === 'picture');
                          const stockIdx = headers.findIndex(h => h.includes('stock') || h === 'inventory' || h === 'qty' || h === 'quantity');
                          const salesIdx = headers.findIndex(h => h.includes('sales') || h.includes('sold'));

                          if (nameIdx === -1) {
                            triggerToast("Invalid CSV: 'Name' column is required.", "error");
                            return;
                          }

                          const importedProducts: Product[] = [];
                          let successCount = 0;

                          for (let i = 1; i < rows.length; i++) {
                            const row = rows[i];
                            if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

                            const name = row[nameIdx] || '';
                            if (!name) continue;

                            const category = catIdx !== -1 && row[catIdx] ? row[catIdx] : 'Heavy Machinery Parts';
                            const rawPrice = priceIdx !== -1 ? row[priceIdx] : '100';
                            const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 100.0;
                            
                            const shortDescription = shortDescIdx !== -1 && row[shortDescIdx] ? row[shortDescIdx] : `${name} premium machinery item.`;
                            const description = descIdx !== -1 && row[descIdx] ? row[descIdx] : `${name} manufactured with maximum industrial precision. High wear resistance and optimal performance.`;
                            
                            const rawImage = imageIdx !== -1 && row[imageIdx] ? row[imageIdx] : '';
                            let image = rawImage;
                            const availableKeys = ['helical_gear', 'bearing_block', 'bevel_gear', 'factory_presses', 'industrial_bolt', 'machine_shaft', 'metal_collar', 'oil_expeller'];
                            if (!image || (!availableKeys.includes(image) && !image.startsWith('http') && !image.startsWith('data:'))) {
                              image = availableKeys[Math.floor(Math.random() * availableKeys.length)];
                            }

                            const rawStock = stockIdx !== -1 ? row[stockIdx] : '10';
                            const stock = parseInt(rawStock.replace(/[^0-9]/g, '')) || 10;

                            const rawSales = salesIdx !== -1 ? row[salesIdx] : '0';
                            const salesCount = parseInt(rawSales.replace(/[^0-9]/g, '')) || 0;

                            const newProd: Product = {
                              id: `prod-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                              name,
                              name_en: name,
                              name_zh: name,
                              name_ar: name,
                              shortDescription,
                              short_en: shortDescription,
                              short_zh: shortDescription,
                              short_ar: shortDescription,
                              description,
                              desc_en: description,
                              desc_zh: description,
                              desc_ar: description,
                              price,
                              category,
                              sizes: ['Standard Unit', 'Heavy Duty XL'],
                              colors: [
                                { name: 'Industrial Chrome', value: '#94A3B8' },
                                { name: 'Hardened Steel', value: '#475569' }
                              ],
                              image,
                              rating: 4.8,
                              salesCount,
                              stock
                            };

                            importedProducts.push(newProd);
                            successCount++;
                          }

                          if (importedProducts.length > 0) {
                            setProducts(prev => [...prev, ...importedProducts]);
                            triggerToast(`Catalog updated: Successfully imported ${successCount} products!`, "success");
                          } else {
                            triggerToast("No products found in the uploaded CSV file.", "error");
                          }
                        } catch (err) {
                          triggerToast("Error parsing CSV file. Please ensure valid format.", "error");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = '';
                    };

                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/60 pb-3">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                            📦 Product Catalog Data ({products.length})
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => {
                                const csvContent = "data:text/csv;charset=utf-8," 
                                  + "Name,Category,Price,Short Description,Description,Image,Stock,Sales Count\n"
                                  + '"Screw Compressor","Compressors",3450.00,"Industrial silent rotary screw air compressor.","Heavy-duty rotary screw compressor with integrated dryer.","bevel_gear",10,12\n'
                                  + '"Heavy Casting Shaft","Heavy Machinery Parts",890.00,"Forged carbon steel mechanical drive shaft.","Engineered for high load power transmission systems.","machine_shaft",25,48';
                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", "machinery_import_template.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Template CSV</span>
                            </button>

                            <label className="px-3 py-1.5 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Import CSV</span>
                              <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleCSVUpload} 
                                className="hidden" 
                              />
                            </label>

                            {selectedAdminProducts.length > 0 && (
                              <button
                                onClick={() => {
                                  if (!isMohab) {
                                    triggerToast("Access Denied: Just Mohab can delete products", "error");
                                    return;
                                  }
                                  setShowBulkDeleteConfirm(true);
                                }}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.02] shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse"
                              >
                                Delete Selected ({selectedAdminProducts.length})
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (!isMohab) {
                                  triggerToast("Access Denied: Just Mohab can delete all products", "error");
                                  return;
                                }
                                if (window.confirm("Are you sure you want to delete ALL products from the catalog? This action is irreversible.")) {
                                  setProducts([]);
                                  setSelectedAdminProducts([]);
                                  triggerToast("All products have been deleted successfully", "success");
                                }
                              }}
                              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
                            >
                              Delete All Products
                            </button>
                          </div>
                        </div>
                        {/* Localization Status Filter & Sorting Toggle Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                              <Languages className="w-3.5 h-3.5 text-[#00f0ff]" />
                              <span>Translation Audit Filter:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: 'all', label: 'All Products' },
                                { id: 'missing-en', label: 'Missing EN 🇺🇸' },
                                { id: 'missing-zh', label: 'Missing ZH 🇨🇳' },
                                { id: 'missing-ar', label: 'Missing AR 🇸🇦' },
                                { id: 'missing-any', label: 'Missing Any ⚠️' },
                              ].map((tab) => {
                                const count = products.filter(p => {
                                  const hasMissingEn = !p.name_en?.trim() || !p.short_en?.trim() || !p.desc_en?.trim();
                                  const hasMissingZh = !p.name_zh?.trim() || !p.short_zh?.trim() || !p.desc_zh?.trim();
                                  const hasMissingAr = !p.name_ar?.trim() || !p.short_ar?.trim() || !p.desc_ar?.trim();
                                  if (tab.id === 'all') return true;
                                  if (tab.id === 'missing-en') return hasMissingEn;
                                  if (tab.id === 'missing-zh') return hasMissingZh;
                                  if (tab.id === 'missing-ar') return hasMissingAr;
                                  if (tab.id === 'missing-any') return hasMissingEn || hasMissingZh || hasMissingAr;
                                  return true;
                                }).length;

                                const isActive = adminProductLocFilter === tab.id;
                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => setAdminProductLocFilter(tab.id as any)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all font-bold cursor-pointer ${
                                      isActive
                                        ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                        : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
                                    }`}
                                  >
                                    {tab.label} ({count})
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Sorting Feature Dropdown */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1.5">
                              <ArrowUpDown className="w-3.5 h-3.5 text-[#00f0ff]" />
                              <span>Sort By:</span>
                            </span>
                            <select
                              value={adminProductSort}
                              onChange={(e) => setAdminProductSort(e.target.value as any)}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono outline-none cursor-pointer focus:border-[#00f0ff] hover:border-slate-700 transition-all"
                            >
                              <option value="name-asc">Alphabetical Name (A-Z)</option>
                              <option value="price-asc">Price: Low to High</option>
                              <option value="price-desc">Price: High to Low</option>
                              <option value="sales-desc">Sales Count: High to Low</option>
                            </select>
                          </div>
                        </div>

                        {/* Column Visibility Toggles */}
                        <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                          <div className="flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-[#00f0ff]" />
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-300 tracking-wider">
                              🛠️ Column Visibility Toggles
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-mono text-slate-400 mt-1">
                            {[
                              { key: 'image', label: 'Image' },
                              { key: 'name', label: 'Name & Audit' },
                              { key: 'category', label: 'Category' },
                              { key: 'price', label: 'Price' },
                              { key: 'stock', label: 'Stock Level' },
                              { key: 'salesCount', label: 'Sales Count' },
                              { key: 'description', label: 'Description' },
                            ].map((col) => (
                              <label key={col.key} className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                                <input
                                  type="checkbox"
                                  checked={(adminProductColumns as any)[col.key]}
                                  onChange={(e) => setAdminProductColumns(prev => ({ ...prev, [col.key]: e.target.checked }))}
                                  className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-900 text-[#00f0ff] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00f0ff]"
                                />
                                <span>{col.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left text-slate-300">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-mono">
                                <th className="p-3 w-10">
                                  <input 
                                    type="checkbox"
                                    checked={filteredProducts.length > 0 && selectedAdminProducts.length === filteredProducts.length}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAdminProducts(filteredProducts.map(prod => prod.id));
                                      } else {
                                        setSelectedAdminProducts([]);
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                                  />
                                </th>
                                {adminProductColumns.image && <th className="p-3 w-16">IMAGE</th>}
                                {adminProductColumns.name && <th className="p-3">NAME & LOCALIZATION AUDIT</th>}
                                {adminProductColumns.category && <th className="p-3">CATEGORY</th>}
                                {adminProductColumns.price && <th className="p-3">PRICE</th>}
                                {adminProductColumns.stock && <th className="p-3">STOCK</th>}
                                {adminProductColumns.salesCount && <th className="p-3">SALES COUNT</th>}
                                {adminProductColumns.description && <th className="p-3 max-w-xs">DESCRIPTION</th>}
                                <th className="p-3 text-right">ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredProducts.map((p, idx) => (
                                <motion.tr 
                                  key={p.id} 
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3), ease: "easeOut" }}
                                  className={`border-b border-slate-900 hover:bg-slate-900/40 transition-colors ${
                                    selectedAdminProducts.includes(p.id) ? 'bg-indigo-950/20' : ''
                                  }`}
                                >
                                  <td className="p-3">
                                    <input 
                                      type="checkbox"
                                      checked={selectedAdminProducts.includes(p.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedAdminProducts(prev => [...prev, p.id]);
                                        } else {
                                          setSelectedAdminProducts(prev => prev.filter(id => id !== p.id));
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                                    />
                                  </td>
                                  {adminProductColumns.image && (
                                    <td className="p-3">
                                      <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-850 p-0.5">
                                        {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                                          <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                                        ) : (
                                          <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-6 h-6" />
                                        )}
                                      </div>
                                    </td>
                                  )}
                                  {adminProductColumns.name && (
                                    <td className="p-3">
                                      <div className="font-bold text-white text-xs">{p.name}</div>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        {(!p.name_en?.trim() || !p.short_en?.trim() || !p.desc_en?.trim()) ? (
                                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            EN 🇺🇸 MISSING
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            EN 🇺🇸 OK
                                          </span>
                                        )}

                                        {(!p.name_zh?.trim() || !p.short_zh?.trim() || !p.desc_zh?.trim()) ? (
                                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            ZH 🇨🇳 MISSING
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            ZH 🇨🇳 OK
                                          </span>
                                        )}

                                        {(!p.name_ar?.trim() || !p.short_ar?.trim() || !p.desc_ar?.trim()) ? (
                                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            AR 🇸🇦 MISSING
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] font-mono font-bold tracking-wider">
                                            AR 🇸🇦 OK
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  )}
                                  {adminProductColumns.category && <td className="p-3 font-mono">{p.category}</td>}
                                  {adminProductColumns.price && <td className="p-3 font-mono text-indigo-400 font-bold">${p.price}</td>}
                                  {adminProductColumns.stock && (
                                    <td className="p-3 font-mono">
                                      <div className="flex flex-col gap-1 items-start">
                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                                          (p.stock || 0) < 5 
                                            ? 'bg-rose-500/20 text-rose-400 border-2 border-rose-500 animate-pulse ring-2 ring-rose-500/30 shadow-[0_0_12px_rgba(239,68,68,0.6)]' 
                                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                                        }`}>
                                          {p.stock !== undefined ? p.stock : 0} units
                                        </span>
                                        {(p.stock || 0) < 5 && (
                                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-rose-500/30 border border-rose-500/50 text-rose-200 animate-pulse tracking-wide flex items-center gap-1 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block shrink-0" />
                                            ⚠️ RESTOCK REQ
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  )}
                                  {adminProductColumns.salesCount && (
                                    <td className="p-3 font-mono">
                                      <span className="text-slate-300 font-bold">
                                        {p.salesCount !== undefined ? p.salesCount : 0} sold
                                      </span>
                                    </td>
                                  )}
                                  {adminProductColumns.description && (
                                    <td className="p-3 max-w-xs truncate text-slate-400 font-sans" title={p.description || p.shortDescription}>
                                      {p.description || p.shortDescription}
                                    </td>
                                  )}
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => {
                                          if (!isMohab) {
                                            triggerToast("Access Denied: Just Mohab can edit products", "error");
                                            return;
                                          }
                                          setEditingProduct({
                                            ...p,
                                            name_en: p.name_en || p.name || '',
                                            name_zh: p.name_zh || p.name || '',
                                            name_ar: p.name_ar || p.name || '',
                                            short_en: p.short_en || p.shortDescription || '',
                                            short_zh: p.short_zh || p.shortDescription || '',
                                            short_ar: p.short_ar || p.shortDescription || '',
                                            desc_en: p.desc_en || p.description || '',
                                            desc_zh: p.desc_zh || p.description || '',
                                            desc_ar: p.desc_ar || p.description || '',
                                          });
                                        }}
                                        className="p-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-400 border border-indigo-500/20 rounded transition-all cursor-pointer text-[10px] font-bold"
                                        title="Edit Product"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (!isMohab) {
                                            triggerToast("Access Denied: Just Mohab can delete products", "error");
                                            return;
                                          }
                                          setProducts(products.filter(item => item.id !== p.id));
                                          triggerToast(`Deleted ${p.name} successfully`, 'success');
                                        }}
                                        className="p-1.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-400 border border-rose-500/20 rounded transition-all cursor-pointer text-[10px] font-bold"
                                        title="Delete Product"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  case 'add-product':
                    return (
                      <div className={`p-6 rounded-2xl border shadow-xl space-y-4 max-w-xl mx-auto transition-colors duration-300 ${
                        theme === 'day' 
                          ? 'bg-white border-slate-200 text-slate-800' 
                          : theme === 'cyberpunk'
                            ? 'bg-[#070913]/90 border-pink-500/30 text-[#00f0ff] hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
                            : 'bg-[#151b26] border-slate-850 text-slate-100'
                      }`}>
                        <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                          theme === 'day' ? 'text-indigo-600' : 'text-[#00f0ff]'
                        }`}>
                          ➕ Create New Machinery Listing
                        </h3>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <label className={`block mb-1 font-bold ${theme === 'day' ? 'text-slate-600' : 'text-slate-400'}`}>Product Name</label>
                            <input 
                              type="text" 
                              id="new-prod-name-inline"
                              placeholder="e.g., Heavy-Duty Robotic Arm RX-300"
                              className={`w-full p-2.5 rounded-lg border outline-none transition-all ${
                                theme === 'day'
                                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                                  : theme === 'cyberpunk'
                                    ? 'bg-slate-950 border-pink-500/30 text-[#00f0ff] focus:border-[#00f0ff]'
                                    : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block mb-1 font-bold ${theme === 'day' ? 'text-slate-600' : 'text-slate-400'}`}>Category</label>
                            <select 
                              id="new-prod-cat-inline"
                              className={`w-full p-2.5 rounded-lg border outline-none transition-all ${
                                theme === 'day'
                                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                                  : theme === 'cyberpunk'
                                    ? 'bg-slate-950 border-pink-500/30 text-[#00f0ff] focus:border-[#00f0ff]'
                                    : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500'
                              }`}
                            >
                              <option>CNC & Milling</option>
                              <option>Industrial Robotics</option>
                              <option>Laser Cutters</option>
                              <option>Rotary Compressors</option>
                            </select>
                          </div>
                          <div>
                            <label className={`block mb-1 font-bold ${theme === 'day' ? 'text-slate-600' : 'text-slate-400'}`}>Price ($)</label>
                            <input 
                              type="number" 
                              id="new-prod-price-inline"
                              placeholder="12500"
                              className={`w-full p-2.5 rounded-lg border outline-none transition-all ${
                                theme === 'day'
                                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                                  : theme === 'cyberpunk'
                                    ? 'bg-slate-950 border-pink-500/30 text-[#00f0ff] focus:border-[#00f0ff]'
                                    : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block mb-1 font-bold ${theme === 'day' ? 'text-slate-600' : 'text-slate-400'}`}>Description</label>
                            <textarea 
                              id="new-prod-desc-inline"
                              placeholder="Describe machinery voltage, parameters..."
                              className={`w-full p-2.5 rounded-lg border outline-none transition-all h-20 resize-none ${
                                theme === 'day'
                                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white'
                                  : theme === 'cyberpunk'
                                    ? 'bg-slate-950 border-pink-500/30 text-[#00f0ff] focus:border-[#00f0ff]'
                                    : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500'
                              }`}
                            />
                          </div>

                          {/* Dynamic File Upload Box */}
                          <div>
                            <label className={`block mb-1 font-bold ${theme === 'day' ? 'text-slate-600' : 'text-slate-400'}`}>Product Image (Upload from Browser)</label>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('inline-file-upload-input')?.click()}
                                  className={`px-4 py-2 border rounded-lg cursor-pointer text-xs font-mono transition-all ${
                                    theme === 'day'
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                      : theme === 'cyberpunk'
                                        ? 'bg-slate-900/60 hover:bg-slate-800 text-pink-400 border-pink-500/20'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                  }`}
                                >
                                  Choose Image file
                                </button>
                                <input 
                                  type="file" 
                                  id="inline-file-upload-input" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files[0]) {
                                      const file = files[0];
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          setInlineUploadedImage(event.target.result as string);
                                          triggerToast("Product image loaded successfully!", "success");
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                {inlineUploadedImage && (
                                  <button
                                    type="button"
                                    onClick={() => setInlineUploadedImage(null)}
                                    className="text-xs text-rose-500 hover:underline font-bold"
                                  >
                                    Remove image
                                  </button>
                                )}
                              </div>
                              {inlineUploadedImage ? (
                                <div className={`w-24 h-24 rounded-lg overflow-hidden border p-1 ${
                                  theme === 'day' ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'
                                }`}>
                                  <img 
                                    src={inlineUploadedImage} 
                                    alt="Inline uploaded preview" 
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              ) : (
                                <div className={`p-3 border border-dashed rounded-lg italic text-[11px] ${
                                  theme === 'day' 
                                    ? 'bg-slate-50 border-slate-200 text-slate-400' 
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                }`}>
                                  No product image uploaded yet. Uses default placeholder if empty.
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (!isMohab) {
                                triggerToast("Access Denied: Only primary admin (Mohab) can host new products.", "error");
                                return;
                              }
                              const nameVal = (document.getElementById('new-prod-name-inline') as HTMLInputElement)?.value;
                              const catVal = (document.getElementById('new-prod-cat-inline') as HTMLSelectElement)?.value;
                              const priceVal = (document.getElementById('new-prod-price-inline') as HTMLInputElement)?.value;
                              const descVal = (document.getElementById('new-prod-desc-inline') as HTMLTextAreaElement)?.value;
                              
                              if (!nameVal || !priceVal) {
                                triggerToast("Name and Price are required", "error");
                                return;
                              }

                              const newProd: Product = {
                                id: `prod-${Date.now()}`,
                                name: nameVal,
                                shortDescription: descVal ? descVal.substring(0, 50) : 'Industrial machinery spec',
                                description: descVal || 'No description provided.',
                                price: parseFloat(priceVal),
                                category: catVal,
                                sizes: ['Standard', '380V Industrial', '440V Heavy Duty'],
                                colors: [{ name: 'Silver Steel', value: '#94a3b8' }, { name: 'Carbon Black', value: '#1e293b' }],
                                image: inlineUploadedImage || 'tshirt'
                              };

                              setProducts([newProd, ...products]);
                              triggerToast(`Successfully hosted ${nameVal}!`, "success");
                              setInlineUploadedImage(null);
                              setAdminSubView('products');
                            }}
                            className={`w-full py-3 font-bold rounded-lg uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                              theme === 'day'
                                ? 'bg-indigo-600 hover:bg-indigo-550 shadow-md text-white'
                                : theme === 'cyberpunk'
                                  ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-[#00f0ff] hover:brightness-115 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg text-white'
                            }`}
                          >
                            Add to Catalog
                          </button>
                        </div>
                      </div>
                    );

                  case 'add-category':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-sm mx-auto">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                          📁 Create Custom Category
                        </h3>
                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">Category Code / Label</label>
                            <input 
                              type="text" 
                              id="new-cat-label-inline"
                              placeholder="e.g., Plastic Injection Molding"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const catVal = (document.getElementById('new-cat-label-inline') as HTMLInputElement)?.value;
                              if (!catVal) {
                                triggerToast("Please enter a category name.", "error");
                                return;
                              }
                              CATEGORIES.push(catVal);
                              triggerToast(`Category "${catVal}" added to memory.`, "success");
                              setAdminSubView('overview');
                            }}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg uppercase tracking-wider text-white"
                          >
                            Save Category
                          </button>
                        </div>
                      </div>
                    );

                  case 'users':
                    return (
                      <AdminUsers 
                        users={users} 
                        onDeleteUsers={(ids) => {
                          if (!isMohab) {
                            triggerToast("Access Denied: Just Mohab can delete users", "error");
                            return;
                          }
                          setUsers(users.filter(u => !ids.includes(u.id)));
                          triggerToast("Deleted selected user(s) successfully", "success");
                        }} 
                        onAddUser={(newUser) => setUsers([newUser, ...users])}
                        onToast={triggerToast} 
                      />
                    );

                  case 'add-user':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-sm mx-auto">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                          👤 Onboard Operator
                        </h3>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">Operator Email</label>
                            <input 
                              type="email" 
                              id="new-op-email"
                              placeholder="operator@sdazum.com"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Assigned Department</label>
                            <select id="new-op-role" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white">
                              <option value="admin">Administrator</option>
                              <option value="user">Standard User</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const email = (document.getElementById('new-op-email') as HTMLInputElement)?.value;
                              const role = (document.getElementById('new-op-role') as HTMLSelectElement)?.value as 'admin' | 'user';
                              
                              if (!email) {
                                triggerToast("Email is required", "error");
                                return;
                              }

                              const newUser: UserType = {
                                id: `user-${Date.now()}`,
                                username: email.split('@')[0],
                                email,
                                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
                                status: 'active',
                                role,
                                joinedDate: new Date().toLocaleDateString(),
                                walletBalance: 0
                              };

                              setUsers([newUser, ...users]);
                              triggerToast(`Onboarded ${email} successfully as ${role}`, "success");
                              setAdminSubView('users');
                            }}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg uppercase tracking-wider text-white"
                          >
                            Register Operator
                          </button>
                        </div>
                      </div>
                    );

                  case 'transactions':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                          💳 Secure Revenue ledger Logs
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left text-slate-300">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-mono">
                                <th className="p-3">TRANSACTION ID</th>
                                <th className="p-3">GATEWAY</th>
                                <th className="p-3">CARD</th>
                                <th className="p-3 text-right">TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((o, idx) => (
                                <motion.tr 
                                  key={o.id} 
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3), ease: "easeOut" }}
                                  className="border-b border-slate-900 hover:bg-slate-900/40"
                                >
                                  <td className="p-3 font-mono font-bold text-white">{o.id}</td>
                                  <td className="p-3 font-mono text-emerald-400">Merchant Sandbox</td>
                                  <td className="p-3 font-mono">XXXX-XXXX-XXXX-4242</td>
                                  <td className="p-3 text-right font-mono text-indigo-400 font-bold">${o.total.toFixed(2)}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );

                  case 'add-order':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-sm mx-auto">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                          📦 Dispatch Custom Machinery Order
                        </h3>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">Customer Name</label>
                            <input 
                              type="text" 
                              id="manual-order-name"
                              placeholder="Altayeb Dafalla"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Machinery Selection</label>
                            <select id="manual-order-prod" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white">
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const name = (document.getElementById('manual-order-name') as HTMLInputElement)?.value;
                              const prodId = (document.getElementById('manual-order-prod') as HTMLSelectElement)?.value;
                              const product = products.find(p => p.id === prodId);

                              if (!name || !product) {
                                triggerToast("Name and Product must be selected.", "error");
                                return;
                              }

                              const newOrder: Order = {
                                id: `TXN-${Math.floor(Math.random() * 899999) + 100000}-MANUAL`,
                                date: new Date().toLocaleDateString(),
                                total: product.price,
                                status: 'success',
                                products: [{
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  size: 'Standard',
                                  color: 'Default',
                                  image: product.image
                                }],
                                address: {
                                  name,
                                  email: 'Altayeb@Azumgroup.com',
                                  address: 'Industrial District 2',
                                  city: 'Jinan',
                                  phone: '+86'
                                }
                              };

                              setOrders(prev => {
                                const next = [newOrder, ...prev];
                                if (currentUser && currentUser.email !== 'mohabmohnad9@gmail.com' && currentUser.email !== 'lamadevtest@gmail.com') {
                                  localStorage.setItem(`sdazum_orders_${currentUser.email}`, JSON.stringify(next));
                                }
                                return next;
                              });
                              updateTelemetryAction('purchase', newOrder.total);
                              triggerToast(`Dispatched manual order for ${product.name}!`, "success");
                              setAdminSubView('overview');
                            }}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg uppercase tracking-wider text-white"
                          >
                            Confirm Dispatch
                          </button>
                        </div>
                      </div>
                    );

                  default:
                    return <AdminOverview products={products} orders={orders} telemetry={telemetry} theme={theme} />;
                }
              })()}
            </div>

            {/* PRODUCT EDITING DIALOG BOX */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 font-mono text-xs text-slate-200 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-[#00f0ff]">
                      <Upload className="w-5 h-5 animate-pulse" />
                      <h3 className="font-bold uppercase tracking-wider">Edit Machine / Product</h3>
                    </div>
                    <button 
                      onClick={() => setEditingProduct(null)}
                      className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Multilingual inputs group */}
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      
                      {/* English Product Profile */}
                      <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                        <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border-b border-slate-900 pb-1">English Product Profile (EN)</p>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Product Name (EN)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="E.g. Precision CNC Milling Machine"
                            value={editingProduct.name_en || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Short Tagline (EN)</label>
                          <input 
                            type="text" 
                            placeholder="E.g. High efficiency 5-axis servo system."
                            value={editingProduct.short_en || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, short_en: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Full Description (EN)</label>
                          <textarea 
                            rows={2}
                            placeholder="E.g. Designed for aerospace engineering..."
                            value={editingProduct.desc_en || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, desc_en: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans resize-none"
                          />
                        </div>
                      </div>

                      {/* Chinese Product Profile */}
                      <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                        <p className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest border-b border-slate-900 pb-1">Chinese Product Profile (ZH)</p>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">产品名称 (ZH)</label>
                          <input 
                            type="text" 
                            placeholder="例如：高精度五轴数控加工中心"
                            value={editingProduct.name_zh || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name_zh: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">一句话简介 (ZH)</label>
                          <input 
                            type="text" 
                            placeholder="例如：高精密航天及模具雕刻首选设备。"
                            value={editingProduct.short_zh || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, short_zh: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">详细产品描述 (ZH)</label>
                          <textarea 
                            rows={2}
                            placeholder="例如：配置全闭环绝对值伺服电机..."
                            value={editingProduct.desc_zh || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, desc_zh: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans resize-none"
                          />
                        </div>
                      </div>

                      {/* Arabic Product Profile */}
                      <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-900 pb-1">Arabic Product Profile (AR)</p>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">اسم المنتج (AR)</label>
                          <input 
                            type="text" 
                            placeholder="مثال: ماكينة الخراطة الرقمية عالية الأداء"
                            value={editingProduct.name_ar || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">وصف قصير متميز (AR)</label>
                          <input 
                            type="text" 
                            placeholder="مثال: نظام محاذاة مؤازر متزامن دقيق."
                            value={editingProduct.short_ar || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, short_ar: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">الوصف الكامل للمنتج (AR)</label>
                          <textarea 
                            rows={2}
                            placeholder="مثال: مصممة خصيصاً للتصنيع الصناعي الدقيق..."
                            value={editingProduct.desc_ar || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, desc_ar: e.target.value })}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Category</label>
                      <select 
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                      >
                        <option>CNC & Milling</option>
                        <option>Industrial Robotics</option>
                        <option>Laser Cutters</option>
                        <option>Heavy Presses</option>
                        <option>Laser & Cutting</option>
                        <option>Power & Compressors</option>
                        <option>Conveyors & Logistics</option>
                        <option>Molding & Casting</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 block mb-1 font-mono text-[11px]">Product Image</label>
                      <div className="flex items-center gap-2">
                        <label 
                          htmlFor="edit-file-upload-input"
                          className="px-4 py-2.5 bg-[#ff2e93]/10 hover:bg-[#ff2e93]/20 border border-[#ff2e93]/30 text-[#ff2e93] hover:text-white rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File</span>
                        </label>
                        <input 
                          type="file" 
                          id="edit-file-upload-input" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files[0]) {
                              const file = files[0];
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result && editingProduct) {
                                  setEditingProduct({
                                    ...editingProduct,
                                    image: event.target.result as string
                                  });
                                  triggerToast("Product image uploaded successfully!", "success");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {editingProduct.image && (
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: 'tshirt' })}
                            className="text-xs text-rose-400 hover:underline cursor-pointer"
                          >
                            Reset to default
                          </button>
                        )}
                      </div>

                      {/* Upload preview */}
                      {editingProduct.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(editingProduct.image) ? (
                        <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-1 relative">
                          <img 
                            src={editingProduct.image} 
                            alt="Uploaded preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-lg text-slate-500 italic text-[11px] mt-2">
                          No customized image uploaded yet. Uses default fallback SVG.
                        </div>
                      )}

                      {/* Manual URL entry */}
                      <div className="pt-1.5">
                        <span className="text-[10px] text-slate-500 block mb-1">Or paste Image URL manually:</span>
                        <input 
                          type="text" 
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-[10px] outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!isMohab) {
                          triggerToast("Access Denied: Just Mohab can edit products", "error");
                          return;
                        }
                        const finalEdited = {
                          ...editingProduct,
                          name: editingProduct.name_en || editingProduct.name_zh || editingProduct.name_ar || editingProduct.name,
                          shortDescription: editingProduct.short_en || editingProduct.shortDescription,
                          description: editingProduct.desc_en || editingProduct.description
                        };
                        const updated = products.map((item) => item.id === editingProduct.id ? finalEdited : item);
                        setProducts(updated);
                        localStorage.setItem('cyberport_products', JSON.stringify(updated));
                        setEditingProduct(null);
                        triggerToast(`Updated ${finalEdited.name} successfully`, 'success');
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg uppercase tracking-wider cursor-pointer font-sans"
                    >
                      Save Product Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            </motion.div>
          </AdminGuard>
        )}

        {/* 8. DEDICATED FULL-PAGE AI ASSISTANT HUB */}
        {view === 'ai' && (
          <motion.div 
            id="dedicated-ai-hub" 
            className="max-w-7xl mx-auto py-6 px-4 font-sans text-slate-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Header: JARVIS COGNITIVE MATRIX System Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-teal-900 pb-4 mb-6">
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="font-mono text-[10px] text-teal-400 font-bold uppercase tracking-widest">Gemini 3.5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="font-mono text-[10px] text-teal-400 font-bold uppercase tracking-widest">Mansion Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="font-mono text-[10px] text-teal-400 font-bold uppercase tracking-widest">Audio Core</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-black text-teal-400 tracking-[0.4em] font-mono uppercase pl-[0.4em]">
                J A R V I S
              </h1>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-teal-400/70">
                  <span className="uppercase tracking-widest">Cognitive Matrix</span>
                  <button onClick={() => setTheme(theme === 'day' ? 'night' : 'day')} className="p-1 hover:text-white transition-colors cursor-pointer" title="Adjust System Brightness">
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => triggerToast("All core sub-protocols active. Status: STABLE.", "success")} 
                  className="px-3 py-1 border border-teal-500/40 hover:border-teal-400 text-teal-400 hover:text-white font-mono text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Help Protocols
                </button>
                <button onClick={() => setView('store')} className="p-1 hover:text-rose-400 transition-colors cursor-pointer" title="Disconnect Platform">
                  <Power className="w-4 h-4 text-teal-500 hover:text-rose-500" />
                </button>
              </div>
            </div>

            {/* Core 3-Column Sci-Fi Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: COMMS (Left Column) */}
              <div className="bg-slate-950/90 border border-teal-900/60 rounded-3xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(20,184,166,0.05)] relative overflow-hidden h-[620px]">
                {/* Micro sci-fi grid overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-teal-500/2 to-transparent pointer-events-none cyber-grid opacity-15" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Comm Header */}
                  <div className="flex items-center justify-between border-b border-teal-900/40 pb-2 mb-4">
                    <span className="font-mono text-xs font-black text-teal-400 tracking-wider flex items-center gap-1.5 uppercase">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
                      <span>_ COMMS</span>
                    </span>
                    <span className="font-mono text-[8px] text-teal-500/60 uppercase">SYS_STREAM_LNK</span>
                  </div>

                  {/* Messages Feed */}
                  <div ref={jarvisChatFeedRef} className="flex-1 h-[485px] max-h-[485px] overflow-y-auto space-y-4 mb-4 pr-1 cyber-scroll">
                    {aiMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
                        <p className="text-teal-500/60 font-mono text-xs max-w-xs leading-relaxed uppercase tracking-wider">
                          No conversation yet. Wake JARVIS and start talking.
                        </p>
                        <button
                          onClick={() => {
                            const welcomeMsg = "Greetings, Sir. JARVIS is fully operational, cognitive matrix synced. All systems are performing at peak safety thresholds.";
                            setAiMessages([{ sender: 'ai', text: welcomeMsg, date: new Date().toLocaleTimeString() }]);
                            speakAiText(welcomeMsg);
                          }}
                          className="px-4 py-2 bg-teal-950/50 border border-teal-500/40 hover:bg-teal-500 hover:text-black hover:scale-105 rounded-xl font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Initialize Connection
                        </button>
                      </div>
                    ) : (
                      aiMessages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          {msg.sender === 'user' ? (
                            <div className="max-w-[85%] bg-teal-950/40 border border-teal-500/40 rounded-2xl rounded-tr-none p-3 shadow-md">
                              <span className="text-[8px] font-mono font-bold text-teal-400 block mb-1 uppercase">
                                {currentUser?.name || currentUser?.email?.split('@')[0] || "Operator"}
                              </span>
                              <p className="text-teal-200 text-xs font-mono break-all">{msg.text}</p>
                              <span className="text-[8px] font-mono text-teal-600 block mt-1 text-right">{msg.date}</span>
                            </div>
                          ) : (
                            <div className="max-w-[85%] bg-slate-900/90 border border-teal-900/60 rounded-2xl rounded-tl-none p-3 shadow-md">
                              <span className="text-[8px] font-mono font-bold text-teal-400 block mb-1 uppercase flex items-center gap-1">
                                <img src={jarvisHelmet} className="w-3.5 h-3.5 rounded-full border border-teal-400/30 object-cover" referrerPolicy="no-referrer" />
                                <span>JARVIS Core</span>
                              </span>
                              <p className="text-slate-200 text-xs font-mono leading-relaxed">{msg.text}</p>
                              <span className="text-[8px] font-mono text-teal-600 block mt-1 text-right">{msg.date}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Comm footer status tickers */}
                <div className="relative z-10 border-t border-teal-900/40 pt-2 flex items-center justify-between font-mono text-[8px] text-teal-500/60 uppercase">
                  <span>RX_BUFFER: SECURE</span>
                  <span>LNK_STATUS: ENCRYPTED</span>
                </div>
              </div>

              {/* Column 2: JARVIS REACTOR CORE & TELEMETRY CONTROLS (Center Column) */}
              <div className="bg-slate-950/90 border border-teal-900/60 rounded-3xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(20,184,166,0.05)] relative overflow-hidden h-[620px]">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-teal-500/2 to-transparent pointer-events-none cyber-grid opacity-15" />
                
                <div className="relative z-10 flex-1 flex flex-col items-center justify-between">
                  {/* Top Header */}
                  <div className="w-full text-center">
                    <span className="font-mono text-[10px] text-teal-400 font-extrabold tracking-widest uppercase">System Core Status</span>
                    <div className="w-full h-px bg-linear-to-r from-transparent via-teal-900/50 to-transparent my-1" />
                  </div>

                  {/* CAMERA STREAM OR ARC REACTOR ROTATOR */}
                  <div className="w-full flex-1 flex flex-col items-center justify-center py-4 relative">
                    {isCameraOn ? (
                      /* Live Camera View with sci-fi overlays */
                      <div className="w-full max-w-[280px] aspect-video bg-black rounded-2xl border border-teal-500/40 overflow-hidden relative shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        
                        {/* Sci-Fi Target Overlay */}
                        <div className="absolute inset-0 border border-teal-500/20 pointer-events-none flex items-center justify-center">
                          {/* Face brackets */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-teal-400"></div>
                          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-teal-400"></div>
                          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-teal-400"></div>
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-teal-400"></div>
                          
                          {/* Concentric targets */}
                          <div className="w-20 h-20 rounded-full border border-teal-500/30 border-dashed animate-spin"></div>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse absolute"></div>
                          
                          {/* Scan-line */}
                          <div className="absolute inset-x-0 h-0.5 bg-teal-400/40 animate-bounce top-0"></div>
                          
                          {/* Live Diagnostic Labels */}
                          <span className="absolute bottom-2 left-3 font-mono text-[7px] text-teal-400 uppercase tracking-widest">LIVE SCAN ENGAGED // 60 FPS</span>
                          <span className="absolute top-2 right-3 font-mono text-[7px] text-red-500 animate-pulse uppercase font-black">● REC</span>
                        </div>
                      </div>
                    ) : (
                      /* Arc Reactor Widget with Spinning concentric rings */
                      <div className="relative w-56 h-56 flex items-center justify-center bg-black/40 rounded-full border border-teal-950">
                        {/* Concentric spinning rings */}
                        <div className="absolute w-48 h-48 rounded-full border border-teal-500/10 border-dashed animate-[spin_12s_linear_infinite]" />
                        <div className="absolute w-40 h-40 rounded-full border border-teal-500/20 border-dashed animate-[spin_8s_linear_infinite_reverse]" />
                        <div className="absolute w-32 h-32 rounded-full border border-teal-500/30 animate-[spin_4s_linear_infinite]" />
                        <div className="absolute w-24 h-24 rounded-full border-2 border-teal-500/50 border-dotted animate-pulse" />
                        
                        {/* Center Core */}
                        <div className="w-10 h-10 rounded-full bg-teal-950 border border-teal-400/80 shadow-[0_0_20px_rgba(20,184,166,0.8)] flex items-center justify-center relative">
                          <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping absolute"></div>
                          <div className="w-3 h-3 rounded-full bg-teal-300"></div>
                        </div>

                        {/* Ring markers */}
                        <div className="absolute top-2 font-mono text-[8px] text-teal-500/50">00°</div>
                        <div className="absolute bottom-2 font-mono text-[8px] text-teal-500/50">180°</div>
                        <div className="absolute right-2 font-mono text-[8px] text-teal-500/50">90°</div>
                        <div className="absolute left-2 font-mono text-[8px] text-teal-500/50">270°</div>
                      </div>
                    )}
                  </div>

                  {/* Core Telemetry parameters */}
                  <div className="text-center space-y-1 mb-4">
                    <p className="font-mono text-[9px] text-teal-500/70 uppercase tracking-wider">
                      UPLINK LIVE  /  PI READY  /  RUNS 03  /  SESSION 00:16
                    </p>
                    <p className="font-mono text-xs font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                      SYSTEM MATRIX ACTIVE
                    </p>
                  </div>

                  {/* Interactive Button row */}
                  <div className="flex items-center gap-3.5 mb-6">
                    {/* Voice Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsListening(!isListening);
                        toggleListening();
                      }}
                      className={`hidden w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isListening
                          ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                          : 'bg-teal-950/20 border-teal-500/40 text-teal-400 hover:bg-teal-500 hover:text-black hover:border-teal-400'
                      }`}
                      title={isListening ? "Mute Microphone Input" : "Engage Voice Protocol"}
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    {/* AI Readout Speaker Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAiVoiceEnabled(!isAiVoiceEnabled);
                        triggerToast(
                          !isAiVoiceEnabled ? "Voice Output Active" : "Voice Output Silenced",
                          "success"
                        );
                      }}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isAiVoiceEnabled
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-teal-400 hover:border-teal-900'
                      }`}
                      title={isAiVoiceEnabled ? "Silence voice output" : "Enable voice readouts"}
                    >
                      {isAiVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    {/* Live Camera Scanner Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCameraOn(!isCameraOn);
                        triggerToast(
                          !isCameraOn ? "Camera scanner initialized" : "Camera scanner offline",
                          "success"
                        );
                      }}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isCameraOn
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-900'
                      }`}
                      title={isCameraOn ? "Shut Down Camera" : "Open Camera Scanner"}
                    >
                      <Camera className="w-5 h-5" />
                    </button>

                    {/* Quick Reboot */}
                    <button
                      type="button"
                      onClick={() => {
                        setAiMessages([]);
                        triggerToast("Cognitive stream cleared and rebooted.", "success");
                      }}
                      className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900 text-slate-500 hover:text-teal-400 hover:border-teal-900 flex items-center justify-center transition-all cursor-pointer"
                      title="Clear session messages"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Command Terminal Input */}
                  <form onSubmit={handleAiQuery} className="w-full relative">
                    <div className="relative w-full flex items-center">
                      <span className="absolute left-4 font-mono text-xs text-teal-500/80 font-bold">$</span>
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Initiate terminal command protocol..."
                        className="w-full bg-slate-950 border border-teal-900/60 focus:border-teal-400 focus:ring-1 focus:ring-teal-500/30 text-teal-300 rounded-2xl pl-8 pr-16 outline-none py-3.5 text-xs font-mono"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 px-3 py-1.5 bg-teal-950 border border-teal-500/50 text-teal-400 hover:bg-teal-500 hover:text-black font-mono text-[10px] font-extrabold rounded-xl transition-all cursor-pointer uppercase"
                      >
                        Exec
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Column 3: WORK STREAM (Right Column) */}
              <div className="bg-slate-950/90 border border-teal-900/60 rounded-3xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(20,184,166,0.05)] relative overflow-hidden h-[620px]">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-teal-500/2 to-transparent pointer-events-none cyber-grid opacity-15" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* WORK STREAM HEADER WITH SUBTABS */}
                  <div className="border-b border-teal-900/40 pb-2 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black text-teal-400 tracking-wider uppercase">_ WORK STREAM</span>
                      <span className="font-mono text-[8px] text-teal-500/60 uppercase">NODE_PRIORITY_H</span>
                    </div>

                    {/* Subtabs horizontal bar */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {['TASKS', 'SCHEDULE', 'NETLINK', 'DESKTOP', '3D FAB', 'MANSION'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setJarvisTab(tab as any)}
                          className={`px-2.5 py-1 rounded font-mono text-[8px] font-black tracking-wider transition-all cursor-pointer uppercase shrink-0 ${
                            jarvisTab === tab
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUBTAB CONTENTS */}
                  <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                    
                    {/* TASKS SUBTAB */}
                    {jarvisTab === 'TASKS' && (
                      <div className="space-y-4">
                        {/* Task Telemetry Overview */}
                        <div className="bg-slate-900/50 border border-teal-900/30 rounded-2xl p-4 flex items-center justify-between">
                          <div className="space-y-2 font-mono text-[9px]">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Task Ratio Telemetry</span>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                              <span>Active Tasks: <strong className="text-teal-300">{jarvisTasks.filter(t => !t.completed).length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Completed: <strong className="text-emerald-400">{jarvisTasks.filter(t => t.completed).length}</strong></span>
                            </div>
                            <div className="text-slate-500">
                              TOTAL POOL FILE RECORDS: 0{jarvisTasks.length}
                            </div>
                          </div>

                          {/* Dynamic SVG Circular Ring */}
                          <div className="relative w-16 h-16 flex items-center justify-center font-mono">
                            {(() => {
                              const total = jarvisTasks.length;
                              const completed = jarvisTasks.filter(t => t.completed).length;
                              const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;
                              const strokeDasharray = 2 * Math.PI * 22; // r=22
                              const strokeDashoffset = strokeDasharray - (ratio / 100) * strokeDasharray;
                              return (
                                <>
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="32" cy="32" r="22" stroke="#115e59" strokeWidth="3.5" fill="transparent" />
                                    <circle cx="32" cy="32" r="22" stroke="#14b8a6" strokeWidth="3.5" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500" />
                                  </svg>
                                  <span className="absolute text-[9px] text-teal-400 font-bold">{ratio}%<br /><span className="text-[6px] text-teal-600 block text-center uppercase">Done</span></span>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Task adder form inputs */}
                        <div className="bg-slate-900/30 border border-teal-900/20 rounded-2xl p-3 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTaskInput}
                              onChange={(e) => setNewTaskInput(e.target.value)}
                              placeholder="Add task manually..."
                              className="flex-1 bg-black border border-teal-950 focus:border-teal-600 rounded-xl px-3 py-1.5 text-[10px] font-mono text-teal-300 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newTaskInput.trim()) return;
                                const newTask = {
                                  id: String(Date.now()),
                                  text: newTaskInput.trim(),
                                  priority: newTaskPriority,
                                  completed: false
                                };
                                setJarvisTasks(prev => [...prev, newTask]);
                                setNewTaskInput("");
                                triggerToast("New Jarvis operational task queued.", "success");
                              }}
                              className="p-1.5 bg-teal-950 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-black rounded-lg transition-all cursor-pointer font-bold text-xs"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between font-mono text-[8px]">
                            <span className="text-slate-500">TASK PRIORITY:</span>
                            <div className="flex gap-1.5">
                              {(['HIGH', 'MEDIUM', 'LOW'] as const).map(p => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setNewTaskPriority(p)}
                                  className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                    newTaskPriority === p
                                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                                      : 'border-transparent text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dynamic checklist */}
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {jarvisTasks.map(t => (
                            <div key={t.id} className="flex items-center justify-between bg-slate-900/40 border border-teal-950 rounded-xl p-2.5 hover:border-teal-900/60 transition-colors">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={t.completed}
                                  onChange={() => {
                                    setJarvisTasks(prev => prev.map(item => item.id === t.id ? { ...item, completed: !item.completed } : item));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-teal-500 text-teal-600 focus:ring-teal-500 bg-black cursor-pointer"
                                />
                                <span className={`text-[10px] font-mono block truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                  {t.text}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[7px] font-mono px-1 py-0.5 rounded font-black ${
                                  t.priority === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-500/20' :
                                  t.priority === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                                  'bg-teal-950 text-teal-400 border border-teal-500/20'
                                }`}>
                                  {t.priority}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setJarvisTasks(prev => prev.filter(item => item.id !== t.id));
                                  }}
                                  className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Clear Button */}
                        {jarvisTasks.some(t => t.completed) && (
                          <button
                            type="button"
                            onClick={() => {
                              setJarvisTasks(prev => prev.filter(t => !t.completed));
                              triggerToast("Completed diagnostic items cleared.", "success");
                            }}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-[9px] uppercase tracking-wider rounded-xl border border-teal-950/40 hover:border-teal-900 transition-all cursor-pointer"
                          >
                            Clear Completed Items
                          </button>
                        )}
                      </div>
                    )}

                    {/* SCHEDULE SUBTAB */}
                    {jarvisTab === 'SCHEDULE' && (
                      <div className="space-y-3 font-mono text-[9px] text-teal-400/80">
                        <div className="p-3 bg-slate-900/40 border border-teal-950 rounded-xl space-y-1">
                          <span className="text-teal-500 text-[10px] font-bold block uppercase">08:00 AM // SYSTEM CALIBRATION</span>
                          <p className="text-slate-400 text-[8px]">Recalibrate heavy hydraulic press cylinders and laser feedback monitors.</p>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-teal-950 rounded-xl space-y-1">
                          <span className="text-amber-500 text-[10px] font-bold block uppercase">12:30 PM // SATELLITE HANDOVER</span>
                          <p className="text-slate-400 text-[8px]">Seamless switch to orbital link satellite G-12 for encrypted ground diagnostics.</p>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-teal-950 rounded-xl space-y-1">
                          <span className="text-teal-500 text-[10px] font-bold block uppercase">04:00 PM // THERMAL SWEEP</span>
                          <p className="text-slate-400 text-[8px]">Run localized coolant flush on active server mainframe racks in sector 4.</p>
                        </div>
                      </div>
                    )}

                    {/* NETLINK SUBTAB */}
                    {jarvisTab === 'NETLINK' && (
                      <div className="space-y-4 font-mono text-[9px]">
                        <div className="space-y-1.5 p-3 bg-slate-900/40 border border-teal-950 rounded-xl">
                          <div className="flex justify-between text-slate-400"><span>Downlink:</span><span className="text-teal-400 font-bold">STABLE (98.4%)</span></div>
                          <div className="flex justify-between text-slate-400"><span>IP Routing:</span><span className="text-slate-300">10.12.98.204</span></div>
                          <div className="flex justify-between text-slate-400"><span>Ping delay:</span><span className="text-emerald-400">4.1ms</span></div>
                          <div className="flex justify-between text-slate-400"><span>Encryption:</span><span className="text-teal-400">AES-256 GCM</span></div>
                        </div>

                        {/* Audio/Net signal wave simulation */}
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[8px] uppercase">Active Bandwidth Telemetry:</span>
                          <div className="flex items-end gap-1.5 h-12 bg-black/60 border border-teal-950 rounded-xl p-2.5 overflow-hidden justify-center">
                            {[40, 70, 20, 85, 55, 90, 45, 10, 60, 30, 75, 40, 80, 50, 95, 30].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className="w-1.5 bg-teal-500 rounded-sm animate-pulse"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DESKTOP SUBTAB */}
                    {jarvisTab === 'DESKTOP' && (
                      <div className="space-y-3 font-mono text-[9px]">
                        <div className="bg-slate-900/40 border border-teal-950 p-3 rounded-xl space-y-1.5">
                          <span className="text-teal-500 text-[10px] font-bold block">SYS_PARAMETERS</span>
                          <div className="flex justify-between text-slate-400"><span>CPU Speed:</span><span>4.90 GHz</span></div>
                          <div className="flex justify-between text-slate-400"><span>Kernel ID:</span><span>MansionOS-v9.42</span></div>
                          <div className="flex justify-between text-slate-400"><span>Security Sandbox:</span><span className="text-emerald-400">ENGAGED</span></div>
                        </div>
                        <div className="bg-slate-900/40 border border-teal-950 p-3 rounded-xl space-y-1">
                          <span className="text-teal-500 text-[10px] font-bold block uppercase">Diagnostic Ticker Log</span>
                          <div className="bg-black/80 rounded p-2 h-20 overflow-y-auto text-teal-500/80 text-[7px] leading-relaxed space-y-1">
                            {microservicesLogs.slice(0, 8).map((log, i) => (
                              <p key={i}>{log}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3D FAB SUBTAB */}
                    {jarvisTab === '3D FAB' && (
                      <div className="space-y-4 text-center py-4 font-mono">
                        <span className="text-teal-500 text-[9px] uppercase tracking-wider block">HOLOGRAPHIC ROTATING MODEL</span>
                        
                        {/* Spinning Wireframe CSS Cuboid / Arc Reactor simulation */}
                        <div className="w-24 h-24 mx-auto relative flex items-center justify-center animate-[spin_5s_linear_infinite]">
                          <div className="absolute inset-0 border border-teal-500/40 rounded-sm transform rotate-45"></div>
                          <div className="absolute inset-2 border border-teal-400/50 rounded-full transform rotate-12"></div>
                          <div className="absolute inset-4 border border-teal-300/60 rounded-sm transform rotate-60"></div>
                          <div className="w-4 h-4 rounded-full bg-teal-400 animate-ping"></div>
                        </div>

                        <div className="space-y-1 text-center">
                          <p className="text-[10px] font-black text-teal-400">MARK_85_CORE.OBJ</p>
                          <p className="text-[8px] text-slate-500 uppercase">3D Fabrication ready // Layer height: 0.1mm</p>
                        </div>
                      </div>
                    )}

                    {/* MANSION SUBTAB */}
                    {jarvisTab === 'MANSION' && (
                      <div className="space-y-3 font-mono text-[9px] text-teal-400/80">
                        <div className="p-3 bg-slate-900/40 border border-teal-950 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-teal-400 uppercase">
                            <span>Mansion Node Security</span>
                            <span className="text-emerald-400 font-extrabold animate-pulse">LIVE SECURE</span>
                          </div>
                          <div className="flex justify-between text-slate-500"><span>Malibu Sector 4:</span><span>Grid Intact</span></div>
                          <div className="flex justify-between text-slate-500"><span>Stark Tower Dome:</span><span>Shield at 100%</span></div>
                          <div className="flex justify-between text-slate-500"><span>Sub-level Laboratories:</span><span>HVAC Normal (21°C)</span></div>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-teal-950 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold block uppercase text-teal-500">Node Coordinates</span>
                          <p className="text-[8px] text-slate-400">Lat: 34.0219° N, Lon: 118.4814° W (Malibu, CA)</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Footer metrics bar */}
                <div className="relative z-10 border-t border-teal-900/40 pt-2 flex items-center justify-between font-mono text-[9px] text-teal-500/60 uppercase">
                  <span>CPU TEMP: 34°C</span>
                  <span>MEM LOAD: 24.2GB</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* 9. INTERACTIVE SUPPORT CHAT HUB */}
        {view === 'chat' && (
          <motion.div 
            id="dedicated-chat-hub" 
            className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!currentUser ? (
              <div className="text-center py-24 bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-xl space-y-6 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono text-slate-200 uppercase tracking-tight">Access Denied</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Please log in or sign up to access the Operator Lounge and chat with other mechanical engineers, industrial operators, and logistics support specialists.
                  </p>
                </div>
                <button
                  onClick={() => setView('auth')}
                  className="px-6 py-3 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-black uppercase rounded-xl transition-all font-mono text-xs shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  Authorize Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Left Column: Group Members */}
                <div className="md:col-span-1 space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider">Group Chat Members</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">All operators & AI in one unified group chatroom</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        id: 'lounge',
                        name: 'Group Chat Lounge',
                        title: 'Unified Global Group Chat',
                        avatar: shandongLogoImg,
                        online: true,
                        isAgent: true
                      }
                    ].map((agent) => {
                      const isLounge = agent.id === 'lounge';
                      return (
                        <button
                          key={agent.id}
                          onClick={() => {
                            setActiveAgent('lounge');
                            if (!isLounge) {
                              const cleanName = agent.id === 'elena' ? 'Elena' : agent.id === 'marcus' ? 'Marcus' : agent.id === 'sora' ? 'Sora' : agent.name.split(' ')[0];
                              setChatInputs(prev => ({
                                ...prev,
                                lounge: (prev.lounge || '').includes(`@${cleanName}`)
                                  ? prev.lounge
                                  : (prev.lounge || '').trim()
                                    ? `${prev.lounge.trim()} @${cleanName} `
                                    : `@${cleanName} `
                              }));
                            }
                          }}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                            isLounge 
                              ? 'bg-slate-900 border-[#00f0ff] shadow-lg shadow-[#00f0ff]/10 scale-102 ring-1 ring-[#00f0ff]/20' 
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                          }`}
                        >
                          <div className="relative">
                            <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`font-bold text-xs block truncate ${isLounge ? 'text-[#00f0ff]' : 'text-slate-100'}`}>{agent.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{agent.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Status checklist */}
                  <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-2.5 font-mono text-[9px] text-slate-500">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">System Connection Status</span>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div><span>WebSocket Bridge: Secure</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div><span>Encryption: SSL-TLS-1.3</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div><span>Logistics Queue Latency: 0ms</span></div>
                  </div>
                </div>

                {/* Support Message Board Center/Right Column */}
                <div className="md:col-span-3 space-y-6">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 h-[550px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    
                    {/* Header info bar */}
                    {(() => {
                      const getRecipientDetails = () => {
                        if (activeAgent === 'elena') {
                          return {
                            name: 'Elena (Logistics Coordinator)',
                            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
                          };
                        }
                        if (activeAgent === 'marcus') {
                          return {
                            name: 'Marcus (Store Account Manager)',
                            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                          };
                        }
                        if (activeAgent === 'sora') {
                          return {
                            name: 'Sora (Machinery Spec Expert)',
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                          };
                        }
                        if (activeAgent === 'lounge') {
                          return {
                            name: 'Operators Lounge Chatroom',
                            avatar: shandongLogoImg
                          };
                        }
                        const peer = registeredUsers.find(u => u.email === activeAgent);
                        if (peer) {
                          return {
                            name: peer.name || peer.email.split('@')[0],
                            avatar: peer.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(peer.email)}`
                          };
                        }
                        return {
                          name: `Operator (${activeAgent.split('@')[0]})`,
                          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(activeAgent)}`
                        };
                      };
                      const activeDetails = getRecipientDetails();

                      return (
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
                          <div className="flex items-center gap-3">
                            <img 
                              src={activeDetails.avatar} 
                              alt={activeDetails.name} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                            />
                            <div>
                              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                                {activeDetails.name}
                              </h4>
                              <p className="text-[10px] text-emerald-400 font-mono">Typically replies in real-time</p>
                            </div>
                          </div>
                          
                          <span className="bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono font-bold px-3 py-1 rounded-xl truncate max-w-[150px]">
                            ID: #{activeAgent.split('@')[0].toUpperCase()}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Message Histories */}
                    <div ref={dedicatedChatHubFeedRef} className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
                      {(chatHistories[activeAgent] || []).map((msg, idx) => (
                        <div key={idx} className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.sender === 'user' ? (
                            <div className="flex flex-col items-end w-full space-y-1">
                              {/* Username at the top */}
                              <span className="text-[10px] font-bold text-[#ff4fa8] tracking-wider font-mono mr-10 uppercase">
                                {msg.userName || currentUser?.name || currentUser?.email?.split('@')[0] || "Operator Guest"}
                              </span>
                              
                              {/* Row with Message Bubble and Profile Image */}
                              <div className="flex items-start gap-2.5 justify-end w-full max-w-[85%]">
                                {/* Message Bubble */}
                                <div className="bg-[#3c253c]/95 border border-[#ff2e93]/60 rounded-2xl rounded-tr-none p-2.5 px-4 flex flex-col items-center justify-center text-center gap-1.5 shadow-lg shadow-[#ff2e93]/5 w-full relative group/msg">
                                  {/* Delete Button for own messages only */}
                                  {msg.id && msg.senderEmail && currentUser && msg.senderEmail.toLowerCase() === currentUser.email.toLowerCase() && (
                                    <button
                                      onClick={() => deleteChatMessage(msg.id, msg.senderEmail)}
                                      className="absolute -top-1.5 -left-1.5 p-1 bg-rose-950/95 hover:bg-rose-900 border border-rose-500/50 text-rose-400 hover:text-white rounded-full transition-all cursor-pointer opacity-0 group-hover/msg:opacity-100 shadow-lg z-20"
                                      title="Delete Message"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                  {/* Message text content */}
                                  {!msg.stickerUrl && (
                                    <p className="text-[#ff4fa8] font-extrabold text-[11px] tracking-widest uppercase leading-snug font-sans text-center">
                                      {msg.text}
                                    </p>
                                  )}

                                  {/* Recorded Voice Player */}
                                  {msg.audioUrl && (
                                    <div className="mt-2 w-full">
                                      <CustomAudioPlayer src={msg.audioUrl} />
                                    </div>
                                  )}

                                  {/* Sticker Visual */}
                                  {msg.stickerUrl && (
                                    <div className="mt-1.5 flex flex-col items-center justify-center p-2 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 w-full">
                                      <img 
                                        src={msg.stickerUrl} 
                                        alt={msg.text} 
                                        className="w-16 h-16 object-contain select-none animate-pulse" 
                                      />
                                      <span className="text-[8px] text-slate-500 mt-1 block">{msg.text}</span>
                                    </div>
                                  )}

                                  {/* File Attachment Card */}
                                  {msg.file && (
                                    <div className="mt-2 w-full">
                                      {(msg.file.type || '').startsWith('image/') ? (
                                        <div className="space-y-1.5 flex flex-col items-center">
                                          <img 
                                            src={msg.file.url} 
                                            alt={msg.file.name} 
                                            onClick={() => setPreviewImage(msg.file.url)}
                                            className="rounded-xl max-h-40 max-w-full object-cover border-2 border-slate-800 shadow-md cursor-zoom-in hover:opacity-90 transition-all" 
                                          />
                                          <a 
                                            href={msg.file.url} 
                                            download={msg.file.name}
                                            className="text-[9px] text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                                          >
                                            Download Image ({msg.file.size})
                                          </a>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl w-full text-left">
                                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <span className="block text-[9px] text-slate-100 truncate font-bold">{msg.file.name}</span>
                                            <span className="block text-[8px] text-slate-500 font-medium">{msg.file.size}</span>
                                          </div>
                                          <a 
                                            href={msg.file.url} 
                                            download={msg.file.name}
                                            className="text-[9px] text-pink-400 hover:underline font-extrabold shrink-0"
                                          >
                                            GET
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <span className="text-[#7d8b9e] font-mono text-[9px] tracking-wider font-medium text-center mt-1 block">
                                    {formatMessageTime(msg.date, msg.timestamp)}
                                  </span>
                                </div>

                                {/* Profile Image to the right */}
                                <div className="shrink-0 mt-0.5">
                                  <img 
                                    src={profileImage} 
                                    alt="User Profile" 
                                    className="w-8 h-8 rounded-full object-cover border-2 border-[#ff2e93]/50 shadow-md shadow-[#ff2e93]/10"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-start justify-start w-full max-w-[85%]">
                              <img 
                                src={msg.userAvatar || (
                                  activeAgent === 'elena' 
                                    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
                                    : activeAgent === 'marcus'
                                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                                )} 
                                alt="avatar" 
                                className="w-6 h-6 rounded-lg object-cover mt-0.5 border border-slate-800" 
                              />
                              <div className="max-w-[80%] leading-relaxed bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none p-3 text-xs font-mono">
                                <span className="text-[9px] font-black text-indigo-400 block mb-1">
                                  {msg.userName || (activeAgent === 'elena' ? 'Elena' : activeAgent === 'marcus' ? 'Marcus' : 'Sora')}
                                </span>
                                
                                {/* Message text content */}
                                {!msg.stickerUrl && <p>{msg.text}</p>}

                                {/* Recorded Voice Player */}
                                {msg.audioUrl && (
                                  <div className="mt-2 w-full">
                                    <CustomAudioPlayer src={msg.audioUrl} />
                                  </div>
                                )}

                                {/* Sticker Visual */}
                                {msg.stickerUrl && (
                                  <div className="mt-1.5 flex flex-col items-center justify-center p-2 bg-slate-950/20 rounded-xl border border-dashed border-slate-800">
                                    <img 
                                      src={msg.stickerUrl} 
                                      alt={msg.text} 
                                      className="w-16 h-16 object-contain select-none animate-pulse" 
                                    />
                                    <span className="text-[8px] text-slate-500 mt-1 block">{msg.text}</span>
                                  </div>
                                )}

                                {/* File Attachment Card */}
                                {msg.file && (
                                  <div className="mt-2">
                                    {(msg.file.type || '').startsWith('image/') ? (
                                      <div className="space-y-1.5">
                                        <img 
                                          src={msg.file.url} 
                                          alt={msg.file.name} 
                                          onClick={() => setPreviewImage(msg.file.url)}
                                          className="rounded-xl max-h-40 max-w-full object-cover border border-slate-800 shadow-md cursor-zoom-in hover:opacity-90 transition-all" 
                                        />
                                        <a 
                                          href={msg.file.url} 
                                          download={msg.file.name}
                                          className="text-[9px] text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                                        >
                                          Download Image ({msg.file.size})
                                        </a>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <span className="block text-[9px] text-slate-100 truncate font-bold">{msg.file.name}</span>
                                          <span className="block text-[8px] text-slate-500 font-medium">{msg.file.size}</span>
                                        </div>
                                        <a 
                                          href={msg.file.url} 
                                          download={msg.file.name}
                                          className="text-[9px] text-pink-400 hover:underline font-extrabold shrink-0"
                                        >
                                          GET
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <span className="text-[8px] text-slate-500 mt-1 block text-right">{formatMessageTime(msg.date, msg.timestamp)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {chatIsTyping && (
                        <div className="flex justify-start gap-2 items-center">
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 font-mono rounded-tl-none flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            <span className="text-[10px] text-slate-500 ml-1">someone is typing...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Controls */}
                    <div className="border-t border-slate-800/80 pt-3 relative z-10 flex flex-col gap-2">
                      
                      {/* Sticker Selector Panel */}
                      {stickerPickerOpen && (
                        <div className="absolute bottom-20 left-0 right-0 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Smile className="w-3.5 h-3.5 text-[#00f0ff]" />
                              Industrial Operators Stickers
                            </span>
                            <button type="button" onClick={() => setStickerPickerOpen(false)} className="text-[10px] text-slate-500 hover:text-white">Close</button>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {stickers.map((st) => (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => sendSticker(st.url, st.label)}
                                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-900 border border-transparent hover:border-indigo-500/30 rounded-xl transition-all group"
                                title={st.label}
                              >
                                <img src={st.url} alt={st.label} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] text-slate-500 mt-1 truncate max-w-full text-center">{st.emoji}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attachment Input */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*,application/pdf,text/*,.zip,.rar" 
                        onChange={handleFileAttachment} 
                      />

                      {/* Tool Actions Rail */}
                      <div className="flex flex-wrap items-center gap-1.5 px-1 pb-1">
                        
                        {/* File Attachment Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-2.5 rounded-xl transition-all text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
                          title="Attach files (images, logs, documents)"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="text-[9px] font-bold hidden sm:inline">Attach</span>
                        </button>

                        {/* Sticker Button */}
                        <button
                          type="button"
                          onClick={() => setStickerPickerOpen(!stickerPickerOpen)}
                          className={`bg-slate-900 hover:bg-slate-800/80 border p-2.5 rounded-xl transition-all text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer ${stickerPickerOpen ? 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20' : 'border-slate-800'}`}
                          title="Send Animated Sticker"
                        >
                          <Smile className="w-4 h-4" />
                          <span className="text-[9px] font-bold hidden sm:inline">Stickers</span>
                        </button>

                        {/* Microphone Voice Recorder */}
                        {isRecording ? (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-red-600 hover:bg-red-500 animate-pulse text-white font-black px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/40 text-xs"
                            title="Stop & Submit Audio Message"
                          >
                            <StopCircle className="w-4 h-4 text-white" />
                            <span className="font-mono text-[10px]">{recordingSeconds}s Recording...</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/50 p-2.5 rounded-xl transition-all text-slate-400 hover:text-pink-400 flex items-center gap-1.5 cursor-pointer"
                            title="Record Microphone Audio Message"
                          >
                            <Mic className="w-4 h-4" />
                            <span className="text-[9px] font-bold hidden sm:inline">Mic Record</span>
                          </button>
                        )}

                        {/* AI Indicator is removed per user request */}
                      </div>

                      {/* Main Message Form */}
                      <form onSubmit={(e) => handleSupportMessageSubmit(e, activeAgent)} className="flex gap-2 relative">
                        <input
                          type="text"
                          value={chatInputs[activeAgent] || ''}
                          onChange={(e) => setChatInputs(prev => ({ ...prev, [activeAgent]: e.target.value }))}
                          placeholder={
                            activeAgent === 'lounge' 
                              ? "Send a message to all people & AI in this group lounge..." 
                              : `Message ${activeAgent === 'elena' ? 'Elena' : activeAgent === 'marcus' ? 'Marcus' : activeAgent === 'sora' ? 'Sora' : activeAgent.split('@')[0]}...`
                          }
                          className="flex-1 bg-slate-900 border border-slate-800 focus:border-pink-500 text-slate-200 rounded-xl px-4 outline-none py-3 text-xs"
                        />
                        <button
                          type="submit"
                          className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs shrink-0 hover:shadow-lg hover:shadow-indigo-900/30"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send</span>
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* FLOATING CHATBOT BAR - STORE AI ASSISTANT */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-[73px] h-[73px] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border relative ${
            theme === 'cyberpunk' 
              ? 'bg-black border-[#00f0ff] text-[#00f0ff] glow-cyan' 
              : 'bg-indigo-600 border-indigo-400 text-white'
          }`}
          title="Open AI Store Concierge"
        >
          <img src={jarvisHelmet} className="w-[67px] h-[67px] rounded-full object-cover border-2 border-[#00f0ff]/40 shadow-xl" referrerPolicy="no-referrer" />
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
          </span>
        </button>

        {isAiOpen && (
          <div className={`absolute bottom-16 left-0 w-80 sm:w-96 rounded-3xl border shadow-2xl p-4 flex flex-col justify-between h-96 z-50 font-mono text-xs ${
            theme === 'day' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-pink-500/40 text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <img src={jarvisHelmet} className="w-7 h-7 rounded-md object-cover border border-[#00f0ff]/20 shadow-sm" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-[#00f0ff] uppercase">{t.aiAssistant}</h4>
                  <p className="text-[9px] text-slate-500">Industrial Machine Logistics Advisor</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAiVoiceEnabled(!isAiVoiceEnabled)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isAiVoiceEnabled
                      ? 'border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
                      : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isAiVoiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
                >
                  {isAiVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!currentUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-200">AI Concierge Locked</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Authentication required. Please log in or sign up to consult the AI on factory machine specifications, custom configurations, and automated diagnostics.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setView('auth');
                    setIsAiOpen(false);
                  }}
                  className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-black uppercase rounded-xl transition-all font-mono text-[10px] shadow-[0_0_8px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  Authorize Session
                </button>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div ref={globalLoungeChatFeedRef} className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1 cyber-scroll">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end w-full' : 'items-start'}`}>
                      {msg.sender === 'user' ? (
                        <div className="flex flex-col items-end w-full space-y-1">
                          {/* Username at the top */}
                          <span className="text-[10px] font-bold text-[#ff4fa8] tracking-wider font-mono mr-10 uppercase">
                            {currentUser?.name || currentUser?.email?.split('@')[0] || "Operator Guest"}
                          </span>
                          
                          {/* Row with Message Bubble and Profile Image */}
                          <div className="flex items-start gap-2.5 justify-end w-full max-w-[95%]">
                            {/* Message Bubble */}
                            <div className="bg-[#3c253c]/95 border border-[#ff2e93]/60 rounded-3xl rounded-tr-none p-5 flex flex-col items-center justify-center text-center gap-2.5 max-w-[80%] shadow-lg shadow-[#ff2e93]/5">
                              <p className="text-[#ff4fa8] font-extrabold text-[13px] tracking-widest uppercase leading-relaxed font-sans text-center">{msg.text}</p>
                              <span className="text-[#7d8b9e] font-mono text-[9px] tracking-wider font-medium text-center">{formatMessageTime(msg.date, msg.timestamp)}</span>
                            </div>

                            {/* Profile Image to the right */}
                            <div className="shrink-0 mt-0.5">
                              <img 
                                src={profileImage} 
                                alt="User Profile" 
                                className="w-8 h-8 rounded-full object-cover border-2 border-[#ff2e93]/50 shadow-md shadow-[#ff2e93]/10"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-2.5 rounded-2xl max-w-[85%] leading-relaxed bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none">
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[8px] text-slate-600 mt-0.5">{formatMessageTime(msg.date, msg.timestamp)}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Suggested quick prompt tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 mb-2">
                  {['CNC Milling specs', 'Robotic arm reach', 'Fiber laser power', 'Claim balance'].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setAiInput(prompt);
                      }}
                      className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-400 hover:text-white rounded text-[9px] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Form Input query */}
                <form onSubmit={handleAiQuery} className="flex gap-2 border-t border-slate-800 pt-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      placeholder={t.askAi}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-pink-500 text-slate-200 rounded-xl pl-3 pr-8 outline-none py-2 text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={toggleListening}
                      title="Speak query"
                      className={`hidden absolute right-2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {isListening ? <StopCircle className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="p-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* INSTANT AUTOMATED DELIVERY TERMINAL SYSTEM PANEL (MICROSERVICES SIMULATION) */}
      {isDeliveryLogOpen && deliveryProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-pink-500/40 rounded-3xl p-6 font-mono text-xs text-slate-200 space-y-6 shadow-2xl glow-pink">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-pink-500">
                <Terminal className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold uppercase tracking-wider">{t.instantDelivery}</h3>
              </div>
              <button 
                onClick={() => { setIsDeliveryLogOpen(false); setDeliveryProduct(null); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery Logs terminal outputs */}
            <div className="bg-black/80 p-4 rounded-xl border border-slate-900 h-40 overflow-y-auto text-[11px] text-pink-400 space-y-1.5 cyber-scroll">
              {deliveryLogs.map((log, index) => (
                <p key={index} className="leading-relaxed">
                  <span className="text-[#00f0ff]">&gt;</span> {log}
                </p>
              ))}
            </div>

            {/* LIVE COUNTDOWN & DECRYPTION PROGRESS ENGINE */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-black/40 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="uppercase tracking-wider">CRYPTOGRAPHIC PIPELINE LOGISTICS</span>
                <span className={isGeneratingKey ? "text-amber-400 animate-pulse font-bold" : "text-emerald-400 font-bold"}>
                  {isGeneratingKey ? "● GENERATION ACTIVE" : "✓ COMPLETED"}
                </span>
              </div>

              {isGeneratingKey ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-amber-300 font-bold">ETA: 00:{deliveryCountdown < 10 ? `0${deliveryCountdown}` : deliveryCountdown}s</span>
                    <span className="text-[10px] text-slate-400">{(10 - deliveryCountdown) * 10}% DECRYPTED</span>
                  </div>
                  {/* Progress loading bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-amber-500 via-pink-500 to-[#00f0ff] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.6)]" 
                      style={{ width: `${(10 - deliveryCountdown) * 10}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-emerald-400 font-bold text-xs">
                    <span>✓ ALL KEY BLOCKS SYNCHRONIZED</span>
                    <span>100% COMPLETE</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full w-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Code Display Card with spring animations */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-[#00f0ff]/30 rounded-2xl p-4 text-center space-y-3">
              <p className="text-[10px] uppercase font-bold text-[#00f0ff] tracking-widest">DISPATCHED DIGITAL LICENSE / SERIAL ACCESS KEY</p>
              {isGeneratingKey ? (
                <p className="text-xs font-bold font-mono tracking-wider text-amber-400/80 selection:bg-pink-500 select-all border border-amber-500/20 bg-black/60 py-3 rounded-lg animate-pulse uppercase">
                  🔒 Decrypting secure license block... standby
                </p>
              ) : (
                <p className="text-xl font-bold font-mono tracking-widest text-white selection:bg-pink-500 select-all border border-[#00f0ff]/20 bg-black/60 py-2.5 rounded-lg">
                  {deliveryKey}
                </p>
              )}
              <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Authorized activation key. Guard this credential securely.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                disabled={isGeneratingKey}
                onClick={() => {
                  navigator.clipboard.writeText(deliveryKey);
                  triggerToast("Activation Key copied to your clipboard!", "success");
                }}
                className={`flex-1 py-3 font-bold rounded-xl shadow-lg transition-all cursor-pointer text-center text-xs font-mono uppercase tracking-wider ${
                  isGeneratingKey 
                    ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white glow-pink'
                }`}
              >
                {isGeneratingKey ? "Decrypting..." : "Copy Dispatch Code"}
              </button>
              
              <button
                onClick={() => { setIsDeliveryLogOpen(false); setDeliveryProduct(null); }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer text-xs font-mono uppercase tracking-wider"
              >
                Close Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AFFILIATE HUB & WALLET TOP-UP DIALOG BOX */}
      {isAffiliateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-[#00f0ff]/40 rounded-3xl p-6 font-mono text-xs text-slate-200 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <Coins className="w-5 h-5 animate-spin" />
                <h3 className="font-bold uppercase tracking-wider">{t.affiliate}</h3>
              </div>
              <button 
                onClick={() => setIsAffiliateModalOpen(false)}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet summary statistics */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Affiliate Earnings</p>
                <p className="text-xl font-bold text-[#00f0ff] mt-1">${affiliateEarnings.toFixed(2)}</p>
              </div>
            </div>

            {/* Affiliate System Copy Referrals code */}
            <div className="bg-black/60 p-4 rounded-2xl border border-pink-500/10 space-y-3">
              <h4 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest">{t.referralLink}</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://sdazum.cyberport/invite?ref=${affiliateCode}`}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-[10px] text-slate-300"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-3 bg-pink-500 text-white rounded-xl text-[10px] font-bold hover:bg-pink-600 cursor-pointer"
                >
                  {t.copyLink}
                </button>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Active referrals: {referralsCount} users</span>
                <span className="text-pink-400">Invite Code: {affiliateCode}</span>
              </div>
            </div>

            {/* Rewards button claims */}
            <div className="space-y-3">
              <button
                onClick={handleClaimAffiliateBonus}
                className="w-full py-3 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-mono font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-101"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Free $50.00 Affiliate Bonus</span>
              </button>
              
              <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                *Claim mock affiliate earnings directly to test affiliate conversion tracking on our running sneakers, hoodies and fitness activewear.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE USER PROFILE AVATAR DIALOG BOX */}
      {isProfileEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-pink-500/40 rounded-3xl p-6 font-mono text-xs text-slate-200 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <Upload className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider">{t.changeProfile}</h3>
              </div>
              <button 
                onClick={() => { setIsProfileEditorOpen(false); setNewAvatarInput(''); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Choose from ready-made presets list */}
            <div className="space-y-3">
              <label className="text-slate-400 uppercase tracking-widest text-[9px] block">Select Stylish Preset Avatars</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', // Female Athlete
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', // Male Runner
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', // Cyber Runner 1
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'  // Athlete Leader
                ].map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProfileImage(presetUrl);
                      if (currentUser) {
                        const updatedUser = { ...currentUser, avatar: presetUrl };
                        setCurrentUser(updatedUser);
                        localStorage.setItem('cyberport_user', JSON.stringify(updatedUser));
                        setRegisteredUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: presetUrl } : u));
                        setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, avatar: presetUrl } : u));
                      }
                      setIsProfileEditorOpen(false);
                      triggerToast("Avatar updated successfully to preset!", "success");
                    }}
                    className="w-14 h-14 rounded-xl overflow-hidden border border-slate-800 hover:border-[#00f0ff] cursor-pointer"
                  >
                    <img src={presetUrl} className="w-full h-full object-cover" alt={`preset-${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Drag and Drop or Browse File from Browser */}
            <div className="space-y-3">
              <label className="text-slate-400 uppercase tracking-widest text-[9px] block">Upload Image From Your Browser</label>
              
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProfileImageFile(file);
                }}
                onClick={() => document.getElementById('profile-file-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 scale-102' 
                    : 'border-slate-800 hover:border-pink-500 bg-slate-900/50 hover:bg-slate-900'
                }`}
              >
                <input
                  id="profile-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProfileImageFile(file);
                  }}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-pink-500" />
                <p className="text-[11px] font-bold text-slate-300">Drag & Drop Image here</p>
                <p className="text-[9px] text-slate-500 mt-1">or click to browse your computer</p>
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-2 py-1">
              <span className="h-[1px] bg-slate-900 flex-1"></span>
              <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">or</span>
              <span className="h-[1px] bg-slate-900 flex-1"></span>
            </div>

            {/* Input custom image url from browser */}
            <form onSubmit={handleApplyAvatar} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase tracking-widest text-[9px] block">Paste Custom Image URL from browser</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newAvatarInput}
                  onChange={(e) => setNewAvatarInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-850 rounded-xl outline-none text-xs text-slate-200 focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl glow-pink cursor-pointer"
              >
                Apply Custom Avatar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER MULTI-COLUMN DESIGN (Sleek Cyber Theme) */}
      <footer id="global-footer" className="bg-black border-t border-slate-900 text-slate-500 text-[11px] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-black tracking-tighter text-white uppercase">SDAZUM.</span>
            <p className="text-slate-600 leading-relaxed font-sans">
              High-performance gear engineered for premium comfort and high-friction street-fashion metrics.
            </p>
            <div className="pt-3 border-t border-slate-900/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest font-mono">Developer</span>
              <p className="text-[11px] text-[#00f0ff] font-mono mt-1">
                Developed by <span className="text-white font-bold">Mohab</span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Email: <a href="mailto:mohabmohnad9@gmail.com" className="hover:text-pink-400 hover:underline">mohabmohnad9@gmail.com</a>
              </p>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">Support Services</h5>
            <ul className="space-y-2 font-mono text-[10px]">
              <li><a href="#" className="hover:text-pink-400">Digital Dispatch Node</a></li>
              <li><a href="#" className="hover:text-pink-400">Multi-Channel Help Desk</a></li>
              <li><a href="#" className="hover:text-pink-400">Stripe Payments Gateways</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">Microservices Architecture</h5>
            <ul className="space-y-2 font-mono text-[10px]">
              <li><a href="#" className="hover:text-pink-400">SEO Crawler Optimizer</a></li>
              <li><a href="#" className="hover:text-pink-400">Wallet System ledger</a></li>
              <li><a href="#" className="hover:text-pink-400">Dispatch Queues Daemon</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">Legal Guidelines</h5>
            <ul className="space-y-2 font-mono text-[10px]">
              <li><a href="#" className="hover:text-pink-400">Cryptographic Disclaimers</a></li>
              <li><a href="#" className="hover:text-pink-400">Acceptable Prototype Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 font-mono text-[9px]">
          <div>
            © {new Date().getFullYear()} SDAZUM CYBERPORT DESIGN SUITE. BUILT ON SECURE MICROSERVICES PROTOTYPE INFRASTRUCTURE.
          </div>
          <div className="text-slate-400">
            Developed by <span className="text-white">Mohab</span> (<a href="mailto:mohabmohnad9@gmail.com" className="hover:text-[#00f0ff] underline">mohabmohnad9@gmail.com</a>)
          </div>
        </div>
      </footer>

      {/* SLIDE-OUT DRAWER OVERLAY: ADD PRODUCT (Supports User Custom Addition) */}
      {isAddProductOpen && (
        <div id="add-product-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div id="add-product-panel" className="w-full max-w-lg bg-slate-950 border-l border-pink-500/30 text-white p-6 overflow-y-auto flex flex-col justify-between font-mono text-xs">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-lg tracking-tight uppercase text-pink-500">{t.newProductTitle}</h3>
                <button
                  id="close-drawer-btn"
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form entries for hosting new products */}
              <form id="add-product-form" onSubmit={handleAddProductSubmit} className="space-y-4">
                
                {/* Multilingual Product Information Fields */}
                <div className="space-y-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-900">
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border-b border-slate-900 pb-1">English Product Profile (EN)</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Product Name (EN)</label>
                      <input
                        id="new-prod-name-en"
                        type="text"
                        required
                        placeholder="E.g. Precision CNC Milling Machine"
                        value={newProductForm.name_en}
                        onChange={(e) => setNewProductForm({ ...newProductForm, name_en: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Short Tagline (EN)</label>
                      <input
                        id="new-prod-short-en"
                        type="text"
                        placeholder="E.g. High efficiency 5-axis servo system."
                        value={newProductForm.short_en}
                        onChange={(e) => setNewProductForm({ ...newProductForm, short_en: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Full Description (EN)</label>
                      <textarea
                        id="new-prod-desc-en"
                        rows={2}
                        placeholder="E.g. Designed for aerospace engineering and micron level tool milling..."
                        value={newProductForm.desc_en}
                        onChange={(e) => setNewProductForm({ ...newProductForm, desc_en: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-900">
                  <p className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest border-b border-slate-900 pb-1">Chinese Product Profile (ZH)</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">产品名称 (ZH)</label>
                      <input
                        id="new-prod-name-zh"
                        type="text"
                        placeholder="例如：高精度五轴数控加工中心"
                        value={newProductForm.name_zh}
                        onChange={(e) => setNewProductForm({ ...newProductForm, name_zh: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">一句话简介 (ZH)</label>
                      <input
                        id="new-prod-short-zh"
                        type="text"
                        placeholder="例如：高精密航天及模具雕刻首选设备。"
                        value={newProductForm.short_zh}
                        onChange={(e) => setNewProductForm({ ...newProductForm, short_zh: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">详细产品描述 (ZH)</label>
                      <textarea
                        id="new-prod-desc-zh"
                        rows={2}
                        placeholder="例如：配置全闭环绝对值伺服电机与油冷循环冷却系统，高稳定性运行..."
                        value={newProductForm.desc_zh}
                        onChange={(e) => setNewProductForm({ ...newProductForm, desc_zh: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-900">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-900 pb-1">Arabic Product Profile (AR)</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">اسم المنتج (AR)</label>
                      <input
                        id="new-prod-name-ar"
                        type="text"
                        placeholder="مثال: ماكينة الخراطة الرقمية عالية الأداء"
                        value={newProductForm.name_ar}
                        onChange={(e) => setNewProductForm({ ...newProductForm, name_ar: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">وصف قصير متميز (AR)</label>
                      <input
                        id="new-prod-short-ar"
                        type="text"
                        placeholder="مثال: نظام محاذاة مؤازر متزامن دقيق."
                        value={newProductForm.short_ar}
                        onChange={(e) => setNewProductForm({ ...newProductForm, short_ar: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">الوصف الكامل للمنتج (AR)</label>
                      <textarea
                        id="new-prod-desc-ar"
                        rows={2}
                        placeholder="مثال: مصممة خصيصاً للتصنيع الصناعي الدقيق وعمليات الإنتاج المستمرة..."
                        value={newProductForm.desc_ar}
                        onChange={(e) => setNewProductForm({ ...newProductForm, desc_ar: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">{t.price}</label>
                    <input
                      id="new-prod-price"
                      type="number"
                      required
                      placeholder="89.00"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Category Category</label>
                    <select
                      id="new-prod-category"
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Product Illustration</span>
                  
                  {/* File Upload Box & Dropzone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Option A: Upload File</label>
                      <div 
                        id="image-dropzone"
                        className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all relative overflow-hidden ${
                          isProductDragging 
                            ? 'border-[#00f0ff] bg-[#00f0ff]/10 scale-102' 
                            : 'border-slate-800 hover:border-pink-500/70 bg-slate-900/50'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsProductDragging(true);
                        }}
                        onDragLeave={() => setIsProductDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsProductDragging(false);
                          const files = e.dataTransfer.files;
                          if (files && files[0]) {
                            const file = files[0];
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setNewProductForm({ ...newProductForm, image: evt.target.result as string });
                                triggerToast("Local product image loaded successfully", "success");
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        onClick={() => {
                          const fileInput = document.getElementById('drawer-prod-file-upload');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 text-pink-500 mx-auto" />
                          <p className="text-[10px] font-bold">Drag & Drop Image Here</p>
                          <p className="text-[8px] text-slate-500">or click to browse local files</p>
                        </div>
                        <input 
                          type="file" 
                          id="drawer-prod-file-upload" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setNewProductForm({ ...newProductForm, image: evt.target.result as string });
                                  triggerToast("Local product image loaded successfully", "success");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Option B: Image URL</label>
                      <div className="h-32 flex flex-col justify-between">
                        <textarea
                          id="new-prod-img-url"
                          rows={3}
                          placeholder="Or paste external Unsplash or web URL..."
                          value={newProductForm.image.startsWith('http') ? newProductForm.image : ''}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setNewProductForm({ 
                              ...newProductForm, 
                              image: val || 'tshirt'
                            });
                          }}
                          className="w-full h-20 px-3 py-2 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none resize-none text-[10px] placeholder:text-slate-600"
                        />
                        <p className="text-[8px] text-slate-500 leading-tight">Provide an image file directly or paste an external link to populate the product illustration.</p>
                      </div>
                    </div>
                  </div>
                  
                  {newProductForm.image.startsWith('http') && (
                    <div className="mt-1 p-2 bg-slate-900 border border-slate-850 rounded-xl flex items-center gap-3">
                      <img src={newProductForm.image} className="w-10 h-10 object-cover rounded-lg shrink-0" alt="Preview URL" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] text-slate-400 block truncate font-mono">External URL Active</span>
                        <span className="text-[8px] text-emerald-400 block font-mono">Live render enabled</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewProductForm({ ...newProductForm, image: 'tshirt' })}
                        className="text-[9px] text-pink-500 font-bold hover:underline shrink-0 px-2"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {newProductForm.image.startsWith('data:image/') && (
                    <div className="mt-1 p-2 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                          <img src={newProductForm.image} className="w-full h-full object-cover" alt="Uploaded thumbnail" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] text-slate-400 block font-mono truncate">Uploaded Local Image</span>
                          <span className="text-[8px] text-emerald-400 block font-mono">In-Memory Base64 Data</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewProductForm({ ...newProductForm, image: 'tshirt' })}
                        className="text-[9px] text-pink-500 font-bold hover:underline shrink-0 px-2"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <button
                  id="drawer-submit-btn"
                  type="submit"
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg glow-pink cursor-pointer mt-4"
                >
                  {t.createProduct}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD & INSTALL APP MODAL */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 flex flex-col justify-between font-sans relative ${
            theme === 'cyberpunk'
              ? 'bg-slate-950 border-[#00f0ff]/40 text-white'
              : theme === 'day'
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 animate-pulse">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl tracking-tight uppercase">
                  {language === 'ar' ? 'تحميل وتثبيت سدازوم' : language === 'zh' ? '下载与安装 SDAZUM' : 'Download & Install Sdazum'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {language === 'ar' 
                    ? 'قم بتثبيت التطبيق على جهازك للوصول السريع أو قم بتنزيل ملف الكمبيوتر التنفيذي.' 
                    : language === 'zh'
                      ? '在您的设备上安装应用程序以实现快捷访问，或下载电脑端可执行文件。'
                      : 'Install the app on your home screen for rapid access, or download native PC binary.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: PWA Installation */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  theme === 'day' ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/50 border-slate-800/60'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Option 1</span>
                    <h4 className="font-extrabold text-sm">
                      {language === 'ar' ? 'التطبيق الذكي (PWA)' : language === 'zh' ? '网页应用 (PWA)' : 'Web App (PWA)'}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {language === 'ar'
                        ? 'تثبيت فوري على شاشة هاتفك أو حاسوبك بدون متجر تطبيقات.'
                        : language === 'zh'
                          ? '免商店快速安装到手机主屏幕 or 电脑。'
                          : 'Instant download on phone or desktop browser. Launches in fullscreen.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDownloadModalOpen(false);
                      triggerInstallApp();
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
                  >
                    {language === 'ar' ? 'تثبيت الآن 📱' : language === 'zh' ? '立即安装 📱' : 'Install Now 📱'}
                  </button>
                </div>

                {/* Option 2: Desktop Executable (.exe) */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  theme === 'day' ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/50 border-slate-800/60'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Option 2</span>
                    <h4 className="font-extrabold text-sm">
                      {language === 'ar' ? 'تطبيق الكمبيوتر (.exe)' : language === 'zh' ? '电脑客户端 (.exe)' : 'Desktop App (.exe)'}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {language === 'ar'
                        ? 'قم بتحميل ملف تشغيل الكمبيوتر ويندوز المباشر والمستقل.'
                        : language === 'zh'
                          ? '下载适用于 Windows 电脑桌面的独立双击运行客户端。'
                          : 'Get the portable standalone Windows executable file to run natively.'}
                    </p>
                  </div>
                  <a
                    href="/api/download-app-exe"
                    onClick={() => setIsDownloadModalOpen(false)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md text-center shadow-blue-600/10 transition-colors block"
                  >
                    {language === 'ar' ? 'تحميل التطبيق 💻' : language === 'zh' ? '下载 EXE 💻' : 'Download .exe 💻'}
                  </a>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-150 dark:border-slate-800">
                <p className="text-[10px] text-slate-500">
                  {language === 'ar' 
                    ? 'أو امسح رمز الـ QR بالأسفل في القائمة الشخصية لفتح التطبيق على الهواتف الأخرى.' 
                    : language === 'zh'
                      ? '或者，您也可以扫描个人菜单底部的二维码，在其他设备上同步打开！'
                      : 'You can also scan the sync QR code inside the profile dropdown to open on another device.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* QUICK VIEW DETAILS MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full max-w-2xl rounded-3xl p-6 border relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
              theme === 'day' 
                ? 'bg-white border-slate-200 text-slate-900' 
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            {/* Close button */}
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white transition-all cursor-pointer z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Left side image and price trend sparkline */}
              <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800">
                  {quickViewProduct.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(quickViewProduct.image) ? (
                    <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <ProductSVG type={quickViewProduct.image} color={quickViewProduct.colors?.[0]?.value || '#94A3B8'} className="w-32 h-32" />
                    </div>
                  )}
                </div>
                {/* Price history sparkline overlay */}
                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#00f0ff] block mb-2">💵 6-Month Price Trend Sparkline</span>
                  <PriceSparkline basePrice={quickViewProduct.price} productId={quickViewProduct.id} theme={theme} />
                </div>
              </div>

              {/* Right side specifications and purchase actions */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-pink-500/15 text-pink-400 border border-pink-500/20 rounded text-[9px] font-bold font-mono uppercase tracking-wider">
                    {quickViewProduct.category}
                  </span>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'cyberpunk' ? 'text-[#00f0ff]' : ''}`}>
                    {quickViewProduct[`name_${language}` as keyof typeof quickViewProduct] || quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {quickViewProduct[`desc_${language}` as keyof typeof quickViewProduct] || quickViewProduct.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-mono">Inventory Stock Level:</span>
                    <span className={`text-xs font-mono font-bold ${(quickViewProduct.stock || 0) < 5 ? 'text-rose-400 animate-pulse font-black' : 'text-emerald-400 font-black'}`}>
                      {quickViewProduct.stock || 0} units remaining
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-mono">Value Assessment:</span>
                    <span className="text-lg font-black font-mono text-[#00f0ff]">${quickViewProduct.price.toFixed(2)}</span>
                  </div>

                  {/* Sizes selector */}
                  {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Select Interface Size:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickViewProduct.sizes.map(size => (
                          <span key={size} className="px-2.5 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-md text-[10px] font-mono font-semibold">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buy button */}
                  <button
                    onClick={() => {
                      const defaultSize = quickViewProduct.sizes?.[0] || 'Standard';
                      const defaultColor = quickViewProduct.colors?.[0] || { name: 'Industrial Gray', value: '#64748B' };
                      handleAddToCart(quickViewProduct, 1, defaultSize, defaultColor);
                      setQuickViewProduct(null);
                    }}
                    className={`w-full py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                      theme === 'cyberpunk'
                        ? 'bg-gradient-to-r from-pink-500 to-[#00f0ff] text-slate-950 hover:brightness-110 shadow-lg glow-pink font-black'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Instantly Acquire Machinery</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-md rounded-2xl border p-6 space-y-4 relative ${
              theme === 'day' 
                ? 'bg-white border-slate-200 text-slate-900' 
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 text-rose-500">
              <span className="p-2 bg-rose-500/10 rounded-full">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Confirm Bulk Destruction</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              You are about to delete <span className="text-rose-400 font-bold">{selectedAdminProducts.length}</span> selected machinery listings permanently from Shandong Azum's catalogs. This procedure cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/50">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-950/80 text-slate-400 border border-slate-800 rounded-xl hover:text-white transition-all text-xs font-bold cursor-pointer font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProducts(prev => prev.filter(p => !selectedAdminProducts.includes(p.id)));
                  setSelectedAdminProducts([]);
                  setShowBulkDeleteConfirm(false);
                  triggerToast("Selected products successfully deleted", "success");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all text-xs font-bold cursor-pointer shadow-lg shadow-red-600/25 font-mono"
              >
                Permanently Destroy
              </button>
            </div>
          </motion.div>
        </div>
      )}


      {/* SYSTEM TOAST ALERT OVERLAY */}
      {toast && (
        <div
          id="toast-alert"
          onClick={() => {
            setView('cart');
            setToast(null);
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all transform hover:-translate-y-0.5 animate-fade-in bg-slate-950 border-pink-500/40 text-white font-mono text-xs glow-pink"
        >
          <div className="flex items-center gap-3">
            <span className="text-[#00f0ff] font-black bg-[#00f0ff]/10 p-1.5 rounded-xl">⚡</span>
            <div className="text-left">
              <p className="font-bold">{toast.message}</p>
              {toast.type !== 'error' && (
                <p className="text-[9px] text-slate-500 mt-0.5">Click to view checkout status</p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToast(null);
            }}
            className="p-1 hover:bg-slate-900 rounded-full text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ADMIN COMMAND PALETTE (Cmd+K) */}
      {isMohab && isAdminPaletteOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-[10vh] p-4 animate-fade-in"
          onClick={() => setIsAdminPaletteOpen(false)}
        >
          <div 
            className={`w-full max-w-xl rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
              theme === 'cyberpunk'
                ? 'bg-slate-950 border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-white'
                : theme === 'day'
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-[#121420] border-slate-800 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/40">
              <Search className="w-4 h-4 text-[#00f0ff]" />
              <input 
                type="text"
                autoFocus
                value={paletteSearchQuery}
                onChange={(e) => {
                  setPaletteSearchQuery(e.target.value);
                  setPaletteSelectedIndex(0);
                }}
                placeholder="Type to search admin sub-views..."
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder-slate-500"
              />
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">ESC</span>
            </div>

            {/* Results List */}
            <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
              {filteredPaletteItems.length > 0 ? (
                filteredPaletteItems.map((item, idx) => {
                  const isSelected = idx === paletteSelectedIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setPaletteSelectedIndex(idx)}
                      onClick={() => {
                        setView('admin');
                        setAdminSubView(item.subView as any);
                        setIsAdminPaletteOpen(false);
                        triggerToast(`Navigated to ${item.name}`, 'success');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                        isSelected 
                          ? theme === 'cyberpunk'
                            ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white shadow-xs'
                            : theme === 'day'
                              ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                              : 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                          : 'border border-transparent hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon === 'Home' && <Home className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Mail' && <Mail className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Calendar' && <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Search' && <Search className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Settings' && <Settings className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'ShoppingBag' && <ShoppingBag className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'PlusCircle' && <PlusCircle className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'FolderPlus' && <FolderPlus className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Users' && <Users className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'CreditCard' && <CreditCard className="w-4 h-4 text-indigo-400 shrink-0" />}
                        {item.icon === 'Plus' && <Plus className="w-4 h-4 text-indigo-400 shrink-0" />}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-sans">{item.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wider">{item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-[9px] text-[#00f0ff] animate-pulse">⏎ Go</span>
                        )}
                        <kbd className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">
                          {item.shortcut}
                        </kbd>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 italic text-xs">
                  No matching sub-views found. Try searching for "products" or "inbox".
                </div>
              )}
            </div>

            {/* Footer info panel */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
                <span>esc to close</span>
              </div>
              <div>
                <span>Cmd + K to toggle</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX MODAL */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shadow-lg"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div 
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800/60 shadow-2xl flex items-center justify-center bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={previewImage} 
              alt="Expanded Preview" 
              className="w-full h-full max-h-[80vh] object-contain select-none cursor-default rounded-xl"
            />
          </div>
        </div>
      )}

      {/* EXPANDABLE PRODUCT SPECS CARD OVERLAY MODAL */}
      <AnimatePresence>
        {expandedProduct && (
          <ExpandedProductModal
            product={expandedProduct}
            theme={theme}
            language={language}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            handleAddToCart={handleAddToCart}
            onClose={() => setExpandedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* FLOATING COMPARE TRIGGER BAR PANEL */}
      <AnimatePresence>
        {compareProductIds.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 border px-5 py-3 rounded-2xl flex flex-wrap items-center gap-4 shadow-2xl backdrop-blur-md font-sans ${
              theme === 'day' 
                ? 'bg-white border-slate-200 text-slate-800' 
                : 'bg-slate-900/95 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500 animate-bounce" />
              <span className="text-xs font-mono font-black uppercase tracking-widest">
                Compare Mode: {compareProductIds.length} Products Checked
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-700/50 pl-4">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                Compare Now
              </button>
              <button
                onClick={() => setCompareProductIds([])}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  theme === 'day' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDE-BY-SIDE PRODUCT COMPARISON MODAL */}
      <AnimatePresence>
        {showCompareModal && (
          <ProductCompareModal
            products={products.filter(p => compareProductIds.includes(p.id))}
            theme={theme}
            onClose={() => setShowCompareModal(false)}
            onRemove={(id) => setCompareProductIds(prev => prev.filter(item => item !== id))}
          />
        )}
      </AnimatePresence>

      {/* MOBILE QR CODE QUICK VIEW MODAL */}
      <AnimatePresence>
        {qrCodeProduct && (() => {
          const quickViewUrl = `${window.location.origin}${window.location.pathname}?quickview=${qrCodeProduct.id}`;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setQrCodeProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center ${
                  theme === 'day'
                    ? 'bg-white border-slate-200 text-slate-850'
                    : 'bg-slate-950 border-slate-800 text-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setQrCodeProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 mb-4">
                    <QrCode className="w-6 h-6 animate-pulse" />
                  </div>

                  <h3 className="font-extrabold text-lg uppercase tracking-wider font-mono">
                    Quick Mobile View
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Scan this QR code with your mobile camera to instantly load the digital specs and interactive tools for:
                  </p>
                  
                  <div className={`mt-3 px-3 py-2 rounded-xl text-xs font-bold font-mono border max-w-sm break-all ${
                    theme === 'day' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-850 text-pink-400'
                  }`}>
                    {qrCodeProduct.name}
                  </div>

                  {/* QR Code Graphic Frame */}
                  <div className="mt-6 p-4 bg-white rounded-2xl border-4 border-pink-500/30 shadow-inner flex items-center justify-center relative group">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(quickViewUrl)}`}
                      alt={`QR Code for ${qrCodeProduct.name}`}
                      className="w-48 h-48 select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                  </div>

                  {/* Manual URL Actions */}
                  <div className="mt-5 w-full">
                    <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase mb-1">QUICK VIEW DEEP-LINK URL</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={quickViewUrl}
                        className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono select-all text-ellipsis overflow-hidden ${
                          theme === 'day'
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(quickViewUrl);
                          triggerToast("Copied quick view URL to clipboard!", "success");
                        }}
                        className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                        title="Copy to Clipboard"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <a
                    href={quickViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-[11px] text-[#00f0ff] hover:underline font-mono font-black uppercase tracking-wider flex items-center gap-1"
                  >
                    Open Link in New Tab ↗
                  </a>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* INDUSTRIAL HARDWARE QR/BARCODE CAMERA SCANNER MODAL */}
      <AnimatePresence>
        {isQrScannerOpen && (
          <CameraScannerModal
            isOpen={isQrScannerOpen}
            onClose={() => setIsQrScannerOpen(false)}
            products={products}
            onScanSuccess={(productId) => {
              setScannedTargetProductId(productId);
              setRecentScans((prev) => {
                const filtered = prev.filter(id => id !== productId);
                return [productId, ...filtered].slice(0, 5);
              });
              const prod = products.find(p => p.id === productId);
              logUserActivity('scan', 'QR/Barcode Scanned', `Industrial component decoded: "${prod ? prod.name : productId}" (ID: ${productId})`);
              triggerToast(`Product targeted successfully!`, "success");
            }}
            theme={theme as any}
          />
        )}
      </AnimatePresence>

      {/* LIVE CUSTOMER ACTIVITY TRACKER MODAL */}
      <AnimatePresence>
        {isActivitiesModalOpen && (
          <CustomerActivityTrackerModal
            isOpen={isActivitiesModalOpen}
            onClose={() => setIsActivitiesModalOpen(false)}
            activities={activities}
            onClearActivities={() => {
              setActivities([]);
              localStorage.removeItem('azum_activities');
              triggerToast("Telemetry logging buffer cleared.", "success");
            }}
            theme={theme as any}
            onLogActivity={logUserActivity}
            products={products}
          />
        )}
      </AnimatePresence>

      {/* SET PRICE ALERT DIALOG MODAL */}
      <AnimatePresence>
        {priceAlertProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl border p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl ${
                theme === 'cyberpunk'
                  ? 'bg-slate-950 border-[#00f0ff]/40 text-white'
                  : theme === 'day'
                    ? 'bg-white border-slate-200 text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <button
                onClick={() => setPriceAlertProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg tracking-tight uppercase">
                    Set Price Alert
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    We will notify you instantly when the price of this industrial machinery drops below your target price.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/45 border-slate-800'
                } flex items-center gap-3`}>
                  {priceAlertProduct.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(priceAlertProduct.image) ? (
                    <img
                      src={priceAlertProduct.image}
                      alt={priceAlertProduct.name}
                      className="w-12 h-12 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shrink-0">
                      <ProductSVG type={priceAlertProduct.image} color={priceAlertProduct.colors?.[0]?.value || '#94A3B8'} className="w-8 h-8" />
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="font-extrabold text-sm truncate">{priceAlertProduct.name}</h4>
                    <span className="text-xs font-mono text-indigo-400">Current Price: ${priceAlertProduct.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Target Price ($):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                      <input
                        id="price-alert-target-input"
                        type="number"
                        step="0.01"
                        className={`w-full pl-7 pr-3 py-2 border rounded-xl outline-none font-mono text-sm ${
                          theme === 'day'
                            ? 'bg-white border-slate-300 text-slate-800 focus:border-indigo-500'
                            : 'bg-slate-950 border-slate-800 text-white focus:border-pink-500'
                        }`}
                        placeholder="e.g. 5000.00"
                        defaultValue={(priceAlertProduct.price * 0.9).toFixed(2)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Recipient Email Address:
                    </label>
                    <input
                      id="price-alert-email-input"
                      type="email"
                      className={`w-full px-3 py-2 border rounded-xl outline-none font-mono text-sm ${
                        theme === 'day'
                          ? 'bg-white border-slate-300 text-slate-800 focus:border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-white focus:border-pink-500'
                      }`}
                      defaultValue={priceAlertEmail}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      const targetInput = document.getElementById('price-alert-target-input') as HTMLInputElement;
                      const emailInput = document.getElementById('price-alert-email-input') as HTMLInputElement;
                      if (!targetInput || !emailInput) return;

                      const targetVal = parseFloat(targetInput.value);
                      const emailVal = emailInput.value.trim();

                      if (isNaN(targetVal) || targetVal <= 0) {
                        triggerToast("Please enter a valid target price.", "error");
                        return;
                      }

                      if (targetVal >= priceAlertProduct.price) {
                        triggerToast("Target price must be less than current price.", "error");
                        return;
                      }

                      if (!emailVal || !emailVal.includes('@')) {
                        triggerToast("Please enter a valid email address.", "error");
                        return;
                      }

                      const updatedThresholds = { ...priceAlertThresholds, [priceAlertProduct.id]: targetVal };
                      setPriceAlertThresholds(updatedThresholds);
                      setPriceAlertEmail(emailVal);

                      localStorage.setItem('azum_price_thresholds', JSON.stringify(updatedThresholds));
                      localStorage.setItem('azum_price_email', emailVal);

                      logUserActivity(
                        'theme',
                        'Price Alert Active',
                        `Set price alert for ${priceAlertProduct.name} at target: $${targetVal}. Recipient: ${emailVal}`
                      );

                      triggerToast(`Success! Price alert configured at $${targetVal.toFixed(2)} for ${priceAlertProduct.name}`, "success");
                      setPriceAlertProduct(null);
                    }}
                    className={`flex-1 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center ${
                      theme === 'cyberpunk'
                        ? 'bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-slate-950 shadow-[0_0_12px_#00f0ff]'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    Activate Alert
                  </button>
                  <button
                    onClick={() => setPriceAlertProduct(null)}
                    className={`px-4 py-3 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer border ${
                      theme === 'day' 
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 30 }}
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed bottom-6 right-6 p-4 rounded-full z-50 cursor-pointer shadow-[0_0_25px_rgba(0,0,0,0.35)] border flex items-center justify-center overflow-hidden group ${
              theme === 'cyberpunk'
                ? 'bg-slate-950/90 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : theme === 'day'
                  ? 'bg-white border-slate-200 text-indigo-600 shadow-[0_4px_20px_rgba(79,70,229,0.15)]'
                  : 'bg-slate-900 border-slate-700 text-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.25)]'
            }`}
            title="Scroll to Top"
          >
            {/* Ambient pulsing expansion ring */}
            <span className="absolute inset-0 rounded-full overflow-hidden">
              <motion.span
                className={`absolute inset-0 rounded-full opacity-30 ${
                  theme === 'cyberpunk' ? 'bg-[#00f0ff]' : 'bg-indigo-500'
                }`}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.35, 0, 0.35]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </span>

            {/* Hover overlay sheen */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t ${
              theme === 'cyberpunk' ? 'from-pink-500/20 to-[#00f0ff]/10' : 'from-indigo-500/10 to-transparent'
            }`} />

            {/* Bouncing arrow up indicator */}
            <motion.div
              variants={{
                hover: { 
                  y: [0, -6, 0],
                  transition: { repeat: Infinity, duration: 1, ease: "easeInOut" }
                }
              }}
              className="relative z-10"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
