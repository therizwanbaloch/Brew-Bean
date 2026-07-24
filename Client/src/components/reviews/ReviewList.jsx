import React from 'react';
import { HiStar } from 'react-icons/hi';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-6 text-center text-[#D2B48C]/70 text-sm">
        No reviews yet. Be the first to share your thoughts on this coffee!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev._id} className="bg-[#3E2723]/20 border border-[#3E2723]/60 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#FDFBF7] text-sm">{rev.user?.name || 'Verified Coffee Lover'}</span>
            <div className="flex items-center text-[#E67E22]">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-4 h-4 ${i < rev.rating ? 'fill-[#E67E22] text-[#E67E22]' : 'text-[#3E2723]'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[#D2B48C]/90 text-xs leading-relaxed">{rev.comment}</p>
          {rev.createdAt && (
            <span className="text-[10px] text-[#D2B48C]/50 block">
              {new Date(rev.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}