import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState('');
  const [trackedData, setTrackedData] = useState<{
    id: string;
    courier: string;
    trackingNo: string;
    status: string;
    estimatedDelivery: string;
    timeline: { title: string; time: string; completed: boolean }[];
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal) return;

    // Simulate tracking response
    setTrackedData({
      id: inputVal.startsWith('ORD-') ? inputVal : 'ORD-782194',
      courier: 'Delhivery Surface Express',
      trackingNo: 'IND918237461',
      status: 'In Transit — Out for Delivery Soon',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      timeline: [
        { title: 'Order Placed & Verified (COD)', time: 'Yesterday, 10:30 AM', completed: true },
        { title: 'Packed at Delhi Fulfillment Center', time: 'Yesterday, 04:15 PM', completed: true },
        { title: 'Handed over to Courier Partner (Delhivery)', time: 'Today, 08:00 AM', completed: true },
        { title: 'Out for Delivery (Agent Assigned)', time: 'Expected Tomorrow', completed: false }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-[#4b0082]/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#e8d5f5] text-[#4b0082] flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-[#4b0082]">
              Track Your Package Status
            </h3>
            <p className="text-xs text-gray-500">
              Enter your 6-digit Order ID or 10-digit Phone Number
            </p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            required
            placeholder="e.g. ORD-782194 or 9876543210"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4b0082]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#4b0082] text-white font-bold text-xs rounded-xl hover:bg-[#3a0066] transition flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" /> Track
          </button>
        </form>

        {/* Tracking Results */}
        {trackedData ? (
          <div className="p-4 bg-[#f2eded]/60 rounded-2xl border border-gray-200 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <div>
                <span className="font-bold text-[#4b0082] block">{trackedData.id}</span>
                <span className="text-[10px] text-gray-500">{trackedData.courier} • {trackedData.trackingNo}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {trackedData.status}
              </span>
            </div>

            <div className="text-gray-700 font-medium">
              Expected Delivery: <strong className="text-emerald-700">{trackedData.estimatedDelivery}</strong>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-2">
              {trackedData.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-bold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 text-xs space-y-1">
            <Package className="w-8 h-8 mx-auto text-gray-300" />
            <p>Order update notifications are also sent via SMS & WhatsApp upon dispatch.</p>
          </div>
        )}

      </div>
    </div>
  );
};
