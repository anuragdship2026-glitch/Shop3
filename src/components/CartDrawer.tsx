import React from 'react';
import { CartItem } from '../types';
import { PaymentIconsRow } from './PaymentLogos';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}) => {
  if (!isOpen) return null;

  const getItemPrice = (item: CartItem) => {
    if (item.selectedBundleId && item.product.bundles) {
      const bundle = item.product.bundles.find((b) => b.id === item.selectedBundleId);
      if (bundle) return bundle.price;
    }
    return item.product.sellPrice * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getItemPrice(item), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#4b0082]/20">
          
          {/* Header */}
          <div className="p-4 bg-[#3a0066] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c9a84c]" />
              <h2 className="font-serif-brand text-lg font-bold">Your Shopping Bag ({totalItemsCount})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#4b0082] rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-200" />
            </button>
          </div>

          {/* Prepaid Discount Progress Bar */}
          <div className="bg-[#e8d5f5] p-3 border-b border-[#4b0082]/10 text-xs text-[#2d004d]">
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#4b0082]" /> FREE Shipping Unlocked Across India!
              </span>
              <span className="text-[#6b1a9e]">Prepaid Save ₹50</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-[#4b0082] h-full w-full rounded-full" />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-[#f2eded] text-[#4b0082] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif-brand text-base font-bold text-gray-800">Your bag is currently empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our best sellers and add items to experience instant fast shipping & COD across India.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#4b0082] text-white font-bold text-xs rounded-full shadow hover:bg-[#3a0066] transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 bg-[#f2eded]/40 rounded-2xl border border-gray-100 relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-xl bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-[#2c2c2c] line-clamp-2">
                      {item.product.name}
                    </h4>
                    
                    {item.selectedSize && (
                      <span className="text-[10px] font-bold text-[#4b0082] bg-[#e8d5f5] px-1.5 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-[#6b1a9e]">
                        ₹{getItemPrice(item).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200 space-y-3 shadow-lg">
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cash on Delivery (COD) Charge</span>
                  <span className="font-bold text-emerald-600">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#2c2c2c] pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#6b1a9e] text-base">₹{subtotal}</span>
                </div>
              </div>

              <button
                onClick={onProceedCheckout}
                className="w-full py-3.5 bg-[#4b0082] hover:bg-[#3a0066] text-white font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 border-2 border-[#c9a84c]"
              >
                <span>Proceed to Instant Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#c9a84c]" />
              </button>

              <div className="pt-1 text-center space-y-1.5">
                <PaymentIconsRow />
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Guaranteed Safe Checkout</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
