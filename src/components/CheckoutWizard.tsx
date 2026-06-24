/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, ShoppingBag, MapPin, CreditCard, ChevronRight, Check } from 'lucide-react';
import { CartItem, Order } from '../types';
import { ProductSVG } from './ProductSVG';

interface CheckoutWizardProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '123456789',
    address: '123 Main St, Anytown',
    city: 'New York',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Credit Card Form State
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvc: '',
    country: 'United States',
    zip: '',
  });

  const [isPaying, setIsPaying] = useState(false);

  // Calculate pricing
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    return subtotal * 0.10; // 10% discount
  }, [subtotal]);

  const shippingFee = subtotal > 0 ? 10.00 : 0.00;

  const total = useMemo(() => {
    return subtotal - discount + shippingFee;
  }, [subtotal, discount, shippingFee]);

  // Confetti particles generator
  const confettiParticles = useMemo(() => {
    if (step !== 4) return [];
    return Array.from({ length: 120 }).map((_, i) => {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6'];
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        top: `${-10 - Math.random() * 20}%`,
        size: `${Math.random() * 12 + 6}px`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 3 + 2.5}s`,
        angle: `${Math.random() * 360}deg`,
        shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm',
      };
    });
  }, [step]);

  // Expose error checking on Step 2
  const handleAddressContinue = () => {
    const errors: Record<string, string> = {};

    if (!addressForm.name.trim()) {
      errors.name = 'Name is required!';
    }
    if (!addressForm.email.trim()) {
      errors.email = 'Email address is required!';
    } else if (!/\S+@\S+\.\S+/.test(addressForm.email)) {
      errors.email = 'Invalid email address!';
    }
    if (!addressForm.phone.trim()) {
      errors.phone = 'Phone number is required!';
    } else {
      const digits = addressForm.phone.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 10) {
        errors.phone = 'Phone number must be between 7 and 10 digits!';
      }
    }
    if (!addressForm.address.trim()) {
      errors.address = 'Address is required!';
    }
    if (!addressForm.city.trim()) {
      errors.city = 'City is required!';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep(3);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate payment loading
    setTimeout(() => {
      setIsPaying(false);
      setStep(4);

      // Create new order object
      const newOrder: Order = {
        id: 'ord-' + Math.random().toString(36).substr(2, 9),
        total: total,
        status: 'success',
        date: new Date().toLocaleDateString(),
        products: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor.name,
          price: item.product.price,
        })),
        address: { ...addressForm },
      };

      onOrderPlaced(newOrder);
      onClearCart();
    }, 1800);
  };

  // Card number auto-spacing format helper
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setCardForm({ ...cardForm, number: parts.join(' ') });
  };

  return (
    <div id="checkout-funnel" className="w-full max-w-7xl mx-auto py-8 px-4 font-sans text-slate-800">
      {/* Confetti overlay for Success Page */}
      {step === 4 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className={`absolute animate-bounce ${p.shape}`}
              style={{
                left: p.left,
                top: '110%',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                animation: `fall ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
                transform: `rotate(${p.angle})`,
                opacity: 0.8,
              }}
            />
          ))}
          <style>{`
            @keyframes fall {
              0% { top: -10%; transform: translateY(0) rotate(0deg); }
              100% { top: 110%; transform: translateY(100vh) rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Stepper Header */}
      {step < 4 && (
        <div id="stepper-progress" className="max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Your Shopping Cart</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10"></div>
            {[
              { num: 1, label: 'Shopping Cart', icon: <ShoppingBag className="w-4 h-4" /> },
              { num: 2, label: 'Shipping Address', icon: <MapPin className="w-4 h-4" /> },
              { num: 3, label: 'Payment Method', icon: <CreditCard className="w-4 h-4" /> },
            ].map((s) => {
              const active = step >= s.num;
              return (
                <button
                  key={s.num}
                  id={`checkout-step-btn-${s.num}`}
                  onClick={() => {
                    // Only let them navigate back to step they already cleared
                    if (s.num === 1 && step < 4) setStep(1);
                    if (s.num === 2 && step >= 2 && step < 4) setStep(2);
                  }}
                  className={`flex flex-col items-center gap-2 cursor-pointer focus:outline-none`}
                  disabled={step === 4 || (s.num === 3 && step < 3) || (s.num === 2 && step < 2)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-bold transition-all ${
                      active ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: SHOPPING CART */}
      {step === 1 && (
        <div id="step-1-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-6">
            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-700">Your cart is empty</h3>
                <p className="text-slate-400">Head back to the storefront to add some products!</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                  id={`cart-item-${index}`}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    {item.product.image && (item.product.image.startsWith('http://') || item.product.image.startsWith('https://') || item.product.image.includes('/')) ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ProductSVG type={item.product.image} color={item.selectedColor.value} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-slate-900 text-base">{item.product.name}</h3>
                    <p className="text-xs text-slate-400">Quantity: {item.quantity}</p>
                    <p className="text-xs text-slate-500">Size: {item.selectedSize}</p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs text-slate-500">Color:</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"
                        style={{ backgroundColor: item.selectedColor.value }}
                        title={item.selectedColor.name}
                      ></span>
                    </div>
                  </div>

                  {/* Quantity adjustment & Pricing */}
                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 transition-colors font-bold cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold text-xs text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 transition-colors font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-base">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-400">
                          (${item.product.price.toFixed(2)} x {item.quantity})
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Summary Sidepanel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Cart Details</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span id="summary-subtotal" className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount(10%)</span>
                <span id="summary-discount" className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span id="summary-shipping" className="font-bold text-slate-900">+${shippingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total</span>
                <span id="summary-total" className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="cart-continue-btn"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              disabled={cart.length === 0}
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SHIPPING ADDRESS FORM */}
      {step === 2 && (
        <div id="step-2-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Shipping Address</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  id="ship-name-input"
                  type="text"
                  placeholder="John Doe"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-50 rounded-xl border outline-none text-sm ${
                    formErrors.name ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {formErrors.name && <p id="error-name" className="text-xs text-rose-500 font-medium">{formErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  id="ship-email-input"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={addressForm.email}
                  onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-50 rounded-xl border outline-none text-sm ${
                    formErrors.email ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {formErrors.email && <p id="error-email" className="text-xs text-rose-500 font-medium">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                <input
                  id="ship-phone-input"
                  type="text"
                  placeholder="123456789"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-50 rounded-xl border outline-none text-sm ${
                    formErrors.phone ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {formErrors.phone && <p id="error-phone" className="text-xs text-rose-500 font-medium">{formErrors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
                  <input
                    id="ship-address-input"
                    type="text"
                    placeholder="123 Main St, Anytown"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border outline-none text-sm ${
                      formErrors.address ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {formErrors.address && <p id="error-address" className="text-xs text-rose-500 font-medium">{formErrors.address}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <input
                    id="ship-city-input"
                    type="text"
                    placeholder="New York"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border outline-none text-sm ${
                      formErrors.city ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {formErrors.city && <p id="error-city" className="text-xs text-rose-500 font-medium">{formErrors.city}</p>}
                </div>
              </div>
            </div>

            <button
              id="address-continue-btn"
              onClick={handleAddressContinue}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Checkout Right summary panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Cart Details</h3>
            <div className="space-y-3 text-sm border-b border-slate-100 pb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 max-w-[150px] truncate">{item.product.name} (x{item.quantity})</span>
                  <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount(10%)</span>
                <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">+${shippingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT METHOD FORM */}
      {step === 3 && (
        <div id="step-3-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Card Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Payment Method</h3>

            {/* Simulated credit card widget */}
            <div className="bg-gradient-to-r from-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden max-w-sm mx-auto mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-10">
                <div className="w-10 h-7 bg-amber-400/80 rounded-md"></div>
                <div className="flex gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <div className="w-6 h-6 rounded-full bg-amber-500/80 -ml-3"></div>
                </div>
              </div>
              <p className="text-lg tracking-widest font-mono mb-4">
                {cardForm.number || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between font-mono text-[10px]">
                <div>
                  <p className="text-[8px] text-indigo-200 uppercase">Card Holder</p>
                  <p className="font-bold uppercase">{addressForm.name || 'John Doe'}</p>
                </div>
                <div>
                  <p className="text-[8px] text-indigo-200 uppercase">Expires</p>
                  <p className="font-bold">{cardForm.expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <input
                    id="card-number-input"
                    type="text"
                    required
                    placeholder="1234 1234 1234 1234"
                    value={cardForm.number}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <span className="text-xs bg-indigo-50 border border-indigo-150 text-indigo-600 font-bold px-1 rounded">VISA</span>
                    <span className="text-xs bg-amber-50 border border-amber-150 text-amber-600 font-bold px-1 rounded">MC</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiration Date</label>
                  <input
                    id="card-expiry-input"
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Code (CVC)</label>
                  <input
                    id="card-cvc-input"
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                  <select
                    id="card-country-select"
                    value={cardForm.country}
                    onChange={(e) => setCardForm({ ...cardForm, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ZIP Code</label>
                  <input
                    id="card-zip-input"
                    type="text"
                    required
                    placeholder="12345"
                    value={cardForm.zip}
                    onChange={(e) => setCardForm({ ...cardForm, zip: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Payment Overlay Loading */}
              {isPaying ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500 font-bold">Processing Secure Payment via Stripe...</p>
                </div>
              ) : (
                <button
                  id="card-pay-btn"
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer mt-4"
                >
                  Pay ${total.toFixed(2)}
                </button>
              )}
            </form>
          </div>

          {/* Pricing summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Cart Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount(10%)</span>
                <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">+${shippingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-150">
              By clicking Pay, you agree to our <span className="underline">Terms & Conditions</span> and <span className="underline">Refund Policies</span>.
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS PAGE */}
      {step === 4 && (
        <div id="payment-success-card" className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 my-10 py-12 relative z-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
            ✓
          </div>
          <div className="space-y-2">
            <h2 id="success-title" className="text-2xl font-black text-emerald-600">Successful Payment</h2>
            <p id="success-desc-1" className="text-sm font-semibold text-slate-500">Payment complete</p>
            <p id="success-desc-2" className="text-xs text-slate-400 font-bold">Payment Status: <span className="text-slate-800">paid</span></p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs text-slate-500 flex flex-col gap-2">
            <p>Order processed successfully!</p>
            <p className="font-bold">A confirmation email was dispatched to {addressForm.email}</p>
          </div>

          <button
            id="success-view-orders-btn"
            onClick={() => setStep(1)} // Reset checkout view for next use
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            See your orders
          </button>
        </div>
      )}
    </div>
  );
};
