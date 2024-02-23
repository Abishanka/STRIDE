<template>
    <div class="main-container">
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
        <div>
         
        </div>
    </div>
</template>

<script>
export default {
    name: 'WaterFallView',
    data() {
    return {
      sidebaroptions: ['Waterfall', 'Cadet Profile', 'Export'],
    }
  },
}
  
import '../assets/styles/WaterFallView.css';
import '../assets/styles/Sidebar.css';
</script>

<style scoped>
/* Add any page-specific styles here */
</style>