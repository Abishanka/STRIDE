<template>
    <div class="main-container dotted">
      <div class="sidebar container" style="margin-left: 0; margin-right: 0;">
        <div class="d-flex align-items-center">
          <div class="logo">
            <img src="../assets/images/logo.png" alt="Logo">
          </div>
          <div class="headername">STRIDE</div>
        </div>
  
        <div class="container text-center sidebar-menu">
          <div class="row sidebar-options" v-for="option in sidebarOptions" :key="option" @click="optionClick(option)">
            <div class="col options">{{ option }}</div>
          </div>
        </div>
  
        <div class="container mt-auto position-absolute bottom-0 homebutton" @click="goHome">
          Return to Home
        </div>
      </div>
    </div>
</template>

<script>

import { useRouter } from 'vue-router';

export default {
  name: 'CadetProfileView',
}

import '../assets/styles/HomeView.css';
import '../assets/styles/Sidebar.css';

</script>