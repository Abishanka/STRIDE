import { createRouter, createWebHistory } from 'vue-router';
import UserEntry from './components/UserEntry.vue';

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory instead of mode: 'history'
  routes: [
    { path: '/', component: UserEntry },
    { path: '/:catchAll(.*)', redirect: '/' },
  ]
});

export default router; // Export the router to use it in main.js
