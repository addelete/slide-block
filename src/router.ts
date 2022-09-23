import { createRouter, createWebHashHistory } from 'vue-router';
import Index from './pages/Index.vue';
import DesignDemo from './pages/DesignDemo.vue';



const routes = [
  { path: '/', component: Index },
  { path: '/DesignDemo', component: DesignDemo },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
