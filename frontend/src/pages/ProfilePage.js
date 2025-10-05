import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, BookOpen, Star, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'x-auth-token': token },
                });
                setProfileData(res.data);
            } catch (err) {
                setError('Failed to load profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfileData();
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (loading || authLoading) return (
        <div className="flex justify-center items-center h-screen text-xl text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading profile...
        </div>
    );

    if (error || !profileData) return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-3xl text-red-500">Error</h1>
            <p className="text-lg text-gray-600">{error}</p>
        </div>
    );

    const { user, books, reviews } = profileData;

    const renderBookCard = (book) => (
        <div key={book._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex justify-between items-center">
            <div>
                <Link to={`/books/${book._id}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition duration-300">
                    {book.title}
                </Link>
                <p className="text-sm text-gray-500">by {book.author}</p>
            </div>
            <div className="flex space-x-2">
                <Link to={`/edit-book/${book._id}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
            </div>
        </div>
    );

    const renderReviewCard = (review) => (
        <div key={review._id} className="bg-gray-50 p-4 rounded-lg shadow-inner border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-700 mb-1">
                Reviewed: 
                <Link to={`/books/${review.bookId._id}`} className="text-indigo-600 hover:underline ml-1">
                    {review.bookId.title}
                </Link>
            </p>
            <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500' : 'text-gray-300'}`} />
                ))}
            </div>
            <p className="text-gray-600 italic">"{review.reviewText}"</p>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-indigo-600">
                <div className="flex items-center space-x-4 mb-8 border-b pb-4">
                    <User className="w-10 h-10 text-indigo-600 bg-indigo-50 p-2 rounded-full" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{user.name}'s Dashboard</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <BookOpen className="w-6 h-6 text-green-600" />
                            <span>Books Added ({books.length})</span>
                        </h2>
                        <div className="space-y-3">
                            {books.length > 0 ? books.map(renderBookCard) : (
                                <p className="text-gray-500 italic">You haven't added any books yet.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <Star className="w-6 h-6 text-yellow-600" />
                            <span>Your Reviews ({reviews.length})</span>
                        </h2>
                        <div className="space-y-3">
                            {reviews.length > 0 ? reviews.map(renderReviewCard) : (
                                <p className="text-gray-500 italic">You haven't submitted any reviews.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;