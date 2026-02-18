import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import TermsView from '../views/terms.vue'
import PrivacyView from '../views/privacy.vue'
import PreviewView from '../views/preview.vue'

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
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
