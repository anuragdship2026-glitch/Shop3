import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface ProductQuizWidgetProps {
  onSelectProduct: (p: Product) => void;
}

export const ProductQuizWidget: React.FC<ProductQuizWidgetProps> = ({ onSelectProduct }) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const goals = [
    { id: 'slimming', title: '👗 Instant Shape & Body Contour', targetId: 'p2' },
    { id: 'smoothie', title: '🥤 Portable Smoothies & Fast Blending', targetId: 'p1' },
    { id: 'hair', title: '✨ Painless Hair Removal & Grooming', targetId: 'p3' },
    { id: 'spiritual', title: '🪔 Pure Brass Puja & Festival Decor', targetId: 'p4' }
  ];

  const handleSelectGoal = (goal: typeof goals[0]) => {
    setSelectedGoal(goal.id);
    const prod = PRODUCTS.find((p) => p.id === goal.targetId) || PRODUCTS[0];
    setRecommendedProduct(prod);
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGoal(null);
    setRecommendedProduct(null);
  };

  return (
    <div className="bg-gradient-to-r from-[#3a0066] to-[#4b0082] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden my-8 border border-[#c9a84c]/30 backdrop-blur-md">
      
      {/* Background Decorative Pattern */}
      <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 rounded-full bg-[#c9a84c]/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a84c]/20 text-[#c9a84c] rounded-full text-xs font-bold uppercase tracking-wider border border-[#c9a84c]/40">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Finder
        </div>

        <h2 className="font-serif-brand text-2xl sm:text-3xl font-black">
          Find Your Perfect Lifestyle Match In 10 Seconds
        </h2>

        {step === 1 && (
          <div className="space-y-4 pt-2">
            <p className="text-xs sm:text-sm text-gray-200 font-medium">
              What primary benefit are you looking for today?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGoal(g)}
                  className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-left font-extrabold text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                >
                  <span>{g.title}</span>
                  <ArrowRight className="w-4 h-4 text-[#c9a84c] group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && recommendedProduct && (
          <div className="bg-white text-[#2c2c2c] p-6 rounded-2xl shadow-2xl space-y-4 animate-fadeIn text-left max-w-lg mx-auto border border-[#c9a84c]">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ✓ Best Recommended Match
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Try Again
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={recommendedProduct.images[0]}
                alt={recommendedProduct.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
              />
              <div className="space-y-1">
                <h3 className="font-serif-brand text-base font-bold text-[#4b0082]">
                  {recommendedProduct.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {recommendedProduct.description}
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-black text-[#6b1a9e]">
                    Rs. {recommendedProduct.sellPrice}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    Rs. {recommendedProduct.mrp}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProduct(recommendedProduct)}
              className="w-full py-3 bg-[#4b0082] hover:bg-[#3a0066] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-[#c9a84c]"
            >
              <span>View Product Details & Buy</span>
              <ArrowRight className="w-4 h-4 text-[#c9a84c]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
