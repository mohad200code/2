/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: string;
  sizes: string[];
  colors: { name: string; value: string; image?: string }[];
  image: string;
  rating?: number;
  salesCount?: number; // How many people bought this product
  reviews?: ProductReview[]; // Customer comments and stars
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'banned';
  role: string;
  phone?: string;
  joinedDate: string;
  walletBalance?: number; // Wallet System
  referralCode?: string; // Affiliate System
  referralsCount?: number;
  earnings?: number;
}

export interface Order {
  id: string;
  total: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
  products: { name: string; quantity: number; size: string; color: string; price: number; customName?: string }[];
  address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; value: string; image?: string };
  customName?: string;
}
