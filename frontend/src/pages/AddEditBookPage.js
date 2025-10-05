import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, fetchBookDetails } from '../api/booksApi';
import { BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialFormData = {
  title: '',
  author: '',
  description: '',
  genre: '',
  year: '',
};
const CURRENT_YEAR = new Date().getFullYear(); // Define current year for max constraint
const MIN_YEAR = 1400;

const AddEditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!id;

  const loadBookData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchBookDetails(id);
      const book = data.book;
      
      if (user && book.addedBy._id !== user.id) {
          setError('You are not authorized to edit this book.');
          setTimeout(() => navigate('/'), 3000);
          return;
      }
      
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        year: book.year,
      });
    } catch (err) {
      setError('Failed to load book data.');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    if (isEditMode) {
      loadBookData();
    }
  }, [id, isEditMode, loadBookData, isAuthenticated, navigate, authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        await updateBook(id, formData);
      } else {
        await createBook(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${isEditMode ? 'update' : 'add'} book.`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (isEditMode && loading)) return (
    <div className="flex justify-center items-center h-screen text-xl text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading...
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl border-t-4 border-indigo-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <span>{isEditMode ? 'Edit Book Details' : 'Add New Book'}</span>
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">Author</label>
            <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="genre">Genre</label>
              <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">Published Year</label>
              <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"min={MIN_YEAR} 
                max={CURRENT_YEAR}
                placeholder={`e.g., ${CURRENT_YEAR}`} />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 flex justify-center items-center shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (isEditMode ? 'Update Book' : 'Add Book')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditBookPage;