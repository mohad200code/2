/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle,
  TrendingUp,
  Upload,
  Shield,
  ArrowRight,
  Lock,
  Gift,
  MessageSquare
} from 'lucide-react';

import { Product, User as UserType, Order, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, CATEGORIES } from './mockData';
import { ProductSVG } from './components/ProductSVG';
import { ClerkAuth } from './components/ClerkAuth';
import { CheckoutWizard } from './components/CheckoutWizard';
import { AdminOverview } from './components/AdminOverview';
import { AdminUsers } from './components/AdminUsers';

// Translation Dictionaries for English, Chinese, and Arabic
const translations = {
  en: {
    storeName: "NIKE CYBERPORTAL",
    home: "Storefront",
    cart: "Cart",
    admin: "Partner Hub",
    orders: "My Orders",
    wallet: "Cyber Wallet",
    affiliate: "Affiliate Hub",
    addProd: "Host Product",
    searchPlaceholder: "Search exclusive athlete gear...",
    all: "All Gear",
    tshirts: "T-Shirts",
    shoes: "Shoes",
    jackets: "Jackets",
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
    storeName: "耐克智能控制中心",
    home: "数码商城",
    cart: "购物车",
    admin: "合作伙伴中心",
    orders: "订单状态追踪",
    wallet: "电子钱包",
    affiliate: "分销佣金系统",
    addProd: "发布新产品",
    searchPlaceholder: "搜索专属前沿装备...",
    all: "全部装备",
    tshirts: "潮牌T恤",
    shoes: "科技跑鞋",
    jackets: "防风夹克",
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
    storeName: "بوابة نايكي الرقمية",
    home: "المتجر",
    cart: "السلة",
    admin: "لوحة التحكم",
    orders: "طلباتي الرياضية",
    wallet: "المحفظة الرقمية",
    affiliate: "التسويق بالعمولة",
    addProd: "إضافة منتج حصرى",
    searchPlaceholder: "ابحث عن ملابس رياضية...",
    all: "كل المعدات",
    tshirts: "تيشيرتات",
    shoes: "أحذية رياضية",
    jackets: "سترات واقية",
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
  const [adminSubView, setAdminSubView] = useState<'overview' | 'users'>('overview');
  const [authIsSignUp, setAuthIsSignUp] = useState<boolean>(false);

  // Multi-Language Support
  const [language, setLanguage] = useState<'en' | 'zh' | 'ar'>('en');

  // Dynamic Styles (Day / Night / Cyberpunk)
  const [theme, setTheme] = useState<'day' | 'night' | 'cyberpunk'>('cyberpunk');

  // Main Database States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Selected details targets
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(null);
  const [customEngravingName, setCustomEngravingName] = useState<string>('');
  const [detailQty, setDetailQty] = useState(1);

  // Store filter/search state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Interactive product card color overrides
  const [productColorOverrides, setProductColorOverrides] = useState<Record<string, { name: string; value: string }>>({});

  // Slide-out Drawer for Admin: Add Product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isProductDragging, setIsProductDragging] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    category: 'T-shirts',
    sizes: [] as string[],
    colors: [] as { name: string; value: string }[],
    image: 'tshirt'
  });

  // User Dropdown menu overlay
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // System Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // User Authentication Context (Supports Signup / Login simulation)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'admin' | 'user' } | null>({
    email: 'mohabmohnad9@gmail.com',
    role: 'admin',
  });

  // Wallet System States
  const [walletBalance, setWalletBalance] = useState<number>(550.00);

  // Affiliate System States
  const [affiliateCode, setAffiliateCode] = useState<string>('MOHAB-CYBER-99');
  const [referralsCount, setReferralsCount] = useState<number>(4);
  const [affiliateEarnings, setAffiliateEarnings] = useState<number>(100.00);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState<boolean>(false);

  // Change Profile Image States
  const [profileImage, setProfileImage] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100');
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<boolean>(false);
  const [newAvatarInput, setNewAvatarInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Google OAuth & Real Gmail API dispatch states
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string; picture: string } | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string>('');

  // Reviews System Local Memory
  const [reviewsDB, setReviewsDB] = useState<Record<string, Product['reviews']>>({});

  // Review Input Form
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  // Automated Delivery & Chat Bot simulation
  const [deliveryLogs, setDeliveryLogs] = useState<string[]>([]);
  const [isDeliveryLogOpen, setIsDeliveryLogOpen] = useState<boolean>(false);
  const [deliveryProduct, setDeliveryProduct] = useState<Product | null>(null);
  const [deliveryKey, setDeliveryKey] = useState<string>('');

  // AI Store Assistant Floating chatbot states
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; date: string }[]>([
    { sender: 'ai', text: "Welcome to Nike Cyberport! I am your AI automated product concierge. Ask me for recommendations, search current inventory, or request affiliate metrics!", date: new Date().toLocaleTimeString() }
  ]);

  // Dedicated Customer Support Chat States
  const [activeAgent, setActiveAgent] = useState<'elena' | 'marcus' | 'sora'>('elena');
  const [chatInputs, setChatInputs] = useState<Record<'elena' | 'marcus' | 'sora', string>>({
    elena: '',
    marcus: '',
    sora: '',
  });
  const [chatIsTyping, setChatIsTyping] = useState<boolean>(false);
  const [chatHistories, setChatHistories] = useState<Record<'elena' | 'marcus' | 'sora', { sender: 'user' | 'agent'; text: string; date: string }[]>>({
    elena: [
      { sender: 'agent', text: "Hello! I'm Elena, lead Dispatch & Logistics Engineer here. If you just placed an order and need your automated microservice dispatch license key, or want me to trace your simulation logs, let me know! How can I assist you today?", date: new Date().toLocaleTimeString() }
    ],
    marcus: [
      { sender: 'agent', text: "Hi! I'm Marcus from billing and store operations. I can assist you with coupon questions, refund requests, or switching your account tiers. What's on your mind?", date: new Date().toLocaleTimeString() }
    ],
    sora: [
      { sender: 'agent', text: "Hey sports fan! Sora here, your premium cyber sports guide. I'm an expert on sizes, custom fits, and which gears (T-shirts, running shoes, or Jackets) will maximize your neo-athletic performance. Let's find your perfect gear!", date: new Date().toLocaleTimeString() }
    ]
  });

  const handleSupportMessageSubmit = (e: React.FormEvent, agentId: 'elena' | 'marcus' | 'sora') => {
    e.preventDefault();
    const currentInput = chatInputs[agentId].trim();
    if (!currentInput) return;

    // Reset current input
    setChatInputs(prev => ({ ...prev, [agentId]: '' }));

    // Add user message
    const userMsgObj = { sender: 'user' as const, text: currentInput, date: new Date().toLocaleTimeString() };
    setChatHistories(prev => ({
      ...prev,
      [agentId]: [...prev[agentId], userMsgObj]
    }));

    setChatIsTyping(true);

    // Dynamic reply based on agent persona
    setTimeout(() => {
      setChatIsTyping(false);
      let replyText = "I received your packet of info! Our digital microservices are evaluating your parameters. Let me know if you want me to coordinate anything else!";
      const cleaned = currentInput.toLowerCase();

      if (agentId === 'elena') {
        if (cleaned.includes('key') || cleaned.includes('code') || cleaned.includes('delivery') || cleaned.includes('order')) {
          replyText = "I see! If you've placed an order, please check the 'Simulated Inbox' at the top, or view the 'Orders Tracker' tab. The instant-delivery daemon dispatches license keys immediately to your email inbox, formatted as `NK-KEY-XXXXX-BULK`!";
        } else if (cleaned.includes('log') || cleaned.includes('error') || cleaned.includes('diagnose')) {
          replyText = "Reviewing gateway diagnostics... I see we have 0 errors and all microservice clusters are operating on green. Your current local session telemetry is completely healthy!";
        } else {
          replyText = "Understood. As logistics coordinator, I guarantee zero latency on your digital gear keys. Ask me about delivery logs, simulation status, or key activation anytime!";
        }
      } else if (agentId === 'marcus') {
        if (cleaned.includes('wallet') || cleaned.includes('money') || cleaned.includes('balance') || cleaned.includes('credit')) {
          replyText = "We have transitioned away from the Cyber Wallet payment model. You can now use our secure, streamlined checkout with any simulated credit card directly!";
        } else if (cleaned.includes('admin') || cleaned.includes('role') || cleaned.includes('access')) {
          replyText = "Aha! You can enter the full Admin Controls dashboard using the tab above. If your account doesn't have permissions, you can switch role via the profile avatar dropdown in the upper right, or click the bypass button in the Admin lock page.";
        } else {
          replyText = "Thanks for checking in! If you have coupon codes or credit card payment query issues, rest assured that our secure double-entry digital ledger handles state changes atomically. No user data is lost.";
        }
      } else if (agentId === 'sora') {
        if (cleaned.includes('shoe') || cleaned.includes('run') || cleaned.includes('size')) {
          replyText = "Awesome choice! Our 'Nike Air Max 270' has extra shock absorption, and fits true to size. If you want a more responsive racing feel, go for the 'Nike Ultraboost Pulse'!";
        } else if (cleaned.includes('jacket') || cleaned.includes('weather') || cleaned.includes('jacket')) {
          replyText = "For wind and light rain protection, the Puma Ultra Warm Zip has specialized insulation. Under Armour StormFleece is ideal for flexible high-velocity workouts because of its light dynamic cut!";
        } else {
          replyText = "Excellent. Remember that high-fidelity athletic gears deserve high-fidelity style. Switch between the Day, Night, and Cyberpunk themes to match your personal vibe!";
        }
      }

      setChatHistories(prev => ({
        ...prev,
        [agentId]: [
          ...prev[agentId],
          { sender: 'agent', text: replyText, date: new Date().toLocaleTimeString() }
        ]
      }));
    }, 1200);
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
    setCustomEngravingName('');
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || '');
      setSelectedColor(selectedProduct.colors[0] || null);
    }
  }, [selectedProduct]);

  // 1. Fetch Google Client ID from backend
  useEffect(() => {
    fetch("/api/google-client-id")
      .then(res => res.json())
      .then(data => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
        }
      })
      .catch(err => console.error("Error loading Google Client ID:", err));
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
    if (!googleToken) {
      console.log("[GMAIL DISPATCH] Gmail API is not active. (Sign in with Google to enable real email notifications)");
      return;
    }

    const toEmail = currentUser?.email || order.address.email || "mohabmohnad9@gmail.com";
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
    setOrders(prev => [mockOrder, ...prev]);

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
      userName: currentUser ? currentUser.email.split('@')[0] : "Anonymous Athlete",
      userAvatar: profileImage,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    // Update reviews list in state
    const currentReviews = reviewsDB[selectedProduct.id] || selectedProduct.reviews || [];
    const updatedReviews = [reviewObj, ...currentReviews];
    
    setReviewsDB({
      ...reviewsDB,
      [selectedProduct.id]: updatedReviews
    });

    triggerToast("Your review and star ratings have been published!", "success");
    setNewComment('');
  };

  // Storefront Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

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

    if (!newProductForm.name || !newProductForm.price) {
      triggerToast('Name and Price are required!', 'error');
      return;
    }

    const priceNum = parseFloat(newProductForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please specify a valid numeric price!', 'error');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name,
      description: newProductForm.description || 'Custom added Nike sportswear crafted by athletes.',
      shortDescription: newProductForm.shortDescription || 'Exclusive athletic design.',
      price: priceNum,
      category: newProductForm.category,
      sizes: newProductForm.sizes.length > 0 ? newProductForm.sizes : ['S', 'M', 'XL'],
      colors: newProductForm.colors.length > 0 ? newProductForm.colors : [{ name: 'black', value: '#1E293B' }],
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
      name: '',
      shortDescription: '',
      description: '',
      price: '',
      category: 'T-shirts',
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
    setAiMessages(prev => [...prev, userMsgObj]);

    // Simple robust local AI response logic with Arabic and Chinese character set checkers
    setTimeout(() => {
      const cleaned = userMsg.toLowerCase();

      // Detect input language
      const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(userMsg);
      const isChinese = /[\u4e00-\u9fa5]/.test(userMsg);
      const detectedLang: 'en' | 'ar' | 'zh' = isArabic ? 'ar' : isChinese ? 'zh' : 'en';

      let aiText = "";

      // Check keyword concepts across English, Arabic and Chinese
      const isShoes = 
        cleaned.includes('shoe') || cleaned.includes('sneaker') || cleaned.includes('run') || cleaned.includes('footwear') ||
        cleaned.includes('حذاء') || cleaned.includes('احذيه') || cleaned.includes('جري') || cleaned.includes('سبورت') ||
        cleaned.includes('鞋') || cleaned.includes('跑鞋') || cleaned.includes('运动鞋') || cleaned.includes('靴');

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
          aiText = "بناءً على طلبك، أنصحك بـ Nike Ultraboost Pulse (تقييم 4.9، 3,280 مشتري) و Nike Air Max 270 (تقييم 4.9، 4,210 مشتري). تتميز بوسائد مرنة للغاية وراحة تامة لممارسة الجري. هل تود أن أفتح لك صفحة تفاصيل المنتج؟";
        } else if (detectedLang === 'zh') {
          aiText = "根据您的需求，我推荐 Nike Ultraboost Pulse (评分 4.9, 3,280 人购买) 和 Nike Air Max 270 (评分 4.9, 4,210 人购买)。它们具有高回弹物理避震技术。需要我为您打开商品详情页吗？";
        } else {
          aiText = "Based on your prompt, I recommend the Nike Ultraboost Pulse (4.9 Rating, 3,280 buyers) and the Nike Air Max 270 (4.9 Rating, 4,210 buyers). They feature high spring physics cushioning. Would you like me to open their detail page?";
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
          aiText = "مرحباً بك! أهلاً بك في المساعد الذكي لبوابة نايكي الرقمية. كيف يمكنني مساعدتك في العثور على المعدات والملابس الرياضية المثالية اليوم؟";
        } else if (detectedLang === 'zh') {
          aiText = "你好！欢迎来到耐克智能助手。今天有什么我可以帮您挑选或咨询的运动装备吗？";
        } else {
          aiText = "Hello! Welcome to Nike Cyberport AI Concierge. How can I help you discover the perfect gear today?";
        }
      } else {
        if (detectedLang === 'ar') {
          aiText = "لقد قمت بمعالجة طلبك باستخدام البحث العصبي القياسي. يمكنني التوصية بأفضل المنتجات أو التحقق من أكواد الإحالة أو الرصيد! جرب كتابة 'أحذية'، 'سترات'، 'محفظة'، أو 'شريك'.";
        } else if (detectedLang === 'zh') {
          aiText = "我已使用标准神经搜索处理了您的请求。我可以为您推荐热门商品、检查钱包余额或查看分销指标！试着输入 '跑鞋'、'夹克'、'钱包' 或 '分销'。";
        } else {
          aiText = "I processed your request using standard neural search. I can recommend top items, check wallet balances or verify affiliate metrics! Try typing 'shoes', 'jackets', 'wallet', or 'affiliate'.";
        }
      }

      setAiMessages(prev => [...prev, {
        sender: 'ai',
        text: aiText,
        date: new Date().toLocaleTimeString()
      }]);
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out successfully', 'success');
    setView('store');
    setIsProfileDropdownOpen(false);
  };

  const handleAuthSuccess = (email: string) => {
    const isAdmin = email.includes('admin') || email === 'lamadevtest@gmail.com' || email === 'mohabmohnad9@gmail.com';
    setCurrentUser({ email, role: isAdmin ? 'admin' : 'user' });
    triggerToast(`Signed in successfully as ${email}! Welcome to Nike Cyberport!`, 'success');
    setView('store');
  };

  // Copy referral invite helper
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://sdazum.nike.cyberport/invite?ref=${affiliateCode}`);
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
    setProfileImage(newAvatarInput.trim());
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
          ? 'bg-slate-50 text-slate-800' 
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
            className="text-xl font-black tracking-tighter flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className={`px-2.5 py-1 rounded-xl text-sm font-bold shadow-md transition-colors ${
              theme === 'cyberpunk' ? 'bg-pink-500 text-white' : 'bg-slate-900 text-white'
            }`}>SD</span>
            <span className="uppercase font-mono tracking-widest text-lg">sdazum</span>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <button 
              onClick={() => setIsAddProductOpen(true)}
              className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                theme === 'cyberpunk' 
                  ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addProd}</span>
            </button>
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
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="font-mono text-[9px] text-pink-500 font-bold tracking-widest">CONNECTED PROFILE</p>
                      <p className="font-bold text-slate-200 truncate mt-0.5">{currentUser.email}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-[#00f0ff] font-semibold uppercase">
                          {currentUser.role} Account
                        </span>
                        <button
                          onClick={() => {
                            const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
                            setCurrentUser({ ...currentUser, role: newRole });
                            triggerToast(`Switched role to ${newRole.toUpperCase()}!`, 'success');
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-750 text-[#00f0ff] text-[9px] font-bold rounded-lg border border-[#00f0ff]/30 cursor-pointer"
                        >
                          Switch Role
                        </button>
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
                        setIsAffiliateModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 font-bold text-slate-300 flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span>{t.affiliate}</span>
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
          <span>Live Customer Chat</span>
          <span className="px-1.5 py-0.5 bg-pink-500 text-white rounded text-[8px] font-bold">LIVE</span>
        </button>

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
      <main className="flex-1 relative z-10">

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
                    {theme === 'cyberpunk' ? '📟 NEO-ATHLETE PROTOCOL' : 'Season Promo Pack'}
                  </span>
                  <h1 id="hero-heading" className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase font-mono">
                    {theme === 'cyberpunk' ? "HYPER DISPATCH" : "CHAMPIONSHIP"} <br />
                    <span className={theme === 'cyberpunk' ? 'text-[#00f0ff]' : 'text-slate-800'}>LEVELS.</span>
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                    Elevate your biomechanics with customizable athlete gear, instant automated delivery, and direct peer-to-peer catalog listing.
                  </p>
                  
                  {/* Action triggers */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => setActiveCategory('Shoes')}
                      className={`px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer ${
                        theme === 'cyberpunk' 
                          ? 'bg-pink-500 text-white hover:bg-pink-600 glow-pink' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Shop Sneakers
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
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"
                      alt="Hero Sneaker"
                      className="w-full h-full object-contain mix-blend-screen"
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
                <h3 className={`font-black text-lg tracking-tight uppercase ${theme === 'cyberpunk' ? 'text-[#00f0ff]' : 'text-slate-900'}`}>
                  {t.all}
                </h3>
                {currentUser && (
                  <p className="text-xs text-slate-500">Logged in: {currentUser.email} (You can add custom gear!)</p>
                )}
              </div>
              
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer uppercase ${
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
            </section>

            {/* PRODUCT CATALOG GRID */}
            <section id="products-grid-catalog" className="max-w-7xl mx-auto px-4">
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
                            theme === 'cyberpunk' ? 'text-[#00f0ff]' : 'text-slate-900'
                          }`}
                        >
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-8">
                          {p.shortDescription}
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
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setSelectedProduct(p); setView('product-details'); }}
                            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 rounded-lg text-[#00f0ff] hover:text-white transition-colors cursor-pointer text-xs font-bold"
                            title="View reviews & details"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* 2. PRODUCT DETAILS SECTION WITH CUSTOM REVIEWS AND WALLET ORDERING */}
        {view === 'product-details' && selectedProduct && (
          <div id="product-details-page" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200">
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
                  <>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-auto max-h-[600px] object-cover rounded-[32px] hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {customEngravingName && (
                      <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-fade-in z-20">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-pink-400 font-mono tracking-widest block">NIKE ID PERSONALIZATION</span>
                          <span className="text-sm font-black text-white font-mono tracking-wider uppercase block">{customEngravingName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-[#00f0ff] font-mono block">LASER ENGRAVED</span>
                          <span className="text-[9px] text-slate-500 font-mono block">READY FOR DISPATCH</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-900/60 rounded-[32px] p-12 flex items-center justify-center min-h-[400px] border border-pink-500/20 w-full relative">
                    <ProductSVG type={selectedProduct.image} color={selectedColor?.value || '#f43f5e'} className="w-56 h-56" />
                    {customEngravingName && (
                      <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-fade-in z-20">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-pink-400 font-mono tracking-widest block">NIKE ID PERSONALIZATION</span>
                          <span className="text-sm font-black text-white font-mono tracking-wider uppercase block">{customEngravingName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-[#00f0ff] font-mono block">LASER ENGRAVED</span>
                          <span className="text-[9px] text-slate-500 font-mono block">READY FOR DISPATCH</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Configurations Panel */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 font-mono font-bold uppercase border border-pink-500/30 px-3 py-1 rounded-full inline-block">
                    {selectedProduct.category}
                  </span>
                  <h2 id="details-title" className="text-3xl font-black text-[#00f0ff] leading-tight font-mono">
                    {selectedProduct.name}
                  </h2>
                  
                  {/* Rating summary and buyers list count */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-[#00f0ff] font-bold font-mono">5.0 Overall Rating</span>
                    <span className="text-slate-400 font-mono text-[11px] ml-2">
                      🔥 {selectedProduct.salesCount || Math.floor(selectedProduct.price * 3.4) + 120} {t.peopleBought}
                    </span>
                  </div>
                </div>

                <p id="details-price" className="text-3xl font-black text-pink-400 font-mono">
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <p id="details-description" className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Configurations parameters */}
                <div className="space-y-5 pt-4 border-t border-slate-800">
                  
                  {/* Sizes buttons selection */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Select Size</span>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((sz) => {
                        const isS = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-4 py-2 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer ${
                              isS
                                ? 'bg-pink-500 text-white border-pink-500 shadow-lg glow-pink'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-pink-500/40'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors bubble option */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Select Color</span>
                    <div className="flex gap-2.5">
                      {selectedProduct.colors.map((c) => {
                        const isC = selectedColor?.name === c.name;
                        return (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c)}
                            className={`w-7 h-7 rounded-full border cursor-pointer transition-all ${
                              isC ? 'ring-2 ring-[#00f0ff] scale-110 shadow-sm' : 'border-slate-850'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Personalization name option */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/55">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <span className="text-[#00f0ff]">⚡</span> Personalize / Custom Name
                      </span>
                      <span className="text-[9px] text-pink-500 font-mono font-bold uppercase tracking-wider">Nike ID Custom</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={20}
                        placeholder="Type name (e.g., Mohab, Cyber-Runner)"
                        value={customEngravingName}
                        onChange={(e) => setCustomEngravingName(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/30 transition-all"
                      />
                      {customEngravingName && (
                        <button 
                          onClick={() => setCustomEngravingName('')}
                          className="absolute right-3 top-2.5 text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                        >
                          Clear
                        </button>
                      )}
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
            <div className="mt-16 bg-slate-950/80 rounded-[32px] p-8 border border-pink-500/20 space-y-8">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-mono text-[#00f0ff] uppercase flex items-center gap-2">
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
                  (reviewsDB[selectedProduct.id] || selectedProduct.reviews || []).map((rev) => (
                    <div key={rev.id} className="bg-black/40 p-5 rounded-2xl border border-slate-850/60 flex gap-4">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-pink-500/40"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#00f0ff] font-mono">{rev.userName}</span>
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
                  ))
                )}
              </div>

              {/* Leave a review Form */}
              <div className="bg-black/60 p-6 rounded-2xl border border-pink-500/25">
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
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl outline-none focus:border-pink-500"
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
              setOrders([newOrder, ...orders]);
              
              // Apply wallet deduction of checkout total
              if (walletBalance >= newOrder.total) {
                setWalletBalance(prev => prev - newOrder.total);
                triggerToast("Order authorized successfully using Wallet system!", "success");
              } else {
                triggerToast("Charged via Credit Card successfully!", "success");
              }

              // Run digital dispatch for orders with digital items
              const generatedKey = `NK-KEY-${Math.floor(Math.random() * 899999) + 100000}-BULK`;
              setDeliveryProduct(products[0]);
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
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-[#00f0ff] tracking-tight font-mono uppercase">Your Order History</h2>
              <p className="text-xs text-slate-400 font-mono">Review real-time microservice shipping and automation metrics</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/80 rounded-3xl border border-pink-500/20 shadow-sm space-y-4">
                <p className="text-4xl">📦</p>
                <h3 className="text-sm font-bold text-slate-500 font-mono uppercase">You have no active orders yet.</h3>
                <button onClick={() => setView('store')} className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-mono font-bold glow-pink">
                  Browse Store Catalog
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
                        <th className="py-4 px-4">Products</th>
                        <th className="py-4 px-4">Instant Key</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-pink-400">
                            #{o.id.substr(0, 10)}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {o.date}
                          </td>
                          <td className="py-4 px-4">
                            <ul className="list-inside space-y-1 text-[11px]">
                              {o.products.map((item, idx) => (
                                <li key={idx} className="list-none">
                                  • <span className="font-medium text-slate-200">{item.name}</span> <span className="font-bold text-[#00f0ff]">(x{item.quantity})</span>
                                  {item.customName && (
                                    <div className="text-[10px] text-pink-400 font-mono mt-0.5 pl-3">
                                      ↳ Laser Engraved: <span className="text-white font-bold bg-pink-500/15 px-1.5 py-0.5 rounded border border-pink-500/20">{item.customName}</span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-indigo-950/80 text-indigo-400 font-bold px-2 py-1 rounded border border-indigo-500/30 text-[10px]">
                              NK-{o.id}-ACTIVE
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#00f0ff]">
                            ${o.total.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
                              <span>Automated Delivery</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
          <div id="admin-panel-layout" className="flex bg-[#0f111a] text-slate-100 min-h-[calc(100vh-4rem)]">
            <aside id="admin-sidebar" className="w-64 bg-[#0a0b10] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 hidden md:flex font-sans">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 px-2 pb-2 border-b border-slate-800/60">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">L</div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight text-white block">John Doe</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">Admin</span>
                  </div>
                </div>
 
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2">Application</p>
                    <button
                      onClick={() => setAdminSubView('overview')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        adminSubView === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Home className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Home Overview</span>
                    </button>
                  </div>
 
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2">E-Commerce</p>
                    <button
                      onClick={() => setIsAddProductOpen(true)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer text-left"
                    >
                      <PlusCircle className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Add Product</span>
                    </button>
                    <button
                      onClick={() => setAdminSubView('users')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        adminSubView === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Users className="w-4.5 h-4.5 text-indigo-400" />
                      <span>See All Users</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
 
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-5xl">
              <div id="admin-subheader" className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                    {adminSubView === 'overview' ? 'DASHBOARD PORTAL' : 'CUSTOMER DIRECTORY'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>Create Product</span>
                </button>
              </div>
 
              {adminSubView === 'overview' ? (
                <AdminOverview products={products} orders={orders} />
              ) : (
                <AdminUsers 
                  users={users} 
                  onDeleteUsers={(ids) => setUsers(users.filter(u => !ids.includes(u.id)))} 
                  onAddUser={(newUser) => setUsers([newUser, ...users])}
                  onToast={triggerToast} 
                />
              )}
            </div>
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
                    <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-pink-400" />
                        </div>
                      )}
                      <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed font-mono ${
                        msg.sender === 'user'
                          ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-tr-none'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="text-[8px] text-slate-500 mt-1 block text-right">{msg.date}</span>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <UserIcon className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form submit */}
                <form onSubmit={handleAiQuery} className="flex gap-2 border-t border-slate-800 pt-3 relative z-10">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask Gemini about latest sports gears, delivery tracking, coupons or system logs..."
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/30 text-white rounded-xl px-4 outline-none py-3 text-xs"
                  />
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
          <div id="dedicated-chat-hub" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-200 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Sidebar Left Column: Agent Selector */}
            <div className="md:col-span-1 space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider">Select Support Expert</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Automated high-fidelity assistance channels</p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'elena' as const,
                    name: 'Elena (Logistics Tech)',
                    title: 'Dispatch & Terminal Keys',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
                    online: true
                  },
                  {
                    id: 'marcus' as const,
                    name: 'Marcus (Billing & Ops)',
                    title: 'Wallets & Access Rules',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
                    online: true
                  },
                  {
                    id: 'sora' as const,
                    name: 'Sora (Sports Guide)',
                    title: 'Gear Specs & Fits Expert',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                    online: true
                  }
                ].map((agent) => {
                  const isSelected = activeAgent === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setActiveAgent(agent.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 border-[#00f0ff] shadow-lg shadow-[#00f0ff]/10 scale-102' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="relative">
                        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-100 text-xs block truncate">{agent.name}</span>
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
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={
                        activeAgent === 'elena' 
                          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
                          : activeAgent === 'marcus'
                            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                      } 
                      alt={activeAgent} 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                        {activeAgent === 'elena' ? 'Elena (Logistics Coordinator)' : activeAgent === 'marcus' ? 'Marcus (Store Account Manager)' : 'Sora (Sports Gear Specialist)'}
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-mono">Typically replies in real-time</p>
                    </div>
                  </div>
                  
                  <span className="bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono font-bold px-3 py-1 rounded-xl">
                    Channel ID: #{activeAgent.toUpperCase()}-SIM
                  </span>
                </div>

                {/* Message Histories */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
                  {chatHistories[activeAgent].map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-xs font-mono leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="text-[8px] text-slate-500 mt-1 block text-right">{msg.date}</span>
                      </div>
                    </div>
                  ))}
                  
                  {chatIsTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 font-mono rounded-tl-none flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[10px] text-slate-500 ml-1">agent is typing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Controls */}
                <form onSubmit={(e) => handleSupportMessageSubmit(e, activeAgent)} className="flex gap-2 border-t border-slate-800 pt-3 relative z-10">
                  <input
                    type="text"
                    value={chatInputs[activeAgent]}
                    onChange={(e) => setChatInputs(prev => ({ ...prev, [activeAgent]: e.target.value }))}
                    placeholder={`Message ${activeAgent === 'elena' ? 'Elena' : activeAgent === 'marcus' ? 'Marcus' : 'Sora'}...`}
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-pink-500 text-slate-200 rounded-xl px-4 outline-none py-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>

              </div>
            </div>

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
                  <p className="text-[9px] text-slate-500">{t.aiDescription}</p>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1 cyber-scroll">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400 rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[8px] text-slate-600 mt-0.5">{msg.date}</span>
                </div>
              ))}
            </div>

            {/* Suggested quick prompt tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 mb-2">
              {['Recommend shoes', 'Check balance', 'Affiliate code', 'Host product'].map((prompt) => (
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
              <input
                type="text"
                placeholder={t.askAi}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-pink-500 text-slate-200 rounded-xl px-3 outline-none py-2 text-[11px]"
              />
              <button
                type="submit"
                className="p-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
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
                  value={`https://sdazum.nike.cyberport/invite?ref=${affiliateCode}`}
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
            <ul className="space-y-2 font-mono">
              <li><a href="#" className="hover:text-pink-400">Digital Dispatch Node</a></li>
              <li><a href="#" className="hover:text-pink-400">Multi-Channel Help Desk</a></li>
              <li><a href="#" className="hover:text-pink-400">Stripe Payments Gateways</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">Microservices Architecture</h5>
            <ul className="space-y-2 font-mono">
              <li><a href="#" className="hover:text-pink-400">SEO Crawler Optimizer</a></li>
              <li><a href="#" className="hover:text-pink-400">Wallet System ledger</a></li>
              <li><a href="#" className="hover:text-pink-400">Dispatch Queues Daemon</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">Legal Guidelines</h5>
            <ul className="space-y-2 font-mono">
              <li><a href="#" className="hover:text-pink-400">Cryptographic Disclaimers</a></li>
              <li><a href="#" className="hover:text-pink-400">Acceptable Prototype Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 font-mono text-[9px]">
          <div>
            © {new Date().getFullYear()} NIKE CYBERPORT DESIGN SUITE. BUILT ON SECURE MICROSERVICES PROTOTYPE INFRASTRUCTURE.
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
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                  <input
                    id="new-prod-name"
                    type="text"
                    required
                    placeholder="Nike Cyber Pegasus Zoom"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Short Tagline</label>
                  <input
                    id="new-prod-short"
                    type="text"
                    placeholder="E.g., High flexibility runner built for virtual cyber-athletes."
                    value={newProductForm.shortDescription}
                    onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Full Page Description</label>
                  <textarea
                    id="new-prod-desc"
                    rows={3}
                    placeholder="Full detailed specs and performance measurements..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-850 focus:border-pink-500 rounded-xl outline-none"
                  />
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
                            if (file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setNewProductForm({
                                    ...newProductForm,
                                    image: event.target.result as string
                                  });
                                  triggerToast("Local image file processed successfully!", "success");
                                }
                              };
                              reader.readAsDataURL(file);
                            } else {
                              triggerToast("Invalid file type. Please upload an image.", "error");
                            }
                          }
                        }}
                        onClick={() => {
                          document.getElementById('browser-image-upload')?.click();
                        }}
                      >
                        {newProductForm.image.startsWith('data:image/') ? (
                          <div className="absolute inset-0 w-full h-full p-2 flex items-center justify-center bg-slate-950">
                            <img 
                              src={newProductForm.image} 
                              alt="Uploaded Preview" 
                              className="w-full h-full object-contain rounded-xl"
                            />
                            <div className="absolute bottom-2 right-2 bg-pink-500/80 px-2 py-0.5 rounded text-[8px] font-bold text-white font-mono uppercase">
                              PREVIEW
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 pointer-events-none">
                            <Upload className="w-5 h-5 mx-auto text-pink-500 animate-bounce" />
                            <p className="text-[10px] text-slate-300 font-bold">Drag & Drop Image</p>
                            <p className="text-[8px] text-slate-500">or click to browse</p>
                          </div>
                        )}
                        <input
                          id="browser-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files[0]) {
                              const file = files[0];
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setNewProductForm({
                                    ...newProductForm,
                                    image: event.target.result as string
                                  });
                                  triggerToast("Local image file loaded!", "success");
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
    </div>
  );
}
