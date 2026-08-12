import React from 'react';
import { Heart, Banknote, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const whyUsItems = [
    {
      title: 'Made for India 🇮🇳',
      description: 'Sourced directly from verified Indian suppliers with fast domestic courier delivery across metro and tier-2/3 cities.',
      icon: Heart
    },
    {
      title: 'COD Friendly 💵',
      description: 'Pay cash when your order arrives at your doorstep — zero risk and no mandatory advance prepayment required.',
      icon: Banknote
    },
    {
      title: 'Real WhatsApp Support 📱',
      description: 'Need help with size choice or order tracking? WhatsApp us anytime — our Indian support team is here for you Mon-Sat.',
      icon: MessageCircle
    }
  ];

  return (
    <section className="my-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#4b0082] via-[#3a0066] to-[#2d004d] text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-[#c9a84c]/20">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="bg-[#c9a84c] text-[#2d004d] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Why Choose Indigo & Co.
          </span>
          <h2 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-[#f2eded]">
            The Indigo & Co. Quality Promise
          </h2>
          <p className="text-xs sm:text-sm text-gray-200">
            Dedicated to bringing Indian women high-performing lifestyle, beauty, and wellness products with absolute trust.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {whyUsItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-[#c9a84c] transition shadow-lg space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#c9a84c] text-[#2d004d] flex items-center justify-center font-bold shadow">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-serif-brand text-lg font-bold text-[#f2eded]">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
