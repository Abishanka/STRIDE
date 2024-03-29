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
          <div class="form-group" style="width: 19.5vw;">
            <label for="cadet-id" class="form-label">Company</label>
            <input type="text" id="cadet-id" v-model="company" placeholder=" ">
          </div>
          <div class="form-group" style="width: 19.5vw;">
            <label for="cadet-id" class="form-label">Platoon</label>
            <input type="text" id="cadet-id" v-model="platoon" placeholder=" ">
          </div>
          <div class="form-group">
            <label for="cadet-id" class="form-label">Leadership</label>
            <div class="bluecard-options" v-for="option in leaderOptions" :key="option"
            :class="{ 'bluecard-selected-option': option === leader_option }" @click="leaderOptionClick(option)">{{ option }}</div>
          </div>
        </div>
        <div class="form-row">
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
      attributeOptions: ['Op1', 'Op2', 'Op3'],
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
      leader_option: null,
      sustain: [null, null, null],
      improve: [null, null, null],
      overall_assessment: null,
      bluecard_date: null
    }
  },

  // mounted() {
  //   window.ipcRenderer.receive('matching-cadets', (event, data) => {
  //     console.log(data);
  //   }),
  //   window.ipcRenderer.receive('submission-status', (event, data) =>{
  //     //if successful data will be: "success". If there's an error data: err.message
  //     console.log(data);
  //   })
  // }, 
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
     createBlueCard(info){
        /*preferably send bluecard info as a json like:
        {
          uid:,
          event:,
          school:,
          leadership_pos:,
          sustain1:,
          sustain2:,
          sustain3:,
          improve1:,
          improve2:,
          improve3:,
          overall_assessment:,
          bluecard_date:
        }

        cid will be automatically determined with insertion
        */
        window.ipcRenderer.send("upload-blue-card", info);
      },
  }
}

import '../assets/styles/BlueCardsView.css';
import '../assets/styles/Sidebar.css';

</script>
  
<style></style>
  