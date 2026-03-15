/**
 * Vue Router configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/timeline/:id?',
      name: 'timeline',
      component: () => import('../pages/TimelinePage.vue'),
    },
  ],
})

export default router
