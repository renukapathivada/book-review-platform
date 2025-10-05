import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 border border-gray-100 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          by <span className="font-medium text-gray-800">{book.author}</span>
        </p>
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

export default BookCard;
