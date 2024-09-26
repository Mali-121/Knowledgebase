import axios from 'axios';

const BASE_URL = 'http://localhost:9000/api';

// Fetch all categories
export function getCategories() {
  return axios.get(`${BASE_URL}/categories`);
}

// Fetch details of a specific category
export function getCategoryDetails(categoryId) {
  return axios.get(`${BASE_URL}/category/${categoryId}`);
}

// Fetch articles belonging to a specific category
export function getArticlesByCategory(categoryId) {
  return axios.get(`${BASE_URL}/category/${categoryId}/articles`);
}

// Fetch details of a specific author
export function getAuthorDetails(authorId) {
  return axios.get(`${BASE_URL}/author/${authorId}`);
}
