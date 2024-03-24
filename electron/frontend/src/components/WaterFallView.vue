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
      <div class="waterfall-criteria-container">
        <div class="waterfall-criteria">
          <h2 class="waterfall-heading">Waterfall Criteria</h2>
          <div class="criteria-row">
            <div class="criteria-input">
              <label for="ftx-length">FTX Length (in days)</label>
              <input type="number" id="ftx-length" v-model="waterfallCriteria.ftxLength">
            </div>
            <div class="criteria-input">
              <label for="cadets-per-platoon">Cadets per Platoon</label>
              <input type="number" id="cadets-per-platoon" v-model="waterfallCriteria.cadetsPerPlatoon">
            </div>
          </div>
          <div class="criteria-row">
            <div class="criteria-input">
              <label for="missions-per-day">Missions per Day</label>
              <input type="number" id="missions-per-day" v-model="waterfallCriteria.missionsPerDay">
            </div>
            <div class="criteria-input">
              <label for="cadets-per-squad">Cadets per Squad</label>
              <input type="number" id="cadets-per-squad" v-model="waterfallCriteria.cadetsPerSquad">
            </div>
          </div>
          <button class="generate-button" @click="generateWaterfall">Generate Waterfall</button>
          <p class="update-warning">⚠️ Update cadet profiles before generating waterfall</p>
        </div>
      </div>
      <div class="output-container">
        <p>Awaiting input parameters...</p>
      </div>
    </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';

export default {
  name: 'WaterFallView',
  setup() {
    const router = useRouter();

    function goHome() {
      router.push('/');
    }

    return {
      goHome,
      sidebarOptions: ['Waterfall', 'Cadet Profile', 'Export'],
      waterfallCriteria: {
        ftxLength: '',
        missionsPerDay: '',
        cadetsPerPlatoon: '',
        cadetsPerSquad: '',
      },
    }
  },
  methods: {
    generateWaterfall() {
      // Logic for generating the waterfall here
      console.log('Generating waterfall with criteria:', this.waterfallCriteria);
    },
  },
}

import '../assets/styles/WaterFallView.css';
import '../assets/styles/Sidebar.css';
</script>

<style scoped></style>
