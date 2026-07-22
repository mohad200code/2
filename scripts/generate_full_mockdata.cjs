const fs = require('fs');
const path = require('path');

const generatedProducts = JSON.parse(fs.readFileSync(path.join(__dirname, 'products_gen.json'), 'utf-8'));

const imageFiles = fs.readdirSync(path.join(__dirname, '..', 'src', 'assets', 'products-image'))
  .filter(f => /\.(png|jpg|jpeg|webp|svg)$/i.test(f))
  .sort();

console.log(`Found ${imageFiles.length} images in src/assets/products-image`);

let importLines = [];
let imgVarNames = [];

imageFiles.forEach((filename, idx) => {
  const sanitizeName = `img_item_${idx}_` + filename.replace(/[^a-zA-Z0-9]/g, '_');
  imgVarNames.push(sanitizeName);
  importLines.push(`import ${sanitizeName} from './products-image/${filename}';`);
});

let fileContent = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, User, Order } from './types';

${importLines.join('\n')}

const imagesGlob = import.meta.glob('./products-image/*.{png,jpg,jpeg,svg,webp,JPG,PNG,JPEG,PNG-1,jpg-1}', { eager: true, import: 'default' });

export const ALL_UPLOADED_IMAGES = Object.entries(imagesGlob).map(([key, value]) => {
  const nameWithExt = key.substring(key.lastIndexOf('/') + 1);
  const name = nameWithExt.replace(/\\.[^/.]+$/, "");
  return {
    name: name,
    url: value as string
  };
});

export const ALL_161_IMAGES = [
  ${imgVarNames.join(',\n  ')}
];

export const INITIAL_PRODUCTS: Product[] = [
`;

const formattedProducts = generatedProducts.map((p, idx) => {
  const imgVar = imgVarNames[idx % imgVarNames.length];
  return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    name_en: ${JSON.stringify(p.name_en)},
    name_zh: ${JSON.stringify(p.name_zh)},
    name_ar: ${JSON.stringify(p.name_ar)},
    shortDescription: ${JSON.stringify(p.shortDescription)},
    short_en: ${JSON.stringify(p.short_en)},
    short_zh: ${JSON.stringify(p.short_zh)},
    short_ar: ${JSON.stringify(p.short_ar)},
    description: ${JSON.stringify(p.description)},
    desc_en: ${JSON.stringify(p.desc_en)},
    desc_zh: ${JSON.stringify(p.desc_zh)},
    desc_ar: ${JSON.stringify(p.desc_ar)},
    price: ${p.price},
    category: ${JSON.stringify(p.category)},
    sizes: ${JSON.stringify(p.sizes)},
    colors: ${JSON.stringify(p.colors)},
    image: ${imgVar},
    rating: ${p.rating},
    salesCount: ${p.salesCount},
    stock: ${p.stock}
  }`;
}).join(',\n');

fileContent += formattedProducts;

fileContent += `
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
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'mockData.ts'), fileContent, 'utf-8');

// Also update products_db.json so the server API /api/products returns all items with images
const plainProducts = generatedProducts.map((p, idx) => {
  const filename = imageFiles[idx % imageFiles.length];
  return {
    ...p,
    image: `/src/assets/products-image/${filename}`
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'products_db.json'), JSON.stringify(plainProducts, null, 2), 'utf-8');

console.log(`Successfully generated src/mockData.ts importing all ${imageFiles.length} images!`);
