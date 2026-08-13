export interface UsageStep {
  stepNumber: number;
  title: string;
  desc: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  supplier: 'Dropship India' | 'Dropdash';
  cost: number;
  sellPrice: number;
  mrp: number;
  category: 'Beauty & Haircare' | "Women's Fashion" | 'Wellness & Body Care' | 'Spiritual & Devotional' | string;
  isHero: boolean;
  tag?: string;
  rating: number;
  reviewCount: number;
  happyCustomersText?: string;
  stockCount: number;
  images: string[];
  shortDesc: string;
  description: string;
  features: string[];
  keyIcons?: { iconName: string; title: string; subtitle: string }[];
  howToUseSteps?: UsageStep[];
  specifications?: ProductSpec[];
  bundles?: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    savingsText: string;
    isPopular?: boolean;
  }[];
  hasSizeGuide?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedBundleId?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verified: boolean;
  productName: string;
  image?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'COD' | 'Prepaid UPI/Razorpay';
  totalAmount: number;
  discount: number;
  codFee?: number;
  finalAmount: number;
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery';
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface SizeChartRow {
  size: string;
  usSize: string;
  waist: string;
  hip: string;
}
