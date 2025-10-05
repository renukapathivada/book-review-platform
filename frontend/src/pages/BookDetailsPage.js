import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookDetails, deleteBook, addReview, deleteReview } from '../api/booksApi';
import { Star, Loader2, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const formatChartData = (distribution) => {
  // Initialize data for all 5 stars, setting count to 0
  let dataMap = {};
  for (let i = 1; i <= 5; i++) {
    dataMap[i] = { rating: `${i} Star`, count: 0 };
  }

  // Populate actual counts from the backend distribution array
  distribution.forEach(item => {
    if (dataMap[item._id]) {
      dataMap[item._id].count = item.count;
    }
  });

  // Convert map values to an array and sort from 1 to 5 stars
  return Object.values(dataMap).sort((a, b) => a.rating.localeCompare(b.rating));
};

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < fullStars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

const ReviewForm = ({ bookId, onReviewAdded }) => {
    const { isAuthenticated, user } = useAuth();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const handleStarClick = (newRating) => setRating(newRating);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return setError('Please select a star rating.');
        setSubmitting(true);
        setError('');
        try {
            await addReview({ bookId, rating, reviewText });
            setRating(0);
            setReviewText('');
            onReviewAdded();
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) return (
        <p className="text-center p-4 bg-gray-100 rounded-xl text-gray-600 font-medium shadow-inner">
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link> to add your review.
        </p>
    );

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Add Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2 star-rating">
                    <label className="text-sm font-medium text-gray-700">Rating:</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                className={`w-6 h-6 cursor-pointer transition duration-150 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                onClick={() => handleStarClick(star)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review comments here..."
                        rows="4"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                    />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 flex items-center shadow-md"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

const RatingChart = ({ distribution, totalReviews }) => {
    const chartData = formatChartData(distribution);

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Rating Distribution</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="rating" stroke="#6b7280" />
                        <YAxis allowDecimals={false} stroke="#6b7280" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                            formatter={(value) => [`${value} reviews`, 'Count']}
                        />
                        <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">Total Reviews: {totalReviews}</p>
        </div>
    );
};
const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchBookDetails(id);
      setBookData(data);
    } catch (err) {
      setError('Book not found or failed to load details.');
      setBookData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBookDetails();
  }, [loadBookDetails]);

  const handleDeleteBook = async () => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        try {
            await deleteBook(id);
            navigate('/');
        } catch (err) {
            console.error('Delete Book Failed:', err.response?.data?.msg || err); 
            setError(err.response?.data?.msg || 'Failed to delete book.');
        }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
        try {
            await deleteReview(reviewId);
            loadBookDetails();
        } catch (err) {
            console.error('Delete Review Failed:', err.response?.data?.msg || err);
            setError(err.response?.data?.msg || 'Failed to delete review.');
        }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-xl text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading book details...
    </div>
  );

  if (error && !bookData) return (
    <div className="p-10 text-center">
      <h1 className="text-3xl text-red-500">Error</h1>
      <p className="text-lg text-gray-600">{error}</p>
      <Link to="/" className="text-blue-600 hover:underline mt-4 block font-medium">Go back to book list</Link>
    </div>
  );

  const book = bookData.book;
  const averageRating = bookData.averageRating;
  const reviews = bookData.reviews;
  const distribution = bookData.ratingDistribution;
  const isBookCreator = isAuthenticated && user?.id === book.addedBy?._id;
  const totalReviews = reviews.length;

  return (
    <div className="container mx-auto p-4 md:p-10">
      <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12">
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{book.title}</h1>
          {isBookCreator && (
            <div className="flex space-x-2">
              <Link to={`/edit-book/${book._id}`} className="p-2 text-indigo-600 hover:text-indigo-800 transition duration-300 shadow-sm rounded-full bg-gray-100">
                <Edit className="w-6 h-6" />
              </Link>
              <button onClick={handleDeleteBook} className="p-2 text-red-600 hover:text-red-800 transition duration-300 shadow-sm rounded-full bg-gray-100">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <p className="text-xl font-semibold text-gray-700">Author: <span className="text-gray-900">{book.author}</span></p>
            <p className="text-md text-gray-500">Genre: **{book.genre}** | Published: **{book.year}**</p>
            <p className="text-gray-800 leading-relaxed mt-4">{book.description}</p>
            <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">Added by: {book.addedBy.name}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl text-center shadow-2xl border-t-4 border-blue-400">
            <h3 className="text-2xl font-bold text-blue-800 mb-3">Average Rating</h3>
            <p className="text-6xl font-extrabold text-blue-600 mb-2">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center mb-4">
              <RatingStars rating={averageRating} />
            </div>
            <p className="text-sm text-gray-600">({reviews.length} total reviews)</p>
          </div>
        </div>
        {totalReviews > 0 && (
          <div className="mb-10">
              <RatingChart distribution={distribution} totalReviews={totalReviews} />
          </div>
        )}
        <div className="mb-12 border-t pt-8 border-gray-200">
            <ReviewForm bookId={id} onReviewAdded={loadBookDetails} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">User Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-lg">Be the first to review this book!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-lg flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{review.userId.name}</p>
                    <div className="flex items-center my-1">
                      <RatingStars rating={review.rating} />
                      <span className="ml-2 text-sm text-gray-600 font-medium">({review.rating} / 5)</span>
                    </div>
                    <p className="text-gray-700 mt-2 italic border-l-2 pl-3 border-gray-100">"{review.reviewText}"</p>
                  </div>
                  {isAuthenticated && user?.id === review.userId._id && (
                    <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full bg-gray-100 transition duration-300"
                        title="Delete Review"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;