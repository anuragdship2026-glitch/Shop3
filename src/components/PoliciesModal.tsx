import React, { useState } from 'react';
import { GST_DETAILS, POLICIES_CONTENT } from '../data/products';
import { X, FileText, Truck, RotateCcw, ShieldCheck, Mail, Building, MapPin } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'SHIPPING' | 'RETURNS' | 'GST' | 'CONTACT'>('SHIPPING');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-[#4b0082]/20 my-6">
        
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-brand text-xl font-bold text-[#4b0082]">
              Store Policies & GST Information
            </h3>
            <p className="text-xs text-gray-500">
              Indigo & Co. (indigoandco.in) • Transparent Business Details
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('SHIPPING')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'SHIPPING'
                ? 'bg-[#4b0082] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🚚 Shipping Policy
          </button>

          <button
            onClick={() => setActiveTab('RETURNS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'RETURNS'
                ? 'bg-[#4b0082] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔄 Return & Refund
          </button>

          <button
            onClick={() => setActiveTab('GST')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'GST'
                ? 'bg-[#4b0082] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🏛️ GST Registration
          </button>

          <button
            onClick={() => setActiveTab('CONTACT')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'CONTACT'
                ? 'bg-[#4b0082] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📞 Contact Support
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4 min-h-[220px]">
          
          {/* SHIPPING */}
          {activeTab === 'SHIPPING' && (
            <div className="space-y-3 text-xs text-gray-700">
              <h4 className="font-bold text-[#4b0082] text-sm">
                Free Shipping Across India
              </h4>
              <p>
                We provide FREE shipping on all prepaid and Cash on Delivery (COD) orders across India.
              </p>
              <ul className="space-y-2 bg-[#f2eded]/60 p-4 rounded-2xl border border-gray-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Processing Time:</span>
                  <span>24 to 48 business hours for quality check & packing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Metro Cities:</span>
                  <span>3 to 7 business days delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Tier 2 & Tier 3:</span>
                  <span>5 to 7 business days delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Remote Locations:</span>
                  <span>7 to 10 business days delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Tracking Number:</span>
                  <span>A tracking link will be sent via SMS & WhatsApp immediately upon courier pickup.</span>
                </li>
              </ul>
            </div>
          )}

          {/* RETURNS */}
          {activeTab === 'RETURNS' && (
            <div className="space-y-3 text-xs text-gray-700">
              <h4 className="font-bold text-[#4b0082] text-sm">
                7 Days Easy Return & Refund Window
              </h4>
              <p>
                Customer satisfaction is our top priority. If you receive a damaged or wrong product, we offer a hassle-free return window.
              </p>
              <ul className="space-y-2 bg-[#f2eded]/60 p-4 rounded-2xl border border-gray-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• 7 Days Return:</span>
                  <span>Requests must be initiated within 7 days of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• COD Refunds:</span>
                  <span>For Cash on Delivery orders, refunds are transferred directly to your bank account or UPI ID.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#4b0082]">• Shapewear Size Exchanges:</span>
                  <span>Need a different size? Size exchanges are handled swiftly by our support team.</span>
                </li>
              </ul>
            </div>
          )}

          {/* GST */}
          {activeTab === 'GST' && (
            <div className="space-y-3 text-xs text-gray-700">
              <h4 className="font-bold text-[#4b0082] text-sm">
                Official GST Registration Details
              </h4>
              <p>
                Indigo & Co. is a fully registered Indian e-commerce enterprise operating under Sole Proprietorship.
              </p>
              <div className="grid grid-cols-2 gap-3 bg-[#f2eded]/60 p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">State:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.state}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Ward:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.ward}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Commissionerate:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.commissionerate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Division:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.division}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Range:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.range}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Business Type:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.businessType}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Nature of Business:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.natureOfBusiness}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Reason for Registration:</span>
                  <span className="font-bold text-gray-900">{GST_DETAILS.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {activeTab === 'CONTACT' && (
            <div className="space-y-3 text-xs text-gray-700">
              <h4 className="font-bold text-[#4b0082] text-sm">
                Get In Touch With Indigo & Co.
              </h4>
              <div className="p-4 bg-[#f2eded]/60 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#4b0082]" />
                  <div>
                    <span className="text-gray-500 block">Email Support:</span>
                    <a href={`mailto:${GST_DETAILS.email}`} className="font-bold text-[#4b0082] hover:underline text-sm">
                      {GST_DETAILS.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#4b0082]" />
                  <div>
                    <span className="text-gray-500 block">Support Hours:</span>
                    <span className="font-bold text-gray-900">{GST_DETAILS.supportHours}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-[#4b0082] text-white font-bold text-xs rounded-xl shadow hover:bg-[#3a0066] transition"
        >
          Close
        </button>

      </div>
    </div>
  );
};
