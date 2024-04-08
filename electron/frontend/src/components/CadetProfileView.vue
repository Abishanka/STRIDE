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
      <div class="content-container">
        <div class="cadet-menu-form">
          <div class="form-row">
            <div class="form-group">
              <label for="cadet-menu" class="form-label">Leadership</label>
              <div class="cadetMenu-options" v-for="option in cadetMenuOptions" :key="option"
              :class="{ 'cadetMenu-selected-option': option === cadetMenu_option }" @click="leaderOptionClick(option)">{{ option }}</div>
            </div>
          </div>
        </div>
        <div class="cadet-form">
          <h1 class="cadet-form-heading">Cadet</h1>
          <div class="form-row">
            <label for="search-cadet" class="form-label">Search Cadet Name</label>
            <input type="text" id="search-cadet" v-model="searchText" @input="handleInputChange(searchText)" placeholder=" ">
          </div>
          <div class="form-row">
            <div class="form-group" style="width: 15vw;">
              <label for="cadet-id" class="form-label">Cadet Unique ID</label>
              <input type="text" id="cadet-id" v-model="cadetId" placeholder=" " readonly>
            </div>
            <div class="form-group" style="width: 40vw;">
              <label for="school" class="form-label">School</label>
              <input type="text" id="school" v-model="school" placeholder=" " readonly>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="first-name" class="form-label" style="width: 27.5vw;">First Name</label>
              <input type="text" id="first-name" v-model="firstName" placeholder=" " readonly>
            </div>
            <div class="form-group">
              <label for="last-name" class="form-label" style="width: 27.5vw;">Last Name</label>
              <input type="text" id="last-name" v-model="lastName" placeholder=" " readonly>
            </div>
          </div>
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
    }),
    cadetMenuOptions: ['Import cadets', 'Add a cadet', 'Edit a cadet']
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

import '../assets/styles/Sidebar.css';

</script>

<style scoped>    
  /* https://stackoverflow.com/questions/70489057/dotted-background-with-pure-html-css */
  .dotted {
      background-image: radial-gradient(#191919 10%, transparent 10%),
      radial-gradient(#ccc 10%, transparent 10%);
      background-position: 0 0, 50px 50px;
      background-size: 50px 50px;
  }
    
  .main-container {
      width: 100vw;
      height: 100vh; 
      margin: 0 auto;
      padding: 0;
      display: flex;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    flex-grow: 1;
  }

  .cadet-form .cadet-menu-form {
      position: relative;
      width: 60vw;
      padding-top: 2.5vh;
      background-color: #1E1E1E;
      padding: 3vh;
      border-radius: 5px;
      text-align: center;
  }

  .cadet-form-heading {
      font-family: sans-serif;
      color: #6EA171;
  }

  .form-row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0;
      margin-bottom: 3vh;
  }

  .form-row input {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: none;
      border-bottom: 1px solid #fff;
      background-color: #1E1E1E;
      color: #D2D1D1;
  }

  .form-row input:focus {
      outline: none;
      border-bottom: 1px solid #6EA171;
  }

  .form-label {
      margin-bottom: 5px;
      display: block;
      text-align: left;
      color: #D2D1D1;
  }

  .form-group {
      margin: 0;
  }

  .form-group .bluecard-options .cadetMenu-options {
      color: white;
      display: inline-block;
      align-items: center;
      justify-content: center;
      background-color: #191919;
      padding: 1vh;
      width: 5.6vw;
      border-color: transparent;
  }

  .bluecard-options:hover {
      background-color: #6EA171;
      cursor: pointer;
  }

  .bluecard-options:focus {
      outline: none;
  }

  .bluecard-selected-option {
      background-color: #4D784E !important;
  }
</style>