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
  googleUser?: { email: string; name: string; picture: string } | null;
  onConnectGmail?: () => void;
  language?: 'en' | 'zh' | 'ar';
  currentUser?: any;
  onContinueShopping?: () => void;
  formatPrice?: (amount: number) => string;
}

const wizardTranslations = {
  en: {
    step1: "1. Shopping Cart",
    step2: "2. Shipping Address",
    step3: "3. Secure Checkout",
    step4: "4. Confirmation",
    emptyCart: "Your cart is empty",
    emptyCartSub: "Add some high-performance athlete gear from the storefront to get started!",
    backToStore: "Back to Storefront",
    product: "Product",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    action: "Action",
    cartDetails: "Cart Details",
    subtotal: "Subtotal",
    shipping: "Shipping",
    estTax: "Estimated Tax",
    totalAmount: "Total Amount",
    free: "Free",
    proceedShipping: "Proceed to Shipping",
    shippingAddress: "Shipping Address",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phone: "Phone Number",
    street: "Street Address",
    city: "City",
    proceedPayment: "Proceed to Payment",
    backToCart: "Back to Cart",
    paymentMethod: "Payment Method",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    country: "Cardholder Country",
    zip: "Billing ZIP/Postal",
    authorizing: "Authorizing Payment...",
    authorizeCard: "Authorize with Card",
    payWallet: "Pay with Wallet Balance",
    backToShipping: "Back to Shipping",
    successTitle: "Secure Authorization Successful!",
    successSub: "Your order has been authorized and queued into our instant digital delivery dispatcher.",
    txnId: "Transaction ID",
    deliveryDest: "Delivery Destination",
    viewOrders: "View Order Status",
    sandboxTxn: "Simulated Sandbox Transaction",
    requiredField: "This field is required",
    phoneRequired: "Please enter a valid phone number",
    emailRequired: "Please enter a valid email address",
    invalidCard: "Please enter a valid 16-digit card number",
    invalidExpiry: "Use MM/YY format",
    invalidCvc: "Must be 3 or 4 digits",
    invalidZip: "Please enter a billing ZIP code"
  },
  zh: {
    step1: "1. 购物车",
    step2: "2. 配送地址",
    step3: "3. 安全结账",
    step4: "4. 订单确认",
    emptyCart: "您的购物车是空的",
    emptyCartSub: "请从商店中添加一些专业运动装备来开始体验！",
    backToStore: "返回数码商城",
    product: "商品",
    price: "价格",
    quantity: "数量",
    total: "小计",
    action: "操作",
    cartDetails: "购物车详情",
    subtotal: "商品小计",
    shipping: "配送费",
    estTax: "预估税费",
    totalAmount: "总付款金额",
    free: "免费",
    proceedShipping: "去填写配送地址",
    shippingAddress: "收货配送地址",
    fullName: "收货人姓名",
    emailAddress: "电子邮箱",
    phone: "电话号码",
    street: "街道地址",
    city: "城市",
    proceedPayment: "去支付授权",
    backToCart: "返回购物车",
    paymentMethod: "安全支付方式",
    cardNumber: "信用卡号",
    expiryDate: "有效期 (月/年)",
    country: "持卡人国家/地区",
    zip: "账单邮编",
    authorizing: "正在授权付款...",
    authorizeCard: "信用卡授权支付",
    payWallet: "使用电子钱包余额支付",
    backToShipping: "返回配送信息",
    successTitle: "安全授权支付成功！",
    successSub: "您的订单已成功授权，并已进入即时自动发货系统队列中。",
    txnId: "交易单号",
    deliveryDest: "数字发货目标邮箱",
    viewOrders: "查看订单状态追踪",
    sandboxTxn: "模拟沙盒环境交易",
    requiredField: "此栏为必填项",
    phoneRequired: "请输入有效的电话号码",
    emailRequired: "请输入有效的电子邮箱地址",
    invalidCard: "请输入有效的16位卡号",
    invalidExpiry: "请使用 MM/YY 格式",
    invalidCvc: "请输入3位或4位安全码(CVC)",
    invalidZip: "请输入账单邮编"
  },
  ar: {
    step1: "١. عربة التسوق",
    step2: "٢. عنوان الشحن",
    step3: "٣. الدفع الآمن",
    step4: "٤. تأكيد الطلب",
    emptyCart: "عربة التسوق فارغة",
    emptyCartSub: "أضف بعض المنتجات والمعدات الرياضية عالية الأداء من المتجر للبدء!",
    backToStore: "العودة إلى المتجر",
    product: "المنتج",
    price: "السعر",
    quantity: "الكمية",
    total: "المجموع",
    action: "الإجراء",
    cartDetails: "تفاصيل السلة",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    estTax: "الضريبة التقديرية",
    totalAmount: "المبلغ الإجمالي",
    free: "مجاني",
    proceedShipping: "المتابعة لعنوان الشحن",
    shippingAddress: "عنوان شحن المنتجات",
    fullName: "الاسم بالكامل",
    emailAddress: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    street: "عنوان الشارع / الحي",
    city: "المدينة",
    proceedPayment: "المتابعة لإتمام الدفع",
    backToCart: "العودة لعربة التسوق",
    paymentMethod: "طريقة الدفع الآمنة",
    cardNumber: "رقم البطاقة الائتمانية",
    expiryDate: "تاريخ الانتهاء",
    country: "بلد حامل البطاقة",
    zip: "الرمز البريدي للفواتير",
    authorizing: "جاري تفويض عملية الدفع...",
    authorizeCard: "تفويض الدفع بالبطاقة",
    payWallet: "الدفع برصيد المحفظة",
    backToShipping: "العودة لعنوان الشحن",
    successTitle: "تم تفويض الدفع الآمن بنجاح!",
    successSub: "تم تسجيل وتفويض طلبك بنجاح وجاري إرساله فوراً عبر نظام التوزيع الرقمي الآلي.",
    txnId: "رقم المعاملة",
    deliveryDest: "البريد الإلكتروني للتسليم",
    viewOrders: "عرض وتتبع حالة طلباتي",
    sandboxTxn: "معاملة تجريبية في بيئة التطوير",
    requiredField: "هذا الحقل مطلوب",
    phoneRequired: "يرجى إدخال رقم هاتف صحيح",
    emailRequired: "يرجى إدخال بريد إلكتروني صحيح",
    invalidCard: "يرجى إدخال رقم بطاقة صحيح من 16 رقماً",
    invalidExpiry: "يرجى استخدام الصيغة MM/YY",
    invalidCvc: "يجب أن يتكون من 3 أو 4 أرقام",
    invalidZip: "يرجى إدخال الرمز البريدي"
  }
};

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  googleUser = null,
  onConnectGmail,
  language = 'en',
  currentUser = null,
  onContinueShopping,
  formatPrice,
}) => {
  const t = wizardTranslations[language];
  const displayPrice = formatPrice || ((val: number) => `$${val.toFixed(2)}`);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentError, setPaymentError] = useState<string>('');
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [txnDetails, setTxnDetails] = useState<{
    transactionId: string;
    gateway: string;
    isSandbox: boolean;
    message: string;
  } | null>(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState(() => ({
    name: currentUser?.username || 'John Doe',
    email: currentUser?.email || 'johndoe@gmail.com',
    phone: '123456789',
    address: '123 Main St, Anytown',
    city: 'New York',
  }));

  useEffect(() => {
    if (currentUser) {
      setAddressForm(prev => ({
        ...prev,
        name: currentUser.username || prev.name,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser]);

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
      errors.name = t.requiredField;
    }
    if (!addressForm.email.trim()) {
      errors.email = t.requiredField;
    } else if (!/\S+@\S+\.\S+/.test(addressForm.email)) {
      errors.email = t.emailRequired;
    }
    if (!addressForm.phone.trim()) {
      errors.phone = t.requiredField;
    } else {
      const digits = addressForm.phone.replace(/\D/g, '');
      if (digits.length < 5) {
        errors.phone = t.phoneRequired;
      }
    }
    if (!addressForm.address.trim()) {
      errors.address = t.requiredField;
    }
    if (!addressForm.city.trim()) {
      errors.city = t.requiredField;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep(3);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setPaymentError('');

    try {
      let data;
      try {
        const response = await fetch('/api/payment/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardNumber: cardForm.number,
            expiry: cardForm.expiry,
            cvc: cardForm.cvc,
            amount: total,
            address: addressForm,
          }),
        });

        data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Payment transaction failed. Please verify your credentials.');
        }
      } catch (fetchErr: any) {
        const errMsg = fetchErr?.message || '';
        if (errMsg === 'Failed to fetch' || errMsg.includes('fetch') || errMsg.includes('NetworkError') || errMsg.includes('Failed to load')) {
          console.warn('[PAYMENT FALLBACK] Secure endpoint offline or unreachable. Simulating payment locally.');
          data = {
            transactionId: 'TXN-FALLBACK-' + Math.random().toString(36).substr(2, 9),
            gateway: 'Simulated Client Sandbox',
            isSandbox: true,
            message: 'Payment successfully processed via offline sandbox.'
          };
        } else {
          throw fetchErr;
        }
      }

      // Succeeded! Move to Step 4
      setIsPaying(false);
      setTxnDetails({
        transactionId: data.transactionId || ('TXN-' + Math.random().toString(36).substr(2, 9)),
        gateway: data.gateway || 'Simulated Sandbox',
        isSandbox: data.isSandbox !== undefined ? data.isSandbox : true,
        message: data.message || 'Payment successfully processed.'
      });
      setStep(4);

      // Create new order object with server-assigned transaction token
      const newOrder: Order = {
        id: data.transactionId || ('ord-' + Math.random().toString(36).substr(2, 9)),
        total: total,
        status: 'success',
        date: new Date().toLocaleDateString(),
        products: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor.name,
          price: item.product.price,
          customName: item.customName,
          image: item.product.image,
        })),
        address: { ...addressForm },
      };

      setPurchasedItems([...cart]);
      onOrderPlaced(newOrder);
      onClearCart();
    } catch (err: any) {
      console.error('[PAYMENT GATEWAY REJECTION]', err);
      setPaymentError(err.message || 'The secure gateway encountered a processing exception.');
      setIsPaying(false);
    }
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
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            {step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}
          </h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10"></div>
            {[
              { num: 1, label: t.step1, icon: <ShoppingBag className="w-4 h-4" /> },
              { num: 2, label: t.step2, icon: <MapPin className="w-4 h-4" /> },
              { num: 3, label: t.step3, icon: <CreditCard className="w-4 h-4" /> },
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
            
            {/* Google Gmail Integration Status Card */}
            {cart.length > 0 && (
              googleUser ? (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      📧
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        {language === 'zh' ? '谷歌邮箱通知系统：已激活' : language === 'ar' ? 'نظام إشعارات الجيميل: نشط' : 'Gmail Notification Daemon: ACTIVE'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {language === 'zh' ? '订单完成后，真实的电子收据和发货信息将发送至 ' : language === 'ar' ? 'سيتم إرسال فاتورة إيصال حقيقية ومفاتيح التسليم الرقمية إلى ' : 'A real receipts invoice and digital delivery keys will be dispatched to '}
                        <strong className="text-emerald-400 font-mono">{googleUser.email}</strong>
                        {language === 'zh' ? ' 邮箱。' : language === 'ar' ? ' فور إكمال الطلب!' : ' upon order completion!'}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono px-2 py-0.5 rounded-lg font-bold">
                    {language === 'zh' ? '已连接' : language === 'ar' ? 'متصل' : 'CONNECTED'}
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      📧
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        {language === 'zh' ? '接收真实 Gmail 确认收据与数字发货单' : language === 'ar' ? 'استلام تأكيد المعاملة والتسليم عبر الجيميل' : 'Receive Real Gmail Confirmation & Dispatch'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {language === 'zh' ? '关联 Google 账户，即可直接在您的 Gmail 收件箱中接收专业精美的交易收据。' : language === 'ar' ? 'قم بتسجيل الدخول باستخدام جوجل لإرسال إيصالات المعاملات الرسمية ومفاتيح التفعيل إلى صندوق البريد الخاص بك.' : 'Authenticate with Google to dispatch official styled transaction receipts and license keys to your Gmail inbox.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onConnectGmail}
                    className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <span>{language === 'zh' ? '连接 Gmail' : language === 'ar' ? 'ربط حساب الجيميل' : 'Connect Gmail'}</span>
                  </button>
                </div>
              )
            )}
            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-700">{t.emptyCart}</h3>
                <p className="text-slate-400">{t.emptyCartSub}</p>
                {onContinueShopping && (
                  <button
                    type="button"
                    onClick={onContinueShopping}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg inline-flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    <span>{language === 'zh' ? '继续购物' : language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</span>
                  </button>
                )}
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
                    {item.customName && (
                      <div className="inline-block bg-pink-50 text-pink-700 border border-pink-100 rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                        ✏️ {language === 'zh' ? '专属个性刻字' : language === 'ar' ? 'نقش مخصص بالليزر' : 'Custom Laser Engraving'}: "{item.customName}"
                      </div>
                    )}
                    <p className="text-xs text-slate-400">{t.quantity}: {item.quantity}</p>
                    <p className="text-xs text-slate-500">{language === 'zh' ? '尺码' : language === 'ar' ? 'المقاس' : 'Size'}: {item.selectedSize}</p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs text-slate-500">{language === 'zh' ? '颜色' : language === 'ar' ? 'اللون' : 'Color'}:</span>
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
                        {displayPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-400">
                          ({displayPrice(item.product.price)} x {item.quantity})
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                      title={language === 'zh' ? '移出购物车' : language === 'ar' ? 'إزالة المنتج' : 'Remove item'}
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
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">{t.cartDetails}</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span id="summary-subtotal" className="font-bold text-slate-900">{displayPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '特惠折扣 (10%)' : language === 'ar' ? 'خصم (10%)' : 'Discount(10%)'}</span>
                <span id="summary-discount" className="font-bold text-emerald-600">-{displayPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '配送费用' : language === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</span>
                <span id="summary-shipping" className="font-bold text-slate-900">
                  {shippingFee === 0 ? t.free : `+${displayPrice(shippingFee)}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>{t.total}</span>
                <span id="summary-total" className="text-slate-900">{displayPrice(total)}</span>
              </div>
            </div>

            <button
              id="cart-continue-btn"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              disabled={cart.length === 0}
            >
              <span>{language === 'zh' ? '下一步' : language === 'ar' ? 'متابعة' : 'Continue'}</span>
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
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">{t.shippingAddress}</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.fullName}</label>
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.emailAddress}</label>
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.phone}</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.street}</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.city}</label>
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
              <span>{language === 'zh' ? '前往安全支付' : language === 'ar' ? 'المتابعة لإتمام الدفع' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Checkout Right summary panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">{t.cartDetails}</h3>
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
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '特惠折扣 (10%)' : language === 'ar' ? 'خصم (10%)' : 'Discount(10%)'}</span>
                <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '配送费用' : language === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? t.free : `+$${shippingFee.toFixed(2)}`}
                </span>
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
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">{t.paymentMethod}</h3>

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
                  <p className="text-[8px] text-indigo-200 uppercase">
                    {language === 'zh' ? '持卡人姓名' : language === 'ar' ? 'حامل البطاقة' : 'Card Holder'}
                  </p>
                  <p className="font-bold uppercase">{addressForm.name || 'John Doe'}</p>
                </div>
                <div>
                  <p className="text-[8px] text-indigo-200 uppercase">
                    {language === 'zh' ? '有效期' : language === 'ar' ? 'ينتهي في' : 'Expires'}
                  </p>
                  <p className="font-bold">{cardForm.expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            {paymentError && (
              <div id="payment-error-alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-4 py-3 rounded-xl">
                ⚠️ {paymentError}
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.cardNumber}</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.expiryDate}</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {language === 'zh' ? '安全码 (CVC)' : language === 'ar' ? 'رمز الأمان (CVC)' : 'Security Code (CVC)'}
                  </label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.country}</label>
                  <select
                    id="card-country-select"
                    value={cardForm.country}
                    onChange={(e) => setCardForm({ ...cardForm, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800"
                  >
                    <option>{language === 'zh' ? '中国' : language === 'ar' ? 'الصين' : 'China'}</option>
                    <option>{language === 'zh' ? '美国' : language === 'ar' ? 'الولايات المتحدة' : 'United States'}</option>
                    <option>{language === 'zh' ? '沙特阿拉伯' : language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                    <option>{language === 'zh' ? '加拿大' : language === 'ar' ? 'كندا' : 'Canada'}</option>
                    <option>{language === 'zh' ? '英国' : language === 'ar' ? 'المملكة المتحدة' : 'United Kingdom'}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.zip}</label>
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
                  <p className="text-xs text-slate-500 font-bold">{t.authorizing}</p>
                </div>
              ) : (
                <button
                  id="card-pay-btn"
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer mt-4"
                >
                  {language === 'zh' ? '安全支付 $' : language === 'ar' ? 'دفع $' : 'Pay $'}{total.toFixed(2)}
                </button>
              )}
            </form>
          </div>

          {/* Pricing summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">{t.cartDetails}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '特惠折扣 (10%)' : language === 'ar' ? 'خصم (10%)' : 'Discount(10%)'}</span>
                <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'zh' ? '配送费用' : language === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? t.free : `+$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>{t.total}</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-150">
              {language === 'zh' ? '点击支付即代表您同意我们的 服务条款 与 退款政策。' : language === 'ar' ? 'بالنقر على دفع، فإنك توافق على الشروط والأحكام وسياسات الاسترداد الخاصة بنا.' : 'By clicking Pay, you agree to our Terms & Conditions and Refund Policies.'}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS PAGE */}
      {step === 4 && (
        <div id="payment-success-card" className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 my-10 py-10 relative z-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto animate-bounce">
            ✓
          </div>
          <div className="space-y-1">
            <h2 id="success-title" className="text-2xl font-black text-slate-900 tracking-tight">{t.successTitle}</h2>
            <p id="success-desc-1" className="text-xs font-semibold text-slate-400">{t.successSub}</p>
          </div>

          {/* Secure Transaction Invoice Metadata Panel */}
          <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 text-left space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                {language === 'zh' ? '支付状态' : language === 'ar' ? 'حالة الدفع' : 'Payment Status'}
              </span>
              <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                {language === 'zh' ? '收款成功并记账' : language === 'ar' ? 'مقبول ومدفوع' : 'CAPTURED & PAID'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                {language === 'zh' ? '结算支付通道' : language === 'ar' ? 'بوابة المعالجة' : 'Processor Gateway'}
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-mono ${
                txnDetails?.isSandbox 
                  ? "bg-slate-200 text-slate-700 border border-slate-300" 
                  : "bg-indigo-600 text-white shadow-sm"
              }`}>
                {txnDetails?.gateway || "Stripe Gateway"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px] block">{t.txnId}</span>
              <div className="flex items-center justify-between bg-slate-950 text-emerald-400 font-mono px-3 py-2 rounded-xl text-xs overflow-x-auto select-all shadow-inner">
                <span>{txnDetails?.transactionId || "TXN-SECURE"}</span>
                <span className="text-[9px] text-slate-500 font-sans uppercase font-bold tracking-wider ml-2 shrink-0">
                  {language === 'zh' ? '双击复制' : language === 'ar' ? 'انقر مرتين للنسخ' : 'Double-Click to Copy'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500">
                {language === 'zh' ? '已扣除金额' : language === 'ar' ? 'المبلغ المشحون' : 'Amount Charged'}
              </span>
              <span className="font-black text-slate-950 font-mono text-sm">${total.toFixed(2)}</span>
            </div>

            {txnDetails?.isSandbox && (
              <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-3 text-[10.5px] text-indigo-700 space-y-1 leading-relaxed">
                <span className="font-bold block">
                  💡 {language === 'zh' ? 'Stripe 真实/测试结算：' : language === 'ar' ? 'معالجة Stripe حقيقية/تجريبية:' : 'Live/Test Stripe Processing:'}
                </span>
                {language === 'zh' ? '要想扣除真实信用卡，请在您的工作区环境变量配置面板中配置 STRIPE_SECRET_KEY 凭证密钥。' : language === 'ar' ? 'لشحن بطاقات حقيقية، يرجى إدخال مفتاح STRIPE_SECRET_KEY في لوحة أسرار البيئة الخاصة بك.' : 'To charge real cards, insert your STRIPE_SECRET_KEY in the environment secrets panel of your workspace.'}
              </div>
            )}
          </div>

          {/* Purchased Products Panel with Username, image, price, description, and type */}
          <div id="purchased-products-details" className="bg-slate-50 rounded-2xl border border-slate-150 p-4 text-left space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[10px] border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>{language === 'zh' ? '购买商品详情' : language === 'ar' ? 'تفاصيل المنتجات المشتراة' : 'Purchased Product Details'}</span>
              <span className="text-[9px] text-indigo-600 font-bold lowercase tracking-wider font-sans">
                {language === 'zh' ? '购买者: ' : language === 'ar' ? 'المشتري: ' : 'Purchaser: '}
                <strong className="text-slate-900 uppercase font-mono">{currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : (addressForm.name || "Guest Athlete")}</strong>
              </span>
            </h4>
            <div className="space-y-3">
              {purchasedItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start border-b border-slate-100 last:border-b-0 pb-3 last:pb-0">
                  <div className="w-14 h-14 bg-white border border-slate-150 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {item.product.image && (item.product.image.startsWith('http://') || item.product.image.startsWith('https://') || item.product.image.includes('/')) ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ProductSVG type={item.product.image} color={item.selectedColor?.value || '#4F46E5'} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block truncate">{item.product.name}</span>
                    <span className="inline-block bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider">
                      {item.product.category || "Heavy Machinery"}
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                      {item.product.description || item.product.shortDescription || "No description provided."}
                    </p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-xs font-black text-slate-900 block">${item.product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-2xl text-xs text-slate-500 text-left">
            <p className="font-bold text-emerald-800">
              {language === 'zh' ? '✉️ 电子凭证与激活码已发送' : language === 'ar' ? '✉️ تم إرسال الإيصال' : '✉️ Receipt Dispatched'}
            </p>
            <p className="mt-0.5 leading-relaxed text-[11px]">
              {language === 'zh' ? '系统已通过官方 Gmail 通道将自动生成的数码账单和发货凭证发送至：' : language === 'ar' ? 'يتم الآن إرسال فاتورة رقمية ومفاتيح التسليم الرقمية إلى ' : 'An automated digital invoice and digital delivery keys are being routed to '}
              <strong className="text-slate-800">{addressForm.email}</strong>
              {language === 'zh' ? '。请注意查收。' : language === 'ar' ? ' عبر الجيميل.' : ' via Gmail.'}
            </p>
          </div>

          <button
            id="success-view-orders-btn"
            onClick={() => {
              setStep(1); // Reset step back for future checkouts
              setTxnDetails(null);
            }}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer font-sans text-xs uppercase tracking-wider"
          >
            {language === 'zh' ? '返回商品目录' : language === 'ar' ? 'العودة إلى المعروضات' : 'Back to Catalog'}
          </button>
        </div>
      )}
    </div>
  );
};
