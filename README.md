# Book Review Hub (MERN Stack)


This is a comprehensive full-stack application built using the MERN (MongoDB, Express, React, Node.js) stack. It functions as a platform where users can securely register, log in, manage a public catalog of books, and submit and manage their own reviews and ratings.

---


## 🌟 Key Features Implemented

| Feature Category | Details |
| :--- | :--- |
| **Authentication & Security** | Secure login/signup using **JWT** and **bcrypt** hashing. All data modification routes are protected by Express middleware. |
| **Data & Core Logic** | Full **CRUD** operations for Books and Reviews. Dynamic calculation and display of **Average Ratings**. |
| **Pagination** | The book list efficiently loads data with pagination (5 books per page). |
| **Search, Filter, & Sort** | Users can search by Title/Author, filter by Genre, and sort by Published Year or Average Rating. |
| **Profile Dashboard** | Dedicated page where logged-in users can view and manage their added books and submitted reviews. |
| **Rating Charts** | Book details pages display a **Rating Distribution Bar Chart** using Recharts. |

---


## 🛠️ Setup and Installation

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account (Cluster and Database User created)
* Git

### Step 1: Clone and Setup

Clone the repository

```bash
git clone [https://github.com/renukapathivada/book-review-platform.git](https://github.com/renukapathivada/book-review-platform.git)
cd book-review-platform
```
### Step 2:Backend Configuration
Navigate to the backend directory:

```bash
cd backend
npm install
```
Create a .env file and add your credentials. Note: These are also required for the live Render service.
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECURE_SECRET_KEY
```
Seed the Database (Optional but Recommended for Testing):
```bash
npm run data:import
```
Start the Backend Server (Local Testing):
```bash
npm run dev
```

### Step 3:Frontend Configuration

Open a new terminal and navigate to the frontend directory:
```bash
cd ../frontend
npm install
```
Start the React Application (Local Testing):
```bash
npm start
```
### 🌐 Deployed Links 
Frontend UI (React)
```bash
https://bookreview-hub.netlify.app
```
Backend API (Node/Express)
```bash
https://book-review-platform-3gyf.onrender.com
```
