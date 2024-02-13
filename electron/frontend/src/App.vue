<template>
  <div id="app">
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});

import './assets/styles/app.css';
</script>