import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hi%20Indigo%20%26%20Co.!%20I%20have%20a%20question%20about%20an%20order/product.', '_blank');
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 border-2 border-white group"
      title="Chat on WhatsApp"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="w-6 h-6 fill-current text-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pl-1">
        WhatsApp Support
      </span>
    </button>
  );
};
