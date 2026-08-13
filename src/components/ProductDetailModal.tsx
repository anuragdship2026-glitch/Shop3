import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { REVIEWS } from '../data/products';
import { PaymentIconsRow } from './PaymentLogos';
import { BenefitCard, CustomerProofRow, CoolTagsRow } from './CustomerSocialProof';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  Zap,
  Check,
  Ruler,
  Sparkles,
  Clock,
  ArrowRight,
  ShoppingBag,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Eye,
  Flame,
  HelpCircle,
  PackageCheck,
  RefreshCw,
  Share2,
  Link
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide
}) => {
  if (!isOpen || !product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedBundleId, setSelectedBundleId] = useState<string>(
    product.bundles && product.bundles.length > 1 ? product.bundles[1].id : 'single'
  );
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOW_TO_USE' | 'REVIEWS' | 'SPECS' | 'FAQS'>('OVERVIEW');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyProductLink = () => {
    if (!product) return;
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  // Countdown timer for offer urgency
  const [timerSeconds, setTimerSeconds] = useState(288); // 4 min 48 sec
  const [viewersCount, setViewersCount] = useState(38);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedBundleId(product.bundles && product.bundles.length > 1 ? product.bundles[1].id : 'single');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuate viewers count slightly for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(32 + Math.random() * 20));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll position inside modal to toggle glass sticky bottom bar
  const handleScroll = () => {
    if (modalRef.current) {
      setShowStickyBar(modalRef.current.scrollTop > 350);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Compute selected price
  const activeBundle = product.bundles?.find((b) => b.id === selectedBundleId);
  const currentPrice = activeBundle ? activeBundle.price : product.sellPrice;
  const currentMrp = activeBundle ? activeBundle.originalPrice : product.mrp;
  const discountPercent = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeResult(
        `✅ Express Delivery available to ${pincode}! Expected by ${new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })}. Cash on Delivery (COD) supported.`
      );
    }, 400);
  };

  const constructCartItem = (): CartItem => ({
    product: {
      ...product,
      sellPrice: currentPrice
    },
    quantity,
    selectedBundleId: selectedBundleId,
    selectedSize: product.hasSizeGuide ? selectedSize : undefined
  });

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div
        ref={modalRef}
        onScroll={handleScroll}
        className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full my-2 sm:my-6 shadow-2xl overflow-y-auto max-h-[92vh] relative border border-white/50 flex flex-col scrollbar-thin"
      >
        
        {/* Glass Header Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-gray-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#4b0082] text-[#c9a84c] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Indigo & Co. Official Product
            </span>
            <span className="text-xs text-gray-500 font-bold hidden sm:inline">
              Verified Stock &bull; Express Dispatch
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProductLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4b0082]/10 hover:bg-[#4b0082] text-[#4b0082] hover:text-white rounded-full text-xs font-extrabold transition shadow-sm border border-[#4b0082]/20"
              title="Copy direct product URL link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Product Link</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
          
          {/* LEFT COLUMN - Image Gallery Slider with Glass Navigation Controls */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Image Stage with Glass Arrow Buttons */}
            <div className="relative aspect-square bg-[#f2eded] rounded-3xl overflow-hidden shadow-inner border border-gray-200/60 group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Bestseller Badge */}
              <span className="absolute top-4 left-4 bg-[#c9a84c] text-[#2d004d] text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm">
                <Award className="w-3.5 h-3.5" /> Best Seller
              </span>

              {/* Glass Gallery Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 backdrop-blur-md text-[#4b0082] hover:bg-white hover:scale-110 transition shadow-lg border border-white/60"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 backdrop-blur-md text-[#4b0082] hover:bg-white hover:scale-110 transition shadow-lg border border-white/60"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Position Dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImageIndex === idx ? 'bg-[#c9a84c] w-5' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Reel */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImageIndex === idx
                        ? 'border-[#4b0082] ring-2 ring-[#e8d5f5] scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Live Social Proof Urgency Box (Grabbit Style) */}
            <div className="p-3 bg-[#e8d5f5]/40 backdrop-blur-md rounded-2xl border border-[#4b0082]/15 space-y-1.5 text-xs text-[#2c2c2c]">
              <div className="flex items-center justify-between font-bold text-[#4b0082]">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#4b0082] animate-pulse" />
                  <span>{viewersCount} people currently viewing this</span>
                </span>
                <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" /> High Demand
                </span>
              </div>
              <p className="text-[11px] text-gray-600">
                ⚡ 18 units ordered in the last 2 hours. Order now for today's warehouse dispatch.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN - Purchasing & High-Conversion CTAs */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Product Title */}
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-black text-[#2c2c2c] leading-tight pt-1">
              {product.name}
            </h1>

            {/* Customer Rating Banner with Face Avatars */}
            <div className="bg-amber-50/50 p-2.5 rounded-2xl border border-amber-200/60 shadow-2xs">
              <CustomerProofRow
                customerCountText={product.happyCustomersText || '28,000+ Happy Customers'}
                ratingText={`${product.rating} / 5.0`}
              />
            </div>

            {/* Cool Pill Badges / Tags */}
            <CoolTagsRow />

            {/* Price Box */}
            <div className="flex items-baseline gap-3 bg-white/80 p-3 rounded-2xl border border-gray-200/60 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#6b1a9e]">
                Rs. {currentPrice * quantity}
              </span>
              <span className="text-sm text-gray-400 line-through">
                MRP Rs. {currentMrp * quantity}
              </span>
              <span className="bg-[#c9a84c] text-[#2d004d] text-xs font-black px-2.5 py-1 rounded-full uppercase">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Quantity Selector & Bundle Options */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-gray-700 hover:bg-gray-200 font-bold transition shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-[#4b0082]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-[#4b0082] text-white rounded-lg hover:bg-[#3a0066] font-bold transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bundle Selector Cards */}
              {product.bundles && product.bundles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Pack Bundle Offers (Save Extra):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.bundles.map((bundle) => {
                      const isSelected = selectedBundleId === bundle.id;
                      return (
                        <div
                          key={bundle.id}
                          onClick={() => setSelectedBundleId(bundle.id)}
                          className={`relative p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#4b0082] bg-[#e8d5f5]/30 shadow-md ring-1 ring-[#4b0082]'
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {bundle.isPopular && (
                            <span className="absolute -top-2.5 right-3 bg-[#c9a84c] text-[#2d004d] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                              ★ Most Popular
                            </span>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2c2c2c]">
                              {bundle.name}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {bundle.savingsText}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-base font-extrabold text-[#6b1a9e]">
                              Rs. {bundle.price}.00
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {bundle.originalPrice}.00
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Shapewear Size Selector */}
            {product.hasSizeGuide && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Select Waist Size:</span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-xs font-bold text-[#4b0082] underline hover:text-[#3a0066] flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Chart Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                        selectedSize === sz
                          ? 'bg-[#4b0082] text-white border-[#4b0082] shadow'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#4b0082]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Two Main Action Buttons Only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onAddToCart(constructCartItem())}
                className="w-full py-3.5 bg-[#f2eded] hover:bg-[#e8d5f5] text-[#4b0082] font-extrabold text-xs sm:text-sm rounded-2xl border-2 border-[#4b0082]/30 shadow-sm transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#4b0082]" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={() => onBuyNow(constructCartItem())}
                className="w-full py-3.5 bg-[#4b0082] hover:bg-[#3a0066] text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border-2 border-[#c9a84c]"
              >
                <Zap className="w-4 h-4 text-[#c9a84c] fill-current" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Payment Mode Badges specified on Product Page */}
            <div className="p-3 bg-white/80 rounded-2xl border border-gray-200/60 text-center space-y-2 shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                GUARANTEED SAFE CHECKOUT VIA
              </span>
              <PaymentIconsRow />
            </div>

            {/* Pin Code Delivery Checker */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Truck className="w-4 h-4 text-[#4b0082]" />
                <span>Check Delivery & COD Availability</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode}
                  className="px-4 py-2 bg-[#2d004d] text-white font-bold text-xs rounded-xl hover:bg-[#4b0082] transition"
                >
                  {isCheckingPincode ? 'Checking...' : 'CHECK'}
                </button>
              </form>
              {pincodeResult && (
                <p className="text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* PRODUCT-WISE HIGHLIGHT WIDGETS (e.g. One-Touch Reset, Long Battery Life, etc.) */}
            {product.keyIcons && product.keyIcons.length > 0 && (
              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="text-[11px] font-black uppercase text-[#4b0082] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Product Highlights & Specs</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.keyIcons.map((ic, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-purple-100 text-center flex flex-col items-center justify-center shadow-2xs hover:border-[#4b0082]/30 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#4b0082]/10 text-[#4b0082] flex items-center justify-center mb-1.5 font-bold">
                        <Sparkles className="w-4 h-4 text-[#4b0082]" />
                      </div>
                      <div className="text-xs font-black text-gray-900 leading-tight">{ic.title}</div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5 leading-tight">{ic.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AT LAST: BADGES OF GENUINE, FREE DELIVERY, COD */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-200 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#4b0082] mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">100% Genuine</div>
                <div className="text-[10px] text-gray-500">Quality Assured</div>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-200 shadow-2xs">
                <Truck className="w-6 h-6 text-[#4b0082] mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">Free Shipping</div>
                <div className="text-[10px] text-gray-500">Pan India Delivery</div>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-200 shadow-2xs">
                <PackageCheck className="w-6 h-6 text-[#4b0082] mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">Cash On Delivery</div>
                <div className="text-[10px] text-gray-500">Pay at Doorstep</div>
              </div>
            </div>

          </div>

        </div>

        {/* TABBED INFORMATION SECTION (Grabbit India Style) */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200/80 space-y-6 bg-gray-50/50">
          
          {/* Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#4b0082] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('HOW_TO_USE')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === 'HOW_TO_USE'
                  ? 'bg-[#4b0082] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              How To Use
            </button>
            <button
              onClick={() => setActiveTab('SPECS')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === 'SPECS'
                  ? 'bg-[#4b0082] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === 'REVIEWS'
                  ? 'bg-[#4b0082] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Verified Buyer Reviews ({product.reviewsCount})
            </button>
            <button
              onClick={() => setActiveTab('FAQS')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === 'FAQS'
                  ? 'bg-[#4b0082] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              FAQs & Guarantee
            </button>
          </div>

          {/* TAB CONTENT: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 text-xs text-gray-700 leading-relaxed bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-serif-brand text-lg font-extrabold text-[#4b0082]">
                Product Highlights & Description
              </h3>
              <p className="text-gray-600 font-medium text-sm">
                {product.description}
              </p>
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-[#2c2c2c] uppercase tracking-wider">Key Benefits:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#f2eded]/60">
                      <Check className="w-4 h-4 text-[#4b0082] shrink-0" />
                      <span className="font-semibold text-gray-800">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB CONTENT: HOW TO USE */}
          {activeTab === 'HOW_TO_USE' && (
            <div className="space-y-4 text-xs text-gray-700 leading-relaxed bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-serif-brand text-lg font-extrabold text-[#4b0082]">
                Simple 3-Step Guide for {product.name.split('—')[0]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(product.howToUseSteps || [
                  { stepNumber: 1, title: 'Unpack & Inspect', desc: 'Carefully unpack your item and inspect before first use.' },
                  { stepNumber: 2, title: 'Easy Usage', desc: 'Follow simple operational steps for daily convenience.' },
                  { stepNumber: 3, title: 'Store Safely', desc: 'Store in a clean, dry location to maintain quality.' }
                ]).map((step) => (
                  <div key={step.stepNumber} className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="w-6 h-6 rounded-full bg-[#4b0082] text-white text-xs font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h4 className="font-bold text-[#2c2c2c]">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: SPECS */}
          {activeTab === 'SPECS' && (
            <div className="space-y-4 text-xs text-gray-700 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-serif-brand text-lg font-extrabold text-[#4b0082]">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(product.specifications || [
                  { label: 'Category', value: product.category },
                  { label: 'Quality Standard', value: '100% Quality Inspected' },
                  { label: 'Warranty & Support', value: '7-Day Replacement Guarantee' },
                  { label: 'Country of Origin', value: 'India' }
                ]).map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 flex justify-between border border-gray-200/60 items-center">
                    <span className="font-bold text-gray-500">{spec.label}:</span>
                    <span className="font-extrabold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-4 text-xs text-gray-700 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-serif-brand text-lg font-extrabold text-[#4b0082]">
                    Verified Buyer Ratings for {product.name.split('—')[0]}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-[#c9a84c]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-[#c9a84c]" />
                      ))}
                    </div>
                    <span className="font-black text-sm text-gray-900">{product.rating} out of 5</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  ✓ 100% Verified Indian Buyers
                </span>
              </div>

              <div className="space-y-3">
                {REVIEWS.filter(r => r.productName.toLowerCase().includes(product.name.substring(0, 10).toLowerCase()) || r.productName.toLowerCase().includes(product.category.toLowerCase())).slice(0, 3).length > 0 ? (
                  REVIEWS.filter(r => r.productName.toLowerCase().includes(product.name.substring(0, 10).toLowerCase()) || r.productName.toLowerCase().includes(product.category.toLowerCase())).slice(0, 3).map((rev) => (
                    <div key={rev.id} className="p-3 bg-gray-50 rounded-xl space-y-1 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{rev.author} ({rev.location})</span>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                      <p className="text-gray-600">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  REVIEWS.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="p-3 bg-gray-50 rounded-xl space-y-1 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{rev.author} ({rev.location})</span>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                      <p className="text-gray-600">"{rev.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: FAQS */}
          {activeTab === 'FAQS' && (
            <div className="space-y-3 text-xs text-gray-700 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-serif-brand text-lg font-extrabold text-[#4b0082] mb-2">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-[#2c2c2c] mb-1">Q: Is Cash on Delivery available?</h4>
                  <p className="text-gray-600">Yes! We provide Cash on Delivery across 24,000+ PIN codes in India.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-[#2c2c2c] mb-1">Q: What if I receive a damaged product?</h4>
                  <p className="text-gray-600">We offer a 7-day hassle-free return or replacement guarantee for any transit damages.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* STICKY GLASS BOTTOM BUY BAR (Appears on scroll down inside product detail) */}
        {showStickyBar && (
          <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-white/60 shadow-2xl flex items-center justify-between gap-4 animate-slideUp">
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm hidden sm:block"
              />
              <div>
                <h4 className="text-xs font-bold text-[#2c2c2c] line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-[#6b1a9e]">
                    Rs. {currentPrice * quantity}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through hidden sm:inline">
                    MRP Rs. {currentMrp * quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToCart(constructCartItem())}
                className="px-4 py-2 bg-[#f2eded] hover:bg-[#e8d5f5] text-[#4b0082] font-extrabold text-xs rounded-xl border border-[#4b0082]/30 transition"
              >
                Add To Cart
              </button>
              <button
                onClick={() => onBuyNow(constructCartItem())}
                className="px-5 py-2 bg-[#4b0082] hover:bg-[#3a0066] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1 border border-[#c9a84c]"
              >
                <Zap className="w-3.5 h-3.5 text-[#c9a84c] fill-current" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

