import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  Heart,
  MessageCircle,
  FileText,
  Menu,
  X,
  User,
  UserCheck,
  LogOut,
  Package,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { IndigoLogo } from './IndigoLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenPolicies: () => void;
  onOpenAuth: () => void;
  onOpenMyOrders: () => void;
  currentUser: any | null;
  onLogout: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: 'home' | 'products' | 'product_detail';
  onNavigateView: (view: 'home' | 'products' | 'product_detail', category?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenPolicies,
  onOpenAuth,
  onOpenMyOrders,
  currentUser,
  onLogout,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentView,
  onNavigateView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All Products',
    'Beauty & Haircare',
    "Women's Fashion",
    'Wellness & Body Care',
    'Spiritual & Devotional'
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFirstName = () => {
    if (!currentUser) return '';
    const name = currentUser.name || '';
    if (name) return name.split(' ')[0];
    if (currentUser.email) return currentUser.email.split('@')[0];
    if (currentUser.phone) return `+91 ${currentUser.phone.slice(-4)}`;
    return 'VIP';
  };

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
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Track Order Button - Desktop */}
            <button
              onClick={currentUser ? onOpenMyOrders : onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4b0082] bg-[#e8d5f5] hover:bg-[#4b0082] hover:text-white rounded-full transition border border-[#4b0082]/20"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>

            {/* User Profile / Login Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-[#e8d5f5] text-[#4b0082] rounded-full border border-[#4b0082]/20 transition text-xs font-bold"
                  aria-label="User Account Menu"
                >
                  <div className="w-5 h-5 rounded-full bg-[#4b0082] text-[#c9a84c] flex items-center justify-center text-[10px] font-black">
                    {getFirstName().charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                    {getFirstName()}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#4b0082]" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4b0082] bg-gray-50 hover:bg-[#e8d5f5] rounded-full border border-[#4b0082]/20 transition"
                  aria-label="Login with OTP"
                >
                  <User className="w-4 h-4 text-[#4b0082]" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#4b0082]/15 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-black text-[#4b0082] truncate">
                      {currentUser.name || 'VIP Member'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {currentUser.email || currentUser.phone || 'Signed in'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMyOrders();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#4b0082] flex items-center gap-2 transition"
                    >
                      <Package className="w-4 h-4 text-[#4b0082]" />
                      <span>My Orders & Invoices</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenTracking();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#4b0082] flex items-center gap-2 transition"
                    >
                      <Truck className="w-4 h-4 text-[#4b0082]" />
                      <span>Track Active Courier</span>
                    </button>

                    <a
                      href="https://wa.me/919876543210?text=Hi%20Indigo%20%26%20Co.%2C%20I%20need%20support%20with%20my%20order"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
            
            {/* Mobile Auth Button */}
            {currentUser ? (
              <div className="bg-purple-50 p-3 rounded-xl border border-[#4b0082]/20 flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-black text-[#4b0082]">
                    Hello, {getFirstName()}!
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {currentUser.email || currentUser.phone}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-600 bg-white px-2 py-1 rounded-lg border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 bg-[#4b0082] text-white text-xs font-bold rounded-xl mb-2 flex items-center justify-center gap-2 shadow"
              >
                <User className="w-4 h-4 text-[#c9a84c]" />
                <span>Login with OTP / Access Account</span>
              </button>
            )}

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
                  onOpenMyOrders();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-bold text-[#4b0082] px-3 py-2 bg-[#e8d5f5] rounded-lg"
              >
                <Package className="w-4 h-4" />
                <span>My Orders & Invoices</span>
              </button>
              
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <Truck className="w-4 h-4 text-[#4b0082]" />
                <span>Track Courier</span>
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
