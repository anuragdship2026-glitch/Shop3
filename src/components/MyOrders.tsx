import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { IndigoLogo } from './IndigoLogo';

interface MyOrdersProps {
  isOpen: boolean;
  onClose: () => void;
  onStartShopping: () => void;
  onOpenAuth: () => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({
  isOpen,
  onClose,
  onStartShopping,
  onOpenAuth
}) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const token = localStorage.getItem('indigo_session');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Safety timeout
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    try {
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders || []);
      } else if (response.status === 401) {
        localStorage.removeItem('indigo_session');
        setOrders([]);
      } else {
        setErrorMessage(data.message || 'Oops! Something went wrong. Please try again.');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setErrorMessage('Oops! Could not load your orders. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (status: string = 'Confirmed') => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) {
      return (
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Delivered</span>
        </span>
      );
    }
    if (s.includes('dispatch') || s.includes('transit') || s.includes('shipped')) {
      return (
        <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Truck className="w-3 h-3 text-blue-600" />
          <span>Dispatched</span>
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Confirmed</span>
      </span>
    );
  };

  const token = localStorage.getItem('indigo_session');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-[#ffffff] sm:rounded-3xl w-full max-w-3xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl relative border border-[#4b0082]/15">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white sm:rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              aria-label="Back to store"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-black text-[#4b0082]">
                My Orders & Deliveries
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Track status, review invoices, and manage past purchases.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50/50">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={fetchOrders}
                className="text-xs font-bold text-[#4b0082] underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Not logged in State */}
          {!token && (
            <div className="bg-white p-8 rounded-3xl text-center space-y-4 shadow-sm border border-gray-200 my-4">
              <div className="w-16 h-16 bg-[#4b0082]/10 text-[#4b0082] rounded-full flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="font-serif-brand text-lg font-bold text-[#4b0082]">
                  Sign In to View Your Orders
                </h3>
                <p className="text-xs text-gray-500">
                  Enter your email or phone number to view all previous orders and real-time tracking updates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-3 bg-[#4b0082] text-white text-xs font-bold rounded-2xl shadow hover:bg-[#3a0066] transition inline-flex items-center gap-2"
              >
                <span>Login with OTP</span>
                <ChevronRight className="w-4 h-4 text-[#c9a84c]" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {token && isLoading && (
            <div className="space-y-4 py-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 animate-pulse space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/5" />
                  </div>
                  <div className="h-12 bg-gray-100 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
              <div className="text-center text-xs font-medium text-gray-500">
                Fetching your latest orders from Indigo & Co. cloud...
              </div>
            </div>
          )}

          {/* Empty State */}
          {token && !isLoading && orders.length === 0 && (
            <div className="bg-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-sm border border-gray-200 my-4">
              <div className="w-16 h-16 bg-[#c9a84c]/20 text-[#4b0082] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-[#4b0082]" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-serif-brand text-lg font-black text-[#4b0082]">
                  No orders yet. Start shopping!
                </h3>
                <p className="text-xs text-gray-500">
                  You have not placed any orders yet with this account. Explore our bestsellers and luxury essentials today.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="px-6 py-3 bg-[#4b0082] text-white text-xs font-bold rounded-2xl shadow hover:bg-[#3a0066] transition inline-flex items-center gap-2 border border-[#c9a84c]"
              >
                <span>Explore Catalog & Offers</span>
                <ChevronRight className="w-4 h-4 text-[#c9a84c]" />
              </button>
            </div>
          )}

          {/* Orders List */}
          {token && !isLoading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const orderItems = Array.isArray(order.items) ? order.items : [];
                const orderNum = order.order_number || order.id || `#${idx + 1}`;
                const trackingId = order.tracking_id || order.trackingNumber || 'DEL-IN-TRANSIT';
                const createdDate = order.created_at
                  ? new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'Recent Order';

                return (
                  <div
                    key={order.id || idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    {/* Top Bar: Order ID, Date & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-[#4b0082]">
                          {orderNum}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(orderNum, `order-${order.id}`)}
                          className="text-[11px] text-gray-500 hover:text-[#4b0082] flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded border border-gray-200 transition"
                          title="Copy Order ID"
                        >
                          {copiedId === `order-${order.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === `order-${order.id}` ? 'Copied' : 'Copy'}</span>
                        </button>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-xs text-gray-500 font-medium">{createdDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status || 'Confirmed')}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {orderItems.map((item: any, iIdx: number) => {
                        const prod = item?.product || {};
                        const fallbackImg =
                          'https://cdn.shopify.com/s/files/1/0836/9442/0193/files/ChatGPT_Image_Jun_25_2026_07_08_59_PM.png?v=1782394850';
                        const imgSrc = prod.heroImage || prod.image || (Array.isArray(prod.images) ? prod.images[0] : null) || fallbackImg;

                        return (
                          <div
                            key={iIdx}
                            className="flex items-center gap-3 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100"
                          >
                            <img
                              src={imgSrc}
                              alt={prod.name || 'Product'}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0 bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#2c2c2c] truncate">
                                {prod.name || 'Indigo & Co. Essential'}
                              </h4>
                              <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                <span>Qty: {item.quantity || 1}</span>
                                {item.selectedSize && (
                                  <>
                                    <span>•</span>
                                    <span>Size: {item.selectedSize}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="font-extrabold text-xs text-[#4b0082] shrink-0">
                              ₹{(prod.sellPrice || prod.price || 899) * (item.quantity || 1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Meta & Tracking */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50/20 p-3 rounded-xl border border-gray-200/80 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Truck className="w-3.5 h-3.5 text-[#4b0082]" />
                          <span className="font-semibold">Tracking ID:</span>
                          <span className="font-mono font-bold text-gray-900">{trackingId}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(trackingId, `track-${order.id}`)}
                            className="text-gray-400 hover:text-[#4b0082] ml-1"
                            title="Copy Tracking ID"
                          >
                            {copiedId === `track-${order.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="text-gray-600">
                          <span className="font-medium">Estimated Delivery: </span>
                          <strong className="text-emerald-700">
                            {order.estimated_delivery || order.estimatedDelivery || 'In 3-5 days'}
                          </strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-200/50">
                        <div className="text-[11px] text-gray-500">
                          <span>Payment Method: </span>
                          <strong className="text-gray-800">{order.payment_method || 'Prepaid'}</strong>
                        </div>

                        <div className="text-xs">
                          <span className="text-gray-600 font-medium">Total Paid: </span>
                          <span className="font-black text-[#4b0082] text-sm">
                            ₹{(order.final_amount || order.finalAmount || order.subtotal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white sm:rounded-b-3xl text-xs text-gray-500">
          <span>Need help with an order? Contact our concierge via WhatsApp.</span>
          <button
            onClick={() => {
              onClose();
              onStartShopping();
            }}
            className="text-xs font-bold text-[#4b0082] hover:underline"
          >
            Continue Shopping →
          </button>
        </div>

      </div>
    </div>
  );
};
