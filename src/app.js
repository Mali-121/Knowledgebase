import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@fortawesome/fontawesome-free/css/all.css';
// Import FontAwesome core
import { library } from '@fortawesome/fontawesome-svg-core';
// Import specific icons from solid and regular sets
import { faPlay, faLink, faShoppingCart, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots, faGem } from '@fortawesome/free-regular-svg-icons';
// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css';


// Add icons to the library
library.add(faPlay, faLink, faShoppingCart, faSearch, faTv, faCommentDots, faGem);

// Register the FontAwesomeIcon component globally
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
