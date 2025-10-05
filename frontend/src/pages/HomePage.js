import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../api/booksApi';
import { Loader2, Search, Star, BookOpen } from 'lucide-react';

const BookCard = ({ book }) => {
  const rating = book.averageRating || 0; 
  
  const renderRating = () => {
    if (rating === 0) return <p className="text-sm text-gray-500">No reviews yet</p>;
    
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < fullStars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <div className="flex space-x-0.5">{stars}</div>
        <span className="text-sm font-semibold text-gray-700">({rating.toFixed(1)})</span>
      </div>
    );
  };
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 border border-gray-100 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          by <span className="font-medium text-gray-800">{book.author}</span>
        </p>
        <div className="mb-4">
            {renderRating()}
        </div>
        <p className="text-gray-700 text-base line-clamp-4">{book.description}</p>
      </div>
      <div className="mt-6">
        <p className="text-xs text-indigo-500 font-semibold mb-2">{book.genre} ({book.year})</p>
        <Link
          to={`/books/${book._id}`}
          className="mt-4 block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [booksData, setBooksData] = useState({ books: [], totalPages: 1, currentPage: 1, totalBooks: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const loadBooks = useCallback(async (pageNumber, search, genre, sort) => {
    setLoading(true);
    setError('');
    try {
      // Construct query string with all parameters
      const data = await fetchBooks(pageNumber, search, genre, sort);
      
      setBooksData(data);
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks(page, searchTerm, genreFilter, sortBy);
  }, [page, searchTerm, genreFilter, sortBy, loadBooks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= booksData.totalPages) {
      setPage(newPage);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
    setPage(1);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };
  const booksToDisplay = booksData?.books || [];
  if (loading && booksData.books.length === 0) return (
    <div className="flex justify-center items-center h-screen text-xl text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading books...
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
        Explore Great Books ({booksData.totalBooks} available)
      </h1>
      {/* Search, Filter, and Sort Controls */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
            />
          </div>
          {/* Genre Filter */}
          <div className="flex items-center space-x-2 w-full lg:w-1/4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <select
              value={genreFilter}
              onChange={handleGenreChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="All">All Genres</option>
              {booksData.genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          {/* Sort By */}
          <div className="flex items-center space-x-2 w-full lg:w-1/4">
            <Star className="w-5 h-5 text-yellow-500" />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 appearance-none bg-white"
            >
              <option value="">Sort By...</option>
              <option value="year_desc">Year (Newest)</option>
              <option value="year_asc">Year (Oldest)</option>
              <option value="rating_desc">Rating (Highest)</option>
              <option value="rating_asc">Rating (Lowest)</option>
            </select>
          </div>
          
        </div>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {booksToDisplay.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
      {booksData.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-300 shadow-md"
          >
            Previous
          </button>
          <span className="text-lg font-medium text-gray-700">
            Page {page} of {booksData.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === booksData.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition duration-300 shadow-md"
          >
            Next
          </button>
        </div>
      )}
      {booksToDisplay.length === 0 && !loading && (
        <p className="text-center text-gray-500 text-lg mt-10">
          {searchTerm || genreFilter !== 'All' ? 'No books match your current filters.' : 'No books found.'}
        </p>
      )}
    </div>
  );
};

export default HomePage;