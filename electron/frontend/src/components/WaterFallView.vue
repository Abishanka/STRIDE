<template>
  <div class="main-container dotted">
    <div class="modal-backdrop" v-if="modalVisible" @click="modalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <button class="close-button" @click="modalVisible = false">&times;</button>
          <h2>Waterfall Schedule</h2>
        </div>
        <div class="modal-body">
          <div class="day-selector">
            <button v-for="day in days" :key="day" @click="selectedDay = day">
              Day {{ day + 1}}
            </button>
          </div>
          <div class="day-content" v-if="selectedDayContent && selectedDayContent.length > 0">
            <table v-if="selectedDayContent.length">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Mission</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cadet in selectedDayContent" :key="cadet.uid">
                  <td>{{ cadet.school }}</td>
                  <td>{{ cadet.first_name }} {{ cadet.last_name }}</td>
                  <td>{{ cadet.position }}</td>
                  <td>Mission {{ cadet.mission + 1 }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else>No assignments for this day.</p>
          </div>
          <p v-else>No assignments for this day.</p>
        </div>
      </div>
    </div>
    <div class="sidebar container" style="margin-left: 0; margin-right: 0;">
      <div class="d-flex align-items-center">
        <div class="logo">
          <img src="../assets/images/logo.png" alt="Logo">
        </div>
        <div class="headername">STRIDE</div>
      </div>

      <div class="container text-center sidebar-menu">
        <div class="row sidebar-options" v-for="option in sidebarOptions" :key="option"
          @click="sidebarOptionClick(option)">
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
        <table v-if="tableData.length > 0">
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row['Last Name']">
              <td v-for="header in tableHeaders" :key="header">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Awaiting input parameters...</p>
      </div>

    </div>
  </div>
</template>


<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { setcadetProfileReturn } from '../store.ts';


export default {
  name: 'WaterFallView',
  setup() {
    const router = useRouter();
    setcadetProfileReturn('waterfall');

    const tableData = ref([]);
    const tableHeaders = ref([]);

    const modalVisible = ref(false);
    const selectedDay = ref(0); // Initialize to day 0
    const days = ref([]);
    const organizedData = ref({}); // To store organized data by day
    const selectedDayContent = ref([]);

    watch(selectedDay, (newValue) => {
      selectedDayContent.value = [];
      
      // Adjusting for 0-based indexing internally while displaying 1-based to the user
      const adjustedValue = newValue - 1;
      if (organizedData.value && organizedData.value[adjustedValue]) {
        selectedDayContent.value = [...organizedData.value[adjustedValue]]; // Use spread to avoid direct reference
      } else {
        selectedDayContent.value = [];
      }
    });

    function goHome() {
      router.push('/');
    }

    function parseCsvToObjects(csvContent) {
      const lines = csvContent.split('\n').filter(line => line);
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
      });
      tableHeaders.value = headers;
      tableData.value = data;
    }

    function convertToCsv(data, leadershipData) {
      const headers = ['School', 'Last Name', 'First Name', 'Platoon', 'Squad'];
      const missions = new Set();
      leadershipData.forEach(leader => {
        missions.add(`Day ${leader.day + 1} Mission ${leader.mission + 1}`);
      });
      const missionHeaders = Array.from(missions).sort(); // Sort the headers for consistency
      headers.push(...missionHeaders);

      const leadershipCountHeaders = ['Total SL', 'Total PL', 'Total PSG'];

      let csvContent = headers.concat(leadershipCountHeaders).join(',') + '\n';

      const cadetMap = new Map();
      data.forEach((platoon, platoonIndex) => {
        platoon.forEach((squad, squadIndex) => {
          squad.forEach(cadet => {
            cadetMap.set(cadet.uid, { ...cadet, platoon: platoonIndex + 1, squad: squadIndex + 1 });
          });
        });
      });

      const sortedPlatoons = [];
      cadetMap.forEach(cadet => {
        if (!sortedPlatoons[cadet.platoon]) {
          sortedPlatoons[cadet.platoon] = [];
        }
        if (!sortedPlatoons[cadet.platoon][cadet.squad]) {
          sortedPlatoons[cadet.platoon][cadet.squad] = [];
        }
        sortedPlatoons[cadet.platoon][cadet.squad].push(cadet);
      });

      sortedPlatoons.forEach(platoon => {
        platoon.forEach(squad => {
          let slCount = 0;
          let plCount = 0;
          let psgCount = 0;

          squad.forEach(cadet => {
            let row = [
              cadet.school,
              `${cadet.last_name}, ${cadet.first_name}`,
              cadet.platoon,
              cadet.squad
            ];

            missionHeaders.forEach(header => {
              const matchingLeader = leadershipData.find(leader => leader.cadet === cadet.uid && `Day ${leader.day + 1} Mission ${leader.mission + 1}` === header);
              if (matchingLeader) {
                row.push(matchingLeader.position);

                // Increment counts based on the position
                if (matchingLeader.position === 'SL') {
                  slCount++;
                } else if (matchingLeader.position === 'PL') {
                  plCount++;
                } else if (matchingLeader.position === 'PSG') {
                  psgCount++;
                }
              } else {
                row.push('');
              }
            });

            // Add the counts to the row and reset them for the next leader
            row = row.concat([slCount, plCount, psgCount]);
            slCount = 0;
            plCount = 0;
            psgCount = 0;

            csvContent += row.join(',') + '\n';
          });
        });
      });

      downloadCsv(csvContent, "test.csv");
      parseCsvToObjects(csvContent);
    }

    function downloadCsv(data, filename) {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Populate based on generated data
    // For demo, assuming `data` is fetched or passed to the component
    function parseDataForModal(data) {
      // Populate `organizedData` based on the input data
      const tempOrganizedData = {};
      data.leadership.forEach(lead => {
        if (!tempOrganizedData[lead.day]) tempOrganizedData[lead.day] = [];
        const cadetInfo = findCadetInfo(lead.cadet, data.platoons);
        if (cadetInfo) {
          tempOrganizedData[lead.day].push({ ...cadetInfo, position: lead.position, mission: lead.mission });
        }
      });
      organizedData.value = tempOrganizedData;
      days.value = Object.keys(tempOrganizedData).map(Number).sort((a, b) => a - b);
      updateSelectedDayContent();
    }
    // Watcher to update content based on the selected day
    watch(selectedDay, () => {
      updateSelectedDayContent();
    });

    function updateSelectedDayContent() {
      selectedDayContent.value = organizedData.value[selectedDay.value] || [];
      selectedDayContent.value.sort((a, b) => a.mission - b.mission);
    }

    function findCadetInfo(uid, platoons) {
      for (const platoon of platoons) {
        for (const squad of platoon) {
          const cadet = squad.find(c => c.uid === uid);
          if (cadet) return cadet;
        }
      }
      return null;
    }

    return {
      goHome,
      sidebarOptions: ['Cadet Profile', 'Export'],
      waterfallCriteria: {
        ftxLength: '',
        missionsPerDay: '',
        cadetsPerPlatoon: '',
        cadetsPerSquad: '',
      },
      convertToCsv,
      tableData,
      tableHeaders,

      modalVisible,
      selectedDay,
      days,
      selectedDayContent,
      parseDataForModal,
    }
  }, 
  mounted() {
    // Receive data from the main process
    window.ipcRenderer.receive('receive-waterfall-data', (event, data) => {
      console.log(data);
      this.convertToCsv(data.platoons, data.leadership);
      this.parseDataForModal(data);
      this.modalVisible = true;
    });
  },
  methods: {
    sidebarOptionClick(option) {
      switch (option) {
        case 'Cadet Profile':
          this.$router.push('/cadetprofile');
          break;
        case 'Export':
          // Export the Waterfall logic here
          break;
        default:
          console.log('No option selected or option not recognized');
      }
    },
    generateWaterfall() {
      console.log('Generating waterfall with criteria:', this.waterfallCriteria);
      window.ipcRenderer.send("get-waterfall-data", this.waterfallCriteria);
      this.modalVisible = true; // Show modal after data is prepared
    },
    prepareModalData(data) {
      // This method would organize the data into a structure that can be easily iterated over in the template.
      // For simplicity in explanation, focus on preparing data for a single selected day at first.
      const organizedData = {};
      data.leadership.forEach(lead => {
        if (!organizedData[lead.day]) organizedData[lead.day] = [];
        const cadetInfo = this.findCadetInfo(lead.cadet, data.platoons);
        if (cadetInfo) {
          organizedData[lead.day].push({ ...cadetInfo, position: lead.position, mission: lead.mission });
        }
      });
      // Example: Populate days and selectedDayContent based on organizedData
      this.days = Object.keys(organizedData);
      this.selectedDayContent = organizedData[this.selectedDay];
    },
    findCadetInfo(uid, platoons) {
      // Find and return cadet info by uid
      for (const platoon of platoons) {
        for (const squad of platoon) {
          const cadet = squad.find(c => c.uid === uid);
          if (cadet) return cadet;
        }
      }
      return null;
    },
  },  
}

import '../assets/styles/Sidebar.css';
</script>

<style scoped>
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

.waterfall-criteria-container {
  position: relative;
  width: 40vw;
  /* Fixed width */
  padding-top: 2.5vh;
  /* Space for the title line */
}

.waterfall-criteria {
  background-color: #1E1E1E;
  padding: 3vh;
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
  color: #6EA171;
  padding: 0 1vw;
}

.criteria-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0;
  margin-top: 2vh;
  /* Negative margin for gutters */
}

.criteria-input {
  flex: 1 1;
  padding: 0 1vw;
}

.criteria-input label {
  color: #D2D1D1;
  font-family: Helvetica;
  text-align: left;
  display: block;
}

.criteria-input input {
  width: 100%;
  padding: 0;
  margin-top: 2vh;
  margin-bottom: 2vh;
  padding: 0.2vh;
  border: none;
  border-bottom: 1px solid #fff;
  background-color: #1E1E1E;
  color: #D2D1D1;
}

.criteria-input input:focus {
  outline: none;
  border-bottom: 1px solid #6EA171;
}

.generate-button {
  width: 100%;
  /* Adjust width for consistent padding */
  padding: 2vh 2vh;
  /* Match input padding */
  margin: 2vh 0;
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
  font-size: 0.75rem;
  /* Smaller font size for the warning */
  margin-top: 10px;
  /* Space from the button */
}

.output-container {
  background-color: #333;
  border: 1px solid #fff;
  border-radius: 5px;
  color: #fff;
  padding: 20px;
  width: calc(100% - 40px);
  /* Full width minus padding, matching the criteria box */
  box-sizing: border-box;
  text-align: center;
  margin-top: 2vh;
}

.output-container p {
  margin: 0;
}

/* Modal Backdrop & Content */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #1E1E1E; /* Match the dark theme background */
  color: #BBE0E3; /* Use the light teal for text */
  padding: 20px;
  border-radius: 5px;
  width: 70%; /* Make modal wider */
  max-height: 80%;
  overflow-y: auto;
  border: 1px solid #BBE0E3; /* Border color matched with the form styling */
}

.modal-header, .close-button {
  color: #BBE0E3;
}

/* Adjusting Button Styles to Match Form Buttons */
button, .generate-button, .day-selector button, .close-button {
  background-color: #BBE0E3; /* Light teal background */
  color: black; /* Text color */
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

button:hover, .generate-button:hover, .day-selector button:hover, .close-button:hover {
  background-color: #4D784E; /* Darker shade for hover state, taken from your form styling */
}

/* Additional Styles for Table and Day Selector to Ensure Consistency */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
  border: 1px solid #BBE0E3; /* Borders matched to the theme */
}

th {
  background-color: #BBE0E3; /* Light teal header */
  color: black; /* Text color for contrast */
}

tr:nth-child(even) {
  background-color: #2c313a; /* Slightly lighter shade for zebra striping */
}

.day-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.day-selector button {
  margin: 0 10px; /* Spacing between buttons */
}

/* Styling Scrollbars for Content Consistency */
.modal-content::-webkit-scrollbar {
  width: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #4D784E; /* Scrollbar color matched with the button hover state */
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #6EA171;
}

</style>
