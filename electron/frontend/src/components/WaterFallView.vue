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

    return {
      goHome,
      sidebarOptions: ['Waterfall', 'Cadet Profile', 'Export'],
      waterfallCriteria: {
        ftxLength: '',
        missionsPerDay: '',
        cadetsPerPlatoon: '',
        cadetsPerSquad: '',
      },
      convertToCsv
    }
  }, 
  // mounted() {
  //   // Receive data from the main process
  //   window.ipcRenderer.receive('receive-waterfall-data', (event, data) => {
  //     console.log(data);
  //     this.convertToCsv(data.platoons, data.leadership);
  //   });
  // },
  methods: {
    generateWaterfall() {
      // Logic for generating the waterfall here
      console.log('Generating waterfall with criteria:', this.waterfallCriteria);
      window.ipcRenderer.send("get-waterfall-data", this.waterfallCriteria);
    },
  },  
}

import '../assets/styles/WaterFallView.css';
import '../assets/styles/Sidebar.css';
</script>

<style scoped></style>
