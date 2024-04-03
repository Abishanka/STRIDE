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
    </div>
  </div>
</template>
  
<script>

import { useRouter } from 'vue-router';

export default {
  name: 'AnalysisView',
  setup() {
    const router = useRouter();
    function goHome() {
      router.push('/');
    }
    return {
      goHome,
      sidebarOptions: ['Blue Card', 'Cadet Profile', 'Export']
    }
  }, mounted() {
    window.ipcRenderer.receive('receive-analysis-results', (event, data) => {
      console.log(data);
    })
  },
  methods: {
    submitOptions() {
        window.ipcRenderer.send("get-analysis-results");
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
</style>
  