import axios from 'axios';

export const fetchCategories = () => {
  return axios.get('http://localhost:9000/api/categories');
};

export const fetchCategoryArticles = (categoryId) => {
  return axios.get(`http://localhost:9000/api/category/${categoryId}/articles`);
};
export const fetchSearchResults = (queryText) => {
  return axios.get(`http://localhost:9000/api/search/${queryText}`);
};