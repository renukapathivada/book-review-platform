const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');

// Load environment variables
dotenv.config();


// Connect to the database
const connectDB = async () => {
  try {
    // Adding serverSelectionTimeoutMS and the tls property for Windows compatibility
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      tls: true,
      // The option below is used as a final resort to bypass strict SSL validation 
      // when Node.js has issues with the Atlas certificate chain on some OS/Node versions.
      // Note: This is for local testing ONLY. Do not use this in production.
      tlsInsecure: true 
    });
    console.log('MongoDB connected for seeding!');
  } catch (err) {
    console.error(`MongoDB connection error during seeding: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// --- MOCK DATA ---
const mockUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: '123456', // Will be hashed
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: '123456',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: '123456',
  },
];

let createdUsers = [];
let createdBooks = [];
let createdReviews = [];

const importData = async () => {
  try {
    // 1. Destroy existing data
    await destroyData();

    console.log('--- Hashing Passwords ---');
    const hashedUsers = mockUsers.map(user => {
        const salt = bcrypt.genSaltSync(10);
        return {
            ...user,
            password: bcrypt.hashSync(user.password, salt)
        };
    });
    
    // 2. Insert Users
    createdUsers = await User.insertMany(hashedUsers);
    const alice = createdUsers.find(u => u.email === 'alice@example.com');
    const bob = createdUsers.find(u => u.email === 'bob@example.com');
    const charlie = createdUsers.find(u => u.email === 'charlie@example.com');
    console.log('Users created!');

    // 3. Define and Insert Books
    const mockBooks = [
      {
        title: 'The Great MERN Project',
        author: 'F. Scott Frontend',
        description: 'A brilliant exploration of React state, Express routing, and the intoxicating glamour of clean MongoDB schemas.',
        genre: 'Technology',
        year: 2024,
        addedBy: alice._id,
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel set in a totalitarian superstate, examining the role of truth and facts within politics.',
        genre: 'Dystopian Fiction',
        year: 1949,
        addedBy: bob._id,
      },
      {
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        description: 'A coming-of-age story following a young woman who raises herself in the marshlands of North Carolina.',
        genre: 'Literary Fiction',
        year: 2018,
        addedBy: charlie._id,
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        description: 'Explores the entire history of humankind, from the evolution of archaic human species in the Stone Age to the twenty-first century.',
        genre: 'Non-Fiction',
        year: 2011,
        addedBy: alice._id,
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'Set in the distant future amidst a feudal intergalactic society where planetary noble houses control planets.',
        genre: 'Science Fiction',
        year: 1965,
        addedBy: bob._id,
      },
    ];

    createdBooks = await Book.insertMany(mockBooks);
    const bookMERN = createdBooks[0];
    const book1984 = createdBooks[1];
    const bookDune = createdBooks[4];
    console.log('Books created!');

    // 4. Define and Insert Reviews (ensuring a mix of users and ratings)
    const mockReviews = [
      // Reviews for The Great MERN Project (Book 1)
      { bookId: bookMERN._id, userId: alice._id, rating: 5, reviewText: 'The architecture is flawless. A modern masterpiece!' },
      { bookId: bookMERN._id, userId: bob._id, rating: 4, reviewText: 'Great flow, though authentication was tricky at first.' },
      { bookId: bookMERN._id, userId: charlie._id, rating: 5, reviewText: 'Excellent security and clean code. Highly recommend.' },
      
      // Reviews for 1984 (Book 2)
      { bookId: book1984._id, userId: alice._id, rating: 5, reviewText: 'Chilling and prophetic. A must-read classic.' },
      { bookId: book1984._id, userId: bob._id, rating: 4, reviewText: 'Powerful themes, but a bit depressing.' },

      // Reviews for Dune (Book 5)
      { bookId: bookDune._id, userId: charlie._id, rating: 5, reviewText: 'The world-building is unmatched. Sci-fi at its finest.' },
      { bookId: bookDune._id, userId: bob._id, rating: 3, reviewText: 'Slow burn, but pays off in the end.' },
    ];

    createdReviews = await Review.insertMany(mockReviews);
    console.log('Reviews created!');
    
    console.log('✅ Data Imported!');
    process.exit();

  } catch (error) {
    console.error(`🚨 Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();
    console.log('🗑️ Data Destroyed!');
  } catch (error) {
    console.error(`🚨 Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}