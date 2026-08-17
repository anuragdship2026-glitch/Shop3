import React from 'react';
import { Product } from '../types';
import { SHOPIFY_PRODUCT_HANDLES } from '../data/products';
import { ShoppingBag, Zap, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onBuyNow
}) => {
  const discountPercent = Math.round(((product.mrp - product.sellPrice) / product.mrp) * 100);
  const shopifyHandle = product.shopifyHandle || SHOPIFY_PRODUCT_HANDLES[product.id] || product.id;

  const handleAddToCart = (event?: any) => {
    // Try Shopify Web Components cart first
    const storeElement = document.querySelector('shopify-store') as any;
    if (storeElement) {
      storeElement.addToCart(event);
    }
    // Also keep our local cart in sync
    onAddToCart(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm hover:shadow-xl border border-white/80 hover:border-[#4b0082]/20 flex flex-col cursor-pointer transition-all duration-300 justify-between transform hover:-translate-y-1"
    >
      <div>
        {/* Image Container with Glass Badges */}
        <div className="relative aspect-square bg-[#f2eded] rounded-xl mb-3 overflow-hidden flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isHero && (
              <span className="bg-[#c9a84c] text-[#2d004d] text-[9px] px-2 py-0.5 font-black rounded uppercase tracking-wider shadow-sm backdrop-blur-sm">
                ★ BESTSELLER
              </span>
            )}
            {product.tag && (
              <span className="bg-[#4b0082] text-white text-[9px] px-2 py-0.5 font-bold rounded uppercase tracking-wider shadow-sm">
                {product.tag}
              </span>
            )}
          </div>

          <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Content Body */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
            <span>{product.category}</span>
            <span className="flex items-center gap-0.5 text-[#c9a84c]">
              <Star className="w-3 h-3 fill-current" /> {product.rating}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold leading-snug text-[#2c2c2c] group-hover:text-[#4b0082] transition-colors line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Price & Two Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-[#4b0082]">
              ₹{product.sellPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 line-through font-medium">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 font-black bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            Save ₹{(product.mrp - product.sellPrice).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Two Buttons Only: Add to Cart and Buy Now */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className="w-full py-2 bg-[#f2eded] hover:bg-[#e8d5f5] text-[#4b0082] font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 border border-[#4b0082]/20"
          >
            <ShoppingBag className="w-3 h-3 text-[#4b0082]" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="w-full py-2 bg-[#4b0082] hover:bg-[#3a0066] text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-1 border border-[#c9a84c]"
          >
            <Zap className="w-3 h-3 text-[#c9a84c] fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

