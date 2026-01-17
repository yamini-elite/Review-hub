
import React, { useState, useEffect, useMemo } from 'react';
import { Review, Category, UserProfile } from './types';
import { ReviewCard } from './components/ReviewCard';
import { ReviewForm } from './components/ReviewForm';
import { ChatInterface } from './components/ChatInterface';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './services/AuthContext';
import { getRecommendations, RecommendedReview } from './services/recommendationService';
import { FirebaseTest } from './components/FirebaseTest';

import reviewsData from './data/reviews.json';

const ADMIN_EMAILS = ['arthiyamini16@gmail.com', 'admin@reviewwise.ai']; // TODO: Add your email here to see the debug panel

const ReviewWiseApp: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'chat'>('reviews');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Explorer',
    interests: [Category.TRAVEL, Category.ELECTRONICS, Category.PRODUCT],
    searchHistory: [],
    preferredRatingMin: 4
  });

  // Sync user name from Firebase
  useEffect(() => {
    if (user?.displayName) {
      setUserProfile(prev => ({ ...prev, name: user.displayName! }));
    }
  }, [user]);

  // Load reviews from local data store
  useEffect(() => {
    const mappedReviews: Review[] = reviewsData.map((r: any, index: number) => {
      let category: Category = Category.OTHER;
      const catStr = r.category.toLowerCase();

      if (catStr === 'product') category = Category.PRODUCT;
      else if (catStr === 'travel') category = Category.TRAVEL;
      else if (catStr === 'food') category = Category.FOOD;
      else if (catStr === 'fashion') category = Category.FASHION;
      else if (catStr === 'electronics') category = Category.ELECTRONICS;
      else if (catStr === 'restaurants') category = Category.RESTAURANTS;
      else if (catStr === 'books') category = Category.BOOKS;

      return {
        id: `uploaded-${index}`,
        title: r.item_name || 'Review',
        content: r.review_text,
        rating: r.rating,
        category: category,
        author: r.username,
        date: r.date
      };
    });

    const demoReviews: Review[] = [
      {
        id: '1',
        title: 'iPhone 15 Pro Max Review',
        content: 'The camera is phenomenal. The action button is a nice touch, but battery life is just okay for a pro model. Overall a solid buy for photography lovers.',
        rating: 4,
        category: Category.ELECTRONICS,
        author: 'Sarah Chen',
        date: '2024-03-10'
      },
      {
        id: '2',
        title: 'Santorini - A Dream Trip',
        content: 'Stayed in Oia. The sunset views are every bit as magical as people say. Highly recommend "The Blue Note" restaurant for authentic moussaka.',
        rating: 5,
        category: Category.TRAVEL,
        author: 'Marco Rossi',
        date: '2023-11-22'
      }
    ];

    setReviews([...demoReviews, ...mappedReviews]);
  }, []);

  const recommendations = useMemo(() =>
    getRecommendations(reviews, userProfile),
    [reviews, userProfile]
  );

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateSearchHistory = (term: string) => {
    // Better keyword extraction: Keep short but meaningful words
    const words = term.toLowerCase()
      .split(/[\s,?!.]+/)
      .filter(w => w.length >= 3 && !['what', 'this', 'that', 'with', 'from', 'have', 'your'].includes(w));

    // Also include the full phrase if it's 2-3 words (long tail search)
    const wordsCount = term.split(/\s+/).length;
    const itemsToAdd = (wordsCount > 1 && wordsCount <= 3) ? [term.toLowerCase().trim(), ...words] : words;

    setUserProfile(prev => ({
      ...prev,
      searchHistory: Array.from(new Set([...prev.searchHistory, ...itemsToAdd])).slice(-10)
    }));
  };

  const toggleInterest = (cat: Category) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(cat)
        ? prev.interests.filter(c => c !== cat)
        : [...prev.interests, cat]
    }));
  };

  const filteredReviews = selectedCategory === 'All'
    ? reviews
    : reviews.filter(r => r.category === selectedCategory);

  const handleNewReviewClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsFormOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-indigo-950 tracking-tight block">Review <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">Hub</span></span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Personalized Insights</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ask AI
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold hover:bg-indigo-100 transition-colors overflow-hidden"
                  title="Your Profile"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName || 'U').charAt(0).toUpperCase()
                  )}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) logout();
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Sign In
              </button>
            )}

            <button
              onClick={handleNewReviewClick}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              New Review
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {activeTab === 'reviews' ? (
          <div className="space-y-12">

            {/* DEBUG: Only visible to admins */}
            {isAdmin && <FirebaseTest />}

            {/* Recommendation Strip */}
            {recommendations.length > 0 && (
              <section className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border border-indigo-500/50">Engine V2.0</span>
                    <h2 className="text-2xl font-black">Top Picks For You</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase">{rec.category}</span>
                          <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Match Score: {rec.matchScore}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2 line-clamp-1">{rec.title}</h4>
                        <p className="text-white/60 text-xs line-clamp-2 mb-4 leading-relaxed">{rec.content}</p>
                        <div className="flex items-center space-x-1">
                          {rec.matchReasons.slice(0, 2).map((reason, i) => (
                            <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/80">
                              {reason.length > 25 ? reason.substring(0, 25) + '...' : reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Standard Feed Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between space-y-6 md:space-y-0">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Community Feed</h1>
                <p className="text-gray-500 font-medium mt-2">Discover authentic experiences from users like you.</p>
              </div>

              {/* Advanced Filter UI */}
              <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  All Reviews
                </button>
                {Object.values(Category).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Grid */}
            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReviews.map(review => (
                  <ReviewCard key={review.id} review={review} onDelete={deleteReview} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-800">No results found</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">No reviews in this category yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 flex items-center justify-between shadow-sm">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Expert Chat</h1>
                <p className="text-gray-500 font-medium">Analyzing {reviews.length} community insights for you.</p>
              </div>
              <div className="hidden sm:flex -space-x-3">
                {userProfile.interests.map((int, i) => (
                  <div key={int} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md z-${30 - i * 10} ${['bg-blue-500', 'bg-purple-500', 'bg-pink-500'][i % 3]}`}>
                    {int.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
            <ChatInterface
              reviews={reviews}
              profile={userProfile}
              onSearchPerformed={updateSearchHistory}
            />
          </div>
        )}
      </main>

      {/* Profile/Settings Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-black mb-2">Preferences</h2>
              <p className="text-indigo-100 font-medium">Tune your recommendation engine</p>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Display Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={e => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Category).map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleInterest(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${userProfile.interests.includes(cat) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Min Rating Filter: {userProfile.preferredRatingMin} Stars</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={userProfile.preferredRatingMin}
                  onChange={e => setUserProfile({ ...userProfile, preferredRatingMin: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && <ReviewForm onAdd={addReview} onClose={() => setIsFormOpen(false)} />}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <footer className="bg-white border-t border-gray-100 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 font-black tracking-widest uppercase">© 2024 Review Hub • Engineered with Gemini 3</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <ReviewWiseApp />
  </AuthProvider>
);

export default App;
