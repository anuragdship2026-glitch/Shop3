import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { PaymentIconsRow } from './PaymentLogos';
import { BenefitCard, CustomerProofRow, CoolTagsRow } from './CustomerSocialProof';
import { ReviewsSection } from './ReviewsSection';
import {
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
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface ProductPageProps {
  product: Product;
  onBackToHome: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onOpenSizeGuide: () => void;
  onSelectRelatedProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBackToHome,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide,
  onSelectRelatedProduct,
  allProducts
}) => {
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(288);
  const [viewersCount, setViewersCount] = useState(41);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setSelectedBundleId(product.bundles && product.bundles.length > 1 ? product.bundles[1].id : 'single');
    setQuantity(1);
    setPincodeResult(null);
  }, [product]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(35 + Math.random() * 18));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyProductLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCheckPincode = () => {
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult('Please enter a valid 6-digit Indian Pincode');
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeResult('Delivery available! Estimated delivery in 2-4 business days (Cash on Delivery available).');
    }, 600);
  };

  const selectedBundle = product.bundles?.find((b) => b.id === selectedBundleId);
  const finalPrice = selectedBundle ? selectedBundle.price : product.sellPrice * quantity;
  const originalPrice = selectedBundle ? selectedBundle.originalPrice : product.mrp * quantity;
  const discountPct = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  const images = product.images && product.images.length > 0 ? product.images : [];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCartItem: CartItem = {
    product,
    quantity,
    selectedSize: product.hasSizeGuide ? selectedSize : undefined,
    selectedBundleId: selectedBundle?.id
  };

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-800 pb-24 sm:pb-16">
      {/* Top Breadcrumb Header Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 font-extrabold text-[#4b0082] hover:text-[#320058] transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Products</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProductLink}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4b0082]/10 hover:bg-[#4b0082] text-[#4b0082] hover:text-white rounded-full text-xs font-bold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm group">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="bg-[#4b0082] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {discountPct}% OFF
                </span>
                {product.isBestSeller && (
                  <span className="bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ❤️ Best Seller
                  </span>
                )}
              </div>

              {/* Gallery Arrow Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImageIndex === idx
                        ? 'border-[#4b0082] ring-2 ring-[#4b0082]/20 scale-95'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sequence as requested */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* 1. TITLE */}
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* 2. 28000+ DETAILS STARS */}
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 shadow-2xs">
              <CustomerProofRow
                customerCountText={product.happyCustomersText || '28,000+ Happy Customers'}
                ratingText={`${product.rating} / 5.0`}
              />
            </div>

            {/* 3. BADGES OF BEST SELLER, INSTA COVER, ETC. */}
            <CoolTagsRow />

            {/* 4. PRICE SECTION & BUY SECTIONS */}
            {/* Live Urgency Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-[#4b0082]/5 border border-[#4b0082]/15 p-2.5 rounded-xl font-bold text-[#4b0082]">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>{viewersCount} people viewing right now</span>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <Clock className="w-4 h-4" />
                <span>Offer ends in: {formatTimer(timerSeconds)}</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#4b0082]">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-gray-400 line-through font-medium">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-200">
                  Save ₹{(originalPrice - finalPrice).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Inclusive of all taxes. Free shipping on all orders.
              </div>
            </div>

            {/* Size Selector if available */}
            {product.hasSizeGuide && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-800 uppercase">Select Size: <span className="text-[#4b0082] font-black">{selectedSize}</span></span>
                  <button onClick={onOpenSizeGuide} className="text-[#4b0082] font-black underline flex items-center gap-1 hover:text-[#320058]">
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl border-2 font-black text-xs transition ${
                        selectedSize === s
                          ? 'border-[#4b0082] bg-[#4b0082] text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bundles Selection */}
            {product.bundles && product.bundles.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center justify-between">
                  <span>Select Quantity Pack:</span>
                  <span className="text-amber-600 font-bold">Best Value Offers</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.bundles.map((bundle) => {
                    const isSelected = selectedBundleId === bundle.id;
                    return (
                      <button
                        key={bundle.id}
                        onClick={() => setSelectedBundleId(bundle.id)}
                        className={`relative p-3 rounded-2xl border-2 text-left transition ${
                          isSelected
                            ? 'border-[#4b0082] bg-[#4b0082]/5 ring-2 ring-[#4b0082]/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {bundle.badge && (
                          <span className="absolute -top-2.5 right-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-2xs">
                            {bundle.badge}
                          </span>
                        )}
                        <div className="font-extrabold text-xs text-gray-900">{bundle.name}</div>
                        <div className="text-sm font-black text-[#4b0082] mt-0.5">
                          ₹{bundle.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-gray-400 line-through">
                          ₹{bundle.originalPrice.toLocaleString('en-IN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pincode Delivery Check Widget */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-2">
              <label className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#4b0082]" />
                <span>Check Delivery & COD Availability:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4b0082] bg-gray-50"
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={isCheckingPincode}
                  className="px-4 py-2 bg-[#4b0082] hover:bg-[#380062] text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                >
                  {isCheckingPincode ? 'Checking...' : 'Check'}
                </button>
              </div>
              {pincodeResult && (
                <div
                  className={`text-xs font-bold p-2 rounded-xl ${
                    pincodeResult.includes('available')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {pincodeResult}
                </div>
              )}
            </div>

            {/* Buy Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onBuyNow(currentCartItem)}
                className="w-full py-4 bg-[#4b0082] hover:bg-[#380062] active:scale-[0.99] text-white text-base font-black rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 tracking-wide uppercase"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-current" />
                <span>BUY NOW - CASH ON DELIVERY</span>
              </button>

              <button
                onClick={() => onAddToCart(currentCartItem)}
                className="w-full py-3.5 bg-white hover:bg-gray-50 text-[#4b0082] border-2 border-[#4b0082] text-sm font-extrabold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>

            <PaymentIconsRow />

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

            {/* 5. AT LAST: BADGES OF GENUINE, FREE DELIVERY, COD */}
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

        {/* Tabbed Content: Details, Specs, Reviews, FAQs */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex border-b border-gray-200 overflow-x-auto gap-4 sm:gap-8 pb-3 scrollbar-none">
            {[
              { id: 'OVERVIEW', label: 'Product Highlights' },
              { id: 'HOW_TO_USE', label: 'How to Use' },
              { id: 'SPECS', label: 'Specifications & Care' },
              { id: 'REVIEWS', label: `Customer Reviews (${product.reviewsCount})` },
              { id: 'FAQS', label: 'FAQs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs sm:text-sm font-black whitespace-nowrap pb-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-[#4b0082] text-[#4b0082]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                <p className="font-medium text-base text-gray-800">{product.description}</p>
                <div className="space-y-2 pt-2">
                  <h4 className="font-extrabold text-[#4b0082] uppercase text-xs tracking-wider">Key Product Features & Benefits:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {(product.features || []).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                        <CheckCircle2 className="w-5 h-5 text-[#4b0082] shrink-0 mt-0.5" />
                        <span className="font-bold text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'HOW_TO_USE' && (
              <div className="space-y-4 text-sm text-gray-700">
                <h3 className="font-extrabold text-gray-900 text-base">Simple 3-Step Guide for {product.name.split('—')[0]}:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(product.howToUseSteps || [
                    { stepNumber: 1, title: 'Unpack & Inspect', desc: 'Carefully unpack your item and inspect components before first use.' },
                    { stepNumber: 2, title: 'Easy Application / Usage', desc: 'Follow simple operational steps for instant daily convenience.' },
                    { stepNumber: 3, title: 'Store Safely', desc: 'Store in a clean, dry location to maintain maximum quality and longevity.' }
                  ]).map((step) => (
                    <div key={step.stepNumber} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                        {step.stepNumber}
                      </div>
                      <div className="font-extrabold text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-600 mt-1 leading-relaxed">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'SPECS' && (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.specifications || [
                    { label: 'Category', value: product.category },
                    { label: 'Quality Standard', value: '100% Quality Inspected' },
                    { label: 'Warranty & Support', value: '7-Day Guaranteed Replacement' },
                    { label: 'Country of Origin', value: 'India' }
                  ]).map((spec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-gray-50 flex justify-between border border-gray-200/60 items-center">
                      <span className="font-bold text-gray-500 text-xs">{spec.label}:</span>
                      <span className="font-extrabold text-gray-900 text-xs">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'REVIEWS' && (
              <ReviewsSection productId={product.id} rating={product.rating} totalReviews={product.reviewsCount} />
            )}

            {activeTab === 'FAQS' && (
              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="font-extrabold text-gray-900">Q: Is Cash on Delivery available?</div>
                  <div className="text-gray-600 text-xs mt-1">Yes! We provide Cash on Delivery across all 28,000+ Indian pincodes.</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="font-extrabold text-gray-900">Q: How long does delivery take?</div>
                  <div className="text-gray-600 text-xs mt-1">Orders are dispatched within 24 hours. Metro cities receive delivery in 2-3 days.</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="font-extrabold text-gray-900">Q: What if I receive a damaged product?</div>
                  <div className="text-gray-600 text-xs mt-1">We offer instant 100% replacement or refund guaranteed if reported within 7 days.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-serif-brand text-gray-900">
              Customers Also Frequently Purchased
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectRelatedProduct(p)}
                  className="bg-white rounded-2xl p-3 border border-gray-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-gray-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</div>
                  <div className="text-sm font-black text-[#4b0082] mt-1">₹{p.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Customer Reviews Section above Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200/80">
          <ReviewsSection productId={product.id} rating={product.rating} totalReviews={product.reviewsCount} />
        </div>
      </div>

      {/* Sticky Bottom Buying Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 shadow-2xl flex items-center justify-between gap-3 sm:hidden">
        <div>
          <div className="text-[10px] uppercase font-black text-gray-400">Total Price</div>
          <div className="text-lg font-black text-[#4b0082]">₹{finalPrice.toLocaleString('en-IN')}</div>
        </div>

        <button
          onClick={() => onBuyNow(currentCartItem)}
          className="flex-1 py-3 bg-[#4b0082] text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 uppercase"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-current" />
          <span>BUY NOW (COD)</span>
        </button>
      </div>
    </div>
  );
};
