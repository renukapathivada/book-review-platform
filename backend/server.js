const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables immediately
dotenv.config();

const app = express();
// The database connection function is called before app setup, ensuring connection logic runs.
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Route loading
// If any of the following requires fail to export an Express router, the TypeError occurs.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Basic root route for testing
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
