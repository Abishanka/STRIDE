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
import { setcadetProfileReturn } from '../store.ts';

export default {
  name: 'WaterFallView',
  setup() {
    const router = useRouter();
    setcadetProfileReturn('waterfall');

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
      sidebarOptions: ['Cadet Profile', 'Export'],
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
    sidebarOptionClick(option) {
      switch (option) {
        case 'Cadet Profile':
          this.$router.push('/cadetprofile');
          break;
        case 'Export':
          //Export the Waterfall
          break;
        default:
          console.log('No option selected or option not recognized');
      }
    },
    generateWaterfall() {
      // Logic for generating the waterfall here
      console.log('Generating waterfall with criteria:', this.waterfallCriteria);
      window.ipcRenderer.send("get-waterfall-data", this.waterfallCriteria);
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
    margin: 0 ;
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
</style>
