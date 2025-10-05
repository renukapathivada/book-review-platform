const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.createBook = async (req, res) => {
  try {
    const newBook = new Book({
      ...req.body,
      addedBy: req.user.id,
    });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// FULLY UPDATED FUNCTION: Handles Search, Filter, Sort, and ensures Average Rating is returned for ALL books.
exports.getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const { search, genre, sort } = req.query;

  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }

  if (genre && genre !== 'All') {
    filter.genre = genre;
  }

  let sortCriteria = { title: 1 }; 
  let sortOrder = 1;

  if (sort === 'year_desc') {
    sortCriteria = { year: -1 };
    sortOrder = -1;
  } else if (sort === 'year_asc') {
    sortCriteria = { year: 1 };
    sortOrder = 1;
  } else if (sort === 'rating_desc') {
    sortCriteria = { averageRating: -1, title: 1 };
    sortOrder = -1;
  } else if (sort === 'rating_asc') {
    sortCriteria = { averageRating: 1, title: 1 };
    sortOrder = 1;
  }
  
  const sortKey = Object.keys(sortCriteria)[0];
  const finalSortCriteria = {};
  finalSortCriteria[sortKey] = sortOrder;

  try {
    const uniqueGenres = await Book.distinct('genre');
    
    const aggregationPipeline = [
      { $match: filter },
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'bookId',
          as: 'reviewsData'
      }},
      { $addFields: {
          averageRating: { $avg: '$reviewsData.rating' },
          reviewCount: { $size: '$reviewsData' }
      }},
      { $sort: { 
          [sortKey]: sortKey === 'averageRating' ? sortOrder : sortOrder,
          title: 1
      }},
      { $facet: {
          metadata: [{ $count: "totalBooks" }],
          data: [
              { $skip: skip },
              { $limit: limit },
              { $lookup: {
                  from: 'users',
                  localField: 'addedBy',
                  foreignField: '_id',
                  as: 'addedBy'
              }},
              { $unwind: { path: '$addedBy', preserveNullAndEmptyArrays: true } },
              { $project: {
                  _id: 1, title: 1, author: 1, description: 1, genre: 1, year: 1,
                  addedBy: { _id: '$addedBy._id', name: '$addedBy.name' },
                  averageRating: { $ifNull: ["$averageRating", 0] },
                  reviewCount: 1
              }}
          ]
      }}
    ];

    const result = await Book.aggregate(aggregationPipeline);

    const books = result[0].data;
    const totalBooks = result[0].metadata[0]?.totalBooks || 0;

    return res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      genres: uniqueGenres
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(`Server error: ${err.message}`);
  }
};


exports.getBookById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ msg: 'Book not found' });
  }
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const reviewSummary = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(req.params.id) } },
      { $facet: {
        summary: [
          { $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          }}
        ],
        distribution: [
          { $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }},
          { $sort: { _id: -1 } }
        ]
      }}
    ]);

    const summary = reviewSummary[0].summary[0] || {};
    const distribution = reviewSummary[0].distribution || [];

    const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'name').sort({ _id: -1 });
    const averageRating = summary.averageRating || 0;

    res.json({ 
      book, 
      averageRating: parseFloat(averageRating.toFixed(2)), 
      reviews,
      ratingDistribution: distribution
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this book' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this book' });
    }

    await book.deleteOne();
    await Review.deleteMany({ bookId: req.params.id });
    res.json({ msg: 'Book and associated reviews removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};