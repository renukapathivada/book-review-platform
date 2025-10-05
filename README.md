Book Review Platform (MERN Stack)
This is a comprehensive full-stack application built using the MERN (MongoDB, Express, React, Node.js) stack. It functions as a platform where users can securely register, log in, manage a public catalog of books, and submit and manage their own reviews and ratings.

Key Features Implemented
Secure Authentication: User signup and login implemented using JWT (JSON Web Tokens) and bcrypt for password hashing.

Authorization: Middleware protects all creation, update, and deletion routes, ensuring only logged-in users and the original creator can modify content.

Data Aggregation: Calculates and displays the average rating for each book dynamically using MongoDB aggregation.

Pagination: The book list displays content with pagination (5 books per page).

Search, Filter, & Sort (Bonus): Allows users to search by title/author, filter by genre, and sort by published year or average rating.

Profile Dashboard (Bonus): Dedicated page where users can view all the books they have added and all the reviews they have submitted.

Project Structure
The project is divided into two main folders:

book-review-platform/
├── backend/                  # Node.js, Express, MongoDB API
│   ├── config/               # DB connection logic
│   ├── controllers/          # Business logic (Auth, Books, Reviews)
│   ├── middleware/           # JWT verification
│   ├── models/               # Mongoose Schemas (User, Book, Review)
│   ├── routes/               # API endpoints
│   ├── seeder.js             # Script for populating test data
│   └── server.js             # Main server entry point
├── frontend/                 # React Application (UI)
│   ├── src/
│   │   ├── api/              # Axios utility functions
│   │   ├── components/       # Reusable components (Navbar, BookCard)
│   │   ├── context/          # Authentication Context
│   │   └── pages/            # Router views
│   └── tailwind.config.js    # Styling configuration
└── README.md

Setup Instructions
Prerequisites
Node.js (v18+)

MongoDB Atlas Account (Cluster and Database User created)

Step 1: Backend Setup
Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file in the backend folder and add your credentials:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECRET_KEY_FOR_JWT

Seed the Database (Optional but Recommended):

npm run data:import

Start the backend server:

npm run dev

(The server runs on http://localhost:5000)

Step 2: Frontend Setup
Open a new terminal and navigate to the frontend directory:

cd frontend

Install dependencies (including bonus libraries):

npm install

Start the React application:

npm start

(The application runs on http://localhost:3000)

Test Credentials (from Seeder)
You can use the following credentials to test ownership, reviews, and the Profile Dashboard:

User

Email

Password

Alice

alice@example.com

123456

Bob

bob@example.com

123456