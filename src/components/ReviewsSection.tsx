import React, { useState } from 'react';
import { REVIEWS } from '../data/products';
import { Star, SlidersHorizontal, ArrowUpDown, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  productId?: string;
  rating?: number;
  totalReviews?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  rating = 4.8,
  totalReviews = 1108
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  // Form states
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      author,
      location: location || 'India',
      rating: userRating,
      date: todayStr,
      title: title || comment.substring(0, 30) + '...',
      comment,
      verified: true,
      productName: productId || 'Verified Customer Review'
    };

    setReviewsList([newRev, ...reviewsList]);
    setAuthor('');
    setLocation('');
    setTitle('');
    setComment('');
    setShowAddReview(false);
    setCurrentPage(1);
  };

  // Filter for specific product if requested
  let filteredReviews = productId
    ? reviewsList.filter(r => r.productId === productId)
    : reviewsList;

  // Filter by rating if selected
  if (filterRating !== null) {
    filteredReviews = filteredReviews.filter(r => r.rating === filterRating);
  }

  // Sort
  filteredReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'highest') return b.rating - a.rating;
    if (sortOption === 'lowest') return a.rating - b.rating;
    return b.id.localeCompare(a.id); // newest default
  });

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto font-sans">
      <div className="bg-white rounded-2xl p-4 sm:p-8 space-y-6">
        
        {/* Top Header Row - Exact Match to Photo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-sm">
              <span className="font-bold text-[#111827] text-base">{rating}</span>
              <span className="text-gray-500 font-normal">
                {totalReviews ? totalReviews.toLocaleString('en-US') : '1,108'} reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Write a review button - Dark Teal */}
            <button
              onClick={() => {
                setShowAddReview(!showAddReview);
                setShowFilterMenu(false);
                setShowSortMenu(false);
              }}
              className="px-5 py-2.5 bg-[#0d826c] hover:bg-[#0b6c5a] text-white font-medium text-sm rounded-lg transition shadow-2xs flex items-center gap-2"
            >
              <span>Write a review</span>
            </button>

            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
                title="Filter reviews"
                className={`p-2.5 border rounded-lg transition flex items-center justify-center ${
                  filterRating !== null 
                    ? 'border-[#0d826c] bg-teal-50 text-[#0d826c]' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Filter Dropdown */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20 space-y-1 text-xs text-gray-700">
                  <div className="font-bold text-gray-900 px-2 py-1 border-b pb-1">Filter by Rating</div>
                  <button
                    onClick={() => { setFilterRating(null); setShowFilterMenu(false); setCurrentPage(1); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>All Ratings</span>
                    {filterRating === null && <Check className="w-3.5 h-3.5 text-[#0d826c]" />}
                  </button>
                  {[5, 4, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => { setFilterRating(num); setShowFilterMenu(false); setCurrentPage(1); }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>{num} Star Reviews</span>
                      {filterRating === num && <Check className="w-3.5 h-3.5 text-[#0d826c]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
                title="Sort reviews"
                className="p-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              {/* Sort Dropdown */}
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20 space-y-1 text-xs text-gray-700">
                  <div className="font-bold text-gray-900 px-2 py-1 border-b pb-1">Sort Reviews</div>
                  <button
                    onClick={() => { setSortOption('newest'); setShowSortMenu(false); setCurrentPage(1); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Most Recent</span>
                    {sortOption === 'newest' && <Check className="w-3.5 h-3.5 text-[#0d826c]" />}
                  </button>
                  <button
                    onClick={() => { setSortOption('highest'); setShowSortMenu(false); setCurrentPage(1); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Highest Rating</span>
                    {sortOption === 'highest' && <Check className="w-3.5 h-3.5 text-[#0d826c]" />}
                  </button>
                  <button
                    onClick={() => { setSortOption('lowest'); setShowSortMenu(false); setCurrentPage(1); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Lowest Rating</span>
                    {sortOption === 'lowest' && <Check className="w-3.5 h-3.5 text-[#0d826c]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        {showAddReview && (
          <form onSubmit={handleSubmitReview} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Write Your Customer Review</h3>
              <button 
                type="button" 
                onClick={() => setShowAddReview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Star Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Overall Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= userRating 
                          ? 'fill-[#0d826c] text-[#0d826c]' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhavna Joshi"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d826c]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d826c]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Review Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Looks sturdy enough for everyday use"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d826c]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Review Details *</label>
              <textarea
                required
                rows={3}
                placeholder="Write your honest thoughts about product quality, comfort, or delivery..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0d826c]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0d826c] text-white font-medium text-xs rounded-lg shadow hover:bg-[#0b6c5a] transition"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List - Exactly formatted like the photo (Max 5 per page) */}
        <div className="divide-y divide-gray-200/80">
          {paginatedReviews.map((rev) => {
            const firstLetter = rev.author ? rev.author.charAt(0).toUpperCase() : 'C';

            return (
              <div key={rev.id} className="py-6 space-y-3">
                {/* 5-Star Rating Row (Teal color) */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-[#0d826c] text-[#0d826c]'
                          : 'text-gray-300 fill-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Author Avatar & Name Row */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e6f4f1] text-[#0d826c] flex items-center justify-center font-bold text-sm shrink-0 border border-teal-100">
                    {firstLetter}
                  </div>
                  <div>
                    <div className="font-bold text-[#111827] text-sm leading-tight">
                      {rev.author}
                    </div>
                    <div className="text-xs text-gray-400 font-normal mt-0.5">
                      {rev.date}
                    </div>
                  </div>
                </div>

                {/* Review Headline Title */}
                {rev.title && (
                  <h3 className="font-bold text-[#111827] text-sm sm:text-base leading-snug">
                    {rev.title}
                  </h3>
                )}

                {/* Review Natural Text */}
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pagination Bar - Exactly 5 reviews per page */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{startIndex + 1}-{Math.min(startIndex + REVIEWS_PER_PAGE, filteredReviews.length)}</span> of <span className="font-bold text-gray-800">{filteredReviews.length}</span> reviews
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#0d826c] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
