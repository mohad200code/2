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
  Pause
} from 'lucide-react';

import { Product, User as UserType, Order, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, CATEGORIES } from './mockData';
import helicalGear from './assets/images/helical_gear_1782614423344.jpg';
import weixinImage from './assets/images/azum_new_card_1782986404798.jpg';
import { ProductSVG } from './components/ProductSVG';
import { ClerkAuth } from './components/ClerkAuth';
import { CheckoutWizard } from './components/CheckoutWizard';
import { AdminOverview } from './components/AdminOverview';
import { AdminUsers } from './components/AdminUsers';
import { ShandongAzumLogo } from './components/ShandongAzumLogo';

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
    aiAssistant: "AI Store Assistant",
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
    aiAssistant: "AI 智控管家",
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
    aiAssistant: "مساعد الذكاء الاصطناعي",
    aiDescription: "عميل مبيعات ذكي وموزع آلي فوري للطلبات.",
    askAi: "اسأل أي شيء عن كتالوج المنتجات...",
    guestMode: "عرض كزائر",
    signupMessage: "سجل الآن لتتمكن من إضافة منتجاتك الخاصة وتفعيل محفظتك!",
    systemHealthy: "الميكروسيرفس تعمل بنجاح",
    seoRating: "مؤشرات الـ SEO ممتازة: 100%"
  }
};

export default function App() {
  // Navigation & Screen View State
  const [view, setView] = useState<'store' | 'product-details' | 'cart' | 'admin' | 'auth' | 'orders' | 'ai' | 'chat'>('store');
  const [adminSubView, setAdminSubView] = useState<'overview' | 'inbox' | 'calendar' | 'search' | 'settings' | 'products' | 'add-product' | 'add-category' | 'users' | 'add-user' | 'transactions' | 'add-order'>('overview');
  
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
  const [language, setLanguage] = useState<'en' | 'zh' | 'ar'>('en');

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
    if (!localStorage.getItem('cyberport_products_reset_v3')) {
      localStorage.removeItem('cyberport_products');
      localStorage.setItem('cyberport_products_reset_v3', 'true');
      return INITIAL_PRODUCTS;
    }
    const saved = localStorage.getItem('cyberport_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn("Cleared corrupt localStorage products");
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [users, setUsers] = useState<UserType[]>(() => {
    const savedUser = localStorage.getItem('cyberport_user');
    let baseUsers = INITIAL_USERS;
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.email && u.email !== 'mohabmohnad9@gmail.com' && u.email !== 'lamadevtest@gmail.com') {
          baseUsers = INITIAL_USERS.filter(userObj => userObj.email !== 'graceallen07@yahoo.com' && userObj.email !== 'mattsc44@gmail.com');
        }
      } catch (e) {}
    }
    return baseUsers;
  });

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(null);
  const [customEngravingName, setCustomEngravingName] = useState<string>('');
  const [detailQty, setDetailQty] = useState(1);

  // Store filter/search state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("Web Speech API is not supported in this browser. Please try Chrome, Edge, or Safari.", "error");
      return;
    }

    if (isListening) {
      if ((window as any).recognitionInstance) {
        (window as any).recognitionInstance.stop();
      }
      setIsListening(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'ar' ? 'ar-SA' : language === 'zh' ? 'zh-CN' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        triggerToast("Listening for speech... Speak into your microphone.", "success");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiInput((prev) => (prev ? prev + ' ' : '') + transcript);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      (window as any).recognitionInstance = rec;
      rec.start();
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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // System Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // User Authentication Context (Supports Signup / Login)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'admin' | 'user'; name?: string } | null>(() => {
    const saved = localStorage.getItem('cyberport_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isMohab = currentUser && (
    currentUser.email === 'mohabmohnad9@gmail.com' ||
    currentUser.name?.toLowerCase() === 'mohab' ||
    currentUser.email.startsWith('mohab')
  );

  const isPrimaryAdmin = currentUser && (
    currentUser.email === 'mohabmohnad9@gmail.com' ||
    currentUser.email === 'lamadevtest@gmail.com'
  );

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
          next.visitorData = next.visitorData.map((d: any) => {
            if (d.name === currentDay) {
              const isMobile = Math.random() > 0.5;
              return {
                ...d,
                Mobile: isMobile ? d.Mobile + 1 : d.Mobile,
                Desktop: !isMobile ? d.Desktop + 1 : d.Desktop
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

  // Google OAuth & Real Gmail API dispatch states
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string; picture: string } | null>(null);
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

  // AI Store Assistant Floating chatbot states
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; date: string }[]>(() => {
    const saved = localStorage.getItem('cyberport_ai_messages');
    return saved ? JSON.parse(saved) : [
      { sender: 'ai', text: "Welcome to Sdazum Cyberport! I am your AI automated industrial machinery concierge. Ask me for recommendations, search current inventory, or request technical specs!", date: new Date().toLocaleTimeString() }
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
    lounge: [
      { sender: 'agent', text: "Welcome to the Industrial Operators Lounge! This is a global real-time chatroom connecting factory leads, machinery operators, and system integrators worldwide.", date: "System Time", userName: "System Daemon", userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100" },
      { sender: 'agent', text: "Hey folks, just deployed two RX-200 robotic arms in our Detroit packing plant. The vision-guidance system is incredible!", date: "System Time", userName: "Gary (CNC Specialist)", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
      { sender: 'agent', text: "Awesome! We just completed the electrical wiring for the 12kW fiber laser LC-12. The dual-shuttle exchange tables save us nearly 40 minutes per pallet load.", date: "System Time", userName: "Sarah (Molding & Fab)", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
    ]
  };

  const [chatHistories, setChatHistories] = useState<Record<string, any[]>>(defaultHistories);

  const socketRef = useRef<WebSocket | null>(null);

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
      setMicroservicesLogs(prev => [randomLog, prev[0], prev[1]].slice(0, 5));
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
          setGoogleUser(data.user);
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

  // Reusable Native Sharing helper with copy clipboard fallback
  const handleShareProduct = async (product: Product) => {
    const deepLinkUrl = `${window.location.origin}?product=${product.id}`;
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
          triggerToast(`Link for "${product.name}" copied!`, "success");
        }
      }
    } else {
      navigator.clipboard.writeText(deepLinkUrl);
      triggerToast(`Link for "${product.name}" copied!`, "success");
    }
  };

  const handleConnectGmail = () => {
    if (!googleClientId) {
      triggerToast("Google OAuth is not configured on this server.", "error");
      return;
    }
    const scopes = [
      "https://www.googleapis.com/auth/gmail.send",
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
      status: 'success',
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

    // Boot Automated Digital Delivery sequence
    const generatedKey = `NK-KEY-${Math.floor(Math.random() * 899999) + 100000}-${product.id.toUpperCase()}`;
    setDeliveryProduct(product);
    setDeliveryKey(generatedKey);
    setDeliveryLogs([
      `[AUTOBOT-DELIVERY] Order event captured: ID ${mockOrder.id}`,
      `[WALLET-CHECKOUT] Verified payment of $${cost.toFixed(2)} USD`,
      `[MICROSERVICE-WAREHOUSE] Retrieving digital license keys...`,
      `[AUTO-SHIPPING] Dispatching automated package tracker...`,
      `[AUTOBOT-DELIVERY] Instant delivery complete! Code unlocked.`
    ]);
    setDeliveryLogs(prev => [...prev, `[SUCCESS] Product: ${product.name}. Enjoy your premium athletic gear!`]);
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

  // Storefront Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const dispName = (p[`name_${language}` as keyof typeof p] || p.name || '').toString().toLowerCase();
      const matchesSearch = dispName.includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory, language]);

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

    // Call the real backend Gemini chat API first!
    fetch("/api/gemini/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMsg, chatHistory: nextMessages })
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.text) {
          const finalMsgs = [...nextMessages, {
            sender: 'ai' as const,
            text: data.text,
            date: new Date().toLocaleTimeString()
          }];
          setAiMessages(finalMsgs);
          localStorage.setItem('cyberport_ai_messages', JSON.stringify(finalMsgs));
          speakAiText(data.text);
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

          if (isShoes) {
            if (detectedLang === 'ar') {
              aiText = "بناءً على طلبك، أنصحك بـ Precision CNC Milling Machine V8 (تقييم 4.9) و Heavy-Duty Robotic Arm RX-200 (تقييم 4.8). تتميز بدقة متناهية وأتمتة عالية تناسب خطوط المصانع. هل تود أن أفتح لك صفحة تفاصيل المنتج؟";
            } else if (detectedLang === 'zh') {
              aiText = "根据您的需求，我推荐 Precision CNC Milling Machine V8 (评分 4.9) 和 Heavy-Duty Robotic Arm RX-200 (评分 4.8)。它们具有微米级定位精度和全自动伺服控制。需要我为您打开商品详情页吗？";
            } else {
              aiText = "Based on your prompt, I recommend the Precision CNC Milling Machine V8 (4.9 Rating) and the Heavy-Duty Robotic Arm RX-200 (4.8 Rating). They feature micro-inch precision and automated servo controls. Would you like me to open their detail page?";
            }
          } else if (isJacket) {
            if (detectedLang === 'ar') {
              aiText = "لدينا سترات مميزة وطلبها عالي: Under Armour StormFleece بسعر ($49.00) مقاومة للماء، و Puma Ultra Warm Zip بسعر ($69.00) مبطنة حرارياً. رائعة لتمارين الطقس البارد!";
            } else if (detectedLang === 'zh') {
              aiText = "我们拥有几款热门夹克：Under Armour StormFleece ($49.00) 防泼水，Puma Ultra Warm Zip ($69.00) 带有保暖内衬。非常适合寒冷天气的户外运动！";
            } else {
              aiText = "We have high-demand jackets: Under Armour StormFleece ($49.00) repels water, and Puma Ultra Warm Zip ($69.00) is thermal-lined. Great for cold weather workouts!";
            }
          } else if (isWallet) {
            if (detectedLang === 'ar') {
              aiText = "لقد تم إيقاف نظام الدفع بالمحفظة الإلكترونية لتبسيط عمليات الشراء. يمكنك الآن استخدام بطاقة الائتمان مباشرة لإتمام عملية الدفع بأمان.";
            } else if (detectedLang === 'zh') {
              aiText = "我们已停用电子钱包支付系统以简化购买流程。您现在可以直接使用模拟信用卡进行安全、便捷的结账。";
            } else {
              aiText = "We have disabled the Cyber Wallet payment model to simplify checkout. You can now use simulated credit cards directly for safe, secure payment.";
            }
          } else if (isAffiliate) {
            if (detectedLang === 'ar') {
              aiText = `كود الإحالة الخاص بك هو '${affiliateCode}'. لقد قمت بدعوة ${referralsCount} من الأعضاء النشطين، وحققت $${affiliateEarnings.toFixed(2)} كعمولة سلبية!`;
            } else if (detectedLang === 'zh') {
              aiText = `您的分销推广码是 '${affiliateCode}'。您已成功邀请 ${referralsCount} 位活跃成员，累计赚取了 $${affiliateEarnings.toFixed(2)} 的被动分销佣金！`;
            } else {
              aiText = `Your Affiliate Code is '${affiliateCode}'. You have invited ${referralsCount} active members, earning $${affiliateEarnings.toFixed(2)} in passive commissions!`;
            }
          } else if (isAddProduct) {
            if (detectedLang === 'ar') {
              aiText = "يمكنك إضافة المنتجات بسهولة! ما عليك سوى تسجيل الدخول، والضغط على زر 'إضافة منتج حصرى' في القائمة، ثم ملء البيانات ورفع الصورة أو سحبها وإفلاتها. سيظهر منتجك في المعرض فوراً.";
            } else if (detectedLang === 'zh') {
              aiText = "您可以非常轻松地发布新产品！只需登录您的账号，点击菜单中的“发布新产品”按钮，填写表单并上传图片（支持拖拽），您的商品就会立即可视地呈现在商城目录中。";
            } else {
              aiText = "You can add products easily! Simply sign up, click the 'Host Product' button in the menu, fill in the form and upload or drag & drop your image. Your product will appear in the catalog instantly.";
            }
          } else if (isLanguage) {
            if (detectedLang === 'ar') {
              aiText = "يمكنك تغيير لغة المتجر في أي وقت! استخدم زر مغير اللغة في شريط الأدوات العلوي للتبديل بين العربية والإنجليزية والصينية.";
            } else if (detectedLang === 'zh') {
              aiText = "您可以随时切换商城语言！点击顶部工具栏的语言选择按钮，即可在中文、英文和阿拉伯语之间进行自由切换。";
            } else {
              aiText = "You can change languages at any time! Use the Language Selector button in the header toolbar to switch between English, Chinese, and Arabic.";
            }
          } else if (isGreeting) {
            if (detectedLang === 'ar') {
              aiText = "مرحباً بك! أهلاً بك في المساعد الذكي لبوابة سدازوم الرقمية. كيف يمكنني مساعدتك في العثور على الماكينات والقطع المثالية اليوم؟";
            } else if (detectedLang === 'zh') {
              aiText = "你好！欢迎来到 SDAZUM 智能助手。今天有什么我可以帮您挑选或咨询的工业设备与零件吗？";
            } else {
              aiText = "Hello! Welcome to Sdazum Cyberport AI Concierge. How can I help you discover the perfect industrial machinery today?";
            }
          } else {
            if (detectedLang === 'ar') {
              aiText = `لقد قمت بمعالجة استفسارك: "${userMsg}". يسعدنا دائماً تقديم المشورة الهندسية وتسهيل عمليات التوزيع واللوجستيات في بوابتنا الرقمية!`;
            } else if (detectedLang === 'zh') {
              aiText = `针对您的提问“${userMsg}”，这是我们的专业解答。我们随时提供最顶级的数控机械、机器人系统和智能电商分销协助。`;
            } else {
              aiText = `Thank you for your question: "${userMsg}". We are ready to assist you. Ask us anything about our high-precision CNC machines, robotic assemblies, or automated checkout operations!`;
            }
          }

          setAiMessages(prev => {
            const updated = [...prev, {
              sender: 'ai' as const,
              text: aiText,
              date: new Date().toLocaleTimeString()
            }];
            localStorage.setItem('cyberport_ai_messages', JSON.stringify(updated));
            speakAiText(aiText);
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
    // Grant admin tier to anyone who registers or signs in per user request
    const finalRole: 'admin' | 'user' = 'admin';

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
          role: 'admin',
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
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        theme === 'day' 
          ? 'theme-day bg-slate-50 text-black' 
          : theme === 'night' 
            ? 'bg-slate-950 text-slate-100' 
            : 'bg-black text-[#00f0ff] cyber-grid relative'
      }`}
    >
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
          
          
          {currentUser?.role === 'admin' && (
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
            <div id="navbar-search" className="relative hidden md:block w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
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
                    }
                  }
                }}
                className={`w-full text-xs rounded-xl pl-9 pr-4 py-2 outline-none transition-all ${
                  theme === 'day' 
                    ? 'bg-slate-100 border border-slate-200 text-slate-800 focus:border-slate-800' 
                    : theme === 'night'
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500'
                      : 'bg-slate-950 border border-pink-500/30 text-[#00f0ff] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30'
                }`}
              />
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
              onClick={() => setTheme('day')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Day Mode (Light)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setTheme('night')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Night Mode (Dark)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setTheme('cyberpunk')}
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
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            view === 'store' || view === 'product-details'
              ? theme === 'cyberpunk'
                ? 'bg-pink-500 text-white shadow-lg glow-pink scale-102'
                : 'bg-indigo-600 text-white scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Store</span>
        </button>

        {isMohab && (
          <button
            onClick={() => setView('ai')}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
              view === 'ai'
                ? theme === 'cyberpunk'
                  ? 'bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/20 scale-102'
                  : 'bg-indigo-600 text-white scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>AI Assistant Hub</span>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        )}

        {isMohab && (
          <button
            onClick={() => setView('chat')}
            className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
              view === 'chat'
                ? theme === 'cyberpunk'
                  ? 'bg-pink-500 text-white shadow-lg glow-pink scale-102'
                  : 'bg-indigo-600 text-white scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Chat</span>
          </button>
        )}

        <button
          onClick={() => {
            setView('admin');
            setAdminSubView('overview');
          }}
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            view === 'admin'
              ? theme === 'cyberpunk'
                ? 'bg-emerald-500 text-black shadow-lg scale-102'
                : 'bg-emerald-600 text-white scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-emerald-400" />
          <span>Admin Controls</span>
        </button>

        <button
          onClick={() => setView('orders')}
          className={`px-3.5 py-2 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            view === 'orders'
              ? theme === 'cyberpunk'
                ? 'bg-pink-500 text-white shadow-lg glow-pink scale-102'
                : 'bg-indigo-600 text-white scale-102'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Orders Tracker</span>
        </button>
      </div>

      {/* VIEW ROUTING SECTIONS */}
      <main className="flex-1 relative">

        {/* 1. STOREFRONT VIEW */}
        {view === 'store' && (
          <div id="storefront-page" className="space-y-8 pb-20">
            
            {/* HERO BANNER SECTION WITH COOL MATRIX RAIN / SPRING HOVER */}
            <section id="hero-banner" className="max-w-7xl mx-auto mt-6 px-4">
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
                      <Bot className="w-4 h-4 animate-bounce" />
                      <span>Ask Store AI</span>
                    </button>
                  </div>
                </div>

                {/* Sneaker illustration with spring physics float effect */}
                <div className="w-72 h-72 md:w-[350px] md:h-[350px] shrink-0 relative mt-6 md:mt-0 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse ${
                    theme === 'cyberpunk' ? 'bg-pink-500/20' : 'bg-amber-300/40'
                  }`} />
                  <div className="relative animate-float cursor-grab max-h-[300px] max-w-[300px]">
                    <img
                      src={weixinImage}
                      alt="Shandong Azum Business Card"
                      className="w-full h-full object-contain rounded-2xl border border-pink-500/10 shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE MICROSERVICES DASHBOARD ACTIVITY BAR */}
            <section className="max-w-7xl mx-auto px-4">
              <div className={`p-4 rounded-2xl border ${
                theme === 'day' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2">
                  <Terminal className="w-4 h-4 text-pink-500" />
                  <span className="uppercase text-slate-300">Automated Backend Activity logs (SEO & microservices prototype)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] text-slate-500">
                  {microservicesLogs.map((log, idx) => (
                    <div key={idx} className="bg-black/40 p-2 rounded border border-slate-800 text-pink-500/80 truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CATEGORIES SELECTION GRID */}
            <section id="categories-row" className="max-w-7xl mx-auto px-4 space-y-4">
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
                    className="absolute h-full bg-gradient-to-r from-pink-500 to-[#00f0ff] rounded-full transition-all duration-75"
                    style={{ 
                      width: '30%', 
                      left: `${categoriesScrollProgress * 0.7}%` 
                    }}
                  />
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG GRID */}
            <section id="products-grid-catalog" className="max-w-7xl mx-auto px-4 pb-12">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => {
                    const commentsCount = (reviewsDB[p.id] || p.reviews || []).length;
                  return (
                    <div
                      key={p.id}
                      id={`product-card-${p.id}`}
                      className={`group rounded-3xl p-5 border transition-all hover:-translate-y-1 relative flex flex-col justify-between ${
                        theme === 'day' 
                          ? 'bg-white border-slate-200/80 shadow-xs hover:shadow-lg' 
                          : theme === 'night' 
                            ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                            : 'bg-slate-950/80 border-pink-500/20 hover:border-pink-500/60 shadow-xl'
                      }`}
                    >
                      {/* Interactive buy overlays */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#00f0ff] border border-pink-500/40 z-10">
                        <span>🔥 {p.salesCount || Math.floor(p.price * 3.4)} sold</span>
                      </div>

                      {/* Product image with fallbacks */}
                      <div 
                        onClick={() => { setSelectedProduct(p); setView('product-details'); }}
                        className="relative w-full h-60 overflow-hidden rounded-2xl mb-4 cursor-pointer group"
                      >
                        {p.image && (p.image.startsWith('http') || p.image.startsWith('data:')) ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900/60 flex items-center justify-center rounded-2xl">
                            <ProductSVG type={p.image} color={p.colors[0]?.value || '#94A3B8'} className="w-28 h-28" />
                          </div>
                        )}
                      </div>

                      {/* Title & metadata */}
                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] uppercase font-bold text-pink-500">{p.category}</span>
                        <h4 
                          onClick={() => { setSelectedProduct(p); setView('product-details'); }}
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

                        {/* Reviews overview in list card */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating || 4) ? 'fill-amber-400' : ''}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400">({commentsCount || (p.reviews || []).length})</span>
                        </div>
                      </div>

                      {/* Price and buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 mt-4">
                        <p className="font-mono font-black text-md text-[#00f0ff]">${p.price.toFixed(2)}</p>
                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { setSelectedProduct(p); setView('product-details'); }}
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
                    </div>
                  );
                })}
              </div>
              )}
            </section>

            {/* PLATFORM SHARE SECTION AT THE BOTTOM OF THE STOREFRONT */}
            <section id="platform-share-bottom" className="max-w-7xl mx-auto px-4 mt-8 pb-10">
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
            </section>
          </div>
        )}

        {/* 2. PRODUCT DETAILS SECTION WITH CUSTOM REVIEWS AND WALLET ORDERING */}
        {view === 'product-details' && selectedProduct && (
          <div id="product-details-page" className={`max-w-7xl mx-auto py-10 px-4 font-sans ${theme === 'day' ? 'text-slate-800' : 'text-slate-200'}`}>
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer font-mono"
            >
              ← Back to cyber storefront
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Visual vector layout */}
              <div className="w-full overflow-hidden rounded-[32px] relative group">
                {selectedProduct.image && (selectedProduct.image.startsWith('http') || selectedProduct.image.startsWith('data:')) ? (
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
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
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
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : ''}`} />
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
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${val <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
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
          </div>
        )}

        {/* 3. CART CHECKOUT VIEW */}
        {view === 'cart' && (
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
              setOrders(prev => {
                const next = [newOrder, ...prev];
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

              // Run digital dispatch for orders with digital items
              const generatedKey = `NK-KEY-${Math.floor(Math.random() * 899999) + 100000}-BULK`;
              setDeliveryProduct(products[0] || null);
              setDeliveryKey(generatedKey);
              setDeliveryLogs([
                `[AUTO-GATEWAY] Bulking multi-order captures.`,
                `[SHIPPING] Processing warehouse tracking metrics.`,
                `[SUCCESS] Dispatch codes dispatched to your Simulated Inbox!`
              ]);
              setIsDeliveryLogOpen(true);

              // Send Real Gmail notification
              sendRealGmailNotification(newOrder, generatedKey);
            }}
            language={language}
          />
        )}

        {/* 4. ORDERS VIEW PANEL */}
        {view === 'orders' && (
          <div id="customer-orders-panel" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200 space-y-6">
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
              return (
                <>
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-2xl font-black text-[#00f0ff] tracking-tight font-mono uppercase">Your Machinery Orders</h2>
                    <p className="text-xs text-slate-400 font-mono">Review real-time industrial delivery tracking and machine unlocking licenses</p>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="text-center py-16 bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-sm space-y-4">
                      <p className="text-4xl">📦</p>
                      <h3 className="text-sm font-bold text-slate-500 font-mono uppercase">You have no active orders yet.</h3>
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
                            {userOrders.map((o) => {
                              const isExpanded = expandedOrderId === o.id;
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
                                                src={item.image && (item.image.startsWith('data:') || item.image.startsWith('http')) ? item.image : `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100`}
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
                                      <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                                        <span>Track Logistics</span>
                                      </span>
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
          </div>
        )}

        {/* 6. CLERK AUTHENTICATOR */}
        {view === 'auth' && (
          <ClerkAuth
            onSuccess={handleAuthSuccess}
            onClose={() => setView('store')}
            onGoogleAuth={handleConnectGmail}
            initialIsSignUp={authIsSignUp}
            language={language}
          />
        )}

        {/* 7. ADMINISTRATIVE DASHBOARD PORTAL */}
        {view === 'admin' && currentUser?.role === 'admin' && (
          <div 
            id="admin-panel-layout" 
            className={`flex min-h-[calc(100vh-4rem)] transition-colors duration-300 ${
              theme === 'day' 
                ? 'bg-slate-50 text-slate-800' 
                : 'bg-[#0f111a] text-slate-100'
            }`}
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
                    theme === 'day' ? 'text-slate-800' : 'text-white'
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
              <div id="admin-subheader" className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase font-mono">
                    {adminSubView === 'overview' && 'DASHBOARD PORTAL'}
                    {adminSubView === 'inbox' && 'MAILROOM DISPATCH'}
                    {adminSubView === 'calendar' && 'DELIVERY LOGISTICS SCHEDULE'}
                    {adminSubView === 'search' && 'DATABASE DRILL CONSOLE'}
                    {adminSubView === 'settings' && 'SYSTEM PARAMS & INTEGRATIONS'}
                    {adminSubView === 'products' && 'MACHINERY CAPABILITIES LIST'}
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
                    return <AdminOverview products={products} orders={orders} telemetry={telemetry} />;
                  
                  case 'inbox':
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl min-h-[500px]">
                        {/* List pane */}
                        <div className="lg:col-span-1 border-r border-slate-800/80 pr-4 space-y-3">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800/60">
                            Sent Inboxes ({adminInbox.length})
                          </h3>
                          <div className="space-y-2 overflow-y-auto max-h-[450px]">
                            {adminInbox.map((mail, idx) => (
                              <div
                                key={mail.id}
                                onClick={() => {
                                  // Selected index tracking
                                  (window as any).selectedMail = mail;
                                  setAdminSubView('inbox'); // re-render trick
                                }}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  (window as any).selectedMail?.id === mail.id || (!(window as any).selectedMail && idx === 0)
                                    ? 'bg-slate-800/80 border-indigo-500/40 shadow'
                                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                                }`}
                              >
                                <div className="flex justify-between items-start text-[10px] text-slate-500 font-mono">
                                  <span>To: {mail.to}</span>
                                  <span>{mail.date}</span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-200 mt-1.5 truncate">{mail.subject}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 truncate">Sender: {mail.from}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Detail pane */}
                        <div className="lg:col-span-2 pl-2 flex flex-col justify-between">
                          {(() => {
                            const mail = (window as any).selectedMail || adminInbox[0];
                            if (!mail) {
                              return (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                  <Mail className="w-12 h-12 text-slate-700 animate-pulse" />
                                  <p className="text-xs mt-3">No email receipts dispatched yet. Checkout items to view real-time logs.</p>
                                </div>
                              );
                            }
                            return (
                              <div className="space-y-4">
                                <div className="border-b border-slate-800 pb-3">
                                  <span className="text-[10px] font-mono text-indigo-400 block">SDAZUM.COM MAIL DELIVERY GATEWAY</span>
                                  <h3 className="text-base font-black text-white mt-1">{mail.subject}</h3>
                                  <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                                    <span>From: <strong className="text-slate-200">{mail.from}</strong></span>
                                    <span>To: <strong className="text-slate-200">{mail.to}</strong></span>
                                  </div>
                                </div>
                                <div 
                                  className="p-4 bg-[#05060b] rounded-xl border border-slate-800 max-h-[400px] overflow-y-auto"
                                  dangerouslySetInnerHTML={{ __html: mail.body }}
                                />
                              </div>
                            );
                          })()}
                        </div>
                      </div>
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

                  case 'products':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/60 pb-3">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                            📦 Product Catalog Data ({products.length})
                          </h3>
                          <button
                            onClick={() => {
                              if (!isMohab) {
                                triggerToast("Access Denied: Just Mohab can delete all products", "error");
                                return;
                              }
                              if (window.confirm("Are you sure you want to delete ALL products from the catalog? This action is irreversible.")) {
                                setProducts([]);
                                triggerToast("All products have been deleted successfully", "success");
                              }
                            }}
                            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
                          >
                            Delete All Products
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left text-slate-300">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-mono">
                                <th className="p-3 w-16">IMAGE</th>
                                <th className="p-3">NAME</th>
                                <th className="p-3">CATEGORY</th>
                                <th className="p-3">PRICE</th>
                                <th className="p-3 text-right">ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((p) => (
                                <tr key={p.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                                  <td className="p-3">
                                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-850 p-0.5">
                                      {p.image && (p.image.startsWith('http') || p.image.startsWith('data:')) ? (
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                                      ) : (
                                        <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-6 h-6" />
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 font-bold text-white">{p.name}</td>
                                  <td className="p-3 font-mono">{p.category}</td>
                                  <td className="p-3 font-mono text-indigo-400 font-bold">${p.price}</td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => {
                                          if (!isMohab) {
                                            triggerToast("Access Denied: Just Mohab can edit products", "error");
                                            return;
                                          }
                                          setEditingProduct(p);
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );

                  case 'add-product':
                    return (
                      <div className="bg-[#0a0b10] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-xl mx-auto">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                          ➕ Create New Machinery Listing
                        </h3>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">Product Name</label>
                            <input 
                              type="text" 
                              id="new-prod-name-inline"
                              placeholder="e.g., Heavy-Duty Robotic Arm RX-300"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Category</label>
                            <select 
                              id="new-prod-cat-inline"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            >
                              <option>CNC & Milling</option>
                              <option>Industrial Robotics</option>
                              <option>Laser Cutters</option>
                              <option>Rotary Compressors</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Price ($)</label>
                            <input 
                              type="number" 
                              id="new-prod-price-inline"
                              placeholder="12500"
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Description</label>
                            <textarea 
                              id="new-prod-desc-inline"
                              placeholder="Describe machinery voltage, parameters..."
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white h-20"
                            />
                          </div>

                          {/* Dynamic File Upload Box */}
                          <div>
                            <label className="text-slate-400 block mb-1">Product Image (Upload from Browser)</label>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('inline-file-upload-input')?.click()}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer text-xs font-mono"
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
                                    className="text-xs text-rose-400 hover:underline"
                                  >
                                    Remove image
                                  </button>
                                )}
                              </div>
                              {inlineUploadedImage ? (
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-1">
                                  <img 
                                    src={inlineUploadedImage} 
                                    alt="Inline uploaded preview" 
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              ) : (
                                <div className="p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-lg text-slate-500 italic text-[11px]">
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
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg uppercase tracking-wider text-white cursor-pointer"
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
                              {orders.map((o) => (
                                <tr key={o.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                                  <td className="p-3 font-mono font-bold text-white">{o.id}</td>
                                  <td className="p-3 font-mono text-emerald-400">Merchant Sandbox</td>
                                  <td className="p-3 font-mono">XXXX-XXXX-XXXX-4242</td>
                                  <td className="p-3 text-right font-mono text-indigo-400 font-bold">${o.total.toFixed(2)}</td>
                                </tr>
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
                    return <AdminOverview products={products} orders={orders} telemetry={telemetry} />;
                }
              })()}
            </div>

            {/* PRODUCT EDITING DIALOG BOX */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 font-mono text-xs text-slate-200 space-y-6 shadow-2xl">
                  
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
                    <div>
                      <label className="text-slate-400 block mb-1">Product Name</label>
                      <input 
                        type="text" 
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-sans"
                      />
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
                      {editingProduct.image && (editingProduct.image.startsWith('http') || editingProduct.image.startsWith('data:')) ? (
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

                      {/* Collapsible/small option for manual URL pasting if they ever need it */}
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
                        const updated = products.map((item) => item.id === editingProduct.id ? editingProduct : item);
                        setProducts(updated);
                        localStorage.setItem('cyberport_products', JSON.stringify(updated));
                        setEditingProduct(null);
                        triggerToast(`Updated ${editingProduct.name} successfully`, 'success');
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg uppercase tracking-wider cursor-pointer font-sans"
                    >
                      Save Product Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7b. ADMINISTRATIVE SECURITY LOCKED SCREEN FALLBACK */}
        {view === 'admin' && (!currentUser || currentUser.role !== 'admin') && (
          <div id="admin-lock-screen" className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-950/80 border border-rose-500/40 rounded-full flex items-center justify-center mx-auto text-rose-400 shadow-xl glow-pink">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">Bypassed Security Protocol</h2>
              <span className="text-xs bg-rose-950 text-rose-400 font-mono font-bold px-3 py-1 rounded-full border border-rose-500/30 inline-block uppercase">
                ADMIN PRIVILEGES REQUIRED
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently signed in with standard User tier roles. Access to customer listings, database parameters, and live user profile hosting is protected.
              </p>
            </div>

            <div className="bg-slate-950/85 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                You should Sign Up to have Admin page
              </span>
              <button
                onClick={() => {
                  setAuthIsSignUp(true);
                  setView('auth');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg hover:scale-103"
              >
                🔐 Sign Up
              </button>
            </div>
          </div>
        )}

        {/* 8. DEDICATED FULL-PAGE AI ASSISTANT HUB */}
        {view === 'ai' && (
          <div id="dedicated-ai-hub" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: Interactive Chat Terminal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#00f0ff] tracking-tight font-mono uppercase flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                    <span>Gemini Core AI Assistant</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Real-time LLM model diagnostics, smart recommendations & dispatch logs</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
                </div>
              </div>

              {/* Chat Window */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 h-[500px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-pink-500/1 to-transparent pointer-events-none cyber-grid-blue opacity-25" />
                
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end w-full' : 'items-start'}`}>
                      {msg.sender === 'user' ? (
                        <div className="flex flex-col items-end w-full space-y-1">
                          {/* Username at the top */}
                          <span className="text-[10px] font-bold text-[#ff4fa8] tracking-wider font-mono mr-10 uppercase">
                            {currentUser?.name || currentUser?.email?.split('@')[0] || "Operator Guest"}
                          </span>
                          
                          {/* Row with Message Bubble and Profile Image */}
                          <div className="flex items-start gap-2.5 justify-end w-full max-w-[85%]">
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
                        <div className="flex gap-3 justify-start w-full">
                          {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4 text-pink-400" />
                            </div>
                          )}
                          <div className="max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed font-mono bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none">
                            <p>{msg.text}</p>
                            <span className="text-[8px] text-slate-500 mt-1 block text-right">{formatMessageTime(msg.date, msg.timestamp)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form submit */}
                <form onSubmit={handleAiQuery} className="flex gap-2 border-t border-slate-800 pt-3 relative z-10">
                  <div className="relative flex-1 flex items-center gap-2">
                    <button
                      type="button"
                      id="ai-chat-voice-toggle"
                      onClick={() => {
                        setIsAiVoiceEnabled(!isAiVoiceEnabled);
                        triggerToast(
                          !isAiVoiceEnabled ? "AI voice readout activated!" : "AI voice readout deactivated",
                          "success"
                        );
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isAiVoiceEnabled
                          ? 'bg-pink-500/10 border-pink-500/40 text-pink-400 hover:bg-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.15)]'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                      }`}
                      title={isAiVoiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
                    >
                      {isAiVoiceEnabled ? <Volume2 className="w-4 h-4 animate-bounce text-pink-500" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    </button>
                    <div className="relative flex-1 flex items-center">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask Gemini about latest sports gears, delivery tracking, coupons or system logs..."
                        className="w-full bg-slate-900 border border-slate-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/30 text-white rounded-xl pl-4 pr-10 outline-none py-3 text-xs"
                      />
                      <button
                        type="button"
                        onClick={toggleListening}
                        title="Speak query"
                        className={`absolute right-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isListening 
                            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {isListening ? <StopCircle className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-5 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              {/* Prompt Presets Grid */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">⚡ QUICK DEMO PROMPTS (Click to Ask)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { text: "Recommend technology running shoes", desc: "List top items with specs and pricing." },
                    { text: "How does the microservice instant delivery work?", desc: "Learn about the automatic license key daemon." },
                    { text: "Check my affiliate commission status", desc: "Get live commission metrics from the system." },
                    { text: "How can I host my own custom product?", desc: "Instructions for uploading a personal gear listing." }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiInput(p.text);
                      }}
                      className="text-left p-3 bg-slate-900/60 border border-slate-800 hover:border-[#00f0ff]/50 rounded-2xl hover:bg-slate-900 transition-all cursor-pointer group"
                    >
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-pink-400 block">{p.text}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant Diagnostic & Logs System */}
            <div className="space-y-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                <div>
                  <h3 className="font-mono text-xs font-black text-slate-300 uppercase tracking-wider">Gemini System Parameters</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Model metadata & performance statistics</p>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Selected Model</span>
                    <span className="text-indigo-400 font-bold bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/30">gemini-3.5-flash</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Max Tokens</span>
                    <span className="text-slate-300">8,192 Tokens</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Avg Response Time</span>
                    <span className="text-pink-400 font-bold">124ms</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Context Memory</span>
                    <span className="text-emerald-400">Sliding Window Persistent</span>
                  </div>
                </div>

                {/* Microservice Diagnostic State Tickers */}
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">Live AI Microservice Logs</h4>
                  <div className="p-3 bg-black rounded-xl border border-slate-900 font-mono text-[9px] text-pink-500/90 h-40 overflow-y-auto space-y-1.5 scrollbar-none">
                    {microservicesLogs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed">{log}</p>
                    ))}
                    <div className="w-1 h-3 bg-pink-500 inline-block animate-pulse"></div>
                  </div>
                </div>

                {/* Commission and Store stats widget */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-3 text-center">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Affiliate Partner Stats</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-500 block">Affiliate Income</span>
                      <span className="text-sm font-black text-pink-400">${affiliateEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. INTERACTIVE SUPPORT CHAT HUB */}
        {view === 'chat' && (
          <div id="dedicated-chat-hub" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200">
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
                        avatar: weixinImage,
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
                            avatar: weixinImage
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
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
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
          </div>
        )}
      </main>

      {/* FLOATING CHATBOT BAR - STORE AI ASSISTANT */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer border relative ${
            theme === 'cyberpunk' 
              ? 'bg-black border-[#00f0ff] text-[#00f0ff] glow-cyan animate-cyber-pulse' 
              : 'bg-indigo-600 border-indigo-400 text-white'
          }`}
          title="Open AI Store Concierge"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        </button>

        {isAiOpen && (
          <div className={`absolute bottom-16 left-0 w-80 sm:w-96 rounded-3xl border shadow-2xl p-4 flex flex-col justify-between h-96 z-50 font-mono text-xs ${
            theme === 'day' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-pink-500/40 text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#00f0ff]" />
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
                <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1 cyber-scroll">
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
                      className={`absolute right-2 p-1.5 rounded-lg transition-colors cursor-pointer ${
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

            {/* Delivery Code Display Card with spring animations */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-[#00f0ff]/30 rounded-2xl p-4 text-center space-y-3">
              <p className="text-[10px] uppercase font-bold text-[#00f0ff] tracking-widest">DISPATCHED DIGITAL LICENSE / SERIAL ACCESS KEY</p>
              <p className="text-xl font-bold font-mono tracking-widest text-white selection:bg-pink-500 select-all border border-[#00f0ff]/20 bg-black/60 py-2.5 rounded-lg">
                {deliveryKey}
              </p>
              <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Authorized activation key. Guard this credential securely.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(deliveryKey);
                  triggerToast("Activation Key copied to your clipboard!", "success");
                }}
                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg glow-pink cursor-pointer"
              >
                Copy Dispatch Code
              </button>
              
              <button
                onClick={() => { setIsDeliveryLogOpen(false); setDeliveryProduct(null); }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
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
    </div>
  );
}
