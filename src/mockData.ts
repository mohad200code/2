/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, User, Order } from './types';

const imagesGlob = import.meta.glob('./products-image/*', { eager: true, import: 'default' });

export const ALL_UPLOADED_IMAGES = Object.entries(imagesGlob).map(([key, value]) => {
  const nameWithExt = key.substring(key.lastIndexOf('/') + 1);
  const name = nameWithExt.replace(/\.[^/.]+$/, "");
  return {
    name: name,
    url: value as string
  };
});

export const ALL_161_IMAGES: string[] = Object.values(imagesGlob) as string[];

export function getProductImageUrl(imagePath?: string): string {
  if (!imagePath) return ALL_161_IMAGES[0] || '';
  if (
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.split('?')[0].split('#')[0];
  const filename = cleanPath.substring(cleanPath.lastIndexOf('/') + 1);

  if (filename) {
    const globKey = `./products-image/${filename}`;
    if (imagesGlob[globKey]) {
      return imagesGlob[globKey] as string;
    }

    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const baseName = nameWithoutExt.replace(/-[a-zA-Z0-9]{6,}$/, "");

    const found = ALL_UPLOADED_IMAGES.find(img => {
      if (!img || !img.name) return false;
      return (
        img.name === filename ||
        img.name === nameWithoutExt ||
        img.name === baseName ||
        filename.includes(img.name) ||
        nameWithoutExt.includes(img.name) ||
        baseName.includes(img.name)
      );
    });

    if (found && found.url) {
      return found.url;
    }
  }

  if (
    (imagePath.startsWith('http://') || imagePath.startsWith('https://')) &&
    !imagePath.includes('/assets/') &&
    !imagePath.includes('/products-image/') &&
    !imagePath.includes('ABUIABA')
  ) {
    return imagePath;
  }

  return ALL_161_IMAGES[0] || imagePath;
}

export const CATEGORIES = [
  'All',
  'Agricultural machinery',
  'Gain machinery',
  'Industrial parts',
  'Hardware tools',
  'Other equipment'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'sdazum_admin',
    email: 'admin@sdazum.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'Admin',
    joinedDate: '2024-01-15',
    walletBalance: 10000,
  },
  {
    id: 'usr-2',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'Customer',
    joinedDate: '2024-02-20',
    walletBalance: 250,
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    total: 1850,
    status: 'Delivered',
    date: '2025-01-10',
    products: [
      { name: 'Honey Extractor', quantity: 1, size: 'Standard', color: 'Industrial Grey', price: 1850 }
    ],
    address: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0192',
      address: '123 Industrial Way',
      city: 'Weihai'
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [];
