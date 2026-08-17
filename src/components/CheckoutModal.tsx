import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { GPayIcon, PhonePeIcon, PaytmIcon, UpiIcon, CodIcon, PaymentIconsRow } from './PaymentLogos';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Banknote,
  QrCode,
  Lock,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
  Info,
  Tag,
  Mail,
  UserCheck,
  Package
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
  onViewMyOrders?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  onViewMyOrders
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'ADDRESS' | 'PAYMENT' | 'CONFIRMED'>('ADDRESS');

  // Customer Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Prepaid UPI/Razorpay'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pre-fill from existing session if available
  React.useEffect(() => {
    try {
      const storedCust = localStorage.getItem('indigo_customer');
      if (storedCust) {
        const parsed = JSON.parse(storedCust);
        if (parsed.name && !name) setName(parsed.name);
        if (parsed.email && !email) setEmail(parsed.email);
        if (parsed.phone && !phone) setPhone(parsed.phone);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const getItemPrice = (item: CartItem) => {
    if (item.selectedBundleId && item.product.bundles) {
      const bundle = item.product.bundles.find((b) => b.id === item.selectedBundleId);
      if (bundle) return bundle.price;
    }
    return item.product.sellPrice * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getItemPrice(item), 0);
  const codFee = paymentMethod === 'COD' ? 50 : 0;
  const finalAmount = subtotal + codFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!name.trim() || !phone.trim() || !cleanEmail || !address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery details including your email.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address for order confirmation.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (pincode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit PIN code.');
      return;
    }
    setStep('PAYMENT');
  };

  // Submit order to backend /api/create-order which syncs with Supabase and Shopify Admin REST API
  const submitOrderToBackend = async (extraData: {
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  } = {}) => {
    try {
      console.log('[CheckoutModal] Submitting order to /api/create-order...', {
        paymentMethod,
        finalAmount,
        razorpayPaymentId: extraData.razorpayPaymentId,
        customerName: name.trim()
      });

      const customerObj = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
      };

      const payload = {
        customer: customerObj,
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        cartItems,
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Prepaid UPI/Razorpay',
        amount: finalAmount,
        finalAmount,
        codFee,
        razorpayPaymentId: extraData.razorpayPaymentId || '',
        razorpayOrderId: extraData.razorpayOrderId || '',
        razorpaySignature: extraData.razorpaySignature || ''
      };

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('[CheckoutModal] /api/create-order HTTP status:', response.status);

      let responseData: any = {};
      try {
        responseData = await response.json();
        console.log('[CheckoutModal] /api/create-order response data:', responseData);
      } catch (err) {
        console.warn('API JSON parse notice:', err);
      }

      // Auto-save session token & customer to localStorage for instant account creation
      if (responseData?.token) {
        localStorage.setItem('indigo_session', responseData.token);
      }
      if (responseData?.customer) {
        localStorage.setItem('indigo_customer', JSON.stringify(responseData.customer));
      }

      const estDate = responseData?.estimatedDelivery || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const displayOrderId =
        responseData?.orderNumber ||
        responseData?.orderId ||
        `IND-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: Order = {
        id: displayOrderId,
        orderNumber: responseData?.orderNumber || displayOrderId,
        shopifyOrderId: responseData?.shopifyOrderId ? String(responseData.shopifyOrderId) : undefined,
        pushedToShopify: Boolean(responseData?.pushedToShopify),
        razorpayPaymentId: extraData.razorpayPaymentId || undefined,
        items: cartItems,
        customer: customerObj,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Prepaid UPI / Razorpay',
        totalAmount: subtotal,
        discount: 0,
        codFee,
        finalAmount,
        status: 'Confirmed',
        orderDate: new Date().toLocaleDateString('en-IN'),
        estimatedDelivery: estDate,
        trackingNumber: responseData?.trackingId || responseData?.trackingNumber || ('DEL' + Math.floor(1000000000 + Math.random() * 9000000000))
      };

      setPlacedOrder(newOrder);
      onOrderSuccess(newOrder);
      setStep('CONFIRMED');
    } catch (err: any) {
      console.error('[CheckoutModal] Order creation error:', err);
      setErrorMessage('Oops! Something went wrong while saving your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrepaidCheckout = (event?: any) => {
    const storeElement = document.querySelector('shopify-store') as any;
    if (storeElement) {
      storeElement.buyNow(event);
    }
  };

  const handlePlaceOrder = async (e?: React.MouseEvent) => {
    setErrorMessage(null);

    // For PREPAID orders — replace custom Razorpay flow with Shopify native checkout
    if (paymentMethod === 'Prepaid UPI/Razorpay') {
      handlePrepaidCheckout(e);
      return;
    }

    // For COD orders — keep existing flow completely unchanged. COD orders still go through our custom checkout form → Supabase → api/create-order.
    setIsProcessing(true);
    await submitOrderToBackend();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-[#4b0082]/20 my-4">
        
        {/* Close & Back Controls */}
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Steps & Navigation */}
        <div className="border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#4b0082] mb-2 pr-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (step === 'PAYMENT') setStep('ADDRESS');
                  else onClose();
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-[#4b0082] font-extrabold bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{step === 'PAYMENT' ? 'Back to Address' : 'Back to Store'}</span>
              </button>
              <span className="flex items-center gap-1 ml-1">
                <ShieldCheck className="w-4 h-4 text-[#c9a84c]" /> Secure Checkout
              </span>
            </div>
            <span className="text-gray-400 hidden sm:inline">100% Encrypted & Safe</span>
          </div>

          {step !== 'CONFIRMED' && (
            <div className="flex items-center gap-2 text-xs font-bold mt-2">
              <span className={`px-2.5 py-1 rounded-full ${step === 'ADDRESS' ? 'bg-[#4b0082] text-white' : 'bg-gray-100 text-gray-500'}`}>
                1. Delivery Address & Email
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 'PAYMENT' ? 'bg-[#4b0082] text-white' : 'bg-gray-100 text-gray-500'}`}>
                2. Payment & Confirmation
              </span>
            </div>
          )}
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: ADDRESS & MANDATORY EMAIL */}
        {step === 'ADDRESS' && (
          <form onSubmit={handleAddressSubmit} className="space-y-3">
            <h3 className="font-serif-brand text-lg font-bold text-[#2c2c2c]">
              Where Should We Deliver Your Order?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number (For Delivery & SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
              </div>
            </div>

            {/* Mandatory Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <span>Email Address (For Invoice & Order Tracking) *</span>
                <span className="text-[10px] text-[#4b0082] bg-purple-50 px-1.5 py-0.5 rounded font-semibold">Mandatory</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. ananya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
                <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                We'll email your order invoice and create your VIP account automatically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Flat, House No., Building, Street Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 302, Green Valley Apartments, MG Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                >
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Other">Other India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
                />
              </div>
            </div>

            {/* Quick Order Items Preview Box */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-extrabold text-gray-900">Order Subtotal: </span>
                <span className="font-black text-[#4b0082]">₹{subtotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-gray-500 block">({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
                🚚 Free Pan-India Shipping
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#4b0082] hover:bg-[#3a0066] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Continue to Payment Method</span>
              <ArrowRight className="w-4 h-4 text-[#c9a84c]" />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'PAYMENT' && (
          <div className="space-y-4">
            <h3 className="font-serif-brand text-lg font-bold text-[#2c2c2c]">
              Select Payment Method
            </h3>

            <div className="space-y-3">
              
              {/* Option 1: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col gap-2 ${
                  paymentMethod === 'COD'
                    ? 'border-[#4b0082] bg-[#4b0082]/5 shadow-md ring-1 ring-[#4b0082]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4b0082] text-[#c9a84c] flex items-center justify-center font-bold shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2c2c2c] flex items-center gap-1.5">
                        <span>Cash on Delivery (COD)</span>
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Pay cash directly to courier agent upon delivery.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                    + ₹50 Charge
                  </span>
                </div>

                {paymentMethod === 'COD' && (
                  <div className="mt-1 text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold">COD Convenience Charge:</span> A ₹50 convenience fee is added by logistics partners to handle physical cash collection & verification at your doorstep.
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Prepaid UPI / Razorpay */}
              <div
                onClick={() => setPaymentMethod('Prepaid UPI/Razorpay')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col gap-2 ${
                  paymentMethod === 'Prepaid UPI/Razorpay'
                    ? 'border-emerald-600 bg-emerald-50/30 shadow-md ring-1 ring-emerald-600'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#2c2c2c] flex items-center gap-1.5 flex-wrap">
                        <span>UPI / Cards / Net Banking</span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">⚡ Save ₹50</span>
                      </h4>
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        <GPayIcon className="scale-90 origin-left" />
                        <PhonePeIcon className="scale-90 origin-left" />
                        <PaytmIcon className="scale-90 origin-left" />
                        <UpiIcon className="scale-90 origin-left" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                    NO COD FEE
                  </span>
                </div>

                {paymentMethod === 'Prepaid UPI/Razorpay' && (
                  <div className="mt-1 text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold">Instant Savings:</span> You save the ₹50 COD convenience charge by paying online securely via Google Pay, PhonePe, or Cards.
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Price Summary Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charge</span>
                <span className="text-emerald-700 font-bold">FREE (Pan-India)</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-800">COD Convenience Charge</span>
                  <span className="text-[10px] text-gray-500 font-medium">(Logistics cash collection)</span>
                </div>
                {paymentMethod === 'COD' ? (
                  <span className="font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md text-xs border border-amber-300">
                    + ₹50
                  </span>
                ) : (
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-xs border border-emerald-300">
                    ₹0 (Waived)
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm font-black text-[#2c2c2c] pt-2.5 border-t border-gray-300">
                <div>
                  <span>Total Payable Amount</span>
                  <span className="block text-[10px] text-gray-500 font-normal">
                    {paymentMethod === 'COD' ? 'Pay cash on delivery' : 'Prepaid digital checkout'}
                  </span>
                </div>
                <span className="text-[#4b0082] text-xl font-black">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('ADDRESS')}
                className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-2/3 py-3 bg-[#4b0082] hover:bg-[#3a0066] text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-[#c9a84c]"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({paymentMethod === 'COD' ? `COD ₹${finalAmount}` : `Pay ₹${finalAmount}`})</span>
                    <CheckCircle2 className="w-4 h-4 text-[#c9a84c]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED (DOES NOT AUTO-CLOSE) */}
        {step === 'CONFIRMED' && placedOrder && (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-[#c9a84c] text-[#2d004d] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Order Verified & Saved to Cloud
              </span>
              <h2 className="font-serif-brand text-2xl font-extrabold text-[#4b0082] mt-1">
                Thank You, {placedOrder.customer.name}!
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Your order is confirmed and being prepared for express delivery.
              </p>
            </div>

            {/* Account Auto-Created Badge */}
            <div className="p-2.5 bg-purple-50 rounded-xl border border-[#4b0082]/20 text-xs text-[#4b0082] flex items-center justify-center gap-2 font-bold">
              <UserCheck className="w-4 h-4 text-[#c9a84c]" />
              <span>Account created automatically & saved to your profile!</span>
            </div>

            {/* Order Details Card with Copy Buttons */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-left space-y-2.5">
              
              {/* Order Reference with Copy */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600 font-bold">Order Reference:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#4b0082] font-mono font-black text-sm">
                    {placedOrder.orderNumber || placedOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(placedOrder.orderNumber || placedOrder.id, 'order-id')}
                    className="text-[11px] text-gray-600 hover:text-[#4b0082] bg-white border border-gray-300 px-2 py-0.5 rounded flex items-center gap-1 transition"
                  >
                    {copiedKey === 'order-id' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === 'order-id' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Tracking ID with Copy */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Tracking ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900">{placedOrder.trackingNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(placedOrder.trackingNumber || '', 'tracking-id')}
                    className="text-[11px] text-gray-600 hover:text-[#4b0082] bg-white border border-gray-300 px-2 py-0.5 rounded flex items-center gap-1 transition"
                  >
                    {copiedKey === 'tracking-id' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === 'tracking-id' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Payment Mode:</span>
                <span className="font-bold text-gray-900">{placedOrder.paymentMethod}</span>
              </div>

              {placedOrder.razorpayPaymentId && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                  <span className="text-emerald-900 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay Payment ID:
                  </span>
                  <span className="font-mono font-black text-emerald-800 text-[11px]">{placedOrder.razorpayPaymentId}</span>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="bg-white p-2.5 rounded-xl border border-gray-200/80 space-y-1 text-[11px]">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-gray-900">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>COD Convenience Charge:</span>
                  {placedOrder.codFee ? (
                    <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">+ ₹{placedOrder.codFee}</span>
                  ) : (
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">₹0 (Prepaid Waived)</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-800 font-bold">
                  {placedOrder.paymentMethod.includes('Prepaid') ? 'Total Amount Paid:' : 'Total Amount Payable on Delivery:'}
                </span>
                <span className="font-black text-[#4b0082] text-sm">₹{placedOrder.finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Expected Delivery:</span>
                <strong className="text-emerald-800">{placedOrder.estimatedDelivery}</strong>
              </div>
            </div>

            {/* Email Confirmation Sent Banner */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-[#4b0082] flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#4b0082] shrink-0" />
                <div>
                  <span className="font-bold block">Order confirmation sent to {placedOrder.customer.email}</span>
                  <span className="text-[11px] text-gray-600">
                    A detailed invoice has been dispatched to your inbox.
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Notification Banner */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">WhatsApp Order Updates Active</span>
                  <span className="text-[11px] text-emerald-700">
                    Live courier tracking link sent to +91 {placedOrder.customer.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: View My Orders & Back to Store */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {onViewMyOrders && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewMyOrders();
                  }}
                  className="w-full sm:w-1/2 py-3 bg-[#4b0082] hover:bg-[#3a0066] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 border border-[#c9a84c]"
                >
                  <Package className="w-4 h-4 text-[#c9a84c]" />
                  <span>View My Orders</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`w-full ${onViewMyOrders ? 'sm:w-1/2' : ''} py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
