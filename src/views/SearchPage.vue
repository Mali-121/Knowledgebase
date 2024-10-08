<template>
  <div class="search-page">
    <!--breadcrumb-->
    <nav class = "breadcrumb">
        <router-link to ="/" class = "breadcrumb-link">All Categories</router-link> > Search results
    </nav>
    <!-- Search Bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="filterArticles"
        placeholder="Search for answers"
        class="search-input"
      />
      <button class="search-button" @click="handleSearch">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Error Message if no articles are found -->
    <div v-if="!filteredArticles.length && !isLoading" class="no-results">
      <img src="empty-results-icon.svg" alt="No Results" />
      <p>No results found for "{{ searchQuery }}"</p>
    </div>

    <!-- Article List -->
    <div v-else class="article-list">
      <h3>Showing results for "{{ searchQuery }}"</h3>
      <div v-for="article in filteredArticles" :key="article.id" class="article-item">
        <i class="fas fa-file-alt article-icon"></i>
        <div class="article-details">
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
        </div>
        <i class="fas fa-chevron-right article-arrow"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchSearchResults } from '../apiService';

export default {
  data() {
    return {
      searchQuery: this.$route.params.queryText || '', 
      articles: [], 
      filteredArticles: [], 
      isLoading: true, 
    };
  },
  watch: {
    '$route.params.queryText': {
      immediate: true,
      handler(newQuery) {
        this.searchQuery = newQuery;
        this.performSearch();
      },
    },
  },
  created() {
   
    this.performSearch();
  },
  methods: {
    
    filterArticles() {
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
   
    handleSearch() {
      if (this.searchQuery) {
        this.$router.push({ name: 'search', params: { queryText: this.searchQuery } });
        this.performSearch(); 
      }
    },
    
    performSearch() {
      this.isLoading = true;
      const queryText = this.searchQuery;
      fetchSearchResults(queryText)
        .then(response => {
          this.articles = response.data;
          this.filteredArticles = this.articles; 
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.search-page {
  padding: 2rem;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  padding: 12px;
  width: 500px;
  border-radius: 5px 0 0 5px;
  border: 1px solid #ccc;
}

.search-button {
  padding: 12px;
  background-color: #28a745;
  border: none;
  border-radius: 0 5px 5px 0;
  color: white;
  cursor: pointer;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
}

.no-results img {
  width: 150px;
  margin-bottom: 1rem;
}

.article-list {
  max-width: 700px;
  margin: 0 auto;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  border-radius: 5px;
}

.article-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-icon {
  color: #28a745;
  font-size: 24px;
}

.article-details {
  flex-grow: 1;
  padding-left: 1rem;
}

.article-arrow {
  color: #28a745;
  font-size: 20px;
}
</style>
