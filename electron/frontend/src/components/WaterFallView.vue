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
                <div class="row sidebar-options" v-for="option in sidebaroptions" :key="option" @click="optionClick(option)">
                    <div class="col options">{{option}}</div>
                </div>
            </div>

            <div class="container mt-auto position-absolute bottom-0 homebutton">
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
export default {
    name: 'WaterFallView',
    data() {
    return {
      sidebaroptions: ['Waterfall', 'Cadet Profile', 'Export'],
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
import '../assets/styles/sidebar.css';
</script>

<style scoped>
.main-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0 auto;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  flex-grow: 1;
}

.waterfall-criteria-container {
  position: relative;
  width: 600px; /* Fixed width */
  padding-top: 20px; /* Space for the title line */
}

.waterfall-criteria {
  background-color: #1E1E1E;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #fff;
  text-align: center;
}

.waterfall-heading {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1E1E1E;
  color: #4D784E;
}

.criteria-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0 -10px; /* Negative margin for gutters */
}

.criteria-input {
  flex: 1 1 280px; /* Flex basis of 280px for 2x2 layout */
  padding: 0 10px; /* Gutter */
}

.criteria-input label, .criteria-input input {
  color: #4D784E;
}

.criteria-input input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #fff;
  background-color: #333;
  color: #fff;
}

.generate-button {
  width: calc(100% - 40px); /* Adjust width for consistent padding */
  padding: 15px 20px; /* Match input padding */
  margin: 20px 0;
  border-radius: 5px;
  border: none;
  background-color: #4D784E;
  color: white;
  cursor: pointer;
}

.generate-button:hover {
  opacity: 0.8;
}

.update-warning {
  color: red;
  font-size: 0.75rem; /* Smaller font size for the warning */
  margin-top: 10px; /* Space from the button */
}

.output-container {
  background-color: #333;
  border: 1px solid #fff;
  border-radius: 5px;
  color: #fff;
  padding: 20px;
  width: calc(100% - 40px); /* Full width minus padding, matching the criteria box */
  box-sizing: border-box;
  text-align: center;
  margin-top: 20px;
}

.output-container p {
  margin: 0;
}
</style>
