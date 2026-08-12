import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface LivePurchaseToastProps {
  onSelectProduct?: (product: Product) => void;
}

interface PurchaseNotification {
  customerName: string;
  city: string;
  time: string;
  product: Product;
}

export const LivePurchaseToast: React.FC<LivePurchaseToastProps> = ({ onSelectProduct }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Map products into purchase notifications with realistic Indian customer names & cities
  const notifications: PurchaseNotification[] = React.useMemo(() => {
    const customerList = [
      { name: 'Priya S.', city: 'Delhi NCR', time: '2 mins ago' },
      { name: 'Sunita V.', city: 'Lucknow', time: '4 mins ago' },
      { name: 'Ananya D.', city: 'Pune', time: '1 min ago' },
      { name: 'Meera I.', city: 'Bengaluru', time: '6 mins ago' },
      { name: 'Neha R.', city: 'Mumbai', time: '3 mins ago' },
      { name: 'Kavita M.', city: 'Jaipur', time: '5 mins ago' },
      { name: 'Aarti G.', city: 'Kolkata', time: '8 mins ago' },
      { name: 'Pooja K.', city: 'Ahmedabad', time: '2 mins ago' },
      { name: 'Rohan B.', city: 'Chandigarh', time: '7 mins ago' },
      { name: 'Surbhi N.', city: 'Hyderabad', time: '10 mins ago' }
    ];

    return PRODUCTS.map((prod, idx) => {
      const customer = customerList[idx % customerList.length];
      return {
        customerName: customer.name,
        city: customer.city,
        time: customer.time,
        product: prod
      };
    });
  }, []);

  useEffect(() => {
    if (isDismissed || notifications.length === 0) return;

    // Initial popup after 3.5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    // Toggle toast visibility periodically every 9 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 1200);
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed, notifications.length]);

  if (!isVisible || isDismissed || notifications.length === 0) return null;

  const currentItem = notifications[currentIdx];
  const { product, customerName, city, time } = currentItem;
  const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop';
  const productPrice = product.sellPrice;

  const handleToastClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-gray-200/90 flex items-center gap-3 animate-slideUp transition-all duration-300 group hover:border-[#4b0082]/40">
      
      {/* Product Image Thumbnail */}
      <div 
        onClick={handleToastClick} 
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 cursor-pointer"
      >
        <img
          src={productImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-tl-md">
          <CheckCircle2 className="w-3 h-3" />
        </span>
      </div>

      {/* Product & Buyer Details */}
      <div onClick={handleToastClick} className="text-xs space-y-0.5 flex-1 min-w-0 cursor-pointer">
        <div className="flex items-center gap-1.5 font-extrabold text-gray-900 text-[11px] sm:text-xs">
          <span>{customerName}</span>
          <span className="text-gray-400 font-normal">from</span>
          <span className="text-[#4b0082] font-extrabold">{city}</span>
          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px] font-black border border-emerald-200/60 ml-auto shrink-0">
            Purchased
          </span>
        </div>

        <p className="text-[11px] font-bold text-gray-800 truncate group-hover:text-[#4b0082] transition-colors">
          {product.name}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
          <span className="font-extrabold text-[#4b0082]">₹{productPrice.toLocaleString('en-IN')}</span>
          <span>&bull;</span>
          <span>{time}</span>
          <span>&bull;</span>
          <span className="text-emerald-700 font-semibold">Verified COD Order</span>
        </div>
      </div>

      {/* Close/Dismiss Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissed(true);
        }}
        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition shrink-0"
        title="Dismiss notifications"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
