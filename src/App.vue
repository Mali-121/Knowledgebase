<template>
	<div>
	  <tawk-header></tawk-header>
	  <!-- This is where your routes will render the correct page (e.g., Home, Category) -->
	  <router-view></router-view>
	</div>
  </template>
  
  <script>
  import Header from './components/Header.vue';
  
  export default {
	components: {
	  'tawk-header': Header
	}
  }
  </script>
  
  <style lang="scss" scoped>
	@import 'scss/main.scss';
  </style>