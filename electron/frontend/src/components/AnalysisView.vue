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
        <div class="row sidebar-options" v-for="option in sidebarOptions" :key="option" @click="handleOptionClick(option)">
          <div class="col options">{{ option }}</div>
        </div>
      </div>

      <div class="container mt-auto position-absolute bottom-0 homebutton" @click="goHome">
        Return to Home
      </div>
    </div>
    <div class="content-container text-center">
      <!-- Dropdown and Submit Button Grouped Together, Centered Horizontally and Located at the Top Vertically -->
      <div v-if="showSchoolsDropdown" class="dropdown-submit-container d-flex justify-content-center align-items-start" style="margin-top: 10px; width: 100%;">
        <select v-model="selectedSchool" class="styled-dropdown" style="width: 50%; min-width: 250px;">
          <option disabled value="">Please select one</option>
          <option v-for="school in uniqueSchools" :key="school">{{ school }}</option>
        </select>
        <button @click="submitSchoolSelection" class="submit-button mt-2">Submit</button>
      </div>
      <!-- Chart Containers in a Column under the Submit Button, Centered Horizontally and Located at the Top Vertically -->
      <div class="chart-container" style="margin-top: 20px; max-width: 90%;">
        <canvas id="overall-assessment-chart"></canvas>
      </div>
      <div class="chart-container" style="margin-top: 20px; max-width: 90%;">
        <canvas id="sustain-chart"></canvas>
      </div>
      <div class="chart-container" style="margin-top: 20px; max-width: 90%;">
        <canvas id="improve-chart"></canvas>
      </div>
    </div>
  </div>
</template>
  
<script>

import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AnalysisView',
  setup() {
    const router = useRouter();
    const showSchoolsDropdown = ref(false);
    const uniqueSchools = ref([]);
    const selectedSchool = ref('');
    const overallAssessmentData = ref([]);
    const sustainData = ref([]);
    const improveData = ref([]);
    let overallAssessmentChart = ref(null);
    let sustainChart = ref(null);
    let improveChart = ref(null);

    function goHome() {
      router.push('/');
    }
    function handleOptionClick(option) {
      if (option === 'Blue Card') {
        window.ipcRenderer.send("get-unique-schools");
        showSchoolsDropdown.value = !showSchoolsDropdown.value; // Toggle visibility
      } else {
        console.log(option + ' clicked');
      }
    }
    function submitSchoolSelection() {
      if (selectedSchool.value) {
        // Request new data for the selected school
        window.ipcRenderer.send("get-overall-assessment-by-school", selectedSchool.value);
        window.ipcRenderer.send("get-sustain-by-school", selectedSchool.value);
        window.ipcRenderer.send("get-improve-by-school", selectedSchool.value);
      }
    }
    onMounted(() => {
      window.ipcRenderer.receive('unique-schools', (event, schools) => {
        uniqueSchools.value = schools.map(school => school.school);
      });
      window.ipcRenderer.receive('overall-assessment-by-school-data', (event, data) => {
        overallAssessmentData.value = data.map(item => ({ label: item.overall_assessment, value: item.count }));
        if (overallAssessmentChart.value) overallAssessmentChart.value.destroy();
        overallAssessmentChart.value = createChart('overall-assessment-chart', 'Overall Assessment', overallAssessmentData.value);
      });
      window.ipcRenderer.receive('sustain-by-school-data', (event, data) => {
        sustainData.value = data.map(item => ({ label: item.sustain, value: item.count }));
        if (sustainChart.value) sustainChart.value.destroy();
        sustainChart.value = createChart('sustain-chart', 'Sustain', sustainData.value);
      });
      window.ipcRenderer.receive('improve-by-school-data', (event, data) => {
        improveData.value = data.map(item => ({ label: item.improve, value: item.count }));
        if (improveChart.value) improveChart.value.destroy();
        improveChart.value = createChart('improve-chart', 'Improve', improveData.value);
      });
    });

    function createChart(chartId, label, data) {
      const ctx = document.getElementById(chartId).getContext('2d');
      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.label),
          datasets: [{
            label: label,
            data: data.map(item => item.value),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    return {
      goHome,
      handleOptionClick,
      submitSchoolSelection,
      sidebarOptions: ['Blue Card', 'Cadet Profile', 'Export'],
      showSchoolsDropdown,
      uniqueSchools,
      selectedSchool,
      overallAssessmentData,
      sustainData,
      improveData
    }
  }
}
</script>
<style scoped>
.analysis-view {
  color: white;
  padding: 20px;
  text-align: center;
  background-color: #000;
}

.funny-image {
  width: 100%;
  max-width: 100%;
  height: auto;
}
/* Updated styles for dropdown, submit button, and charts to be positioned in a new column to the right of the sidebar */
.styled-dropdown, .submit-button {
  width: 80%; /* Adjusted width for better fit in the new column */
  margin: 10px; /* Adjust margin for spacing within the column */
  padding: 10px 20px; /* Adequate padding for better interaction */
  background-color: #333; /* Dark theme background */
  color: white; /* Text color to contrast the background */
  border: none; /* Remove default border */
  border-radius: 5px; /* Slightly rounded corners for a modern look */
  font-size: 16px; /* Readable font size */
  cursor: pointer; /* Cursor change to indicate clickable items */
}

.dropdown-submit-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Align items at the center for vertical centering */
  width: 30%; /* Adjusted width for the new column */
  margin-left: auto; /* Center the column horizontally */
  margin-right: auto;
  padding-right: 20px; /* Padding to ensure content does not touch the edges */
  margin-top: 2%; /* Adjusted margin at the top for better vertical positioning */
}

/* Harmonized styles for charts with the rest of the page, adjusted for new column */
.chart-container {
  column: 2;
  width: 100%; /* Adjusted width to fill the new column */
  margin-top: 20px; /* Adjusted margin to position charts at the top vertically */
  padding: 15px; /* Padding for visual space around the charts */
  background-color: #222; /* Dark theme background for charts */
  border-radius: 10px; /* Rounded corners for charts container */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}
</style>
