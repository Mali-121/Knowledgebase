import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/home.vue';
import Category from '../views/category.vue'; 

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'category',
      component: Category,
      props: true
    },
  ]
  
});
