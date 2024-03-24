<template>
  <div class="main-container dotted">
    <div class="container-sm">
      <div class="d-flex align-items-center">
        <div class="logo">
          <img src="../assets/images/logo.png" alt="Logo">
        </div>
        <div class="headername">STRIDE</div>
      </div>

      <div class="undername">Strategic Training and ROTC Information Data Entry</div>

      <div class="container text-center">
        <div class="row vertical-options">
          <div class="col options" v-for="option in menuoptions" :key="option"
            :class="{ 'selected-option': option === selected_option }" @click="optionClick(option)">{{ option }}</div>
        </div>
      </div>

      <div class="admin-pwd">
        <label for="password">Enter Admin Password</label>
        <div class="input-group mb-3 input-group-lg w-50">
          <input type="password" class="form-control admin-pwd-input" placeholder="Admin Password" name="password"
            v-model="admn_pwd">
          <div class="input-group-append">
            <button class="btn btn-lg admin-pwd-btn" type="submit" @click="handleAdminPwdSubmit()">Submit →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      menuoptions: ['Waterfall', 'Blue Card', 'Analysis'],
      selected_option: '',
      admn_pwd: ''
    }
  },
  methods: {
    optionClick(option) {
      this.selected_option = option;
      console.log(this.selected_option);
    },
    handleAdminPwdSubmit() {
      console.log(this.admn_pwd);
      // Navigate based on the selected_option
      switch (this.selected_option) {
        case 'Waterfall':
          this.$router.push('/waterfall');
          break;
        case 'Blue Card':
          this.$router.push('/bluecards'); // Ensure this matches the route path defined
          break;
        case 'Analysis':
          this.$router.push('/analysis'); // Ensure this matches the route path defined
          break;
        default:
          console.log('No option selected or option not recognized');
      }
    }
  }
}

import '../assets/styles/HomeView.css';
</script>

<style scoped>/* Add any page-specific styles here */</style>