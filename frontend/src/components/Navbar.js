import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="bg-gray-800 p-4 shadow-xl sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center space-x-2 hover:text-yellow-400 transition duration-300">
          <BookOpen className="w-8 h-8 text-yellow-400" />
          <span>BookReview Hub</span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition duration-300">
            Books
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/add-book" className="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition duration-300">
                Add Book
              </Link>
              <Link to="/profile" className="text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition duration-300">
                Profile
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition duration-300 shadow-md"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition duration-300 shadow-md">
                Login
              </Link>
              <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition duration-300 shadow-md">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;