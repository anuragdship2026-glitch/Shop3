import React from 'react';

export const AnnouncementBar: React.FC = () => {
  const tickerItems = [
    'INSTANT DISCOUNTS on PREPAID orders',
    '★',
    '12,567+ 5-Star reviews',
    '★',
    'Online secure payments',
    '★',
    'EXPRESS DELIVERY',
    '★',
    'INSTANT DISCOUNTS on PREPAID orders',
    '★',
    '12,567+ 5-Star reviews',
    '★',
    'Online secure payments',
    '★'
  ];

  return (
    <div className="bg-[#3a0066] text-white text-[11px] uppercase tracking-[2px] font-black py-2.5 overflow-hidden shadow-md border-b border-[#4b0082]/30 backdrop-blur-md select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap gap-6 sm:gap-10">
        
        {/* First Loop Copy */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          {tickerItems.map((item, idx) => (
            <span
              key={`a-${idx}`}
              className={item === '★' ? 'text-[#c9a84c] text-xs font-black' : 'text-gray-100 font-extrabold tracking-widest'}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Second Duplicate Copy for Seamless Infinite Loop */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0" aria-hidden="true">
          {tickerItems.map((item, idx) => (
            <span
              key={`b-${idx}`}
              className={item === '★' ? 'text-[#c9a84c] text-xs font-black' : 'text-gray-100 font-extrabold tracking-widest'}
            >
              {item}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

