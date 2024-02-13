<template>
      <div class="sidebar">
      <router-link to="/page1">Page 1</router-link>
      <router-link to="/page2">Page 2</router-link>
      <router-link to="/page3">Page 3</router-link>
    </div>
    <div class="login-form">
      <h2>Login</h2>
      <input type="text" placeholder="Login"/>
      <input type="password" placeholder="Password"/>
      <button>Login</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserEntry'
  }
  
  import '../assets/styles/UserEntry.css';
  </script>
  
  <style scoped>
  /* Add any page-specific styles here */
  </style>