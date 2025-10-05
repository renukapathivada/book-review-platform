import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const signup = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, formData);
    return res.data;
  } catch (error) {
    throw error.response.data.msg || 'Signup failed';
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, formData);
    return res.data;
  } catch (error) {
    throw error.response.data.msg || 'Login failed';
  }
};