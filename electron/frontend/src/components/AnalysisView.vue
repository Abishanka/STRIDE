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
    <div class="content-container">
      <!-- First School Selection Dropdown, Submit Button, and Charts -->
      <div class="comparison-container d-flex justify-content-between" style="width: 100%;">
        <div v-if="showSchoolsDropdown" class="dropdown-submit-container d-flex flex-column align-items-center" style="margin-top: 10px; width: 20vw;">
          <select v-model="selectedSchool" class="styled-dropdown" style="width: 100%; min-width: 250px;">
            <option disabled value="">Please select one</option>
            <option v-for="school in uniqueSchools" :key="school">{{ school }}</option>
          </select>
          <button @click="submitSchoolSelection" class="submit-button mt-2">Submit</button>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="overall-assessment-chart"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="sustain-chart"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="improve-chart"></canvas>
          </div>
        </div>
        <!-- Second School Selection Dropdown, Submit Button, and Charts for Comparison -->
        <div v-if="showSchoolsDropdown" class="dropdown-submit-container d-flex flex-column align-items-center" style="margin-top: 10px; width: 20vw;">
          <select v-model="selectedSchool2" class="styled-dropdown" style="width: 100%;">
            <option disabled value="">Please select one</option>
            <option v-for="school in uniqueSchools" :key="school">{{ school }}</option>
          </select>
          <button @click="submitSchoolSelection2" class="submit-button mt-2">Submit</button>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="overall-assessment-chart2"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="sustain-chart2"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="improve-chart2"></canvas>
          </div>
        </div>
        <!-- Cadet Selection Dropdown -->
        <div v-if="showCadetsDropdown" class="dropdown-submit-container d-flex flex-column align-items-center" style="margin-top: 10px; width: 20vw;">
          <select v-model="selectedCadet" class="styled-dropdown" style="width: 100%; min-width: 250px;">
            <option disabled value="">Please select a cadet</option>
            <option v-for="cadet in uniqueCadets" :key="cadet" :value="cadet[0]">{{ cadet[1] + ", " + cadet[2] }}</option>
          </select>
          <button @click="viewCadetProfile" class="submit-button mt-2">View Cadet Profile</button>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="overall-assessment-cadet-chart"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="sustain-cadet-chart"></canvas>
          </div>
          <div class="chart-container" style="margin-top: 20px; max-width: 100%;">
            <canvas id="improve-cadet-chart"></canvas>
          </div>
        </div>
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
    const showSchoolsDropdown = ref(true);
    const uniqueSchools = ref([]);
    const selectedSchool = ref('');
    const selectedSchool2 = ref('');
    const overallAssessmentData = ref([]);
    const overallAssessmentData2 = ref([]);
    const sustainData = ref([]);
    const sustainData2 = ref([]);
    const improveData = ref([]);
    const improveData2 = ref([]);
    let overallAssessmentChart = ref(null);
    let sustainChart = ref(null);
    let improveChart = ref(null);
    let overallAssessmentChart2 = ref(null);
    let sustainChart2 = ref(null);
    let improveChart2 = ref(null);
    let curSelection = ref(1);

    const showCadetsDropdown = ref(true);
    const uniqueCadets = ref([]);
    const selectedCadet = ref('');
    
    let overallAssessmentCadetData = ref(null);
    let improveCadetData = ref(null);
    let sustainCadetData = ref(null);
    

    const cadetChartData = ref(null);
    let overallAssessmentCadetChart = ref(null);
    let improveCadetChart = ref(null);
    let sustainCadetChart = ref(null);

    window.ipcRenderer.send("get-unique-schools");
    window.ipcRenderer.send("get-unique-cadets");


    function goHome() {
      router.push('/');
    }
    function handleOptionClick(option) {
      console.log(option + " click");
    }
    function submitSchoolSelection() {
      if (selectedSchool.value) {
        // Request new data for the selected school
        curSelection.value = 1;
        window.ipcRenderer.send("get-overall-assessment-by-school", selectedSchool.value);
        window.ipcRenderer.send("get-sustain-by-school", selectedSchool.value);
        window.ipcRenderer.send("get-improve-by-school", selectedSchool.value);
      }
    }
    function submitSchoolSelection2() {
      if (selectedSchool2.value) {
        // Request new data for the selected school
        curSelection.value = 2;
        window.ipcRenderer.send("get-overall-assessment-by-school", selectedSchool2.value);
        window.ipcRenderer.send("get-sustain-by-school", selectedSchool2.value);
        window.ipcRenderer.send("get-improve-by-school", selectedSchool2.value);
      }
    }
    function viewCadetProfile() {
      console.log("HERE WE GO");
      if (selectedCadet.value) {
        // Request new data for the selected cadet
        console.log("CALLING");
        window.ipcRenderer.send("get-overall-assessment-by-cadet", selectedCadet.value);
        window.ipcRenderer.send("get-sustain-by-cadet", selectedCadet.value);
        window.ipcRenderer.send("get-improve-by-cadet", selectedCadet.value);
      }
    }
    onMounted(() => {
      window.ipcRenderer.receive('unique-schools', (event, schools) => {
        uniqueSchools.value = schools.map(school => school.school);
      });
      window.ipcRenderer.receive('unique-cadets', (event, cadets) => {
        uniqueCadets.value = cadets.map(cadet => [cadet.uid, cadet.last_name, cadet.first_name]);
      });
      window.ipcRenderer.receive('overall-assessment-cadet-data', (event, data) => {
        overallAssessmentCadetData = data.map(item => ({ label: item.overall_assessment, value: item.count }));
        console.log(overallAssessmentCadetChart);
        if (overallAssessmentCadetChart.value) overallAssessmentCadetChart.value.destroy();
        overallAssessmentCadetChart.value = createChart('overall-assessment-cadet-chart', 'Cadet Overall Assessment', overallAssessmentCadetData);
      });
      window.ipcRenderer.receive('sustain-cadet-data', (event, data) => {
        console.log("WOOP");
        console.log(data);
        sustainCadetData = data.map(item => ({ label: item.sustain, value: item.count }));
        if (sustainCadetChart.value) sustainCadetChart.value.destroy();
        sustainCadetChart.value = createChart('sustain-cadet-chart', 'Cadet Sustain', sustainCadetData);
      });
      window.ipcRenderer.receive('improve-cadet-data', (event, data) => {
        improveCadetData = data.map(item => ({ label: item.improve, value: item.count }));
        if (improveCadetChart.value) improveCadetChart.value.destroy();
        improveCadetChart.value = createChart('improve-cadet-chart', 'Cadet Improve', improveCadetData);
      });
      window.ipcRenderer.receive('overall-assessment-data', (event, data) => {
        console.log(curSelection.value);
        if(curSelection.value==1)
        {
          overallAssessmentData.value = data.map(item => ({ label: item.overall_assessment, value: item.count }));
          if (overallAssessmentChart.value) overallAssessmentChart.value.destroy();
          overallAssessmentChart.value = createChart('overall-assessment-chart', 'Overall Assessment', overallAssessmentData.value);
        }
        else
        {
          overallAssessmentData2.value = data.map(item => ({ label: item.overall_assessment, value: item.count }));
          if (overallAssessmentChart2.value) overallAssessmentChart2.value.destroy();
          overallAssessmentChart2.value = createChart('overall-assessment-chart2', 'Overall Assessment', overallAssessmentData2.value);
        }
      });
      window.ipcRenderer.receive('sustain-data', (event, data) => {
        if(curSelection.value==1)
        {
          sustainData.value = data.map(item => ({ label: item.sustain, value: item.count }));
          if (sustainChart.value) sustainChart.value.destroy();
          sustainChart.value = createChart('sustain-chart', 'Sustain', sustainData.value);
        }
        else
        {
          sustainData2.value = data.map(item => ({ label: item.sustain, value: item.count }));
          if (sustainChart2.value) sustainChart2.value.destroy();
          sustainChart2.value = createChart('sustain-chart2', 'Sustain', sustainData2.value);          
        }
      });
      window.ipcRenderer.receive('improve-data', (event, data) => {
        if(curSelection.value==1)
        {
          improveData.value = data.map(item => ({ label: item.improve, value: item.count }));
          if (improveChart.value) improveChart.value.destroy();
          improveChart.value = createChart('improve-chart', 'Improve', improveData.value);
        }
        else
        {
          improveData2.value = data.map(item => ({ label: item.improve, value: item.count }));
          if (improveChart2.value) improveChart2.value.destroy();
          improveChart2.value = createChart('improve-chart2', 'Improve', improveData2.value);          
        }

      });
    });

    function createChart(chartId, label, data) {
      console.log(chartId);
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
      submitSchoolSelection2,
      viewCadetProfile,
      sidebarOptions: ['Export'],
      showSchoolsDropdown,
      showCadetsDropdown,
      uniqueSchools,
      uniqueCadets,
      selectedSchool,
      selectedSchool2,
      selectedCadet,
      cadetChartData,
      overallAssessmentData,
      sustainData,
      improveData
    }
  }
}
</script>
<style scoped>
  .main-container {
      width: 100vw;
      height: 100vh;
      margin: 0 auto;
      padding: 0;
      display: flex;
  }
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
  width: 100%; /* Adjusted width to fill the new column */
  height: 50%;
  margin-top: 20px; /* Adjusted margin to position charts at the top vertically */
  padding: 15px; /* Padding for visual space around the charts */
  background-color: #222; /* Dark theme background for charts */
  border-radius: 10px; /* Rounded corners for charts container */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}
</style>
