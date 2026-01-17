
import React from 'react';
import { Review, Category } from '../types';

interface ReviewCardProps {
  review: Review;
  onDelete: (id: string) => void;
}

const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const colors: Record<Category, string> = {
    [Category.TRAVEL]: 'bg-blue-100 text-blue-800',
    [Category.ELECTRONICS]: 'bg-purple-100 text-purple-800',
    [Category.FASHION]: 'bg-pink-100 text-pink-800',
    [Category.RESTAURANTS]: 'bg-orange-100 text-orange-800',
    [Category.BOOKS]: 'bg-green-100 text-green-800',
    [Category.PRODUCT]: 'bg-indigo-100 text-indigo-800',
    [Category.FOOD]: 'bg-yellow-100 text-yellow-800',
    [Category.OTHER]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${colors[category]}`}>
      {category}
    </span>
  );
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <CategoryBadge category={review.category} />
          <h3 className="text-lg font-bold mt-2 text-gray-900 leading-tight">{review.title}</h3>
        </div>
        <button
          onClick={() => onDelete(review.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating}/5</span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {review.content}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-gray-500">{review.author}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{review.date}</span>
      </div>
    </div>
  );
};
