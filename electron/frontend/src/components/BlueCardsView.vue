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
    <div class="content-container">
      <div class="cadet-form">
        <h1 class="cadet-form-heading">Cadet</h1>
        <div class="form-row">
          <label for="search-cadet" class="form-label">Search Cadet Name</label>
          <input type="text" id="search-cadet" v-model="searchText" @input="handleInputChange(searchText)" placeholder=" ">
        </div>
        <div class="form-row">
          <div class="form-group" style="width: 15vw;">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
          <div class="form-group" style="width: 40vw;">
            <label for="school" class="form-label">School</label>
            <input type="text" id="school" v-model="school" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="first-name" class="form-label" style="width: 27.5vw;">First Name</label>
            <input type="text" id="first-name" v-model="firstName" placeholder=" ">
          </div>
          <div class="form-group">
            <label for="last-name" class="form-label" style="width: 27.5vw;">Last Name</label>
            <input type="text" id="last-name" v-model="lastName" placeholder=" ">
          </div>
        </div>
      </div>
      <div class="bluecard-form">
        <h1 class="bluecard-form-heading">Blue Card</h1>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Cadet Unique ID</label>
            <input type="text" id="cadet-id" v-model="cadetId" placeholder=" ">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

import { useRouter } from 'vue-router';

export default {
  name: 'BlueCardsView',
  setup() {
    const router = useRouter();
    function goHome() {
      router.push('/');
    }
    return {
      goHome,
      sidebarOptions: ['Blue Card', 'Cadet Profile', 'Export']
    }
  },mounted() {
    window.ipcRenderer.receive('matching-cadets', (event, data) => {
      console.log(data);
    });
  },
  methods: {
     handleInputChange(text) {
        window.ipcRenderer.send("get-matching-cadets", text);
     }
  }
}

import '../assets/styles/BlueCardsView.css';
import '../assets/styles/Sidebar.css';

</script>
  
<style></style>
  