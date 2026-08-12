import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, Zap, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  heroProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onExploreProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroProducts,
  onSelectProduct,
  onExploreProducts
}) => {
  return (
    <section className="relative overflow-hidden bg-white text-[#2c2c2c] py-10 sm:py-14 px-6 sm:px-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-4 shadow-sm border border-[#4b0082]/10">
      
      {/* Bold Typography Watermark */}
      <div className="absolute right-[-5%] top-[-10%] opacity-10 pointer-events-none select-none hidden lg:block">
        <span className="text-[350px] xl:text-[420px] leading-none font-black text-[#4b0082] italic font-serif-brand">
          Indigo
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Bold Editorial Copy */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="inline-block px-3 py-1 bg-[#4b0082] text-white text-[10px] tracking-[4px] uppercase font-bold rounded-sm">
              Curated for India
            </span>

            <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-[60px] leading-[1.05] font-black text-[#4b0082]">
              Feel Good. Look Good. <span className="text-[#c9a84c] italic">Live Well.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4b0082]/80 font-medium max-w-xl leading-relaxed">
              Explore our most-loved essentials designed for the modern Indian woman. Top-rated beauty, shapewear, wellness & devotional items delivered directly to your doorstep.
            </p>

            {/* Micro Trust Points */}
            <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#4b0082]/10 text-xs font-bold text-[#4b0082]">
              <div className="flex flex-col">
                <span className="text-[#c9a84c] font-black text-base sm:text-lg">50,000+</span>
                <span className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold">Happy Buyers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#c9a84c] font-black text-base sm:text-lg">★ 4.8 / 5.0</span>
                <span className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold">Verified Rating</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#c9a84c] font-black text-base sm:text-lg">Free COD</span>
                <span className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold">Pan India Shipping</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4b0082] hover:bg-[#3a0066] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Browse Product Menu</span>
                <ArrowRight className="w-4 h-4 text-[#c9a84c]" />
              </button>
              <span className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#4b0082]" /> 100% Verified Quality
              </span>
            </div>
          </div>

          {/* Hero Ad Products Preview Grid */}
          <div className="lg:col-span-5">
            <div className="bg-[#f2eded]/60 p-4 sm:p-5 rounded-2xl border border-[#4b0082]/10 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#4b0082] uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#c9a84c] text-[#c9a84c]" /> Viral Ad Bestsellers
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Tap to View</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {heroProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group relative bg-white text-[#2c2c2c] rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-[#4b0082]/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge */}
                      <span className="absolute top-2 left-2 z-10 bg-[#c9a84c] text-[#2d004d] text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                        Ad Deal
                      </span>

                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-[#f2eded]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="text-xs font-bold line-clamp-1 text-gray-900 group-hover:text-[#4b0082] transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-black text-[#6b1a9e]">
                        ₹{product.sellPrice}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="bg-[#4b0082] text-white text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-widest hover:bg-[#3a0066] transition"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
