/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Download,
  BellRing,
  PackageCheck,
  AlertTriangle,
  AlertOctagon,
  Clock,
  RefreshCw,
  Play,
  Zap,
  Eye,
  Users,
  Search,
  X,
  GripVertical,
  Mic,
  QrCode,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  LineChart,
  Cpu,
  Sparkles,
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
import { getProductImageUrl } from '../mockData';
import logoImg from '../assets/images/shandong_azum_logo.jpg';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { Html5Qrcode } from 'html5-qrcode';
import { ProductSVG } from './ProductSVG';
import { ShandongAzumLogo } from './ShandongAzumLogo';

interface AdminOverviewProps {
  products: Product[];
  orders: Order[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  telemetry?: {
    activeSessions: number;
    apiThroughput: number;
    errorsLogged: number;
    revenueData: Array<{ name: string; Total: number; Successful: number }>;
    visitorData: Array<{ name: string; Mobile: number; Desktop: number }>;
    browserData: Array<{ name: string; value: number; color: string }>;
  };
  theme?: string;
}

interface TodoItem {
  id: string;
  text: string;
  date: string;
  completed: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  category: 'Maintenance' | 'Logistics' | 'Restock';
  machineryId?: string;
  createdAt?: string;
  completedAt?: string;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ products, orders, setProducts, setOrders, telemetry, theme }) => {
  // Use passed telemetry or fall back to mock data
  const activeSessions = telemetry ? telemetry.activeSessions : 12482;
  const apiThroughput = telemetry ? `${telemetry.apiThroughput}ms` : '842ms';
  const errorsLogged = telemetry ? `${telemetry.errorsLogged.toFixed(2)}%` : '0.02%';

  // Dynamic Cognitive Financial and Product metrics
  const cognitiveFinance = useMemo(() => {
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'success' || o.status === 'delivered');
    const completedRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalOrderValue / orders.length : 0;
    
    // Top-selling SKU
    const sortedBySales = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    const topSKU = sortedBySales[0]?.name || 'Industrial Heavy Duty Machinery';
    const topSKUSales = sortedBySales[0]?.salesCount || 0;
    
    // Inventory Health & Alert
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const catalogCount = products.length;
    
    return {
      totalOrderValue,
      completedRevenue,
      avgOrderValue,
      topSKU,
      topSKUSales,
      outOfStock,
      lowStock,
      catalogCount,
      profitEstimate: totalOrderValue * 0.28 // 28% typical margin
    };
  }, [products, orders]);

  const revenueData = telemetry ? telemetry.revenueData : [
    { name: 'April', Total: 120, Successful: 98 },
    { name: 'May', Total: 210, Successful: 180 },
    { name: 'June', Total: 190, Successful: 145 },
    { name: 'July', Total: 250, Successful: 210 },
    { name: 'August', Total: 310, Successful: 285 },
    { name: 'September', Total: 340, Successful: 312 },
  ];

  const visitorData = telemetry ? telemetry.visitorData : [
    { name: 'Mon', Mobile: 140, Desktop: 220 },
    { name: 'Tue', Mobile: 180, Desktop: 290 },
    { name: 'Wed', Mobile: 230, Desktop: 340 },
    { name: 'Thu', Mobile: 170, Desktop: 310 },
    { name: 'Fri', Mobile: 290, Desktop: 410 },
    { name: 'Sat', Mobile: 380, Desktop: 480 },
    { name: 'Sun', Mobile: 210, Desktop: 320 },
  ];

  const browserData = telemetry ? telemetry.browserData : [
    { name: 'Chrome', value: 650, color: '#3B82F6' },
    { name: 'Safari', value: 280, color: '#EC4899' },
    { name: 'Firefox', value: 120, color: '#F59E0B' },
    { name: 'Other', value: 75, color: '#10B981' },
  ];

  const totalBrowserVisitors = browserData.reduce((acc, curr) => acc + curr.value, 0);

  const realTotalVisitors = useMemo(() => {
    return visitorData.reduce((acc, d) => acc + (d.Mobile || 0) + (d.Desktop || 0), 0);
  }, [visitorData]);

  // Real Machinery Shipped Volume Audit (Top 15 Items) Dataset
  const topProductsData = useMemo(() => {
    return [...products]
      .map(p => ({
        name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
        fullName: p.name,
        sales: p.salesCount !== undefined ? p.salesCount : Math.floor(Math.random() * 25 + 5),
        revenue: (p.salesCount !== undefined ? p.salesCount : 12) * p.price,
        category: p.category
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 15);
  }, [products]);

  // Price Audit deviation threshold (defaults to 20% according to user request)
  const [deviationThreshold, setDeviationThreshold] = useState<number>(20);

  const priceAuditReport = useMemo(() => {
    // 1. Group products by category and calculate sum/count
    const categoryStats: Record<string, { total: number; count: number; avg: number }> = {};
    products.forEach(p => {
      if (!p.category) return;
      const cat = p.category;
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, count: 0, avg: 0 };
      }
      categoryStats[cat].total += p.price;
      categoryStats[cat].count += 1;
    });

    // 2. Compute averages
    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avg = categoryStats[cat].total / categoryStats[cat].count;
    });

    // 3. Find deviations > threshold
    const flaggedProducts = products
      .map(p => {
        const avg = categoryStats[p.category || '']?.avg || 0;
        const diff = p.price - avg;
        const deviationPercent = avg > 0 ? (diff / avg) * 100 : 0;
        return {
          ...p,
          categoryAvg: avg,
          deviation: deviationPercent,
          absDeviation: Math.abs(deviationPercent)
        };
      })
      .filter(p => p.absDeviation > deviationThreshold)
      .sort((a, b) => b.absDeviation - a.absDeviation);

    return {
      categoryStats,
      flaggedProducts
    };
  }, [products, deviationThreshold]);

  // Real Category Sales Share Dataset
  const categorySharesData = useMemo(() => {
    const counts: Record<string, number> = {};
    let hasAnySales = false;
    products.forEach(p => {
      if (p.salesCount && p.salesCount > 0) hasAnySales = true;
    });

    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      const count = hasAnySales ? (p.salesCount || 0) : Math.floor(Math.random() * 15 + 3);
      counts[cat] = (counts[cat] || 0) + count;
    });

    const total = Object.values(counts).reduce((sum, v) => sum + v, 0) || 1;
    const colorsList = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#ef4444', '#06b6d4'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
      color: colorsList[idx % colorsList.length]
    })).sort((a, b) => b.value - a.value);
  }, [products]);

  const totalSalesUnits = useMemo(() => {
    let hasAnySales = false;
    products.forEach(p => {
      if (p.salesCount && p.salesCount > 0) hasAnySales = true;
    });
    if (!hasAnySales) {
      return categorySharesData.reduce((sum, c) => sum + c.value, 0);
    }
    return products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  }, [products, categorySharesData]);

  // ==========================================
  // AUTOMATED NOTIFICATION SYSTEM (ALERT CENTER)
  // ==========================================
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Find all low stock products (stock < 5)
  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock < 5);

  // Find all pending / processing orders
  const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'pending');

  // Build active alerts list dynamically
  const activeAlerts: Array<{
    id: string;
    type: 'low_stock' | 'new_order';
    title: string;
    message: string;
    timestamp: string;
    actionText: string;
    onAction: () => void;
  }> = [];

  lowStockProducts.forEach(p => {
    const alertId = `low-stock-${p.id}`;
    if (!dismissedAlerts.includes(alertId)) {
      activeAlerts.push({
        id: alertId,
        type: 'low_stock',
        title: `Low Stock Alert: ${p.name}`,
        message: `Product stock level fell below 5 units threshold! Current level: ${p.stock || 0} units left.`,
        timestamp: 'Real-time telemetry threshold triggered',
        actionText: 'Restock (+25 units)',
        onAction: () => {
          if (setProducts) {
            setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: (item.stock || 0) + 25 } : item));
          }
        }
      });
    }
  });

  pendingOrders.forEach(o => {
    const alertId = `new-order-${o.id}`;
    if (!dismissedAlerts.includes(alertId)) {
      activeAlerts.push({
        id: alertId,
        type: 'new_order',
        title: `New Order Received: #${o.id.substring(0, 8)}`,
        message: `A new purchase has been completed by ${o.address.name} ($${o.total.toFixed(2)}). Status: ${o.status}. Awaiting dispatch processing.`,
        timestamp: o.date ? `Placed on ${o.date}` : 'Recently placed',
        actionText: 'Ship & Fulfill Order',
        onAction: () => {
          if (setOrders) {
            setOrders(prev => prev.map(item => item.id === o.id ? { ...item, status: 'Delivered' as const } : item));
          }
        }
      });
    }
  });

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  // Telemetry Simulation Helpers
  const simulateLowStock = () => {
    if (!setProducts) return;
    const candidates = products.filter(p => p.stock === undefined || p.stock >= 5);
    if (candidates.length === 0) return;
    const randProd = candidates[Math.floor(Math.random() * candidates.length)];
    const randStock = Math.floor(Math.random() * 4) + 1; // 1 to 4 units
    setProducts(prev => prev.map(p => p.id === randProd.id ? { ...p, stock: randStock } : p));
  };

  const simulateNewOrder = () => {
    if (!setOrders || products.length === 0) return;
    const randProd = products[Math.floor(Math.random() * products.length)];
    const mockOrder = {
      id: `order-sim-${Math.random().toString(36).substring(2, 10)}`,
      total: randProd.price * 1.05,
      status: 'Processing' as const,
      date: new Date().toLocaleDateString(),
      products: [
        {
          name: randProd.name,
          quantity: 1,
          size: randProd.sizes?.[0] || 'Standard',
          color: randProd.colors?.[0]?.name || 'Factory Standard',
          price: randProd.price
        }
      ],
      address: {
        name: ['Ahmad Al-Mansour', 'Chen Wei', 'Emily Rodriguez', 'Marcus Vance', 'Sarah Jenkins'][Math.floor(Math.random() * 5)],
        email: 'logistics@azumgroup.com',
        phone: '+86 186 7828 2263',
        address: 'High-Tech Industrial Zone, Gate 4',
        city: 'Jinan, Shandong'
      }
    };
    setOrders(prev => [mockOrder, ...prev]);
  };

  // Todo List State with persistent local storage
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('azum_admin_todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load admin todos", e);
    }
    return [
      { id: 'todo-1', text: 'Calibrate Hydraulic Arms on Excavator', date: '2026-07-10T00:00:00.000Z', completed: false, priority: 'CRITICAL', category: 'Maintenance', machineryId: 'SD-AZ-HEAVY' },
      { id: 'todo-2', text: 'Inspect Heavy Duty Drilling Rig Couplings', date: '2026-07-12T00:00:00.000Z', completed: false, priority: 'HIGH', category: 'Maintenance', machineryId: 'SD-DR-RIG' },
      { id: 'todo-3', text: 'Coordinate shipment of Sdazum heavy parts', date: '2026-07-18T00:00:00.000Z', completed: false, priority: 'ROUTINE', category: 'Logistics', machineryId: 'SD-AZ-PARTS' },
      { id: 'todo-4', text: 'Confirm restock of titanium drill bits', date: '2026-07-20T00:00:00.000Z', completed: true, priority: 'ROUTINE', category: 'Restock', machineryId: 'SD-TI-BITS' },
      { id: 'todo-5', text: 'Lubricate tracks of Bull-Dozer Unit 4', date: '2026-07-08T00:00:00.000Z', completed: false, priority: 'CRITICAL', category: 'Maintenance', machineryId: 'SD-DOZER-4' },
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState<'Maintenance' | 'Logistics' | 'Restock'>('Maintenance');
  const [newTodoPriority, setNewTodoPriority] = useState<'CRITICAL' | 'HIGH' | 'ROUTINE'>('ROUTINE');
  const [newTodoMachineryId, setNewTodoMachineryId] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [todoSearchQuery, setTodoSearchQuery] = useState('');
  const [todoSortBy, setTodoSortBy] = useState<'due_earliest' | 'due_latest' | 'priority_critical' | 'created_newest' | 'created_oldest'>('priority_critical');
  const [todoCategoryFilter, setTodoCategoryFilter] = useState<'ALL' | 'Maintenance' | 'Logistics' | 'Restock'>('ALL');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [canDragId, setCanDragId] = useState<string | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [taskManagerView, setTaskManagerView] = useState<'list' | 'chart'>('list');

  // Synchronized Firestore Queue types & states
  interface SyncOperation {
    id: string;
    type: 'add' | 'update' | 'delete' | 'archive';
    item: any;
    retries: number;
  }

  const [syncQueue, setSyncQueue] = useState<SyncOperation[]>(() => {
    try {
      const saved = localStorage.getItem('azum_firestore_sync_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'failed' | 'offline'>('synced');

  const processSyncQueue = async (queueToProcess = syncQueue) => {
    if (queueToProcess.length === 0) {
      setSyncStatus('synced');
      return;
    }
    if (!db) {
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    let hasFailed = false;
    const remainingQueue: SyncOperation[] = [];

    for (const op of queueToProcess) {
      try {
        if (op.type === 'add') {
          await setDoc(doc(db, 'tasks', op.item.id), {
            id: op.item.id,
            text: op.item.text,
            date: op.item.date,
            completed: op.item.completed,
            priority: op.item.priority,
            category: op.item.category,
            machineryId: op.item.machineryId || null,
            createdAt: op.item.createdAt || new Date().toISOString()
          });
        } else if (op.type === 'update') {
          await setDoc(doc(db, 'tasks', op.item.id), {
            id: op.item.id,
            text: op.item.text,
            date: op.item.date,
            completed: op.item.completed,
            priority: op.item.priority,
            category: op.item.category,
            machineryId: op.item.machineryId || null,
            updatedAt: new Date().toISOString(),
            completedAt: op.item.completedAt || null
          }, { merge: true });
        } else if (op.type === 'delete') {
          await deleteDoc(doc(db, 'tasks', op.item));
        } else if (op.type === 'archive') {
          // Write to 'archived_tasks' collection
          await setDoc(doc(db, 'archived_tasks', op.item.id), {
            ...op.item,
            archivedAt: new Date().toISOString()
          });
          // Delete from standard 'tasks' collection
          await deleteDoc(doc(db, 'tasks', op.item.id));
        }
        console.log(`[Sync] Successfully processed queue item ${op.type} for ${op.id}`);
      } catch (err) {
        console.error(`[Sync] Failed to process queue item ${op.type} for ${op.id}:`, err);
        hasFailed = true;
        remainingQueue.push({
          ...op,
          retries: op.retries + 1
        });
      }
    }

    setSyncQueue(remainingQueue);
    localStorage.setItem('azum_firestore_sync_queue', JSON.stringify(remainingQueue));
    
    if (hasFailed) {
      setSyncStatus('failed');
    } else {
      setSyncStatus('synced');
    }
  };

  const queueSyncOperation = (type: 'add' | 'update' | 'delete' | 'archive', id: string, item: any) => {
    const newOp: SyncOperation = {
      id: `${type}-${id}-${Date.now()}`,
      type,
      item,
      retries: 0
    };
    const updatedQueue = [...syncQueue, newOp];
    setSyncQueue(updatedQueue);
    localStorage.setItem('azum_firestore_sync_queue', JSON.stringify(updatedQueue));
    processSyncQueue(updatedQueue);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (syncQueue.length > 0) {
        processSyncQueue();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [syncQueue]);

  // Voice Memo / Transcriber Speech API
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  React.useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setNewTodoText((prev) => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Auto-archive completed tasks after 7 days
  React.useEffect(() => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let changed = false;
    
    const remaining = todos.filter((todo) => {
      if (todo.completed && todo.completedAt) {
        const completedTime = new Date(todo.completedAt).getTime();
        if (now - completedTime >= SEVEN_DAYS_MS) {
          changed = true;
          // Archive to Firestore
          queueSyncOperation('archive', todo.id, todo);
          return false;
        }
      }
      return true;
    });

    if (changed) {
      setTodos(remaining);
      localStorage.setItem('azum_admin_todos', JSON.stringify(remaining));
      setSelectedTodoIds(prev => prev.filter(id => remaining.some(r => r.id === id)));
      console.log(`[Archive] Automatically archived tasks completed over 7 days ago.`);
    }
  }, [todos]);

  // Bulk Delete Handler
  const handleDeleteSelectedTodos = () => {
    if (selectedTodoIds.length === 0) return;
    const updated = todos.filter(t => !selectedTodoIds.includes(t.id));
    setTodos(updated);
    localStorage.setItem('azum_admin_todos', JSON.stringify(updated));

    // Sync deletions
    selectedTodoIds.forEach(id => {
      queueSyncOperation('delete', id, id);
    });

    setSelectedTodoIds([]);
    playPingSound();
  };

  const handleSelectTodo = (id: string) => {
    setSelectedTodoIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // QR Code Scanner State & Integration
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrScannerError, setQrScannerError] = useState<string | null>(null);

  React.useEffect(() => {
    let html5QrCode: any = null;
    if (isQRScannerOpen) {
      const timer = setTimeout(() => {
        try {
          html5QrCode = new Html5Qrcode("qr-reader-container");
          html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText: string) => {
              console.log("QR Code Scanned:", decodedText);
              setNewTodoMachineryId(decodedText);
              setIsAddTaskModalOpen(true);
              
              html5QrCode.stop().then(() => {
                setIsQRScannerOpen(false);
              }).catch((err: any) => {
                console.error("Error stopping QR Code scanner", err);
                setIsQRScannerOpen(false);
              });
              
              playPingSound();
            },
            (errorMessage: string) => {
              // silent
            }
          ).catch((err: any) => {
            console.error("Error starting QR Code scanner", err);
            setQrScannerError("Could not access camera. Please make sure camera permissions are granted.");
          });
        } catch (e: any) {
          console.error("QR scanner initialization error", e);
          setQrScannerError("Failed to initialize camera scanner.");
        }
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          try {
            html5QrCode.stop().catch((e: any) => console.error("Scanner cleanup stop error", e));
          } catch (e) {}
        }
      };
    }
  }, [isQRScannerOpen]);

  // Bulk Export logs to PDF function
  const exportTasksToPDF = (layout: 'standard' | 'detailed' | 'compact') => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("SHANDONG AZUM MACHINERY MAINTENANCE LOG", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${timestamp} | Layout: ${layout.toUpperCase()}`, 14, 26);
      doc.text(`Total Tasks: ${sortedTodos.length} | Pending: ${pendingCount} | Critical: ${criticalPendingCount}`, 14, 32);
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 36, 196, 36);
      
      let y = 44;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      
      doc.text("ID", 14, y);
      doc.text("CATEGORY", 40, y);
      doc.text("PRIORITY", 65, y);
      doc.text("DUE DATE", 85, y);
      doc.text("STATUS", 110, y);
      doc.text("DESCRIPTION", 130, y);
      
      doc.line(14, y + 3, 196, y + 3);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      
      sortedTodos.forEach((todo) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
          doc.setFont("helvetica", "bold");
          doc.text("SHANDONG AZUM MACHINERY MAINTENANCE LOG (Cont.)", 14, y);
          doc.line(14, y + 3, 196, y + 3);
          y += 10;
          doc.setFont("helvetica", "normal");
        }
        
        const displayId = todo.machineryId || todo.id.replace('todo-', 'T-');
        doc.text(displayId.substring(0, 12), 14, y);
        doc.text(todo.category.toUpperCase(), 40, y);
        
        if (todo.priority === 'CRITICAL') {
          doc.setTextColor(239, 68, 68);
        } else if (todo.priority === 'HIGH') {
          doc.setTextColor(245, 158, 11);
        } else {
          doc.setTextColor(71, 85, 105);
        }
        doc.text(todo.priority, 65, y);
        doc.setTextColor(30, 41, 59);
        
        doc.text(todo.date.split('T')[0], 85, y);
        
        if (todo.completed) {
          doc.setTextColor(34, 197, 94);
          doc.text("COMPLETED", 110, y);
        } else {
          doc.setTextColor(239, 68, 68);
          doc.text("PENDING", 110, y);
        }
        doc.setTextColor(30, 41, 59);
        
        const splitText = doc.splitTextToSize(todo.text, 65);
        doc.text(splitText, 130, y);
        
        y += Math.max(splitText.length * 4, 6);
      });
      
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("CONFIDENTIAL - FOR INTERNAL SD-AZUM ENGINEERING OPERATIONS ONLY", 14, 287);
      
      doc.save(`SD-AZUM-Engineering-Tasks-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF Report:", error);
    }
  };

  // Overdue check helper
  const isOverdue = (dateString: string, completed: boolean) => {
    if (completed) return false;
    try {
      const dueDate = new Date(dateString);
      if (isNaN(dueDate.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    } catch (e) {
      return false;
    }
  };

  // Derived Task Manager states
  const pendingCount = todos.filter((t) => !t.completed).length;
  const criticalPendingCount = todos.filter((t) => !t.completed && t.priority === 'CRITICAL').length;
  
  const completionPercentage = useMemo(() => {
    if (todos.length === 0) return 0;
    const completedCount = todos.filter((t) => t.completed).length;
    return Math.round((completedCount / todos.length) * 100);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (todoCategoryFilter !== 'ALL' && t.category !== todoCategoryFilter) {
        return false;
      }
      const query = todoSearchQuery.toLowerCase().trim();
      if (!query) return true;
      const textMatch = t.text.toLowerCase().includes(query);
      const machineryMatch = t.machineryId ? t.machineryId.toLowerCase().includes(query) : false;
      const categoryMatch = t.category.toLowerCase().includes(query);
      const priorityMatch = t.priority.toLowerCase().includes(query);
      return textMatch || machineryMatch || categoryMatch || priorityMatch;
    });
  }, [todos, todoSearchQuery, todoCategoryFilter]);

  const priorityWeight = {
    CRITICAL: 3,
    HIGH: 2,
    ROUTINE: 1
  };

  const sortedTodos = useMemo(() => {
    const list = [...filteredTodos];
    list.sort((a, b) => {
      if (todoSortBy === 'due_earliest') {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return timeA - timeB;
      } else if (todoSortBy === 'due_latest') {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return timeB - timeA;
      } else if (todoSortBy === 'created_newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (parseInt(a.id.split('-')[1]) || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (parseInt(b.id.split('-')[1]) || 0);
        return timeB - timeA;
      } else if (todoSortBy === 'created_oldest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (parseInt(a.id.split('-')[1]) || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (parseInt(b.id.split('-')[1]) || 0);
        return timeA - timeB;
      } else {
        // priority_critical
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        if (weightB !== weightA) {
          return weightB - weightA;
        }
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return timeA - timeB;
      }
    });
    return list;
  }, [filteredTodos, todoSortBy]);

  // Priority distribution chart calculations
  const priorityChartData = useMemo(() => {
    const critical = todos.filter(t => t.priority === 'CRITICAL').length;
    const high = todos.filter(t => t.priority === 'HIGH').length;
    const routine = todos.filter(t => t.priority === 'ROUTINE').length;
    return [
      { name: 'Critical', value: critical, color: '#f43f5e' },
      { name: 'High', value: high, color: '#f59e0b' },
      { name: 'Routine', value: routine, color: '#10b981' },
    ];
  }, [todos]);

  const [cardCoords, setCardCoords] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardCoords({ x, y });
  };

  // Play subtle 'ping' audio effect using HTML5 Web Audio API
  const playPingSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Subtle audio ping playback failed", e);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    let displayDate = newTodoDueDate;
    try {
      const parsed = new Date(newTodoDueDate);
      if (!isNaN(parsed.getTime())) {
        displayDate = parsed.toISOString();
      }
    } catch (err) {}

    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodoText.trim(),
      date: displayDate,
      completed: false,
      priority: newTodoPriority,
      category: newTodoCategory,
      machineryId: newTodoMachineryId.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [...todos, item];
    setTodos(updated);
    localStorage.setItem('azum_admin_todos', JSON.stringify(updated));

    // Non-blocking sync to Firestore
    queueSyncOperation('add', item.id, item);

    // Reset fields except defaults
    setNewTodoText('');
    setNewTodoMachineryId('');
    setIsAddTaskModalOpen(false);
  };

  const handleToggleTodo = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (target) {
      if (!target.completed) {
        playPingSound();
      }
      const isNowCompleted = !target.completed;
      const updatedItem: TodoItem = { 
        ...target, 
        completed: isNowCompleted,
        completedAt: isNowCompleted ? new Date().toISOString() : undefined
      };
      const updated = todos.map((t) => (t.id === id ? updatedItem : t));
      setTodos(updated);
      localStorage.setItem('azum_admin_todos', JSON.stringify(updated));
      
      // Update in Firestore
      queueSyncOperation('update', updatedItem.id, updatedItem);
    }
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    localStorage.setItem('azum_admin_todos', JSON.stringify(updated));
    
    // Delete from Firestore
    queueSyncOperation('delete', id, id);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (canDragId !== id) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = todos.findIndex((t) => t.id === sourceId);
    const targetIndex = todos.findIndex((t) => t.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const reordered = [...todos];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setTodos(reordered);
    localStorage.setItem('azum_admin_todos', JSON.stringify(reordered));
    setDraggedId(null);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "--- OPERATIONS REPORT: PRODUCTS CATALOG ---\n";
    csvContent += "ID,Name,Category,Price,Sales Count,Rating\n";
    products.forEach(p => {
      csvContent += `"${p.id}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.salesCount || 0},${p.rating || 5}\n`;
    });
    csvContent += "\n--- OPERATIONS REPORT: SYSTEM ORDERS ---\n";
    csvContent += "Order ID,Buyer Name,Email,Total Amount,Status,Date\n";
    orders.forEach(o => {
      csvContent += `"${o.id}","${(o.address?.name || '').replace(/"/g, '""')}","${o.address?.email || ''}",${o.total},"${o.status}","${o.date}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sdazum_cyberport_export_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-dashboard-overview" className="space-y-6 font-sans">
      {/* Executive Action Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border ${
        theme === 'day' ? 'bg-white border-slate-200' : 'bg-[#0a0b10] border-slate-800'
      }`}>
        <div>
          <h2 className={`text-lg font-black tracking-tight uppercase font-mono ${
            theme === 'day' ? 'text-slate-800' : 'text-white'
          }`}>Operations Hub</h2>
          <p className={`text-xs font-mono ${
            theme === 'day' ? 'text-slate-500' : 'text-slate-200'
          }`}>Real-time telemetry reports & partner logs</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Reports (CSV)</span>
        </button>
      </div>

      {/* Shandong Azum Corporate Business Identity */}
      <div className={`p-6 rounded-2xl border shadow-lg flex flex-col md:flex-row gap-6 items-center ${
        theme === 'day' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/40 border-slate-800 text-white'
      }`}>
        <div className="w-full md:w-1/2 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-rose-600 dark:text-rose-400 font-bold tracking-wider uppercase text-[10px]">
             Official Company Identity Card
          </div>
          <div className="py-2">
            <ShandongAzumLogo className="h-10" theme={theme as any} />
          </div>
          <h3 className={`text-xl font-black ${
            theme === 'day' ? 'text-slate-900' : 'text-white'
          }`}>Shandong Azum Import & Export Co., Ltd</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Authorized admin credentials and official representative credentials for international trading, machinery distribution, and microservice terminal logistics management.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-slate-200 dark:border-slate-700/50">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">REPRESENTATIVE</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">Altayeb Yousif Dafalla</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">CONTACT EMAIL</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">Altayeb@Azumgroup.com</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">OFFICIAL SITE</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">www.azumgroup.com</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">HEADQUARTERS</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">Shandong, China</span>
            </div>
          </div>
        </div>
         <div className="w-full md:w-1/2 flex justify-center py-4">
          <div 
            className="relative w-full max-w-[400px] h-[240px] cursor-pointer"
            style={{ perspective: '1200px' }}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => {
              setIsCardHovered(false);
              setCardCoords({ x: 0, y: 0 });
            }}
          >
            {/* 3D Rotator Box */}
            <div 
              className="relative w-full h-full transition-all duration-200 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: isCardHovered
                  ? `rotateY(${cardCoords.x * 32}deg) rotateX(${-cardCoords.y * 32}deg) scale(1.04)`
                  : 'rotateY(0deg) rotateX(0deg) scale(1)',
              }}
            >
              {/* Back Card (White Textured Business Card) */}
              <div 
                className="absolute inset-x-2 bottom-0 h-[190px] rounded-2xl bg-[#fcfbfa] border border-[#e5dfd5] p-5 shadow-xl flex flex-col justify-between transition-all"
                style={{
                  transform: 'translateZ(10px) translateY(10px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: isCardHovered 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Altayeb Personal Detail Info Card */}
                <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="text-[10px] font-black tracking-widest text-[#a1885f] font-mono uppercase mb-1">Representative Card</div>
                  <h4 className="text-sm font-black tracking-tight text-slate-800 font-sans uppercase">ALTAYEB YOUSIF DAFALLA</h4>
                  <p className="text-[9px] font-bold text-slate-500 font-mono italic">Import & Export Manager</p>
                </div>
                
                <div 
                  className="space-y-1 font-mono text-[8px] text-slate-600 border-t border-slate-100 pt-2"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <div className="flex justify-between">
                    <span className="text-slate-400">PHONE:</span>
                    <span className="font-bold text-slate-700">+86 186 7828 2263</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EMAIL:</span>
                    <span className="font-bold text-rose-700">Altayeb@Azumgroup.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">WEB:</span>
                    <span className="font-bold text-slate-700">www.azumgroup.com</span>
                  </div>
                </div>
              </div>

              {/* Front Card (Official Red Branding Card) */}
              <div 
                className="absolute inset-x-2 top-0 h-[140px] rounded-2xl bg-gradient-to-br from-[#cb2f1d] via-[#b82313] to-[#8c1409] p-5 shadow-lg flex flex-col justify-between border border-red-600/20"
                style={{
                  transform: 'translateZ(40px) translateY(-5px) rotateX(-2deg) rotateY(1deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Background watermarked branding texture */}
                <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] rounded-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10" style={{ transform: 'translateZ(20px)' }}>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-wide font-mono uppercase">SHANDONG AZUM</h3>
                    <p className="text-[7px] text-red-200 uppercase font-bold tracking-widest font-mono">Import & Export Co., Ltd.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-serif text-white font-extrabold text-xs shadow-inner">
                    AZ
                  </div>
                </div>

                <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                  <p className="text-[7px] text-red-200 tracking-wider font-mono uppercase leading-none">Official Trading Identity</p>
                  <p className="text-[6px] text-red-300 font-mono mt-1">LICENSE: Shandong Enterprise Registry #37010499217</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚨 UNIFIED OPERATIONS ALERTS & NOTIFICATIONS CENTER */}
      <div className={`p-6 rounded-2xl border transition-all ${
        theme === 'day' 
          ? 'bg-amber-500/5 border-amber-300 shadow-sm' 
          : 'bg-red-950/10 border-red-500/20 shadow-md shadow-red-950/20'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <BellRing className="w-5 h-5 text-red-500 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider font-mono text-slate-800 dark:text-white flex items-center gap-2">
                <span>Unified Operations Alerts Center</span>
                <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest animate-pulse">
                  Live Telemetry
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Automated inventory threshold alerts & pending order dispatch alarms</p>
            </div>
          </div>

          {/* Simulation Tools for easier testing */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] uppercase font-bold font-mono text-slate-400">Simulator:</span>
            <button
              onClick={simulateLowStock}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105"
            >
              <Zap className="w-3 h-3" />
              <span>Drain Inventory</span>
            </button>
            <button
              onClick={simulateNewOrder}
              className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105"
            >
              <Play className="w-3 h-3" />
              <span>Simulate Order</span>
            </button>
          </div>
        </div>

        {/* Alerts List */}
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">All Systems Operational</p>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto">No inventory warnings or pending order fulfillments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map((alert) => {
              const isLowStock = alert.type === 'low_stock';
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                    isLowStock
                      ? 'bg-amber-500/5 border-amber-500/30 text-amber-800 dark:text-amber-300 hover:border-amber-500/50'
                      : 'bg-indigo-500/5 border-indigo-500/30 text-indigo-800 dark:text-indigo-300 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isLowStock ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {isLowStock ? <AlertTriangle className="w-4 h-4" /> : <PackageCheck className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded ${
                          isLowStock ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {isLowStock ? 'Inventory Warning' : 'Pending Order Dispatch'}
                        </span>
                      </div>
                      <p className="text-xs font-bold font-sans mt-1">{alert.title}</p>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-sans">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-850">
                    <span className="text-[9px] font-mono text-slate-400">{alert.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-2 py-1 bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded text-[9px] font-mono transition-colors cursor-pointer"
                        title="Dismiss alert"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={alert.onAction}
                        className={`px-3 py-1 rounded text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 text-white ${
                          isLowStock 
                            ? 'bg-amber-600 hover:bg-amber-500' 
                            : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{alert.actionText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🧠 Azum Cognitive Brain™ - Real-Time Business Intelligence & Financial Diagnoses */}
      <div 
        id="azum-cognitive-intelligence-brain" 
        className={`p-6 rounded-3xl border mb-6 transition-all ${
          theme === 'cyberpunk'
            ? 'bg-black/80 border-pink-500/30 text-slate-200 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
            : theme === 'night'
              ? 'bg-[#151b26] border-slate-800/80 text-slate-200 shadow-xl'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Cpu className="w-5 h-5 animate-pulse text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] text-pink-500 font-mono font-black uppercase tracking-widest block">Cognitive Business Intelligence</span>
              <h3 className="text-sm font-black font-mono tracking-tight uppercase">
                Azum Cognitive Brain™ - Real-Time Financial & Product Diagnostic
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Telemetry online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Simulated Thought Process Stream */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 text-slate-400 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[9px] font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00f0ff]" />
                  Active Brain Reasoning Queue
                </span>
                <span className="text-[8px] text-slate-600">60FPS Multi-threaded Stream</span>
              </div>

              {/* Dynamic thinking steps */}
              <div className="space-y-2 text-[9px] leading-relaxed overflow-y-auto max-h-[140px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-500">✔</span>
                  <span>[INGEST] Pulled current machinery index database size: <b>{cognitiveFinance.catalogCount} assets</b> live in product matrix.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-emerald-500">✔</span>
                  <span>[AUDIT] Scanned orders ledger ({orders.length} orders total). Total gross revenue computed at <b>${cognitiveFinance.totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>.</span>
                </div>
                <div className="flex gap-2 items-start text-indigo-400">
                  <span className="animate-spin text-indigo-400 font-bold">⚙</span>
                  <span>[CALC] Average machinery cart value: <b>${cognitiveFinance.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> per purchase.</span>
                </div>
                <div className="flex gap-2 items-start text-pink-400">
                  <span className="animate-pulse">✦</span>
                  <span>[PREDICT] Estimated net machine margins: <b>${cognitiveFinance.profitEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> (at standard 28% margin threshold).</span>
                </div>
                {cognitiveFinance.lowStock > 0 || cognitiveFinance.outOfStock > 0 ? (
                  <div className="flex gap-2 items-start text-amber-500">
                    <span className="animate-bounce">⚠</span>
                    <span>[ALERT] Low-stock threat discovered: <b>{cognitiveFinance.lowStock} products</b> near threshold; <b>{cognitiveFinance.outOfStock} out-of-stock</b> completely.</span>
                  </div>
                ) : (
                  <div className="flex gap-2 items-start text-emerald-400">
                    <span>✔</span>
                    <span>[HEALTH] All machine product lines within stable parameters. No immediate restock triggers.</span>
                  </div>
                )}
                <div className="flex gap-2 items-start text-slate-500">
                  <span>▶</span>
                  <span>[DIAGNOSTIC] Best Selling Machinery Unit is currently: <b>{cognitiveFinance.topSKU}</b>. Sales: <b>{cognitiveFinance.topSKUSales}</b> units.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[8px] text-slate-500">
              <span>Updated automatically on store state mutation</span>
              <span>Model ID: Azum-V4-Pro</span>
            </div>
          </div>

          {/* Right: Dynamic Cognitive Analysis Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono block">Strategic Advisor Insights</span>
              
              <div className="space-y-2.5">
                {/* Money Insight Indicator */}
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Net Profit Factor</span>
                    <p className="text-lg font-black font-mono">
                      ${cognitiveFinance.profitEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Average Ticket</span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ${cognitiveFinance.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Product Catalog Health Score indicator */}
                <div className="p-3 bg-pink-500/5 rounded-xl border border-pink-500/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-pink-400 uppercase tracking-wider font-mono">Catalog Health Score</span>
                    <p className="text-lg font-black font-mono">
                      {Math.max(40, 100 - (cognitiveFinance.lowStock * 5) - (cognitiveFinance.outOfStock * 15))}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Catalog Size</span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {cognitiveFinance.catalogCount} Heavy Units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic text block summarizing "how does it going" */}
            <div className="p-3 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-900 font-sans text-[11px] leading-relaxed">
              <p className="text-slate-600 dark:text-slate-400">
                Azum cognitive diagnostic model reports that your machinery sales are **{cognitiveFinance.totalOrderValue > 50000 ? 'surging aggressively' : 'recovering in a steady upward trajectory'}.** 
                With **{orders.length} orders** booked and **{cognitiveFinance.catalogCount} active products** in stock, the platform maintains a safe liquidity cushion. 
                {cognitiveFinance.lowStock > 0 ? (
                  <span> Critical action item: **{cognitiveFinance.lowStock} machine lines** require restock orders to prevent customer delivery friction.</span>
                ) : (
                  <span> Machinery logistics pipeline is completely cleared; no pending restock alerts.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Visitors</p>
            <h3 id="stat-visitors" className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
              {realTotalVisitors.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +28.4% from last week
            </p>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Sessions</p>
            <h3 id="stat-sessions" className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
              {activeSessions.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from yesterday
            </p>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">API Throughput</p>
            <h3 id="stat-throughput" className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
              {apiThroughput}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>Optimal response speed</span>
            </p>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Errors Logged</p>
            <h3 id="stat-errors" className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
              {errorsLogged}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>Healthy application state</span>
            </p>
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 text-rose-600 dark:text-rose-400 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div id="charts-grid-row-1" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Machinery Shipped Volume Audit (Top 15 Items) */}
        <div className="bg-white dark:bg-[#151b26] text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg lg:col-span-2 flex flex-col h-[380px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-between font-mono">
            <span>📊 Machinery Shipped Volume Audit (Top 15 Items)</span>
            <span className="text-[10px] font-normal text-indigo-400 font-mono">Real-time inventory dispatch index</span>
          </h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} horizontal={true} className="dark:stroke-[#252f3f]" />
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
                  className="font-mono"
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  payload={[
                    { value: 'Shipped Sales Volume', type: 'circle', id: 'sales', color: '#3b82f6' }
                  ]}
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium text-xs ml-1 font-sans">{value}</span>}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Sales Volume Share */}
        <div className="bg-white dark:bg-[#151b26] text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg flex flex-col h-[380px]">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 font-mono">🍰 Sales Volume Share</h4>
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySharesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {categorySharesData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center visitors label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span id="pie-center-number" className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {totalSalesUnits}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Units Sold</span>
            </div>
          </div>
          {/* Legend indicator badges */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] pt-4 border-t border-slate-100 dark:border-slate-800/80 font-medium font-mono max-h-[100px] overflow-y-auto">
            {categorySharesData.map((c) => (
              <div key={c.name} className="flex items-center gap-1 min-w-0">
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-sans truncate" title={c.name}>{c.name}</span>
                <span className="text-slate-400 dark:text-slate-500 font-bold ml-auto shrink-0">({c.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="charts-grid-row-2" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Area Chart */}
        <div className="bg-white dark:bg-[#151b26] text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg lg:col-span-2 flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 font-mono">Total Visitors</h4>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Weekly wave breakdown</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} horizontal={true} className="dark:stroke-[#252f3f]" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  boundaryGap={false}
                  dy={8}
                  className="font-mono"
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                  className="font-mono"
                />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium text-xs ml-1 font-sans">{value}</span>}
                />
                <Area type="monotone" dataKey="Desktop" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDesktop)" />
                <Area type="monotone" dataKey="Mobile" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMobile)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Todo List */}
        <div id="task-manager-container" className="relative bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col h-[520px]">
          <div className="shrink-0 mb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Machinery Task Board</span>
                {/* Visual Sync Status Indicator */}
                {syncStatus === 'synced' && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-bold bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Synced
                  </span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-blue-500 font-bold bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/20">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Syncing...
                  </span>
                )}
                {(syncStatus === 'failed' || syncStatus === 'offline') && (
                  <button
                    type="button"
                    onClick={() => processSyncQueue()}
                    className="inline-flex items-center gap-1 text-[9px] text-amber-500 font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/20 cursor-pointer transition-colors animate-pulse"
                    title="Connection poor. Click to manually retry."
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Pending ({syncQueue.length})
                  </button>
                )}
              </span>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {selectedTodoIds.length > 0 && (
                    <motion.button
                      id="bulk-delete-btn"
                      type="button"
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      onClick={handleDeleteSelectedTodos}
                      className="px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      Delete Selected ({selectedTodoIds.length})
                    </motion.button>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                  <button
                    type="button"
                    onClick={() => setTaskManagerView('list')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      taskManagerView === 'list'
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskManagerView('chart')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      taskManagerView === 'chart'
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Chart
                  </button>
                </div>

                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{todos.length} Protocols</span>
              </div>
            </h4>
          </div>

          {/* Progress Indicator */}
          <div className="mb-3 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>OVERALL RESOLUTION PROGRESS</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{completionPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-2 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Pending Tasks</span>
              <span className="text-base font-black text-slate-700 dark:text-white leading-none mt-0.5">{pendingCount}</span>
            </div>
            <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 p-2 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
                Critical Alerts
              </span>
              <span className="text-base font-black text-rose-600 dark:text-rose-400 leading-none mt-0.5">{criticalPendingCount}</span>
            </div>
          </div>

          {/* Real-time Search Field, Category Filter, and Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3 shrink-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Filter tasks..."
                value={todoSearchQuery}
                onChange={(e) => setTodoSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-indigo-400 outline-none font-sans"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={todoCategoryFilter}
                onChange={(e) => setTodoCategoryFilter(e.target.value as any)}
                className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none cursor-pointer font-sans"
                title="Filter by Category"
              >
                <option value="ALL">📂 All Categories</option>
                <option value="Maintenance">🔧 Maintenance</option>
                <option value="Logistics">📦 Logistics</option>
                <option value="Restock">🛒 Restock</option>
              </select>
              <select
                value={todoSortBy}
                onChange={(e) => setTodoSortBy(e.target.value as any)}
                className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none cursor-pointer font-sans"
              >
                <option value="priority_critical">⚠️ Priority (Critical First)</option>
                <option value="due_earliest">📅 Due Date (Earliest)</option>
                <option value="due_latest">📅 Due Date (Latest)</option>
                <option value="created_newest">🆕 Creation Date (Newest)</option>
                <option value="created_oldest">⏳ Creation Date (Oldest)</option>
              </select>
              {/* Bulk Export Select Dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    exportTasksToPDF(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:border-indigo-400 outline-none cursor-pointer font-sans"
                defaultValue=""
                title="Bulk Export to PDF"
              >
                <option value="" disabled>📥 Export Logs</option>
                <option value="standard">PDF Standard Log</option>
                <option value="detailed">PDF Detailed Log</option>
                <option value="compact">PDF Compact Log</option>
              </select>
            </div>
          </div>

          {/* Add Todo Form with Categories & Priority dropdowns */}
          <form onSubmit={handleAddTodo} className="space-y-2 mb-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="todo-add-input"
                  type="text"
                  placeholder="Description (e.g. Inspect drive shaft)..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="w-full pl-2 pr-7 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'text-slate-400 hover:text-rose-500'
                  }`}
                  title={isRecording ? "Listening... Click to stop" : "Transcribe Voice Memo"}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative w-[115px]">
                <input
                  id="todo-machinery-input"
                  type="text"
                  placeholder="Machinery ID..."
                  value={newTodoMachineryId}
                  onChange={(e) => setNewTodoMachineryId(e.target.value)}
                  className="w-full pl-2 pr-7 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsQRScannerOpen(true)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-indigo-500 rounded"
                  title="Scan QR Serial Code"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <select
                  value={newTodoCategory}
                  onChange={(e) => setNewTodoCategory(e.target.value as any)}
                  className="px-1 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="Maintenance">🔧 Maint</option>
                  <option value="Logistics">📦 Logistics</option>
                  <option value="Restock">🛒 Restock</option>
                </select>

                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as any)}
                  className="px-1 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>

                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="px-1 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                />
              </div>

              <button
                id="todo-add-btn"
                type="submit"
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-0.5 shrink-0"
                title="Add task to board"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Todo list records with Drag-and-drop handles or Recharts priority chart */}
          {taskManagerView === 'chart' ? (
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-900/35 rounded-2xl border border-slate-100 dark:border-slate-800/80 min-h-0 mb-14">
              <div className="text-center mb-1 shrink-0">
                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Priority Distribution Analyser</h5>
                <p className="text-[8px] text-slate-500 font-mono">Live profiling of maintenance priority metrics in database</p>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} className="font-mono" />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} className="font-mono" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '10px' }} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 shrink-0 flex-wrap">
                {priorityChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-505">
                    <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-sans">{entry.name}: <strong className="font-mono text-slate-800 dark:text-white">{entry.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div id="todo-records" className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0 pb-14">
              <AnimatePresence initial={false}>
                {sortedTodos.length === 0 ? (
                  <motion.p
                    key="empty-todo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-slate-500 italic text-center py-10"
                  >
                    No items on board match current filter.
                  </motion.p>
                ) : (
                  sortedTodos.map((todo) => {
                    const overdue = isOverdue(todo.date, todo.completed);
                    
                    // Color mapping for tags
                    const categoryStyles = {
                      Maintenance: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40',
                      Logistics: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/40',
                      Restock: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40',
                    };

                    const priorityStyles = {
                      CRITICAL: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-full font-bold px-2 py-0.5 flex items-center gap-1 text-[9px]',
                      HIGH: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full font-semibold px-2 py-0.5 flex items-center gap-1 text-[9px]',
                      ROUTINE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-medium px-2 py-0.5 flex items-center gap-1 text-[9px]',
                    };

                    return (
                      <motion.div
                        key={todo.id}
                        id={`todo-card-${todo.id}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: todo.completed ? 0.55 : 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          marginTop: 0,
                          marginBottom: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                          scale: 0.9,
                          y: -20,
                          transition: {
                            height: { type: 'spring', stiffness: 500, damping: 35 },
                            opacity: { duration: 0.15 },
                            scale: { duration: 0.15 },
                            y: { duration: 0.15 }
                          }
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        draggable={canDragId === todo.id}
                        onDragStart={(e) => handleDragStart(e, todo.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, todo.id)}
                        className={`flex flex-col gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 transition-all overflow-hidden ${
                          todo.completed ? 'opacity-55' : 'hover:border-indigo-400/50 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                        } ${draggedId === todo.id ? 'opacity-30 border-dashed border-indigo-500 bg-indigo-50/10' : ''}`}
                        title="Drag handle to reorder"
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Row Selection Checkbox */}
                          <div className="flex items-center shrink-0 mt-1">
                            <input
                              id={`todo-select-checkbox-${todo.id}`}
                              type="checkbox"
                              checked={selectedTodoIds.includes(todo.id)}
                              onChange={() => handleSelectTodo(todo.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              title="Select task for bulk actions"
                            />
                          </div>

                          {/* Drag Handle */}
                          <div
                            onMouseDown={() => !todo.completed && setCanDragId(todo.id)}
                            onMouseUp={() => setCanDragId(null)}
                            onMouseLeave={() => setCanDragId(null)}
                            className={`p-1 -ml-1 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shrink-0 ${
                              todo.completed ? 'cursor-not-allowed opacity-30' : 'cursor-grab active:cursor-grabbing'
                            }`}
                            title="Drag handle to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          {/* Checkbox Toggle with scale spring animation */}
                          <motion.button
                            id={`todo-toggle-${todo.id}`}
                            type="button"
                            onClick={() => handleToggleTodo(todo.id)}
                            whileTap={{ scale: 0.85 }}
                            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer mt-0.5 transition-colors ${
                              todo.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-400 hover:border-indigo-400 dark:border-slate-600'
                            }`}
                          >
                            {todo.completed && (
                              <motion.div
                                initial={{ scale: 0, rotate: -35 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </motion.div>
                            )}
                          </motion.button>

                          {/* Content Section with animated strikethrough line */}
                          <div className="flex-1 min-w-0">
                            <div className="relative inline-block max-w-full">
                              <span className={`text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight block break-words ${todo.completed ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                                {todo.text}
                              </span>
                              <AnimatePresence>
                                {todo.completed && (
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    exit={{ width: 0 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="absolute left-0 top-[50%] h-[1.5px] bg-slate-400 dark:bg-slate-500"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            
                            {/* Due Date & Machinery info */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] font-medium">
                              <span className={`flex items-center gap-0.5 ${overdue ? 'text-rose-500 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                                📅 {(() => {
                                  try {
                                    const d = new Date(todo.date);
                                    if (isNaN(d.getTime())) return todo.date;
                                    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
                                  } catch (e) {
                                    return todo.date;
                                  }
                                })()}
                              </span>
                              {todo.machineryId && (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.2 rounded font-mono border border-slate-200/50 dark:border-slate-700/50">
                                  ⚙️ {todo.machineryId}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            id={`todo-delete-${todo.id}`}
                            type="button"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                            title="Delete task protocol"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Tags & Flags Row */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/40 dark:border-slate-850/30">
                          {/* Category Tag Badge */}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${
                            categoryStyles[todo.category as keyof typeof categoryStyles] || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}>
                            {todo.category}
                          </span>

                          {/* Priority Tag Badge */}
                          <span className={priorityStyles[todo.priority]}>
                            {todo.priority === 'CRITICAL' && <AlertOctagon className="w-3 h-3 text-rose-500 dark:text-rose-400 animate-pulse shrink-0" />}
                            {todo.priority === 'HIGH' && <AlertTriangle className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />}
                            {todo.priority === 'ROUTINE' && <Clock className="w-3 h-3 text-emerald-500 shrink-0" />}
                            <span>{todo.priority.charAt(0) + todo.priority.slice(1).toLowerCase()}</span>
                          </span>

                          {/* Overdue alert badge */}
                          {overdue && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/30 animate-pulse ml-auto">
                              ⚠️ OVERDUE
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            type="button"
            onClick={() => setIsAddTaskModalOpen(true)}
            className="absolute bottom-4 right-4 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-10 flex items-center justify-center"
            title="Add New Task Protocol"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Slide-Up Dialog Modal for adding tasks */}
          <AnimatePresence>
            {isAddTaskModalOpen && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs rounded-2xl z-20 flex items-end justify-center overflow-hidden">
                {/* Backdrop Click */}
                <div className="absolute inset-0" onClick={() => setIsAddTaskModalOpen(false)} />
                
                {/* Modal Container */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="relative w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-t-2xl p-5 shadow-2xl z-30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span>Create Task Protocol</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddTaskModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddTodo} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                        Task Description
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Description (e.g. Inspect drive shaft)..."
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={toggleRecording}
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                            isRecording 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'text-slate-400 hover:text-rose-500'
                          }`}
                          title={isRecording ? "Listening... Click to stop" : "Transcribe Voice Memo"}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Machinery ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Machinery ID..."
                            value={newTodoMachineryId}
                            onChange={(e) => setNewTodoMachineryId(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setIsQRScannerOpen(true)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            title="Scan Machinery QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={newTodoDueDate}
                          onChange={(e) => setNewTodoDueDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={newTodoCategory}
                          onChange={(e) => setNewTodoCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none cursor-pointer"
                        >
                          <option value="Maintenance">🔧 Maintenance</option>
                          <option value="Logistics">📦 Logistics</option>
                          <option value="Restock">🛒 Restock</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                          Priority
                        </label>
                        <select
                          value={newTodoPriority}
                          onChange={(e) => setNewTodoPriority(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:border-indigo-400 outline-none cursor-pointer"
                        >
                          <option value="ROUTINE">Routine</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors cursor-pointer text-xs font-bold flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Confirm Create Task</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* QR Code Scanner Dialog Modal */}
          <AnimatePresence>
            {isQRScannerOpen && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl z-40 flex flex-col items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span>Scan Machinery QR Code</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {qrScannerError ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-rose-500 gap-2">
                      <AlertCircle className="w-8 h-8" />
                      <p className="font-semibold">{qrScannerError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setQrScannerError(null);
                          setIsQRScannerOpen(false);
                          setTimeout(() => setIsQRScannerOpen(true), 100);
                        }}
                        className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-[11px]"
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-square w-full max-w-[280px] mx-auto border border-slate-200 dark:border-slate-800">
                      {/* Aiming Reticle Overlay */}
                      <div className="absolute inset-0 z-10 pointer-events-none border-2 border-transparent flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-indigo-500/80 rounded-xl relative flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-indigo-400" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-indigo-400" />
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-indigo-400" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-indigo-400" />
                          
                          {/* Laser Scanning Line Animation */}
                          <div className="absolute left-0 right-0 h-0.5 bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,1)] animate-bounce" style={{ animationDuration: '3s' }} />
                        </div>
                      </div>
                      
                      <div id="qr-reader-container" className="w-full h-full object-cover font-sans text-[10px]" />
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Align the machinery QR code inside the green frame. The machinery serial ID will be auto-transcribed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Floating Action Button (FAB) at the bottom right of the container */}
          <button
            type="button"
            onClick={() => setIsAddTaskModalOpen(true)}
            className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-2.5 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
            title="Create new machinery maintenance task protocol"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* NEW PRICE AUDIT REPORT FEATURE */}
      <div id="admin-price-audit-section" className={`p-6 rounded-2xl border shadow-lg space-y-6 ${
        theme === 'day' ? 'bg-white border-slate-200' : 'bg-[#0d0f17]/90 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </span>
              <h3 className={`text-lg font-black tracking-tight uppercase font-mono ${
                theme === 'day' ? 'text-slate-900' : 'text-white'
              }`}>Machinery & Inventory Price Audit Report</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Comparing individual listings against their respective category baseline averages.
            </p>
          </div>

          {/* Interactive Threshold Slider */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-xl shrink-0">
            <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">Deviation Threshold:</span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={deviationThreshold}
              onChange={(e) => setDeviationThreshold(parseInt(e.target.value))}
              className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded text-xs font-bold font-mono">
              {deviationThreshold}%
            </span>
          </div>
        </div>

        {/* Category baseline averages tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(priceAuditReport.categoryStats).map(([category, stats]: [string, any]) => (
            <div
              key={category}
              className={`p-3.5 rounded-xl border font-mono ${
                theme === 'day' ? 'bg-slate-50 border-slate-100 text-slate-800' : 'bg-slate-900/40 border-slate-850 text-white'
              }`}
            >
              <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate font-bold">{category}</p>
              <p className="text-sm font-black mt-1 text-slate-800 dark:text-slate-100">${stats.avg.toFixed(2)}</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{stats.count} item{stats.count > 1 ? 's' : ''} counted</p>
            </div>
          ))}
        </div>

        {/* Flagged listings and calibration results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-mono pb-2 border-b border-slate-50 dark:border-slate-850">
            <span>Discrepancy Details</span>
            <span>Flagged anomalies ({priceAuditReport.flaggedProducts.length})</span>
          </div>

          {priceAuditReport.flaggedProducts.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 animate-bounce" />
              <span>Perfect Alignment: No listings deviate more than {deviationThreshold}% from the category baseline.</span>
            </div>
          ) : (
            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 pr-2 space-y-2">
              {priceAuditReport.flaggedProducts.map((p) => {
                const isHigh = p.deviation > 0;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 first:pt-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
                        {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                          <img src={getProductImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                        ) : (
                          <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${theme === 'day' ? 'text-slate-800' : 'text-slate-200'}`}>
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                          {p.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-400 block font-bold">PRICING BASES</span>
                        <span className={`text-xs font-black ${theme === 'day' ? 'text-slate-800' : 'text-slate-200'}`}>
                          ${p.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500"> vs ${p.categoryAvg.toFixed(2)} (avg)</span>
                      </div>

                      {/* Discrepancy Margin Badge */}
                      <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 font-mono text-xs font-bold shrink-0 ${
                        isHigh
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {isHigh ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isHigh ? 'High' : 'Low'}: {isHigh ? '+' : ''}{p.deviation.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Popular Products & Recent Transactions Grid */}
      <div id="admin-secondary-metrics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Popular Products</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {products.slice(0, 4).map((p, index) => (
              <div key={p.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-4">#{index + 1}</span>
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 dark:border-slate-750 p-0.5">
                  {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                    <img src={getProductImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                  ) : (
                    <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400">{p.category}</p>
                </div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Transactions</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Order #{o.id.substr(0, 8)}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400">{o.address.name} • {o.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">${o.total.toFixed(2)}</p>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
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
