/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
}

export interface Order {
  id: string;
  total: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
  products: { name: string; quantity: number; size: string; color: string; price: number }[];
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
}
