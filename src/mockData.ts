/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, User, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cnc-v8',
    name: 'Precision CNC Milling Machine V8',
    name_en: 'Precision CNC Milling Machine V8',
    name_zh: '高精度数控铣床 V8',
    name_ar: 'آلة طحن CNC عالية الدقة V8',
    shortDescription: 'Multi-axis high-speed CNC milling center for heavy mold processing.',
    short_en: 'Multi-axis high-speed CNC milling center for heavy mold processing.',
    short_zh: '用于重型模具加工的多轴高速数控铣削中心。',
    short_ar: 'مركز طحن CNC متعدد المحاور عالي السرعة لمعالجة القوالب الثقيلة.',
    description: 'The Precision CNC Milling Machine V8 delivers exceptional micro-inch stability and extreme durability. Perfect for high-speed aerospace-grade aluminum and steel alloy alloy operations, featuring fully automated digital controls, active coolant recycling, and synchronous multi-axis linkages.',
    desc_en: 'The Precision CNC Milling Machine V8 delivers exceptional micro-inch stability and extreme durability. Perfect for high-speed aerospace-grade aluminum and steel alloy alloy operations, featuring fully automated digital controls, active coolant recycling, and synchronous multi-axis linkages.',
    desc_zh: '高精度数控铣床 V8 提供卓越的微米级稳定性及极佳耐用性。适用于高速航空级铝材和钢合金切削操作，配备全自动数字控制、主动冷却液循环和同步多轴联动。',
    desc_ar: 'توفر آلة طحن CNC عالية الدقة V8 استقراراً استثنائياً بالمايكرو بوصة ومتانة فائقة. مثالية لعمليات الألومنيوم عالية السرعة وسبائك الصلب من درجات الطيران، وتتميز بعناصر تحكم رقمية مؤتمتة بالكامل، وإعادة تدوير نشطة للمبرد، وربط متزامن متعدد المحاور.',
    price: 15500.00,
    category: 'CNC & Milling',
    sizes: ['380V/50Hz', '440V/60Hz'],
    colors: [
      { name: 'Titanium Grey', value: '#475569' },
      { name: 'Cobalt Blue', value: '#1D4ED8' }
    ],
    image: 'gear',
    rating: 4.9,
    salesCount: 14,
    stock: 8,
    reviews: [
      { id: 'rev-1', userName: 'John Doe', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Exceptional stability. This V8 machine has reduced our metal mold milling time by 40%!', date: '9/24/2025' }
    ]
  },
  {
    id: 'prod-robo-rx200',
    name: 'Heavy-Duty Robotic Arm RX-200',
    name_en: 'Heavy-Duty Robotic Arm RX-200',
    name_zh: '重型工业机械臂 RX-200',
    name_ar: 'ذراع آلي ثقيل الخدمة RX-200',
    shortDescription: '6-axis smart robotic arm for automated welding and heavy cargo stacking.',
    short_en: '6-axis smart robotic arm for automated welding and cargo stacking.',
    short_zh: '用于自动焊接和重型货物堆垛的六轴智能机械臂。',
    short_ar: 'ذراع آلي ذكي سداسي المحاور للحام الآلي وتكديس البضائع الثقيلة.',
    description: 'Enrich your production line automation with the RX-200. Utilizing premium high-torque servo motors, absolute rotary encoders, and adaptive pneumatic grippers, it yields a 2.1-meter maximum payload reach with sub-millimeter repeating accuracy.',
    desc_en: 'Enrich your production line automation with the RX-200. Utilizing premium high-torque servo motors, absolute rotary encoders, and adaptive pneumatic grippers, it yields a 2.1-meter maximum payload reach with sub-millimeter repeating accuracy.',
    desc_zh: '通过 RX-200 丰富您的生产线自动化。采用优质高扭矩伺服电机、绝对式旋转编码器和自适应气动夹爪，最大负载范围可达2.1米，重复精度达到亚毫米级。',
    desc_ar: 'أثري أتمتة خط الإنتاج الخاص بك مع ذراع RX-200. باستخدام محركات سيرفو عالية العزم، وأجهزة ترميز دوارة مطلقة، وقبّاضات هوائية متكيفة، فإنه يوفر مدى وصول حمولة أقصى يبلغ 2.1 متر بدقة تكرار أقل من المليمتر.',
    price: 24500.00,
    category: 'Industrial Robotics',
    sizes: ['2.1m Reach', '2.5m Reach'],
    colors: [
      { name: 'Safety Orange', value: '#EA580C' },
      { name: 'Industrial Black', value: '#1E293B' }
    ],
    image: 'arm',
    rating: 4.8,
    salesCount: 6,
    stock: 2, // Low stock! Triggers Inventory Alert
    reviews: [
      { id: 'rev-2', userName: 'Yousif Altayeb', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'We integrated 4 units in our Shaanxi factory grid. The automated sync protocols are seamless.', date: '9/22/2025' }
    ]
  },
  {
    id: 'prod-laser-cut',
    name: 'High-Speed Fiber Laser Cutter',
    name_en: 'High-Speed Fiber Laser Cutter',
    name_zh: '高速光纤激光切割机',
    name_ar: 'قاطع الليزر الليفي عالي السرعة',
    shortDescription: 'High-power fiber laser machine for precise sheet metal profiling.',
    short_en: 'High-power fiber laser machine for precise sheet metal profiling.',
    short_zh: '用于精确钣金轮廓加工的高功率光纤激光机。',
    short_ar: 'آلة ليزر ليفي عالية القدرة لتشكيل الصفائح المعدنية بدقة.',
    description: 'Engineered for continuous continuous operation, this fiber laser cutter easily slices through stainless steel, carbon steel, and aluminum plates. Features integrated computer telemetry, fully enclosed protective sheet casing, and high-efficiency dual exchange stages.',
    desc_en: 'Engineered for continuous continuous operation, this fiber laser cutter easily slices through stainless steel, carbon steel, and aluminum plates. Features integrated computer telemetry, fully enclosed protective sheet casing, and high-efficiency dual exchange stages.',
    desc_zh: '专为持续运行设计，该光纤激光切割机可轻松切穿不锈钢、碳钢及铝板。配备集成计算机遥测系统、全封闭防护板外壳和高效双工位交换平台。',
    desc_ar: 'تم تصميم قاطع الليزر الليفي هذا للتشغيل المستمر، ويقطع بسهولة صفائح الفولاذ المقاوم للصدأ وفولاذ الكربون والألومنيوم. يتميز بنظام تتبع مدمج بالكمبيوتر، وغلاف حماية مغلق بالكامل، ومراحل تبادل مزدوجة عالية الكفاءة.',
    price: 19200.00,
    category: 'Laser & Cutting',
    sizes: ['1500W Power', '3000W Power'],
    colors: [
      { name: 'Titanium Slate', value: '#334155' },
      { name: 'Bright Green Accent', value: '#10B981' }
    ],
    image: 'laser',
    rating: 4.7,
    salesCount: 8,
    stock: 1, // Low stock! Triggers Inventory Alert
    reviews: []
  },
  {
    id: 'prod-compressor',
    name: 'Industrial Rotary Screw Air Compressor',
    name_en: 'Industrial Rotary Screw Air Compressor',
    name_zh: '工业螺杆式空压机',
    name_ar: 'ضواغط الهواء اللولبية الدوارة الصناعية',
    shortDescription: '30 HP energy-efficient rotary screw air compressor with low decibels.',
    short_en: '30 HP energy-efficient rotary screw air compressor with low decibels.',
    short_zh: '30马力节能型螺杆空压机，低噪音运行。',
    short_ar: 'ضاغط هواء لولبي دوار موفر للطاقة بقوة 30 حصان مع مستويات ضوضاء منخفضة.',
    description: 'Providing constant, reliable pressurized air to pneumatics, active actuators, and factory lines. Includes automated thermal shutoffs, variable frequency driving (VFD) for maximum electricity savings, and direct-coupled transmissions.',
    desc_en: 'Providing constant, reliable pressurized air to pneumatics, active actuators, and factory lines. Includes automated thermal shutoffs, variable frequency driving (VFD) for maximum electricity savings, and direct-coupled transmissions.',
    desc_zh: '为气动元件、执行机构和工厂生产线提供持续、可靠的加压空气。包括自动热关断、最大化节电的可变频驱动(VFD)和直联传动系统。',
    desc_ar: 'توفير هواء مضغوط مستمر وموثوق للمعدات الهوائية والمحركات النشطة وخطوط المصانع. يشتمل على مفاتيح إغلاق حراري تلقائي، وتشغيل بتردد متغير (VFD) لأقصى قدر من توفير الكهرباء، ونقل حركة مباشر الاقتران.',
    price: 8900.00,
    category: 'Power & Compressors',
    sizes: ['30 HP / 120 CFM', '50 HP / 210 CFM'],
    colors: [
      { name: 'Machine Blue', value: '#1D4ED8' },
      { name: 'Safety Yellow', value: '#EAB308' }
    ],
    image: 'compressor',
    rating: 4.9,
    salesCount: 19,
    stock: 12,
    reviews: [
      { id: 'rev-3', userName: 'Saeed Al-Ghamdi', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Very quiet and highly stable output pressure. A vital asset to our painting plant!', date: '9/18/2025' }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'Lama',
    email: 'lamadevtest@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'admin',
    phone: '1234567890',
    joinedDate: '9/23/2025'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '68d2b69243332b9cfabb2bdb',
    total: 39500.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Precision CNC Milling Machine V8', quantity: 1, size: '380V/50Hz', color: 'Titanium Grey', price: 15500.00 },
      { name: 'Heavy-Duty Robotic Arm RX-200', quantity: 1, size: '2.1m Reach', color: 'Safety Orange', price: 24500.00 }
    ],
    address: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '1234567890',
      address: 'Industrial Plot 44-B',
      city: 'Detroit'
    }
  },
  {
    id: '68d28640d2416d8516435e38',
    total: 8900.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Industrial Rotary Screw Air Compressor', quantity: 1, size: '30 HP / 120 CFM', color: 'Machine Blue', price: 8900.00 }
    ],
    address: {
      name: 'Jane Smith',
      email: 'janesmith@test.com',
      phone: '1234567890',
      address: 'TechZone Sector 9',
      city: 'Chicago'
    }
  }
];

export const CATEGORIES = [
  'All',
  'CNC & Milling',
  'Industrial Robotics',
  'Heavy Presses',
  'Laser & Cutting',
  'Power & Compressors',
  'Conveyors & Logistics',
  'Molding & Casting',
  'Car spare parts',
  'Electric appliance',
  'Industrial machinery',
  'Forging machinery',
  'Textile Machinery',
  'Agricultural machinery',
  'Earth moving',
  'Fertilization equipment',
  'One-man tools',
  'Planters',
  'Harvesting tools',
  'Parts',
  'Heavy Machinery Parts',
  'Three wheeled',
  'Concentrator',
  'Loader',
  'industrial agriculture machinery',
  'Cotton picker',
  'Cotton presser',
  'Gain machinery',
  'Delinter machinery',
  'Seeder',
  'Oil press',
  'Greenhouse',
  'Products',
  'Aluminum',
  'Metal products',
  'Mining Equipment',
  'CNC machinery',
  'Plastic Machinery'
];
