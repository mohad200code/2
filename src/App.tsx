/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Home,
  Bell,
  ShoppingBag,
  Search,
  Check,
  X,
  User,
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
} from 'lucide-react';

import { Product, User as UserType, Order, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, CATEGORIES } from './mockData';
import { ProductSVG } from './components/ProductSVG';
import { ClerkAuth } from './components/ClerkAuth';
import { GmailInbox } from './components/GmailInbox';
import { CheckoutWizard } from './components/CheckoutWizard';
import { AdminOverview } from './components/AdminOverview';
import { AdminUsers } from './components/AdminUsers';

export default function App() {
  // Navigation & Screen View State
  const [view, setView] = useState<'store' | 'product-details' | 'cart' | 'admin' | 'auth' | 'gmail' | 'orders'>('store');
  const [adminSubView, setAdminSubView] = useState<'overview' | 'users'>('overview');

  // Main Database States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Selected details targets
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  // Store filter/search state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Interactive product card color overrides
  const [productColorOverrides, setProductColorOverrides] = useState<Record<string, { name: string; value: string }>>({});

  // Slide-out Drawer for Admin: Add Product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
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

  // Mock Connected user context
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'admin' | 'user' } | null>({
    email: 'lamadevtest@gmail.com',
    role: 'admin',
  });

  // Action Helpers: Trigger system toast notification
  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Add Item to cart with support for custom sizes and colors
  const handleAddToCart = (product: Product, qty: number, size: string, color: { name: string; value: string }) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: qty, selectedSize: size, selectedColor: color }]);
    }
    triggerToast(`Added ${qty}x ${product.name} to your cart.`, 'success');
  };

  // Storefront Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  // Handler for dynamic Add Product drawer form
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      description: newProductForm.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      shortDescription: newProductForm.shortDescription || 'Short product description.',
      price: priceNum,
      category: newProductForm.category,
      sizes: newProductForm.sizes.length > 0 ? newProductForm.sizes : ['S', 'M', 'XL'],
      colors: newProductForm.colors.length > 0 ? newProductForm.colors : [{ name: 'white', value: '#F8FAFC' }],
      image: newProductForm.image,
      rating: 4.5
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    triggerToast(`Successfully created ${newProd.name}!`, 'success');

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

  // User Bulk deletion callback
  const handleDeleteUsers = (idsToDelete: string[]) => {
    setUsers(users.filter((u) => !idsToDelete.includes(u.id)));
  };

  // Switcher helper
  const handleAuthSuccess = (email: string) => {
    const isAdmin = email.includes('admin') || email === 'lamadevtest@gmail.com';
    setCurrentUser({ email, role: isAdmin ? 'admin' : 'user' });
    triggerToast(`Signed in successfully as ${email}!`, 'success');
    setView('store');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out successfully', 'success');
    setView('store');
    setIsProfileDropdownOpen(false);
  };

  return (
    <div id="application-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-150">
      
      {/* GLOBAL SYSTEM BAR / TOP CONTROLS BRIDGE */}
      <div id="system-header-bridge" className="bg-[#1E293B] text-slate-300 text-[11px] font-bold px-6 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 w-2 h-2 rounded-full inline-block animate-pulse"></span>
          <span className="text-slate-200">TRENDLAMA LIVE PREVIEW</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('gmail')}
            className={`hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded ${
              view === 'gmail' ? 'bg-slate-700 text-white' : ''
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulated Gmail Inbox</span>
          </button>
          <div className="w-px h-3.5 bg-slate-700"></div>
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
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE WEB NAVIGATION BAR */}
      <header id="main-navbar" className="bg-white border-b border-slate-200 h-16 sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => setView('store')} className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2 cursor-pointer">
            <span className="bg-slate-900 text-white px-2.5 py-1 rounded-xl text-sm font-bold shadow-md">T</span>
            <span>TRENDLAMA.</span>
          </button>

          {/* Catalog Filter Header search inputs */}
          {view === 'store' && (
            <div id="navbar-search" className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-box"
                type="text"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-4 relative">
          <button onClick={() => setView('store')} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Storefront">
            <Home className="w-5 h-5 text-slate-600" />
          </button>

          {/* Cart Bag with dynamic numbers badge */}
          <button onClick={() => setView('cart')} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer relative" title="View Shopping Cart">
            <ShoppingBag className="w-5 h-5 text-slate-600" />
            {cart.length > 0 && (
              <span id="cart-badge" className="absolute top-1 right-1 bg-indigo-600 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-bounce">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

          {/* User profile section */}
          <div className="relative">
            <button
              id="avatar-trigger"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden hover:border-slate-400 transition-colors cursor-pointer"
            >
              {currentUser ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>

            {/* User drop menu context menu */}
            {isProfileDropdownOpen && (
              <div id="profile-dropdown-box" className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-2 text-xs font-sans">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                      <p className="font-bold text-slate-900 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">
                        {currentUser.role} account
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setView('orders');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      <span>Your Orders Tracker</span>
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setView('admin');
                          setAdminSubView('overview');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 font-semibold text-rose-600 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setView('auth');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Login / Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* VIEW PANEL ROUTING ENGINES */}
      <main className="flex-1">

        {/* 1. STOREFRONT VIEW */}
        {view === 'store' && (
          <div id="storefront-page" className="space-y-8 pb-16">
            
            {/* HERO BANNER SECTION (Image 1 & 2) */}
            <section id="hero-banner" className="max-w-7xl mx-auto mt-6 px-4">
              <div className="bg-amber-100 rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[340px] shadow-sm border border-amber-200">
                {/* Floating Wave/Spindle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-transparent to-transparent pointer-events-none" />
                
                <div className="space-y-4 max-w-lg relative z-10 text-center md:text-left">
                  <span className="text-xs bg-amber-200/80 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Season Promo Pack
                  </span>
                  <h1 id="hero-heading" className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                    SHOW <br />
                    Your Style.
                  </h1>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Elevate your look with the fresh new lineup of Trendlama sneakers, hoodies, and jackets.
                  </p>
                  <button
                    onClick={() => setActiveCategory('Shoes')}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    Shop Shoes Now
                  </button>
                </div>

                {/* Sneaker illustration */}
                <div className="w-72 h-72 md:w-[350px] md:h-[350px] shrink-0 relative mt-6 md:mt-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-2xl animate-pulse" />
                  <div className="relative rotate-[-12deg] hover:rotate-[-4deg] transition-transform duration-300 cursor-grab max-h-[300px] max-w-[300px]">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"
                      alt="Hero Sneaker"
                      className="w-full h-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORIES HORIZONTAL NAVIGATION (Image 1 & 2) */}
            <section id="categories-row" className="max-w-7xl mx-auto px-4 space-y-4">
              <h3 className="font-black text-lg text-slate-900 tracking-tight uppercase">Explore Categories</h3>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      id={`category-tab-${cat.toLowerCase()}`}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-103'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* PRODUCTS GRID INDEX */}
            <section id="products-catalog" className="max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p id="catalog-count" className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Showing {filteredProducts.length} results
                </p>
                {activeCategory !== 'All' && (
                  <button onClick={() => setActiveCategory('All')} className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                    Clear filter
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-4xl block">🔍</span>
                  <p className="text-slate-500 font-bold text-sm">No products fit your search parameters.</p>
                  <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl">
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => {
                    // Check if user clicked an override color bubble for this specific product card
                    const activeColor = productColorOverrides[p.id] || p.colors[0];

                    return (
                      <div
                        key={p.id}
                        id={`product-card-${p.id}`}
                        className="bg-white rounded-[24px] border border-slate-200 p-4.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
                      >
                        {/* Real or Vector Image preview block */}
                        <div
                          onClick={() => {
                            setSelectedProduct(p);
                            setSelectedSize(p.sizes[0]);
                            setSelectedColor(p.colors[0]);
                            setDetailQty(1);
                            setView('product-details');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 rounded-2xl h-48 flex items-center justify-center p-4 relative overflow-hidden transition-all cursor-pointer"
                        >
                          {p.image && (p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.includes('/')) ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ProductSVG type={p.image} color={activeColor.value} />
                          )}
                          {p.rating && (
                            <span className="absolute top-3.5 right-3.5 bg-white border border-slate-150 px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-700 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {p.rating}
                            </span>
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="mt-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4
                              onClick={() => {
                                setSelectedProduct(p);
                                setSelectedSize(p.sizes[0]);
                                setSelectedColor(p.colors[0]);
                                setDetailQty(1);
                                setView('product-details');
                              }}
                              className="font-bold text-slate-800 text-sm leading-tight hover:text-indigo-600 cursor-pointer transition-colors"
                            >
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2">{p.shortDescription}</p>
                          </div>

                          {/* Color override bubbles inside card row (Image 1 & 2) */}
                          <div className="flex items-center gap-1.5 mt-3">
                            {p.colors.map((c) => {
                              const isSel = activeColor.name === c.name;
                              return (
                                <button
                                  key={c.name}
                                  id={`card-color-${p.id}-${c.name}`}
                                  onClick={() => {
                                    setProductColorOverrides({
                                      ...productColorOverrides,
                                      [p.id]: c
                                    });
                                  }}
                                  className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${
                                    isSel ? 'ring-2 ring-slate-800 scale-110' : 'border-slate-300'
                                  }`}
                                  style={{ backgroundColor: c.value }}
                                  title={c.name}
                                />
                              );
                            })}
                          </div>

                          {/* Price & Add button footer */}
                          <div className="flex items-center justify-between mt-4.5 pt-3 border-t border-slate-100 shrink-0">
                            <p id={`price-txt-${p.id}`} className="font-extrabold text-slate-900 text-base">
                              ${p.price.toFixed(2)}
                            </p>
                            <button
                              id={`add-to-cart-btn-${p.id}`}
                              onClick={() => handleAddToCart(p, 1, p.sizes[0], activeColor)}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* 2. PRODUCT DETAILED VIEW (Image 5 & 6) */}
        {view === 'product-details' && selectedProduct && (
          <div id="product-details-page" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-800">
            {/* Back anchor link */}
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors mb-8 cursor-pointer"
            >
              ← Back to storefront
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Product Preview layout */}
              <div className="bg-slate-100 rounded-[32px] p-10 flex items-center justify-center min-h-[400px] border border-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/30 to-transparent pointer-events-none" />
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  {selectedProduct.image && (selectedProduct.image.startsWith('http://') || selectedProduct.image.startsWith('https://') || selectedProduct.image.includes('/')) ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain mix-blend-multiply rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ProductSVG type={selectedProduct.image} color={selectedColor?.value || '#94A3B8'} className="w-full h-full" />
                  )}
                </div>
              </div>

              {/* Configurations Panel */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <h2 id="details-title" className="text-3xl font-black text-slate-900 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-slate-400 font-bold ml-1">4.8 Rating</span>
                  </div>
                </div>

                <p id="details-price" className="text-2xl font-black text-slate-900">
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <p id="details-description" className="text-xs text-slate-500 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Configurations parameters */}
                <div className="space-y-4 pt-3 border-t border-slate-150">
                  
                  {/* Sizes button choice */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Size</span>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((sz) => {
                        const isS = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            id={`details-size-${sz}`}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              isS
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-103'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
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
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Color</span>
                    <div className="flex gap-2.5">
                      {selectedProduct.colors.map((c) => {
                        const isC = selectedColor?.name === c.name;
                        return (
                          <button
                            key={c.name}
                            id={`details-color-${c.name}`}
                            onClick={() => setSelectedColor(c)}
                            className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                              isC ? 'ring-2 ring-slate-800 scale-110 shadow-sm' : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity and Checkout interaction buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-3 border-t border-slate-150">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                        className="px-4 py-3 hover:bg-slate-200 text-slate-600 transition-colors font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-5 font-bold text-xs">{detailQty}</span>
                      <button
                        onClick={() => setDetailQty(detailQty + 1)}
                        className="px-4 py-3 hover:bg-slate-200 text-slate-600 transition-colors font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id="details-add-cart-btn"
                      onClick={() => handleAddToCart(selectedProduct, detailQty, selectedSize, selectedColor || selectedProduct.colors[0])}
                      className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full"
                    >
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

                {/* Secure trust guarantee tags (Image 6) */}
                <div className="pt-6 border-t border-slate-150 space-y-4">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Free shipping on orders above $100. Standard dispatch within 24 hours.</span>
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">We accept:</span>
                    {['Visa', 'Klarna', 'Mastercard', 'Stripe', 'Paypal'].map((trust) => (
                      <span key={trust} className="text-[9px] bg-slate-150 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-200">
                        {trust}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CART CHECKOUT VIEW (Images 7-11) */}
        {view === 'cart' && (
          <CheckoutWizard
            cart={cart}
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
            }}
          />
        )}

        {/* 4. ORDERS VIEW (Image 13) */}
        {view === 'orders' && (
          <div id="customer-orders-panel" className="max-w-7xl mx-auto py-10 px-4 font-sans text-slate-800 space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Order History</h2>
              <p className="text-xs text-slate-400">Review status and confirmation metrics of placed orders</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <p className="text-4xl">📦</p>
                <h3 className="text-sm font-bold text-slate-500">You haven't placed any orders yet.</h3>
                <button onClick={() => setView('store')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
                  Browse products
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-4">Date</th>
                        <th className="py-4 px-4">Products</th>
                        <th className="py-4 px-4">Address</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900">
                            #{o.id.substr(0, 10)}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {o.date}
                          </td>
                          <td className="py-4 px-4">
                            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                              {o.products.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} <span className="font-bold text-slate-500">(x{item.quantity})</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            <p className="font-bold text-slate-800">{o.address.name}</p>
                            <p>{o.address.address}, {o.address.city}</p>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-950">
                            ${o.total.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full inline-block animate-pulse"></span>
                              <span>{o.status}</span>
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

        {/* 5. GMAIL INBOX SIMULATION (Image 12) */}
        {view === 'gmail' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            <GmailInbox
              latestOrder={orders[0] || null}
              onViewOrders={() => setView('orders')}
            />
          </div>
        )}

        {/* 6. CLERK AUTHENTICATOR (Image 22) */}
        {view === 'auth' && (
          <ClerkAuth
            onSuccess={handleAuthSuccess}
            onClose={() => setView('store')}
          />
        )}

        {/* 7. ADMINISTRATIVE DASHBOARD PORTAL (Images 14-22) */}
        {view === 'admin' && currentUser?.role === 'admin' && (
          <div id="admin-panel-layout" className="flex bg-[#0f111a] text-slate-100 min-h-[calc(100vh-4rem)]">
            
            {/* STYLISH LEFT SIDEBAR COLUMN (Image 14) */}
            <aside id="admin-sidebar" className="w-64 bg-[#0a0b10] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 hidden md:flex font-sans">
              <div className="space-y-6">
                
                {/* Branding header logo */}
                <div className="flex items-center gap-2.5 px-2 pb-2 border-b border-slate-800/60">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                    L
                  </div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight text-white block">Lama Dev</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5">Administrator</span>
                  </div>
                </div>

                {/* Actions Nav Group */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2">Application</p>
                    <button
                      id="sidebar-nav-overview"
                      onClick={() => setAdminSubView('overview')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        adminSubView === 'overview'
                          ? 'bg-slate-800 text-white shadow-lg shadow-indigo-900/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <Home className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Home Overview</span>
                    </button>
                    <button onClick={() => setView('gmail')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/40 cursor-pointer">
                      <Mail className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Inbox (Simulated)</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2">E-Commerce</p>
                    <button
                      id="sidebar-nav-add-prod"
                      onClick={() => setIsAddProductOpen(true)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/40 cursor-pointer text-left"
                    >
                      <PlusCircle className="w-4.5 h-4.5 text-indigo-400" />
                      <span>Add Product</span>
                    </button>
                    <button
                      id="sidebar-nav-users"
                      onClick={() => setAdminSubView('users')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        adminSubView === 'users'
                          ? 'bg-slate-800 text-white shadow-lg shadow-indigo-900/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <Users className="w-4.5 h-4.5 text-indigo-400" />
                      <span>See All Users</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected administrator Profile widget */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="admin"
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-200 truncate">John Doe</p>
                  <p className="text-[10px] text-slate-500 font-sans truncate">Admin account</p>
                </div>
              </div>
            </aside>

            {/* DASHBOARD CONTENT SPACE */}
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-5xl">
              
              {/* Header Title Controls */}
              <div id="admin-subheader" className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h2 id="admin-subview-heading" className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                    {adminSubView === 'overview' ? 'DASHBOARD PORTAL' : 'CUSTOMER DIRECTORY'}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {adminSubView === 'overview' ? 'Trendlama overall metrics overview' : 'Perform user bans and deletions'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Create Product</span>
                  </button>
                </div>
              </div>

              {/* Dynamic admin child routing */}
              {adminSubView === 'overview' ? (
                <AdminOverview products={products} orders={orders} />
              ) : (
                <AdminUsers users={users} onDeleteUsers={handleDeleteUsers} onToast={triggerToast} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER MULTI-COLUMN DESIGN (Sleek Theme) */}
      <footer id="global-footer" className="bg-slate-900 border-t border-slate-800/80 text-slate-400 text-xs py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-black tracking-tighter text-white">TRENDLAMA.</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Premium apparel and footwear designed with comfort and street-fashion aesthetics at the center.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">Customer Support</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li><a href="#" className="hover:text-slate-300">Track Shipping Details</a></li>
              <li><a href="#" className="hover:text-slate-300">Easy Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-slate-300">Stripe Secure Payments</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">Company Information</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li><a href="#" className="hover:text-slate-300">About Trendlama Dev</a></li>
              <li><a href="#" className="hover:text-slate-300">Join our Design Team</a></li>
              <li><a href="#" className="hover:text-slate-300">Licensing Agreements</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-3">Legal Regulations</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li><a href="#" className="hover:text-slate-300">Privacy Policy Rules</a></li>
              <li><a href="#" className="hover:text-slate-300">Acceptable Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 mt-8 text-center text-slate-500 text-[10px]">
          © {new Date().getFullYear()} Trendlama. Built in high-fidelity for developer sandboxing. All Rights Reserved.
        </div>
      </footer>

      {/* SLIDE-OUT DRAWER OVERLAY: ADD PRODUCT (Image 22) */}
      {isAddProductOpen && (
        <div id="add-product-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div id="add-product-panel" className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-white p-6 overflow-y-auto flex flex-col justify-between font-sans">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-lg tracking-tight uppercase">Add Product</h3>
                <button
                  id="close-drawer-btn"
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input Form Fields */}
              <form id="add-product-form" onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                  <input
                    id="new-prod-name"
                    type="text"
                    required
                    placeholder="Nike Air Zoom Pro"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Short Tagline</label>
                  <input
                    id="new-prod-short"
                    type="text"
                    placeholder="Short summary tagline for catalog overview"
                    value={newProductForm.shortDescription}
                    onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Full Description</label>
                  <textarea
                    id="new-prod-desc"
                    rows={3}
                    placeholder="Full detailed product description page text..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Price ($ USD)</label>
                    <input
                      id="new-prod-price"
                      type="number"
                      required
                      placeholder="69.00"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Category Category</label>
                    <select
                      id="new-prod-category"
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Visual asset picker */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Graphic Visual Vector Layout</label>
                  <select
                    id="new-prod-image"
                    value={newProductForm.image.startsWith('http') ? 'tshirt' : newProductForm.image}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                  >
                    <option value="tshirt">👕 Casual T-Shirt Outlines</option>
                    <option value="shoe">👟 Running Sneaker Silhouettes</option>
                    <option value="hoodie">🧥 Warm Fleece Hoodies</option>
                    <option value="shirt">👔 Denim Collar Shirt Overlay</option>
                  </select>
                </div>

                {/* Real Product Image URL */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Real Product Image URL (Optional)</label>
                  <input
                    id="new-prod-img-url"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProductForm.image.startsWith('http') ? newProductForm.image : ''}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setNewProductForm({ 
                        ...newProductForm, 
                        image: val || 'tshirt' // Fallback to 'tshirt' if empty
                      });
                    }}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-750 focus:border-indigo-500 rounded-xl outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Provide an image URL (e.g., from Unsplash) to render a real photograph instead of a vector illustration.</p>
                </div>

                {/* Sizes quick config checkbox array */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Include Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'XL', 'XXL', '38', '40', '42'].map((sz) => {
                      const exists = newProductForm.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          id={`drawer-size-${sz}`}
                          onClick={() => {
                            const updated = exists
                              ? newProductForm.sizes.filter(s => s !== sz)
                              : [...newProductForm.sizes, sz];
                            setNewProductForm({ ...newProductForm, sizes: updated });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                            exists
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors custom indicator selector (Image 22) */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">Include Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'white', value: '#F8FAFC' },
                      { name: 'pink', value: '#FDA4AF' },
                      { name: 'orange', value: '#F97316' },
                      { name: 'grey', value: '#94A3B8' },
                      { name: 'green', value: '#15803D' },
                      { name: 'blue', value: '#1D4ED8' },
                      { name: 'black', value: '#1E293B' }
                    ].map((col) => {
                      const exists = newProductForm.colors.some(c => c.name === col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          id={`drawer-color-${col.name}`}
                          onClick={() => {
                            const updated = exists
                              ? newProductForm.colors.filter(c => c.name !== col.name)
                              : [...newProductForm.colors, col];
                            setNewProductForm({ ...newProductForm, colors: updated });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            exists
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full inline-block border border-slate-600/50" style={{ backgroundColor: col.value }} />
                          <span className="capitalize text-[10px]">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  id="drawer-submit-btn"
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer mt-4"
                >
                  Create Product Catalog Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ALERT/NOTIFICATION TOAST OVERLAY (Image 4) */}
      {toast && (
        <div
          id="toast-alert"
          onClick={() => {
            setView('cart');
            setToast(null);
          }}
          className={`fixed bottom-6 right-6 z-50 p-4.5 rounded-2xl shadow-xl border flex items-center justify-between gap-4 cursor-pointer transition-all transform translate-y-0 hover:translate-y-[-2px] animate-fade-in ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-emerald-500 text-lg font-black bg-emerald-500/10 p-1.5 rounded-xl">✓</span>
            <div className="text-left font-sans text-xs">
              <p className="font-bold">{toast.message}</p>
              {toast.type !== 'error' && (
                <p className="text-[10px] text-slate-400 mt-0.5">Click here to view shopping cart</p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToast(null);
            }}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
