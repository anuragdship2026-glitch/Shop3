import React from 'react';
import { SHAPEWEAR_SIZE_GUIDE } from '../data/products';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-[#4b0082]/20">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#e8d5f5] text-[#4b0082] flex items-center justify-center font-bold">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-brand text-xl font-extrabold text-[#4b0082]">
              Shapewear Size Chart Guide
            </h3>
            <p className="text-xs text-gray-500">
              Find your perfect sculpt fit for 360° tummy control
            </p>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs text-left text-gray-700">
            <thead className="bg-[#4b0082] text-[#f2eded] font-bold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">US Size</th>
                <th className="px-4 py-3">Waist (inches)</th>
                <th className="px-4 py-3">Hip (inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SHAPEWEAR_SIZE_GUIDE.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f2eded]/50'}>
                  <td className="px-4 py-3 font-black text-[#4b0082] bg-[#e8d5f5]/30">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 font-semibold">{row.usSize}</td>
                  <td className="px-4 py-3 text-gray-900 font-bold">{row.waist}</td>
                  <td className="px-4 py-3 text-gray-900">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-4 p-3 bg-[#e8d5f5]/40 rounded-xl text-xs text-[#2d004d] space-y-1 border border-[#4b0082]/10">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#4b0082]" /> How to measure correctly:
          </div>
          <p className="text-gray-600 pl-5">
            Measure your waist around the narrowest part (just above belly button) and hips at the widest point. If between sizes, choose the larger size for maximum comfort.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 bg-[#4b0082] hover:bg-[#3a0066] text-white font-bold text-xs rounded-xl shadow transition"
        >
          Got It, Select My Size
        </button>

      </div>
    </div>
  );
};
