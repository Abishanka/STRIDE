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
          <div class="row sidebar-options" v-for="option in sidebarOptions" :key="option" @click="sidebarOptionClick(option)">
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
import { computed } from 'vue';
import { store } from '../store';

export default {
  name: 'CadetProfileView',
  setup() {
    const router = useRouter();
    function goHome() {
      router.push('/');
    }
    return {
      goHome,
      sidebarOptions: computed(() => {
      if (store.cadetProfileReturn == 'bluecards') {
        return ['Blue Card'];
      } else if (store.cadetProfileReturn == 'waterfall') {
        return ['Waterfall'];
      } else {
        return [];
      }
    })
    }
  },
  methods: {
    sidebarOptionClick(option) {
      switch (option) {
        case 'Blue Card':
          this.$router.push('/bluecards');
          break;
        case 'Waterfall':
          this.$router.push('/waterfall');
          break;
        case 'Export':
          //Export the bluecards
          break;
        default:
          console.log('No option selected or option not recognized');
      }
    },
  }
}

import '../assets/styles/HomeView.css';
import '../assets/styles/Sidebar.css';

</script>