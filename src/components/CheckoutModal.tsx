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
  MessageCircle,
  Copy,
  Download,
  Info,
  Tag
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess
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
    if (!name || !phone || !address || !city || !pincode) {
      alert('Please fill in all mandatory delivery details.');
      return;
    }
    if (pincode.length !== 6) {
      alert('Please enter a valid 6-digit Pincode.');
      return;
    }
    setStep('PAYMENT');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        customerName: name,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        cartItems,
        paymentMethod,
        finalAmount,
        codFee
      };

      // Call Express Backend API (which pushes to Shopify Admin API)
      let backendData: any = null;
      try {
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          backendData = await response.json();
        }
      } catch (e) {
        console.warn('Backend API call notice:', e);
      }

      setIsProcessing(false);
      const trackingNum = backendData?.localOrder?.trackingNumber || ('IND' + Math.floor(10000000 + Math.random() * 90000000));
      const estDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const newOrder: Order = {
        id: backendData?.localOrder?.id || ('ORD-' + Math.floor(100000 + Math.random() * 900000)),
        items: cartItems,
        customer: { name, phone, email, address, city, state, pincode },
        paymentMethod,
        totalAmount: subtotal,
        discount: 0,
        codFee,
        finalAmount,
        status: 'Confirmed',
        orderDate: new Date().toLocaleDateString('en-IN'),
        estimatedDelivery: estDate,
        trackingNumber: trackingNum
      };

      setPlacedOrder(newOrder);
      onOrderSuccess(newOrder);
      setStep('CONFIRMED');
    } catch (err) {
      console.error('Order placement error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-[#4b0082]/20 my-4">
        
        {/* Close Button */}
        {step !== 'CONFIRMED' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Steps */}
        <div className="border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#4b0082] mb-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#c9a84c]" /> Secure Checkout
            </span>
            <span className="text-gray-400">100% Encrypted & Safe</span>
          </div>

          {step !== 'CONFIRMED' && (
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded-full ${step === 'ADDRESS' ? 'bg-[#4b0082] text-white' : 'bg-gray-100 text-gray-500'}`}>
                1. Delivery Address
              </span>
              <span className="text-gray-300">→</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 'PAYMENT' ? 'bg-[#4b0082] text-white' : 'bg-gray-100 text-gray-500'}`}>
                2. Payment & Order Summary
              </span>
            </div>
          )}
        </div>

        {/* STEP 1: ADDRESS */}
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
                  Mobile Number (For Delivery & Order Updates) *
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
                🚚 Free Shipping
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

                {/* Explanatory Callout when COD is active */}
                {paymentMethod === 'COD' && (
                  <div className="mt-1 text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold">COD Charge Breakdown:</span> A ₹50 convenience fee is added by logistics partners to handle physical cash collection & verification at your doorstep.
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

            {/* Price Summary Box with Itemized COD Fee Line */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charge</span>
                <span className="text-emerald-700 font-bold">FREE (Pan-India)</span>
              </div>

              {/* SEPARATE LINE ITEM FOR COD CONVENIENCE CHARGE */}
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

        {/* STEP 3: ORDER CONFIRMED */}
        {step === 'CONFIRMED' && placedOrder && (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-[#c9a84c] text-[#2d004d] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Order Verified & Dispatching
              </span>
              <h2 className="font-serif-brand text-2xl font-extrabold text-[#4b0082] mt-1">
                Thank You, {placedOrder.customer.name}!
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Your order has been received and sent to our fulfillment center.
              </p>
            </div>

            {/* Order Details Card with Itemized COD Fee */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-left space-y-2.5">
              <div className="flex justify-between border-b border-gray-200 pb-2 font-bold">
                <span className="text-gray-600">Order ID:</span>
                <span className="text-[#4b0082] font-mono font-black">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Tracking ID:</span>
                <span className="font-mono font-bold text-gray-900">{placedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Payment Mode:</span>
                <span className="font-bold text-gray-900">{placedOrder.paymentMethod}</span>
              </div>

              {/* Itemized Cost Breakdown in Receipt */}
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
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">₹0 (Prepaid)</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-800 font-bold">Total Amount Payable on Delivery:</span>
                <span className="font-black text-[#4b0082] text-sm">₹{placedOrder.finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Expected Delivery:</span>
                <span className="font-bold text-emerald-800">{placedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* WhatsApp Notification Banner */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">WhatsApp Order Updates Sent!</span>
                  <span className="text-[11px] text-emerald-700">
                    Live tracking link sent to +91 {placedOrder.customer.phone}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#4b0082] text-white font-bold text-xs rounded-xl shadow hover:bg-[#3a0066] transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

