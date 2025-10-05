import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

export const fetchBooks = async (page = 1, search = '', genre = 'All', sort = '') => {
  
  // 1. Prepare parameters for the query string
  const params = {
    page: page,
  };
  
  if (search) {
    params.search = search;
  }
  
  if (genre && genre !== 'All') {
    params.genre = genre;
  }
  
  if (sort) {
    params.sort = sort;
  }

  // 2. Convert params object to a query string (e.g., page=1&search=dune)
  const queryString = new URLSearchParams(params).toString();
  
  // 3. Append the query string to the base URL
  const res = await axios.get(`${BASE_URL}/books?${queryString}`);
  return res.data;
};

export const fetchBookDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/books/${id}`);
  return res.data;
};

export const createBook = async (bookData) => {
  const res = await axios.post(`${BASE_URL}/books`, bookData, getAuthHeaders());
  return res.data;
};

export const updateBook = async (id, bookData) => {
  const res = await axios.put(`${BASE_URL}/books/${id}`, bookData, getAuthHeaders());
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await axios.delete(`${BASE_URL}/books/${id}`, getAuthHeaders());
  return res.data;
};

export const addReview = async (reviewData) => {
  const res = await axios.post(`${BASE_URL}/reviews`, reviewData, getAuthHeaders());
  return res.data;
};

export const deleteReview = async (reviewId) => {
  const res = await axios.delete(`${BASE_URL}/reviews/${reviewId}`, getAuthHeaders());
  return res.data;
};