import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/HomeView.vue';
import WaterFallView from './components/WaterFallView.vue';

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory instead of mode: 'history'
  routes: [
    { path: '/', component: HomeView },
    {path: '/waterfall', component: WaterFallView},
    { path: '/:catchAll(.*)', redirect: '/' },
  ]
});

export default router; // Export the router to use it in main.js
