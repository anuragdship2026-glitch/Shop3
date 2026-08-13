import React, { useState, useMemo } from 'react';
import { Product, CartItem, Order } from './types';
import { PRODUCTS } from './data/products';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustBar } from './components/TrustBar';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { PoliciesModal } from './components/PoliciesModal';
import { WhyUsSection } from './components/WhyUsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ProductQuizWidget } from './components/ProductQuizWidget';
import { LivePurchaseToast } from './components/LivePurchaseToast';
import { Footer } from './components/Footer';
import { Sparkles, Flame, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';

export default function App() {
  // State for View Navigation ('home' landing page vs 'products' catalog page vs 'product_detail' standalone page)
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'product_detail'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All Products' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const heroProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.isHero);
  }, []);

  const handleNavigateView = (view: 'home' | 'products' | 'product_detail', category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Support direct product URLs (e.g. ?product=product-1 or #product-1)
  React.useEffect(() => {
    const parseProductFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      let prodId = searchParams.get('product');
      if (!prodId && window.location.hash) {
        prodId = window.location.hash.replace('#product-', '').replace('#product=', '').replace('#', '');
      }

      if (prodId) {
        const found = PRODUCTS.find(
          (p) => p.id === prodId || p.id.toLowerCase() === prodId?.toLowerCase()
        );
        if (found) {
          setActiveProduct(found);
          setCurrentView('product_detail');
        }
      }
    };

    parseProductFromUrl();

    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      let prodId = searchParams.get('product');
      if (!prodId && window.location.hash) {
        prodId = window.location.hash.replace('#product-', '').replace('#product=', '').replace('#', '');
      }

      if (prodId) {
        const found = PRODUCTS.find(
          (p) => p.id === prodId || p.id.toLowerCase() === prodId?.toLowerCase()
        );
        if (found) {
          setActiveProduct(found);
          setCurrentView('product_detail');
        } else {
          setCurrentView('home');
        }
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Handlers
  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3000);
  };

  const handleOpenProduct = (product: Product) => {
    setActiveProduct(product);
    setCurrentView('product_detail');

    // Sync URL for shareable product links
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    window.history.pushState({ productId: product.id }, '', url.toString());
  };

  const handleCloseProductModal = () => {
    setIsDetailModalOpen(false);
    const url = new URL(window.location.href);
    if (url.searchParams.has('product')) {
      url.searchParams.delete('product');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  };

  const handleAddToCart = (product: Product) => {
    const item: CartItem = {
      product,
      quantity: 1,
      selectedBundleId: product.bundles?.[0]?.id || 'single',
      selectedSize: product.hasSizeGuide ? 'M' : undefined
    };

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, item];
    });

    setIsDetailModalOpen(false);
    setIsCartOpen(true);
    triggerNotification(`Added "${product.name}" to bag!`);
  };

  const handleAddToCartFromModal = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.product.id === item.product.id &&
          ci.selectedSize === item.selectedSize &&
          ci.selectedBundleId === item.selectedBundleId
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });

    setIsDetailModalOpen(false);
    setIsCartOpen(true);
    triggerNotification(`Added "${item.product.name}" to bag!`);
  };

  const handleBuyNow = (product: Product) => {
    const item: CartItem = {
      product,
      quantity: 1,
      selectedBundleId: product.bundles?.[0]?.id || 'single',
      selectedSize: product.hasSizeGuide ? 'M' : undefined
    };
    setCartItems([item]);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNowFromModal = (item: CartItem) => {
    setCartItems([item]);
    setIsDetailModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderSuccess = (order: Order) => {
    setCartItems([]);
    triggerNotification(`Order ${order.id} placed successfully!`);
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Category cards metadata for the Landing Page
  const categoryCards = [
    {
      id: "Women's Fashion",
      name: "Women's Fashion & Dresses",
      image: "https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_18_42_PM.png?v=1782395395",
      count: "Midi Dresses & Body Shapewear",
      badge: "Top Seller"
    },
    {
      id: 'Beauty & Haircare',
      name: 'Beauty & Haircare',
      image: 'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/1740481846929-234.jpg?v=1782162785',
      count: 'K-Beauty Masks & Touch-Up Sticks',
      badge: 'Viral Beauty'
    },
    {
      id: 'Wellness & Body Care',
      name: 'Wellness & Body Care',
      image: 'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_08_59_PM.png?v=1782394850',
      count: 'Heating Massagers & Back Belts',
      badge: 'Health Choice'
    },
    {
      id: 'Spiritual & Devotional',
      name: 'Spiritual & Devotional',
      image: 'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_06_41_52_PM.png?v=1782393448',
      count: 'Digital Jaap Malas & Devotional Gear',
      badge: 'Pooja Essential'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f2eded] text-[#2c2c2c] antialiased">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#4b0082] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-[#c9a84c] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c9a84c]" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Header */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => handleNavigateView('products', cat)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* LANDING PAGE VIEW */}
      {currentView === 'home' && (
        <div className="flex-1 space-y-8 pb-12">
          {/* Appealing Hero Banner */}
          <HeroBanner
            heroProducts={heroProducts}
            onSelectProduct={handleOpenProduct}
            onExploreProducts={() => handleNavigateView('products')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          {/* Trust Badges Bar */}
          <TrustBar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Appealing Featured Categories Section */}
            <section className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-[#4b0082] text-[#c9a84c] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Explore By Collection
                </span>
                <h2 className="font-serif-brand text-3xl sm:text-4xl font-black text-[#4b0082]">
                  Curated Categories For Everyday Life
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Select a category to view high-demand essentials crafted with uncompromised quality.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryCards.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleNavigateView('products', cat.id)}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#4b0082]/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#c9a84c] text-[#2d004d] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {cat.badge}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 bg-white">
                      <h3 className="font-serif-brand text-base font-bold text-[#2c2c2c] group-hover:text-[#4b0082] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {cat.count}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#4b0082] group-hover:text-[#3a0066]">
                        <span>Open Category Menu</span>
                        <span className="text-[#c9a84c] group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Lifestyle Match Finder Widget */}
            <ProductQuizWidget onSelectProduct={handleOpenProduct} />

            {/* Bestsellers Spotlight Section */}
            <section className="space-y-6 pt-4 border-t border-[#4b0082]/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-600 fill-current" />
                    <span className="text-xs font-black text-[#4b0082] uppercase tracking-wider">
                      Most Loved
                    </span>
                  </div>
                  <h2 className="font-serif-brand text-2xl sm:text-3xl font-black text-[#4b0082] mt-1">
                    Bestselling Essentials Showcase
                  </h2>
                </div>

                <button
                  onClick={() => handleNavigateView('products', 'All Products')}
                  className="px-5 py-2.5 bg-[#4b0082] hover:bg-[#3a0066] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition self-start sm:self-auto"
                >
                  View Full Product Menu →
                </button>
              </div>

              {/* Bestsellers Grid with Add to Cart and Buy Now Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {heroProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleOpenProduct}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </section>

            {/* Why Choose Us & Value Propositions */}
            <WhyUsSection />

            {/* Customer Testimonials & Social Proof */}
            <ReviewsSection />

          </main>
        </div>
      )}

      {/* DEDICATED PRODUCT CATALOG PAGE VIEW */}
      {currentView === 'products' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          
          {/* Breadcrumb & Navigation Back */}
          <div className="flex items-center justify-between border-b border-[#4b0082]/10 pb-4">
            <div>
              <button
                onClick={() => handleNavigateView('home')}
                className="text-xs font-extrabold text-[#4b0082] hover:underline flex items-center gap-1 mb-2"
              >
                ← Return to Landing Page
              </button>
              <h1 className="font-serif-brand text-3xl sm:text-4xl font-extrabold text-[#4b0082]">
                Product Menu & Catalog
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Showing {filteredProducts.length} items in <span className="font-bold text-[#4b0082]">{selectedCategory}</span>
              </p>
            </div>

            {/* Quick Filter Reset */}
            {(selectedCategory !== 'All Products' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition"
              >
                Reset Search & Filters
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['All Products', 'Beauty & Haircare', "Women's Fashion", 'Wellness & Body Care', 'Spiritual & Devotional'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#4b0082] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-[#e8d5f5] border border-[#4b0082]/15'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Grid - Two Buttons per item: Add to Cart & Buy Now */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center space-y-3 shadow-sm border border-gray-200 my-8">
              <p className="text-sm font-bold text-gray-700">
                No items found for "{searchQuery || selectedCategory}"
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSearchQuery('');
                }}
                className="px-6 py-2 bg-[#4b0082] text-white font-bold text-xs rounded-full shadow"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={handleOpenProduct}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

        </main>
      )}

      {/* DEDICATED STANDALONE PRODUCT LANDING PAGE VIEW */}
      {currentView === 'product_detail' && activeProduct && (
        <ProductPage
          product={activeProduct}
          onBackToHome={() => handleNavigateView('home')}
          onAddToCart={handleAddToCartFromModal}
          onBuyNow={handleBuyNowFromModal}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onSelectRelatedProduct={handleOpenProduct}
          allProducts={PRODUCTS}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onSelectCategory={(cat) => handleNavigateView('products', cat)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={activeProduct}
        isOpen={isDetailModalOpen}
        onClose={handleCloseProductModal}
        onAddToCart={handleAddToCartFromModal}
        onBuyNow={handleBuyNowFromModal}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
      />

      {/* Live Verified Purchase Notification Toast */}
      <LivePurchaseToast onSelectProduct={handleOpenProduct} />

    </div>
  );
}
