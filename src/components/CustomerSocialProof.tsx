import React from 'react';
import { Star } from 'lucide-react';

interface BenefitCardProps {
  title: string;
  subtitle: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({ title, subtitle }) => (
  <div className="flex-1 min-w-[120px] bg-white rounded-2xl p-3 sm:p-4 text-center border border-gray-200/80 shadow-sm hover:border-[#4b0082]/30 transition">
    <div className="font-extrabold text-xs sm:text-sm text-gray-900 leading-tight">
      {title}
    </div>
    <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">
      {subtitle}
    </div>
  </div>
);

interface CustomerProofRowProps {
  customerCountText?: string;
  ratingText?: string;
  className?: string;
}

export const CustomerProofRow: React.FC<CustomerProofRowProps> = ({
  customerCountText = '36,000 + Happy Customers',
  ratingText = '4.8 / 5.0',
  className = ''
}) => {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  ];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Overlapping Avatars with Gold Ring Borders */}
      <div className="flex items-center">
        {avatars.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Happy Customer ${idx + 1}`}
            referrerPolicy="no-referrer"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-400 object-cover shadow-sm ${
              idx > 0 ? '-ml-2.5' : ''
            }`}
            style={{ zIndex: 10 - idx }}
          />
        ))}
      </div>

      {/* Customer Count + Star Ratings */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
        <span className="text-amber-600 font-black text-sm sm:text-base">
          {customerCountText.split(' ')[0]} {customerCountText.split(' ')[1]}
        </span>
        <span className="text-gray-900 font-extrabold">
          {customerCountText.split(' ').slice(2).join(' ')}
        </span>

        <span className="text-gray-300 font-light">•</span>

        {/* 5 Filled Yellow Stars */}
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-400" />
          ))}
        </div>

        {/* Rating Score Badge */}
        <span className="bg-[#e8d5f5] text-[#4b0082] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-[#4b0082]/10 shadow-2xs">
          {ratingText}
        </span>
      </div>
    </div>
  );
};

export const CoolTagsRow: React.FC<{ tags?: string[] }> = ({ tags }) => {
  const defaultTags = [
    { label: 'Best Seller', emoji: '❤️', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900' },
    { label: 'Instant Coverage', emoji: '⚡', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
    { label: 'Sweatproof & Waterproof', emoji: '💧', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
    { label: '100% Safe & Organic', emoji: '🌿', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      {defaultTags.map((t, idx) => (
        <div
          key={idx}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border shadow-2xs ${t.bg} ${t.border} ${t.text} text-xs font-extrabold`}
        >
          <span className="text-sm select-none">{t.emoji}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
};
