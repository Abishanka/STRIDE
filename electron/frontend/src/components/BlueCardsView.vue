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
      <div class="bluecard-form">
        <h1 class="bluecard-form-heading">Blue Card</h1>
        <div class="form-row" style="margin-top: 2vh;">
          <div class="form-group" style="width: 17vw;">
            <label for="cadet-id" class="form-label">Company</label>
            <input type="text" id="company" v-model="company" placeholder=" ">
          </div>
          <div class="form-group" style="width: 17vw;">
            <label for="cadet-id" class="form-label">Platoon</label>
            <input type="number" id="platoon" v-model="platoon" placeholder=" ">
          </div>
          <div class="form-group" style="width: 17vw;">
            <label for="cadet-id" class="form-label">Squad</label>
            <input type="number" id="squad" v-model="squad" placeholder=" ">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Leadership</label>
            <div class="bluecard-options" v-for="option in leaderOptions" :key="option"
            :class="{ 'bluecard-selected-option': option === leader_option }" @click="leaderOptionClick(option)">{{ option }}</div>
          </div>
          <div class="form-group">
            <label for="cadet-id" class="form-label">Sustain</label>
            <select class="bluecard-options" v-for="(value, index) in sustain" :key="index" v-model="sustain[index]">
                <option v-for="option in attributeOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
          </div>
          <div class="form-group">
            <label for="cadet-id" class="form-label">Improve</label>
            <select class="bluecard-options" v-for="(value, index) in improve" :key="index" v-model="improve[index]">
                <option v-for="option in attributeOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group" style="width: 17vw;">
            <label for="event-name" class="form-label">Event Name</label>
            <input type="text" id="event-name" v-model="eventName" placeholder=" ">
          </div>
          <div class="form-group" style="width: 17vw;">
            <label for="date" class="form-label">Date</label>
            <input type="date" id="date" v-model="bluecard_date">
          </div>
          <div class="form-group" style="width: 17vw;">
            <label for="mission-type" class="form-label">Mission Type</label>
            <select id="mission-type" v-model="missionType" class="bluecard-options" style="width: 17vw;">
              <option value="ambush">Ambush</option>
              <option value="attack">Attack</option>
              <option value="raid">Raid</option>
              <option value="mtc">Movement to Contact (MTC)</option>
              <option value="defense">Defense</option>
            </select>
          </div>          
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="cadet-id" class="form-label">Overall Assessment</label>
            <div class="bluecard-options" v-for="option in overallAssessmentOptions" :key="option"
            :class="{ 'bluecard-selected-option': option === overall_assessment }" @click="assessmentOptionClick(option)">{{ option }}</div>
          </div>
        </div>
        <button class="create-bluecard" @click="createBlueCard">Create Bluecard</button>      
      </div>
    </div>
  </div>
</template>
  
<script>

import { useRouter } from 'vue-router';
import { setcadetProfileReturn } from '../store.ts';

export default {
  name: 'BlueCardsView', 
  setup() {
    const router = useRouter();
    setcadetProfileReturn('bluecards');
    function goHome() {
      router.push('/');
    }
    return {
      goHome,
      sidebarOptions: ['Cadet Profile', 'Export'],
      leaderOptions: ['SL', 'PSG', 'PL'],
      attributeOptions: ["AV", "BT", "CF", "CO", "CP", "DP", "DO", "EI", "EM", "EX", "FT", "GR", "IN", "IT", "LD", "LE", "MA", "MB", "PS", "RS", "SJ", "SP", "WE"],
      overallAssessmentOptions: ['E','P','C','U','O'],
    }
  }, data () {
    return {
      cadetId: null,
      school: null,
      firstName: null,
      lastName: null,
      company: null,
      platoon: null,
      squad:  null,
      leader_option: null,
      sustain: [null, null, null],
      improve: [null, null, null],
      overall_assessment: null,
      bluecard_date: new Date().toISOString().substr(0, 10),
    }
  },

  mounted() {
    window.ipcRenderer.receive('matching-cadets', (event, data) => {
      console.log(data);
    }),
    window.ipcRenderer.receive('submission-status', (event, data) =>{
      //if successful data will be: "success". If there's an error data: err.message
      console.log(data);
    })
  }, 
  methods: {
    sidebarOptionClick(option) {
      switch (option) {
        case 'Cadet Profile':
          this.$router.push('/cadetprofile');
          break;
        case 'Export':
          //Export the bluecards
          break;
        default:
          console.log('No option selected or option not recognized');
      }
    },
    leaderOptionClick(option) {
      this.leader_option = option;
    },
    assessmentOptionClick(option) {
      this.overall_assessment = option;
    },
     handleInputChange(text) {
        window.ipcRenderer.send("get-matching-cadets", text);
     },
     createBlueCard(){
        let blueCardInfo =
        {
          uid: this.cadetId,
          event: this.event,
          school:this.school,
          company: this.company,
          squad: this.squad,
          platoon: this.platoon,
          leadership_pos:this.leader_option,
          sustain1:this.sustain[0],
          sustain2:this.sustain[1],
          sustain3:this.sustain[2],
          improve1:this.improve[0],
          improve2:this.improve[1],
          improve3:this.improve[2],
          overall_assessment:this.overall_assessment,
          bluecard_date: this.bluecard_date
        }
        window.ipcRenderer.send("upload-blue-card", blueCardInfo);
      },
  }
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
    
  /* https://stackoverflow.com/questions/70489057/dotted-background-with-pure-html-css */
  .dotted {
      background-image: radial-gradient(#191919 10%, transparent 10%),
      radial-gradient(#ccc 10%, transparent 10%);
      background-position: 0 0, 50px 50px;
      background-size: 50px 50px;
  }

  .content-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      flex-grow: 1;
      overflow: auto;
  }

  /* width */
  ::-webkit-scrollbar {
      width: 1.5vh;
      height: 2vh;
    }
    
    /* Track */
    ::-webkit-scrollbar-track {
      display: none;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #4D784E;
    }
    
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #6EA171;
    }

  .cadet-form {
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

  .form-group .bluecard-options {
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

  .create-bluecard {
      width: 100%;
      /* Adjust width for consistent padding */
      padding: 2vh 2vh;
      /* Match input padding */
      margin: 2vh 0;
      border-radius: 5px;
      border: none;
      background-color: #BBE0E3;
      color: black;
      cursor: pointer;
  }
    

  .bluecard-form {
      position: relative;
      width: 60vw;
      padding-top: 2.5vh;
      border: 1px solid;
      background-color: #1E1E1E;
      padding: 3vh;
      border-radius: 5px;
      text-align: center;
      border-color: #BBE0E3;
      border-width: 1px;
      color: #BBE0E3;
  }
</style>
  