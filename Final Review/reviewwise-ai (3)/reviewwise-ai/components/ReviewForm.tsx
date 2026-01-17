import React, { useState } from 'react';
import { Category, Review } from '../types';

interface ReviewFormProps {
  onAdd: (review: Review) => void;
  onClose: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    category: Category.TRAVEL,
    author: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      date: new Date().toLocaleDateString()
    };

    onAdd(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Post a Review</h2>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Share your experience</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                <select
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                <div className="flex items-center space-x-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-2.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-xl transition-transform hover:scale-125 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Review Title</label>
              <input
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Brief summary..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Author Name</label>
              <input
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Your name"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Content</label>
              <textarea
                required
                rows={4}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 font-bold focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Share your experience..."
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
