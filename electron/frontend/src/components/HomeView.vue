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
            v-model="admn_pwd" @keyup.enter="handleAdminPwdSubmit()">
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
      if (this.admn_pwd === 'rotc') {
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
      } else {
        console.log('Incorrect password');
      }
    }
  }
}

</script>

<style scoped>
  /* https://stackoverflow.com/questions/70489057/dotted-background-with-pure-html-css */
  .dotted {
      background-image: radial-gradient(#191919 10%, transparent 10%),
      radial-gradient(#ccc 10%, transparent 10%);
      background-position: 0 0, 50px 50px;
      background-size: 50px 50px;
  }

  .main-container {
    width: 100vw;
    height: 100vh; 
    margin: 0 auto;
    padding: 5vh 0;
    display: flex;
  }

  .header {
    display: flex;
  }

  .logo, .headername, .undername {
    display: inline-block;
  }

  .logo img {
    width: 12vh;
  }

  .headername {
    font-size: 10vh;
    font-family: sans-serif;
    font-weight: lighter;
    color: #4D784E;
  }

  .undername {
    color: white;
    font-family: sans-serif;
    font-size: 2.5vh;  
  }

  .vertical-options {
    height: 30vh;
    background-color: #191919;
    margin-top: 12vh;
  }

  .options {
    color: white;
    font-family: sans-serif;
    font-size: 6vh;
    font-weight: lighter;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .options:hover {
    background-color: #6EA171;
    cursor: pointer;
  }

  .selected-option {
    background-color: #4D784E !important;
  }

  .admin-pwd {
    margin-top: 10vh;
    color: white;
    font-size: 2vh;
    font-family: sans-serif;
  }

  .admin-pwd-input {
    width: 2vh;
  }

  .admin-pwd-input:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .admin-pwd .input-group input {
    border: 1px solid #4D784E;
  }

  .admin-pwd-btn {
    color: white;
    background-color: #4D784E;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .admin-pwd-btn:hover {
    background-color: #6EA171;
    cursor: pointer;
  }
</style>