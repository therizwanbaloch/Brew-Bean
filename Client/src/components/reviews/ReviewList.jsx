import React from 'react';
import { HiStar } from 'react-icons/hi';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-amber-900/20 border border-amber-800/40 rounded-2xl p-6 text-center text-amber-300/70 text-sm">
        No reviews yet. Be the first to share your thoughts on this coffee!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev._id} className="bg-amber-900/20 border border-amber-800/40 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-200 text-sm">{rev.user?.name || 'Verified Coffee Lover'}</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-amber-800'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-amber-300/80 text-xs leading-relaxed">{rev.comment}</p>
          {rev.createdAt && (
            <span className="text-[10px] text-amber-400/50 block">
              {new Date(rev.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}