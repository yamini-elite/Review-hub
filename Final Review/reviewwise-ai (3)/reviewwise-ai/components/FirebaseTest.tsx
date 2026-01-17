import React, { useState, useEffect } from 'react';
import { addReview, getReviews, deleteReview } from '../services/reviewService';
import { useAuth } from '../services/AuthContext';

export const FirebaseTest: React.FC = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    // Form state
    const [productName, setProductName] = useState('Test Product');
    const [reviewText, setReviewText] = useState('This is a test review.');
    const [rating, setRating] = useState(5);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await getReviews();
            setReviews(data);
            setStatus('Reviews fetched successfully');
        } catch (error: any) {
            setStatus('Error fetching reviews: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleAdd = async () => {
        if (!user) {
            setStatus('Please login to add a review');
            return;
        }
        setLoading(true);
        try {
            await addReview(user.uid, productName, rating, reviewText);
            setStatus('Review added successfully');
            await fetchReviews();
        } catch (error: any) {
            setStatus('Error adding review: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteReview(id);
            setStatus('Review deleted successfully');
            await fetchReviews();
        } catch (error: any) {
            setStatus('Error deleting review: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg m-4 border border-indigo-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">Firebase CRUD Verification</h2>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm font-mono text-gray-600">
                Status: <span className={status.includes('Error') ? 'text-red-600' : 'text-green-600'}>{status || 'Ready'}</span>
            </div>

            {/* ADD SECTION */}
            <div className="mb-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-lg mb-3 text-indigo-800">1. Create Review</h3>
                {!user ? (
                    <div className="text-amber-600 font-bold">⚠️ Please login (top right) to test adding functionality</div>
                ) : (
                    <div className="space-y-3">
                        <input
                            className="w-full p-2 border rounded-lg"
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            placeholder="Product Name"
                        />
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            placeholder="Review Text"
                        />
                        <div className="flex items-center gap-2">
                            <span>Rating:</span>
                            <input
                                type="number"
                                className="p-2 border rounded-lg w-20"
                                value={rating}
                                max={5}
                                min={1}
                                onChange={e => setRating(Number(e.target.value))}
                            />
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Test Review'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* READ/DELETE SECTION */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-indigo-800">2. Read & Delete Reviews</h3>
                    <button onClick={fetchReviews} className="text-sm text-indigo-600 hover:underline">Refresh List</button>
                </div>

                {reviews.length === 0 ? (
                    <p className="text-gray-400 italic">No reviews found in Firestore 'reviews' collection.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {reviews.map((r) => (
                            <div key={r.id} className="p-4 border rounded-xl flex justify-between items-start hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800">{r.productName}</h4>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">★ {r.rating}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{r.reviewText}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">ID: {r.id}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
