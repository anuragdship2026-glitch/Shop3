import React from 'react';
import { GST_DETAILS } from '../data/products';
import { Mail, ShieldCheck, Truck, Lock, Phone, Heart } from 'lucide-react';
import { PaymentIconsRow } from './PaymentLogos';

interface FooterProps {
  onOpenPolicies: () => void;
  onOpenTracking: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicies,
  onOpenTracking,
  onSelectCategory
}) => {
  return (
    <footer className="bg-[#2d004d] text-[#f2eded] pt-12 pb-8 border-t-4 border-[#c9a84c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/10 pb-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#4b0082] text-[#f2eded] font-serif-brand font-bold text-lg flex items-center justify-center border-2 border-[#c9a84c]">
                I
              </span>
              <span className="font-serif-brand text-2xl font-extrabold text-[#f2eded]">
                Indigo & Co.
              </span>
            </div>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Feel Good. Look Good. Live Well.
            </p>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              India's trusted general e-commerce store bringing quality lifestyle, beauty, devotional, and wellness products with Cash on Delivery.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-serif-brand text-sm font-bold text-[#c9a84c] uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {['Beauty & Haircare', "Women's Fashion", 'Wellness & Body Care', 'Spiritual & Devotional'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-[#c9a84c] transition"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Tracking */}
          <div className="space-y-3">
            <h4 className="font-serif-brand text-sm font-bold text-[#c9a84c] uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button onClick={onOpenTracking} className="hover:text-[#c9a84c] transition">
                  Track Your Courier
                </button>
              </li>
              <li>
                <button onClick={onOpenPolicies} className="hover:text-[#c9a84c] transition">
                  Shipping & Free COD Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenPolicies} className="hover:text-[#c9a84c] transition">
                  7-Day Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenPolicies} className="hover:text-[#c9a84c] transition">
                  GST Registration Info
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Support Details */}
          <div className="space-y-3">
            <h4 className="font-serif-brand text-sm font-bold text-[#c9a84c] uppercase tracking-wider">
              Need Assistance?
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c9a84c]" />
                <a href={`mailto:${GST_DETAILS.email}`} className="hover:underline">
                  {GST_DETAILS.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c9a84c]" />
                <span>Mon-Sat 10:00 AM - 6:00 PM IST</span>
              </p>
              <p className="text-[11px] text-gray-400 pt-1">
                Sole Proprietorship • GST Delhi Ward 81
              </p>
            </div>
          </div>

        </div>

        {/* Payment Partner Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-gray-300">Supported Payment Methods:</span>
            <PaymentIconsRow />
          </div>

          <p className="text-[11px]">
            © {new Date().getFullYear()} Indigo & Co. (indigoandco.in). All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
