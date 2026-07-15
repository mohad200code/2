/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, User, Order } from './types';

import helicalGear from './assets/images/helical_gear_3d_1783941589730.jpg';
import bearingBlock from './assets/images/bearing_block_3d_1783941604326.jpg';
import bevelGear from './assets/images/bevel_gear_3d_1783941620595.jpg';
import factoryPresses from './assets/images/factory_presses_3d_1783941636039.jpg';
import industrialBolt from './assets/images/industrial_bolt_3d_1783941653838.jpg';
import machineShaft from './assets/images/machine_shaft_3d_1783941669533.jpg';
import metalCollar from './assets/images/metal_collar_3d_1783941689645.jpg';
import oilExpeller from './assets/images/oil_expeller_3d_1783941706140.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1782614423344',
    name: 'Helical Gear Pinion Shaft',
    name_en: 'Helical Gear Pinion Shaft',
    name_zh: '斜齿轮小齿轮轴',
    name_ar: 'عمود ترس حلزوني دقيق',
    shortDescription: 'High-precision alloy steel helical pinion gear for high-torque heavy transmissions.',
    short_en: 'High-precision alloy steel helical pinion gear for high-torque heavy transmissions.',
    short_zh: '用于高扭矩重型传动的高精度合金钢斜小齿轮。',
    short_ar: 'ترس صغير حلزوني من سبائك الصلب عالية الدقة لنقل عزم الدوران العالي.',
    description: 'Our Helical Gear Pinion Shaft is manufactured from high-grade carbon steel and alloy steel, heat-treated with carburizing and quenching. Featuring high wear resistance, optimal performance, and silent operation. Suitable for metallurgy, power generation, and heavy mining systems.',
    desc_en: 'Our Helical Gear Pinion Shaft is manufactured from high-grade carbon steel and alloy steel, heat-treated with carburizing and quenching. Featuring high wear resistance, optimal performance, and silent operation. Suitable for metallurgy, power generation, and heavy mining systems.',
    desc_zh: '我们的斜齿轮轴采用优质碳钢和合金钢制造，经渗碳淬火热处理。具有高耐磨性、最佳性能和静音运行的特点。适用于冶金、发电和重型采矿系统。',
    desc_ar: 'يتم تصنيع عمود الترس الحلزوني الخاص بنا من الفولاذ الكربوني عالي الجودة والفولاذ السبائكي، والمعالج حرارياً بالكربنة والتبريد الفجائي. يتميز بمقاومة عالية للتآكل وأداء مثالي وتشغيل صامت. مناسب للصناعات المعدنية وتوليد الطاقة وأنظمة التعدين الثقيلة.',
    price: 1250.00,
    category: 'Heavy Machinery Parts',
    sizes: ['Diameter 120mm', 'Diameter 150mm', 'Diameter 180mm'],
    colors: [
      { name: 'Polished Chrome', value: '#94A3B8' },
      { name: 'Hardened Grey', value: '#475569' }
    ],
    image: helicalGear,
    rating: 4.9,
    salesCount: 142,
    stock: 24
  },
  {
    id: 'prod-1782614410009',
    name: 'High-Precision Bearing Block',
    name_en: 'High-Precision Bearing Block',
    name_zh: '高精度轴承座',
    name_ar: 'وسادة محمل عالية الدقة',
    shortDescription: 'Cast iron pillow block bearing with dual-sealed chrome steel inserts.',
    short_en: 'Cast iron pillow block bearing with dual-sealed chrome steel inserts.',
    short_zh: '带双密封铬钢嵌件的铸铁枕形轴承座。',
    short_ar: 'كرسي محمل من الحديد الزهر مع حشوات فولاذية من الكروم مزدوجة الإحكام.',
    description: 'Heavy duty cast iron housing featuring self-aligning bearings. Lubricated with high-grade synthetic grease, designed for conveyor drives and mining drums in tough industrial conditions.',
    desc_en: 'Heavy duty cast iron housing featuring self-aligning bearings. Lubricated with high-grade synthetic grease, designed for conveyor drives and mining drums in tough industrial conditions.',
    desc_zh: '具有自调心轴承的重型铸铁外壳。采用优质合成润滑脂润滑，专为恶劣工业条件下的输送机驱动和采矿滚筒设计。',
    desc_ar: 'هيكل حديدي زهر للخدمة الشاقة يتميز بمحامل ذاتية المحاذاة. مشحم بشحم صناعي عالي الجودة، مصمم لمحركات السيور الناقلة وبراميل التعدين في الظروف الصناعية الصعبة.',
    price: 420.00,
    category: 'Heavy Machinery Parts',
    sizes: ['Shaft 50mm', 'Shaft 60mm', 'Shaft 80mm'],
    colors: [
      { name: 'Industrial Blue', value: '#1E3A8A' },
      { name: 'Machine Green', value: '#064E3B' }
    ],
    image: bearingBlock,
    rating: 4.8,
    salesCount: 88,
    stock: 12
  },
  {
    id: 'prod-1782614500018',
    name: 'Industrial Bevel Gear Set',
    name_en: 'Industrial Bevel Gear Set',
    name_zh: '工业伞齿轮副',
    name_ar: 'مجموعة تروس مخروطية صناعية',
    shortDescription: 'Spiral bevel gears for 90-degree heavy transmission systems.',
    short_en: 'Spiral bevel gears for 90-degree heavy transmission systems.',
    short_zh: '用于90度重型传动系统的螺旋伞齿轮。',
    short_ar: 'تروس مخروطية لولبية لأنظمة نقل الحركة الثقيلة بزاوية 90 درجة.',
    description: 'Machined spiral bevel gear sets for smooth power diversion. High load capacity and ultra-low thermal backlash under maximum speeds.',
    desc_en: 'Machined spiral bevel gear sets for smooth power diversion. High load capacity and ultra-low thermal backlash under maximum speeds.',
    desc_zh: '精密加工的螺旋伞齿轮副，保证动力顺畅分流。在最高转速下具有高负载能力和极低的热反冲。',
    desc_ar: 'مجموعات تروس مخروطية لولبية مجهزة لتحويل الطاقة بشكل سلس. قدرة تحمل تحميل عالية وارتداد حراري منخفض للغاية تحت أقصى سرعات.',
    price: 850.00,
    category: 'Heavy Machinery Parts',
    sizes: ['Ratio 1:1', 'Ratio 2:1', 'Ratio 3:1'],
    colors: [
      { name: 'Matte Titanium', value: '#64748B' },
      { name: 'Bronze Coat', value: '#B45309' }
    ],
    image: bevelGear,
    rating: 4.7,
    salesCount: 65,
    stock: 15
  },
  {
    id: 'prod-1782614485638',
    name: 'Heavy-Duty Hydraulic Press',
    name_en: 'Heavy-Duty Hydraulic Press',
    name_zh: '重型液压机',
    name_ar: 'مكبس هيدروليكي للخدمة الشاقة',
    shortDescription: '200-ton high-speed hydraulic forge press for precise metal fabrication.',
    short_en: '200-ton high-speed hydraulic forge press for precise metal fabrication.',
    short_zh: '200吨高速液压锻造机，用于精密金属制造。',
    short_ar: 'مكبس هيدروليكي عالي السرعة سعة 200 طن لتصنيع المعادن بدقة.',
    description: 'This hydraulic forging giant delivers outstanding thermal and mechanical performance. PLC touchscreen controls with multi-zone digital safety features.',
    desc_en: 'This hydraulic forging giant delivers outstanding thermal and mechanical performance. PLC touchscreen controls with multi-zone digital safety features.',
    desc_zh: '这款液压锻造巨人提供出色的热和机械性能。PLC触摸屏控制，带有多区域数字安全保护功能。',
    desc_ar: 'يوفر عملاق الكبس الهيدروليكي هذا أداءً حرارياً وميكانيكياً متميزاً. شاشة لمس PLC للتحكم مع ميزات أمان رقمية متعددة المناطق.',
    price: 15400.00,
    category: 'Heavy Presses',
    sizes: ['200 Ton Capacity', '300 Ton Capacity'],
    colors: [
      { name: 'Safety Yellow', value: '#EAB308' },
      { name: 'Stark Red', value: '#991B1B' }
    ],
    image: factoryPresses,
    rating: 4.9,
    salesCount: 19,
    stock: 3
  },
  {
    id: 'prod-1782614445275',
    name: 'High-Tensile Industrial Bolt',
    name_en: 'High-Tensile Industrial Bolt',
    name_zh: '高强度工业螺栓',
    name_ar: 'برغي صناعي عالي الشد',
    shortDescription: 'Grade 12.9 alloy steel hex cap screw for heavy structures.',
    short_en: 'Grade 12.9 alloy steel hex cap screw for heavy structures.',
    short_zh: '用于重型结构的12.9级合金钢内六角圆柱头螺钉。',
    short_ar: 'برغي سداسي الرأس من الفولاذ السبيكي فئة 12.9 للهياكل الثقيلة.',
    description: 'Premium zinc-plated structural steel bolts optimized for thermal expansion resistance and high friction structural joints.',
    desc_en: 'Premium zinc-plated structural steel bolts optimized for thermal expansion resistance and high friction structural joints.',
    desc_zh: '优质镀锌结构钢螺栓，针对耐热膨胀和高摩擦结构接头进行了优化。',
    desc_ar: 'مسامير فولاذية هيكلية ممتازة مطلية بالزنك ومحسنة لمقاومة التمدد الحراري والمفاصل الهيكلية ذات الاحتكاك العالي.',
    price: 15.00,
    category: 'Heavy Machinery Parts',
    sizes: ['M24 x 100mm', 'M30 x 120mm', 'M36 x 150mm'],
    colors: [
      { name: 'Black Oxide', value: '#1E293B' },
      { name: 'Zinc Plated', value: '#CBD5E1' }
    ],
    image: industrialBolt,
    rating: 4.6,
    salesCount: 950,
    stock: 500
  },
  {
    id: 'prod-1782614434561',
    name: 'CNC Hardened Machine Shaft',
    name_en: 'CNC Hardened Machine Shaft',
    name_zh: 'CNC淬火机床轴',
    name_ar: 'عمود آلة مقسى بتقنية CNC',
    shortDescription: 'Linear guide transmission shaft with ground and induction hardened surface.',
    short_en: 'Linear guide transmission shaft with ground and induction hardened surface.',
    short_zh: '表面研磨和感应淬火的线性导向传动轴。',
    short_ar: 'عمود نقل وتوجيه خطي بسطح أرضي ومقسى بالحث.',
    description: 'Precision ground shafting made from standard AISI 1045 steel. Designed to operate under high torque with low noise.',
    desc_en: 'Precision ground shafting made from standard AISI 1045 steel. Designed to operate under high torque with low noise.',
    desc_zh: '由标准AISI 1045钢制成的精密研磨轴。设计用于在高扭矩、低噪音下运行。',
    desc_ar: 'أعمدة دوران أرضية دقيقة مصنوعة من فولاذ AISI 1045 القياسي. مصممة للعمل تحت عزم دوران عالٍ مع ضوضاء منخفضة.',
    price: 310.00,
    category: 'Heavy Machinery Parts',
    sizes: ['Length 1.0m', 'Length 1.5m', 'Length 2.0m'],
    colors: [
      { name: 'Satin Finish', value: '#E2E8F0' }
    ],
    image: machineShaft,
    rating: 4.8,
    salesCount: 110,
    stock: 45
  },
  {
    id: 'prod-1782614457923',
    name: 'Heavy Steel Shaft Collar',
    name_en: 'Heavy Steel Shaft Collar',
    name_zh: '重型钢制轴夹圈',
    name_ar: 'طوق عمود دوران فولاذي ثقيل',
    shortDescription: 'Double split clamp shaft collar for high clamping force.',
    short_en: 'Double split clamp shaft collar for high clamping force.',
    short_zh: '双开式紧固轴夹圈，提供高夹紧力。',
    short_ar: 'طوق عمود دوران مشبك مزدوج لقوة تثبيت عالية.',
    description: 'Premium carbon steel collar with black oxide coating. Ideal for structural stops without damaging key drives.',
    desc_en: 'Premium carbon steel collar with black oxide coating. Ideal for structural stops without damaging key drives.',
    desc_zh: '优质碳钢夹圈，带有黑色氧化涂层。非常适合作为结构挡块，而不会损坏关键传动装置。',
    desc_ar: 'طوق فولاذ كربوني ممتاز مطلي بالأكسيد الأسود. مثالي للمصدات الهيكلية دون التسبب في تلف محركات الأقراص الرئيسية.',
    price: 45.00,
    category: 'Heavy Machinery Parts',
    sizes: ['ID 40mm', 'ID 50mm', 'ID 60mm'],
    colors: [
      { name: 'Dark Charcoal', value: '#334155' }
    ],
    image: metalCollar,
    rating: 4.7,
    salesCount: 310,
    stock: 120
  },
  {
    id: 'prod-1782614471861',
    name: 'Industrial Oil Expeller Screw',
    name_en: 'Industrial Oil Expeller Screw',
    name_zh: '工业榨油机榨螺',
    name_ar: 'برغي عصارة الزيت الصناعي',
    shortDescription: 'High strength press screw for continuous oil extraction.',
    short_en: 'High strength press screw for continuous oil extraction.',
    short_zh: '高强度榨螺，用于连续榨油。',
    short_ar: 'برغي كبس عالي القوة لاستخلاص الزيت بشكل مستمر.',
    description: 'Carburized heat treated expeller screw segments for commercial seeds. Provides high pressure squeezing with minimal wear.',
    desc_en: 'Carburized heat treated expeller screw segments for commercial seeds. Provides high pressure squeezing with minimal wear.',
    desc_zh: '用于商业种子的渗碳热处理榨螺段。提供高压挤压并具有极低的磨损。',
    desc_ar: 'أجزاء لولبية لعصارة الزيت معالجة حرارياً بالكربنة للبذور التجارية. توفر عصراً عالي الضغط مع حد أدنى من التآكل.',
    price: 4800.00,
    category: 'Oil press',
    sizes: ['Squeezer 120mm', 'Squeezer 150mm'],
    colors: [
      { name: 'Oil Tempered', value: '#1E293B' }
    ],
    image: oilExpeller,
    rating: 4.8,
    salesCount: 22,
    stock: 8
  }
];

export const INITIAL_USERS: User[] = [];

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
