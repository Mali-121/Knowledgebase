import axios from 'axios';

export const fetchCategories = () => {
  return axios.get('http://localhost:9000/api/categories');
};

export const fetchCategoryArticles = (categoryId) => {
  return axios.get(`http://localhost:9000/api/category/${categoryId}/articles`);
};
