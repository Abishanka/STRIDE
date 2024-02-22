<template>
      <!-- <div class="sidebar">
      <router-link to="/page1">Page 1</router-link>
      <router-link to="/page2">Page 2</router-link>
      <router-link to="/page3">Page 3</router-link>
    </div>
    <div class="login-form">
      <h2>Login</h2>
      <input type="text" placeholder="Login"/>
      <input type="password" placeholder="Password"/>
      <button>Login</button>
    </div> -->
  <div class="header">
    <div class="logo"><img src="../assets/images/logo.png"></div>
    <div class="name">STRIDE</div>
    <div class="undername">Strategic Training and ROTC Information Data Entry</div>
  </div>
  <div class="verticaloptions">
  </div>
  <div class="password">
    <div class="passwordinput"></div>
    <div class="passwordsubmit"></div>
  </div>
</template>
  
<script>
export default {
  name: 'HomeView'
}

import '../assets/styles/HomeView.css';
</script>

<style scoped>
/* Add any page-specific styles here */
</style>