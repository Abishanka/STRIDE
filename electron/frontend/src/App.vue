<template>
  <div id="app">
    <div class="sidebar">
      <router-link to="/page1">Page 1</router-link>
      <router-link to="/page2">Page 2</router-link>
      <router-link to="/page3">Page 3</router-link>
    </div>
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
  // If you have other options like 'data', 'methods', etc., they will go here.
});
</script>

<style>
#app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.sidebar a {
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.sidebar a:hover {
  background-color: #e7e7e7;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-content .login-form {
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
}

.main-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.main-content button {
  width: 100%;
  padding: 10px;
  background-color: #5cb85c;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.main-content button:hover {
  background-color: #4cae4c;
}
</style>