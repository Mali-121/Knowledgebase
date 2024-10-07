<template>
  <div class="home-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Loading categories...
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      Failed to load categories. Please try again later.
    </div>

    <!-- Search Bar -->
    <div v-if="!loading && !error" class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search for answers"
        @keydown.enter="handleSearch"
      />
      <button class="search-button" aria-label="Search for answers" @click="handleSearch"> 
        <i class="fas fa-search" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Error Message for Empty Search -->
    <div v-if="showError" class="empty-search-error">
      Please enter a search query before searching.
    </div>

    <!-- No Categories Found -->
    <div v-if="filteredCategories.length === 0 && !loading && !error" class="no-categories-message">
      <p>No categories match your search criteria.</p>
    </div>

    <!-- Categories Grid -->
    <div v-if="!loading && !error && filteredCategories.length > 0" class="categories-grid">
      <div v-for="category in filteredCategories" :key="category.id" class="category-card">
        <router-link
          :to="`/category/${category.id}`"
          class="category-link"
          :aria-label="'View category ' + category.title"
        >
          <div class="category-icon">
            <i :class="['fas', categoryIcon(category.icon)]"></i>
          </div>
          <h3>{{ category.title }}</h3>
          <p class="articles-count">{{ category.totalArticle }} articles</p>
          <p class="update-info">Last update {{ formatDate(category.updatedOn) }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '', // For handling search input
      categories: [], // To store categories fetched from the API
      loading: true, // Loading state
      error: false, // Error state
      showError: false, // For handling empty search error
    };
  },
  computed: {
    // Filter and sort categories based on search input and status (enabled)
    filteredCategories() {
      return this.categories
        .filter((category) => category.enabled) // Show only enabled categories
        .filter((category) =>
          category.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) // Search filter
        .sort((a, b) => a.order - b.order); // Sort by order number
    },
  },
  created() {
    // Fetch the categories when the component is created
    axios
      .get('http://localhost:9000/api/categories')
      .then((response) => {
        this.categories = response.data; // Assign the fetched categories to the data property
      })
      .catch((error) => {
        console.error('Error fetching categories:', error); // Log any errors in the console
        this.error = true; // Set error state if API call fails
      })
      .finally(() => {
        this.loading = false; // Set loading state to false when done
      });
  },
  methods: {
    // Function to return the correct FontAwesome icon class based on the category title
    categoryIcon(icon) {
      const iconsMap = {
        play: 'fa-play-circle',
        comment: 'fa-comment',
        desktop: 'fa-desktop',
        link: 'fa-link',
        gem: 'fa-gem',
        code: 'fa-code',
        'shopping-cart': 'fa-shopping-cart',
      };
      return iconsMap[icon] || 'fa-desktop';
    },
    // Format the date for display
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    handleSearch() {
      // Check if search input is empty
      if (!this.searchQuery) {
        this.showError = true; // Display error message
        return;
      }
      // Reset the error if the input is not empty
      this.showError = false;
    },
  },
};
</script>


<style scoped>
.home-container {
  text-align: center;
  padding: 50px 20px;
}

/* Error Message for Empty Search */
.empty-search-error {
  color: red;
  font-size: 1.1rem;
  margin-top: 10px;
}

/* Search Bar */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
}

.search-input {
  padding: 12px 20px;
  width: 600px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
}

.search-button {
  padding: 12px 20px;
  background-color: #28a745;
  border: none;
  border-radius: 0 5px 5px 0;
  color: white;
  cursor: pointer;
}

.search-button i {
  font-size: 1.0rem;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 items per row */
  gap: 20px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

/* Category Card */
.category-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);
}

.category-icon i {
  font-size: 50px;
  color: #28a745;
  margin-bottom: 25px;
}

h3 {
  font-size: 1.5rem;
  color: black;
  margin-top: 0;
}

.articles-count {
  color: #28a745;
  font-weight: bold;
  margin-bottom: 0;
}

.update-info {
  color: #777;
  font-size: 0.9rem;
  margin-top: 0;
  /* Adjusting margin to remove gap */
}

.category-link {
  text-decoration: none;
  color: inherit;
}

.category-link:hover {
  color: inherit;
  text-decoration: none;
  /* Ensures there's no underline on hover as well */
}
</style>