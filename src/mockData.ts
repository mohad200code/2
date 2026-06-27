/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, User, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Nike Dri Flex T-Shirt',
    description: 'Engineered with Nike\'s proprietary sweat-wicking Dri-FIT technology, this athletic t-shirt keeps you dry, cool, and comfortable during high-intensity training. Features an ultra-soft feel and ergonomic flat seams for zero chafing.',
    shortDescription: 'High-performance moisture-wicking athletic tee for peak gym sessions.',
    price: 39.00,
    category: 'T-shirts',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'white', value: '#F8FAFC' },
      { name: 'pink', value: '#FDA4AF' }
    ],
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    salesCount: 1420,
    reviews: [
      { id: 'rev-1-1', userName: 'Alex Johnson', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Amazing athletic shirt! Super breathable and dry.', date: '2026-05-14' },
      { id: 'rev-1-2', userName: 'Sarah Miller', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', rating: 4, comment: 'Great fit, but runs slightly small around the shoulders.', date: '2026-06-02' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Nike Ultraboost Pulse',
    description: 'Designed for dynamic runs and everyday comfort, featuring dual-density cushion technology and ultra-responsive energy return. The lightweight engineered knit upper hugs your feet securely for a seamless, breathable ride.',
    shortDescription: 'Ultra-cushioned responsive running sneakers with engineered mesh.',
    price: 69.00,
    category: 'Shoes',
    sizes: ['38', '40', '42'],
    colors: [
      { name: 'grey', value: '#94A3B8' },
      { name: 'pink', value: '#FDA4AF' }
    ],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    salesCount: 3280,
    reviews: [
      { id: 'rev-2-1', userName: 'David Chen', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Hands down the most comfortable running shoes I have owned.', date: '2026-06-18' },
      { id: 'rev-2-2', userName: 'Emily Watson', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'The energy return is unreal! Feels like running on clouds.', date: '2026-06-20' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Under Armour StormFleece',
    description: 'Armour Storm technology repels water without sacrificing breathability. This cozy fleece lining traps heat to keep you warm and focused through tough conditions, while remaining lightweight and fully flexible.',
    shortDescription: 'Water-resistant, thermal fleece jacket for all-weather protection.',
    price: 49.00,
    category: 'Jackets',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'orange', value: '#F97316' },
      { name: 'yellow', value: '#EAB308' },
      { name: 'black', value: '#1E293B' }
    ],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    salesCount: 910,
    reviews: [
      { id: 'rev-3-1', userName: 'Marcus Aurelius', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', rating: 4, comment: 'Excellent water resistance. Kept me warm in light rain.', date: '2026-04-10' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Nike Air Essentials Pullover',
    description: 'A premium heavyweight colorblocked fleece pullover that delivers bold street style and absolute warmth. Features a kangaroo pocket, adjustable drawstring hood, and signature ribbed cuffs.',
    shortDescription: 'Cozy, street-inspired heavyweight colorblocked fleece hoodie.',
    price: 79.00,
    category: 'Jackets',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'green', value: '#15803D' },
      { name: 'blue', value: '#1D4ED8' },
      { name: 'black', value: '#1E293B' }
    ],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    salesCount: 1845,
    reviews: [
      { id: 'rev-4-1', userName: 'Aaliyah Jones', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Heavy weight and high quality. Looks super trendy!', date: '2026-05-28' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Puma Ultra Warm Zip',
    description: 'Stay exceptionally warm during chilly outdoor activities. Engineered with double-knit insulating tech and a structured high-collar quarter zip design that moves effortlessly with your body.',
    shortDescription: 'High-collar thermal quarter-zip pullover for cold weather workouts.',
    price: 69.00,
    category: 'Jackets',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'grey-plaid', value: '#64748B' },
      { name: 'green', value: '#15803D' }
    ],
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    salesCount: 730,
    reviews: [
      { id: 'rev-5-1', userName: 'Brandon Fox', userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100', rating: 4, comment: 'Perfect overlay for running in 40-degree weather. High zip is very nice.', date: '2026-03-15' }
    ]
  },
  {
    id: 'prod-6',
    name: "Levi's Classic Denim",
    description: 'An essential rugged premium denim shirt built with heavy cotton twill, dual utility chest pockets, and classic metal buttons. Perfect as an outerwear overlay over any simple white tee.',
    shortDescription: 'Rugged vintage-inspired blue denim utility shirt jacket.',
    price: 59.00,
    category: 'T-shirts',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'blue', value: '#2563EB' },
      { name: 'green', value: '#16A34A' }
    ],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    salesCount: 1040,
    reviews: [
      { id: 'rev-6-1', userName: 'Lucas Grabeel', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'The denim is super durable and heavy. High-quality stitching.', date: '2026-06-11' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Nike Air Max 270',
    description: 'Boasting Nike\'s first lifestyle-dedicated Air unit, the Air Max 270 delivers a super comfortable, bouncy stride wrapped in a sleek, breathable mesh mesh sleeve and modern translucent heel.',
    shortDescription: 'Sleek casual streetwear sneaker with legendary heel Air unit cushioning.',
    price: 59.00,
    category: 'Shoes',
    sizes: ['40', '42', '44'],
    colors: [
      { name: 'grey-blue', value: '#38BDF8' },
      { name: 'white', value: '#F8FAFC' }
    ],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    salesCount: 4210,
    reviews: [
      { id: 'rev-7-1', userName: 'Ryan Reynolds', userAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100', rating: 5, comment: 'Iconic look and feel. Definitely buying another pair!', date: '2026-06-23' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Adidas CoreFit T-Shirt',
    description: 'Keep your workout focused and distraction-free. Crafted with ultralight weight, breathable performance knit fabrics that allow optimal air circulation and multi-directional flexibility.',
    shortDescription: 'Lightweight high-flexibility crewneck athletic gym tee.',
    price: 39.00,
    category: 'T-shirts',
    sizes: ['S', 'M', 'XL'],
    colors: [
      { name: 'grey', value: '#475569' },
      { name: 'purple', value: '#A855F7' },
      { name: 'green', value: '#10B981' }
    ],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    rating: 4.4,
    salesCount: 880,
    reviews: [
      { id: 'rev-8-1', userName: 'Zack Morris', userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100', rating: 4, comment: 'Good basic gym shirt. Keeps me sweat-free.', date: '2026-05-30' }
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
  },
  {
    id: 'usr-2',
    username: 'Grace',
    email: 'graceallen07@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '2345678901',
    joinedDate: '9/22/2025'
  },
  {
    id: 'usr-3',
    username: 'Matthew',
    email: 'mattsc44@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '3456789012',
    joinedDate: '9/23/2025'
  },
  {
    id: 'usr-4',
    username: 'Ella',
    email: 'ella.k99@protonmail.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    status: 'banned',
    role: 'user',
    phone: '4567890123',
    joinedDate: '9/18/2025'
  },
  {
    id: 'usr-5',
    username: 'Daniel',
    email: 'daniel.young11@hotmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '5678901234',
    joinedDate: '9/21/2025'
  },
  {
    id: 'usr-6',
    username: 'Harper',
    email: 'harperhallx@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '6789012345',
    joinedDate: '9/20/2025'
  },
  {
    id: 'usr-7',
    username: 'Alexander',
    email: 'alexwlk23@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '7890123456',
    joinedDate: '9/23/2025'
  },
  {
    id: 'usr-8',
    username: 'Charlotte',
    email: 'chotte.lewis15@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '8901234567',
    joinedDate: '9/15/2025'
  },
  {
    id: 'usr-9',
    username: 'Lucas',
    email: 'lucash77@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=100',
    status: 'banned',
    role: 'user',
    phone: '9012345678',
    joinedDate: '9/23/2025'
  },
  {
    id: 'usr-10',
    username: 'Amelia',
    email: 'amwhite09@icloud.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '0123456789',
    joinedDate: '9/22/2025'
  },
  {
    id: 'usr-11',
    username: 'Benjamin',
    email: 'ben.thomas22@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '1112223333',
    joinedDate: '9/23/2025'
  },
  {
    id: 'usr-12',
    username: 'Olivia',
    email: 'oliviat98@hotmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '2223334444',
    joinedDate: '9/21/2025'
  },
  {
    id: 'usr-13',
    username: 'James',
    email: 'j.anderson34@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100',
    status: 'banned',
    role: 'user',
    phone: '3334445555',
    joinedDate: '9/19/2025'
  },
  {
    id: 'usr-14',
    username: 'Mia',
    email: 'miawil12@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '4445556666',
    joinedDate: '9/20/2025'
  },
  {
    id: 'usr-15',
    username: 'Mason',
    email: 'mason.carcia07@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
    status: 'banned',
    role: 'user',
    phone: '5556667777',
    joinedDate: '9/22/2025'
  },
  {
    id: 'usr-16',
    username: 'Isabella',
    email: 'isa.brown88@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    status: 'active',
    role: 'user',
    phone: '6667778888',
    joinedDate: '9/23/2025'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '68d2b69243332b9cfabb2bdb',
    total: 166.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Under Armour StormFleece', quantity: 1, size: 'M', color: 'orange', price: 49.00 },
      { name: 'Nike Dri Flex T-Shirt', quantity: 3, size: 'XL', color: 'pink', price: 39.00 }
    ],
    address: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City'
    }
  },
  {
    id: '68d28640d2416d8516435e38',
    total: 56.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Nike Ultraboost Pulse', quantity: 1, size: '40', color: 'grey', price: 69.00 }
    ],
    address: {
      name: 'Jane Smith',
      email: 'janesmith@test.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City'
    }
  },
  {
    id: '68d287b49c06a28829f1b8c6',
    total: 59.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Puma Classic T90', quantity: 1, size: 'S', color: 'grey-plaid', price: 59.00 }
    ],
    address: {
      name: 'Michael Johnson',
      email: 'michael@test.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City'
    }
  },
  {
    id: '68d28853aa10736126659d87',
    total: 49.00,
    status: 'success',
    date: '9/23/2025',
    products: [
      { name: 'Nasa Unknown T-shirt', quantity: 1, size: 'S', color: 'black', price: 49.00 }
    ],
    address: {
      name: 'Lily Adams',
      email: 'lily@test.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City'
    }
  }
];

export const CATEGORIES = [
  'All',
  'T-shirts',
  'Shoes',
  'Accessories',
  'Bags',
  'Dresses',
  'Jackets',
  'Gloves'
];
