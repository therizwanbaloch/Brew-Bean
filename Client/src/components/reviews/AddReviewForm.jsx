import React, { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AddReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="bg-[#3E2723]/30 border border-[#3E2723] rounded-2xl p-5 text-center text-xs text-[#D2B48C]">
        Please sign in to leave a review for this drink.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      // Hits POST /api/reviews directly
      const res = await API.post('/reviews', {
        productId,
        rating,
        comment,
      });

      if (res.data.success) {
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#3E2723]/30 border border-[#3E2723] rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-[#FDFBF7] text-sm">Write a Review</h3>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900">
          {error}
        </div>
      )}

      {/* Star Rating Picker */}
      <div>
        <label className="text-xs text-[#D2B48C] font-medium block mb-1">Rating:</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none"
            >
              <HiStar
                className={`w-6 h-6 transition ${
                  star <= rating ? 'fill-[#E67E22] text-[#E67E22]' : 'text-[#3E2723]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Field */}
      <div>
        <label className="text-xs text-[#D2B48C] font-medium block mb-1">Your Feedback:</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the flavor profile and temperature?"
          className="w-full bg-[#1C100B] text-[#FDFBF7] placeholder-[#D2B48C]/40 text-xs p-3 rounded-xl border border-[#3E2723] focus:outline-none focus:border-[#E67E22]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#E67E22] hover:brightness-110 text-[#1C100B] font-bold py-2.5 rounded-xl text-xs transition"
      >
        {submitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
}