import React, { useState } from 'react';
import { REVIEWS } from '../data/products';
import { Star, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productName, setProductName] = useState('4-in-1 High Waist Tummy Tucker Shapewear');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      author,
      location: location || 'India',
      rating,
      date: 'Just now',
      comment,
      verified: true,
      productName
    };

    setReviewsList([newRev, ...reviewsList]);
    setAuthor('');
    setComment('');
    setShowAddReview(false);
  };

  return (
    <section className="my-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#4b0082]/10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#c9a84c] text-[#2d004d] text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Verified Social Proof
              </span>
              <span className="text-xs font-bold text-gray-500">
                ★★★★★ 4.8 / 5.0 Average
              </span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-[#4b0082]">
              What Our Customers Say
            </h2>
          </div>

          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-5 py-2.5 bg-[#4b0082] hover:bg-[#3a0066] text-white font-extrabold text-xs rounded-full shadow transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#c9a84c]" />
            <span>Write A Review</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddReview && (
          <form onSubmit={handleSubmitReview} className="p-4 bg-[#f2eded]/60 rounded-2xl border border-[#4b0082]/20 space-y-3">
            <h3 className="font-serif-brand text-sm font-bold text-[#4b0082]">Share Your Feedback</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none"
              />
              <input
                type="text"
                placeholder="City/State (e.g. Mumbai, MH)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            <textarea
              required
              rows={3}
              placeholder="How was your experience with Indigo & Co.?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none"
            />

            <button
              type="submit"
              className="px-6 py-2 bg-[#4b0082] text-white font-bold text-xs rounded-xl shadow hover:bg-[#3a0066] transition"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-[#f2eded]/40 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#c9a84c]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#c9a84c]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs">
                <div>
                  <span className="font-bold text-[#2c2c2c] block">{rev.author}</span>
                  <span className="text-[10px] text-gray-500">{rev.location}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
