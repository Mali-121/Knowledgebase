<template>
  <div class="category-page">
    <!-- Display error message if there's an error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for Answers"
        class="search-input"
      />
      <button class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav>
      <router-link to="/" class="all-categories-link">All categories</router-link> > {{ selectedCategory ? selectedCategory.title : 'Loading...' }}
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left Section: Category Information -->
      <div v-if="selectedCategory && !isArticlesLoading" class="selected-category-card">
        <i :class="['fas', categoryIcon(selectedCategory.icon)]" class="category-icon"></i>
        <h2>{{ selectedCategory.title }}</h2>
        <p class="updated-date">Updated {{ formatDate(selectedCategory.updatedOn) }}</p>
        <hr class="separator-line" />
        <div class="info-section">
          <i class="fas fa-info-circle info-icon"></i>
          <p class="category-description">{{ selectedCategory.description }}</p>
        </div>
      </div>
      <div v-else>
        <p>Loading category...</p>
      </div>

      <!-- Middle Section: Articles -->
      <div class="articles-list">
        <div v-if="!isArticlesLoading && filteredArticles.length">
          <div v-for="article in filteredArticles" :key="article.id" class="article-item">
            <i class="fas fa-file-alt article-icon"></i>
            <div class="article-details">
              <h3>{{ article.title }}</h3>
              <p>Updated {{ formatDate(article.updatedOn) }}</p>
            </div>
            <i class="fas fa-chevron-right article-arrow"></i>
          </div>
        </div>
        <div v-else-if="!isArticlesLoading">
          <p>No articles available for this category.</p>
        </div>
        <div v-else>
          <p>Loading articles...</p>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Carousel for Other Categories -->
    <div class="other-categories-section" v-if="!isCategoriesLoading">
      <h3>Other categories</h3>
      <div class="carousel-arrow-left" @click="scrollLeft">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="carousel-container">
        <div class="carousel-track">
          <div v-for="category in visibleCategories" :key="category.id" class="carousel-item">
            <a @click.prevent="navigateToCategory(category.id)">
              <div class="category-icon">
                <i :class="['fas', categoryIcon(category.icon)]"></i>
              </div>
              <h3>{{ category.title }}</h3>
              <p>{{ category.totalArticle }} articles</p>
              <p>Last updated {{ formatDate(category.updatedOn) }}</p>
            </a>
          </div>
        </div>
      </div>
      <div class="carousel-arrow-right" @click="scrollRight">
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    <div v-else>
      <p>Loading other categories...</p>
    </div>
  </div>
</template>


<script>
import { fetchCategories, fetchCategoryArticles } from '../apiService'; // Importing the service

export default {
  props: ['id'], // Accept 'id' as a prop
  data() {
    return {
      categories: [], // All categories
      selectedCategory: null, // Category clicked from the home page
      articles: [], // Articles for the selected category
      isLoading: true, // Loading state
      isCategoriesLoading: true, // Specific loading indicator for categories
      isArticlesLoading: true, // Specific loading indicator for articles
      errorMessage: null, // To store error messages
      searchQuery: '',
      currentIndex: 0, // Index to keep track of the current visible group of categories
      itemsPerPage: 3, // Number of items to show at a time
    };
  },
  computed: {
    publishedArticles() {
      return this.articles.filter(article => article.status === 'published');
    },
    otherCategories() {
      // Only return the categories that are not the selected one
      return this.selectedCategory ? this.categories.filter(category => category.id !== this.selectedCategory.id) : this.categories;
    },
    filteredArticles() {
      return this.publishedArticles.filter(article =>
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    visibleCategories() {
      // Slice the categories array to only show the current group based on currentIndex and itemsPerPage
      return this.otherCategories.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    },
  },
  watch: {
    // Watch for route changes and fetch the new category when navigating
    '$route.params.id': 'fetchCategory'
  },
  created() {
    // Fetch all categories initially
    this.fetchCategories();
  },
  methods: {
    categoryIcon(icon) {
      const iconsMap = {
        play: 'fa-play-circle',
        comment: 'fa-comment',
        desktop: 'fa-desktop',
        link: 'fa-link',
        gem: 'fa-gem',
        code: 'fa-code',
        'shopping-cart': 'fa-shopping-cart'
      };
      return iconsMap[icon] || 'fa-desktop';
    },
    formatDate(dateStr) {
      if (!dateStr) return 'No date available';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    scrollLeft() {
      if (this.currentIndex > 0) {
        this.currentIndex -= this.itemsPerPage; // Move left by one "page" of items
      }
    },
    scrollRight() {
      if (this.currentIndex + this.itemsPerPage < this.otherCategories.length) {
        this.currentIndex += this.itemsPerPage; // Move right by one "page" of items
      }
    },
    navigateToCategory(categoryId) {
      // Navigate to the category page
      this.$router.push(`/category/${categoryId}`);
    },
    fetchCategories() {
      this.isCategoriesLoading = true; // Start category loading
      fetchCategories()
        .then(response => {
          this.categories = response.data;
          this.fetchCategory(); // Fetch the selected category once the categories are loaded
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          this.errorMessage = 'Failed to load categories. Please try again later.';
        })
        .finally(() => {
          this.isCategoriesLoading = false; // Stop category loading
        });
    },
    fetchCategory() {
      const categoryId = this.$route.params.id;
      this.selectedCategory = this.categories.find(category => category.id === categoryId);

      if (!this.selectedCategory) {
        console.error('Category not found for ID:', categoryId);
        return;
      }

      this.isArticlesLoading = true; // Start articles loading
      fetchCategoryArticles(categoryId)
        .then(response => {
          this.articles = response.data;
        })
        .catch(error => {
          console.error('Error fetching articles:', error);
          this.errorMessage = 'Failed to load articles. Please try again later.';
        })
        .finally(() => {
          this.isArticlesLoading = false; // Stop articles loading
        });
    }
  }
};
</script>


<style scoped>
/* Add your styles here */

.search-bar{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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

.category-page {
  padding: 2rem;
}

/* Error message styles */
.error-message {
  color: red;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
}

nav {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.all-categories-link {
  color: green; /* Green color for All categories text */
  text-decoration: none;
  padding-left: 100px;
}

.main-content {
  display: flex;
  gap: 2rem;
  width: 100%;
  padding-left: 100px;
}

.selected-category-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  width: 270px;
  height: 300px;
  text-align: center;
}

.separator-line {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid #ddd;
}

.category-description {
  font-size: 1rem;
  color: #999;
  margin: 0;
}

.info-icon {
  font-size: 1.2rem;
  color: #4CAF50;
  margin-right: 0.5rem;
}

.category-icon {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.selected-category-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.updated-date {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1em;
}

.category-description {
  font-size: 1rem;
  color: #666;
  margin-top: 1rem;
}

.articles-list {
  width: 800px;
  padding-left: 80px;
}

.article-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.article-icon {
  font-size: 1.5rem;
  color: #4CAF50;
  margin-right: 1rem;
  margin-left: 1rem;
}

.article-details {
  flex-grow: 1;
  padding-left: 1rem;
}

.article-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.article-arrow {
  font-size: 1.2rem;
  color: #4CAF50;
}

.other-categories-section {
  margin-top: 3rem;
  position: relative; /* For absolute positioning of arrows */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.other-categories-section h3 {
  font-size: 2rem;
  font-weight: bold;
  color: black;
  margin-bottom: 1rem;
  text-align: center;
  text-decoration: none;
}

.carousel-container {
  display: flex;
  position: relative;
  overflow: hidden; 
  justify-content: center;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.carousel-track {
  display: flex;
  transition: all 0.3s ease;
  justify-content: center;
  scroll-behavior: smooth;
}

.carousel-item {
  flex: 0 0 268px;
  margin: 0 10px; /* Add some spacing between items */
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.carousel-item a {
  text-decoration: none;
  color: inherit;
}

.carousel-item a:hover {
  text-decoration: none;
}

.carousel-item h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.carousel-item p:nth-child(2) {
  color: #4CAF50; /* Green color for articles count */
}

/* Arrows */
.carousel-arrow-left,
.carousel-arrow-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(187, 187, 187, 0.6);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1.8rem;
  z-index: 10;
}

.carousel-arrow-left {
  left: 80px;
}

.carousel-arrow-right {
  right: 80px;
}

</style>
