import React from 'react';
import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: Truck,
      title: 'Fast Delivery Across India',
      subtitle: 'Dispatched in 24 hrs with live tracking'
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery Available',
      subtitle: 'Pay at your doorstep — zero risk'
    },
    {
      icon: RotateCcw,
      title: 'Hassle-Free Returns',
      subtitle: '7-day easy window & UPI refunds'
    },
    {
      icon: ShieldCheck,
      title: '100% Verified Products',
      subtitle: 'Quality checked from Indian suppliers'
    }
  ];

  return (
    <section className="bg-white border-y border-[#3a0066]/10 py-4 px-4 sm:px-6 my-6 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {trustItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-[#f2eded]/60 hover:bg-[#e8d5f5]/50 transition">
              <div className="w-10 h-10 rounded-full bg-[#4b0082] text-[#c9a84c] flex items-center justify-center shrink-0 shadow-sm">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#2c2c2c] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
