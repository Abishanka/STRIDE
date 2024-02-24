import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/HomeView.vue';
import WaterFallView from './components/WaterFallView.vue';
import BlueCardsView from './components/BlueCardsView.vue';
import AnalysisView from './components/AnalysisView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/waterfall', component: WaterFallView },
    { path: '/bluecards', component: BlueCardsView }, // Added route for Blue Cards
    { path: '/analysis', component: AnalysisView }, // Added route for Analysis
    { path: '/:catchAll(.*)', redirect: '/' },
  ]
});

export default router;
