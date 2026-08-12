import React, { useState } from 'react';
import { ShoppingBag, Search, Truck, Heart, MessageCircle, FileText, Menu, X } from 'lucide-react';
import { IndigoLogo } from './IndigoLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenPolicies: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: 'home' | 'products';
  onNavigateView: (view: 'home' | 'products', category?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenPolicies,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentView,
  onNavigateView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'All Products',
    'Beauty & Hair',
    "Women's Fashion",
    'Wellness & Fitness',
    'Spiritual & Devotion'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#4b0082]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4b0082] hover:bg-[#e8d5f5] rounded-lg transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Subtitle */}
          <div
            className="flex items-center cursor-pointer py-0.5 group"
            onClick={() => onNavigateView('home')}
            title="Indigo & Co. - Home"
          >
            <IndigoLogo className="h-10 sm:h-12" />
          </div>

          {/* Search Input - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'products') {
                    onNavigateView('products');
                  }
                }}
                className="w-full bg-white text-xs text-[#2c2c2c] placeholder-gray-400 pl-9 pr-4 py-2 rounded-full border border-[#4b0082]/20 focus:outline-none focus:border-[#4b0082] transition"
              />
              <Search className="w-3.5 h-3.5 text-[#4b0082] absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Main Navigation View Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6 text-[12px] uppercase font-bold tracking-wider text-[#4b0082]">
            <button
              onClick={() => onNavigateView('home')}
              className={`hover:opacity-100 transition py-1 ${
                currentView === 'home'
                  ? 'font-black underline decoration-2 underline-offset-8 text-[#4b0082]'
                  : 'opacity-70'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigateView('products', 'All Products')}
              className={`hover:opacity-100 transition py-1 ${
                currentView === 'products'
                  ? 'font-black underline decoration-2 underline-offset-8 text-[#4b0082]'
                  : 'opacity-70'
              }`}
            >
              Product Menu
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Track Order Button */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4b0082] bg-[#e8d5f5] hover:bg-[#4b0082] hover:text-white rounded-full transition border border-[#4b0082]/20"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-1.5 bg-[#4b0082] text-white hover:bg-[#3a0066] rounded-full shadow transition group"
            >
              <ShoppingBag className="w-4 h-4 text-[#c9a84c] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Bag</span>
              <span className="bg-[#c9a84c] text-[#2d004d] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'products') {
                  onNavigateView('products');
                }
              }}
              className="w-full bg-white text-xs text-[#2c2c2c] placeholder-gray-400 pl-9 pr-3 py-2 rounded-full border border-[#4b0082]/20 focus:outline-none focus:border-[#4b0082]"
            />
            <Search className="w-3.5 h-3.5 text-[#4b0082] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Bar Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-2 mt-3 pt-2 border-t border-[#4b0082]/10 overflow-x-auto">
          <button
            onClick={() => onNavigateView('home')}
            className={`px-4 py-1.5 text-xs font-extrabold uppercase rounded-full transition whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-[#c9a84c] text-[#2d004d] shadow'
                : 'bg-white text-gray-700 hover:bg-[#e8d5f5] border border-gray-200'
            }`}
          >
            ✦ Home Landing Page
          </button>
          {categories.map((cat) => {
            const isSelected = currentView === 'products' && selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onNavigateView('products', cat)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#4b0082] text-white shadow'
                    : 'bg-white text-[#2c2c2c] hover:bg-[#e8d5f5] hover:text-[#4b0082] border border-[#4b0082]/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#3a0066]/20 px-4 py-4 shadow-xl space-y-3">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                onNavigateView('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-extrabold transition ${
                currentView === 'home' ? 'bg-[#c9a84c] text-[#2d004d]' : 'text-[#4b0082] bg-gray-50'
              }`}
            >
              ✦ Home Landing Page
            </button>

            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-2 px-1">
              Product Categories Menu
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onNavigateView('products', cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  currentView === 'products' && selectedCategory === cat
                    ? 'bg-[#4b0082] text-white font-bold'
                    : 'text-[#2c2c2c] hover:bg-[#e8d5f5]'
                }`}
              >
                {cat}
              </button>
            ))}

            <hr className="my-2 border-gray-200" />

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-bold text-[#4b0082] px-3 py-2 bg-[#e8d5f5] rounded-lg"
              >
                <Truck className="w-4 h-4" />
                <span>Track Your Order</span>
              </button>
              <button
                onClick={() => {
                  onOpenPolicies();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <FileText className="w-4 h-4 text-[#4b0082]" />
                <span>Policies & GST Info</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
