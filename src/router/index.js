import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import TermsView from '../views/terms.vue'
import PrivacyView from '../views/privacy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/terms-of-service',
      name: 'terms',
      component: TermsView,
    },
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: PrivacyView,
    },
  ],
})

export default router
